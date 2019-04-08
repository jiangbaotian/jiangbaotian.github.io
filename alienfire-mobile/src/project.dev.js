window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Const: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53d790H8DtJfpHFcGFL+W3m", "Const");
    "use strict";
    window.Const = {
      GAME_STATE: {
        IDLE: 0,
        PLAYING: 1,
        PRE_END: 2,
        END: 3
      },
      COLLIDER_TAG: {
        PLAYER: 1,
        ENEMY: 2,
        TOOL: 3,
        WEAPON: 4
      },
      TOTAL_BARRIER: 1,
      MONSTER_GAP: 1,
      SCREEN_WIDTH: 750,
      SCREEN_HEIGHT: 1334
    };
    window.Barrier = {
      1: [ {
        gap: 2,
        count: 5,
        data: {
          1: 1,
          2: 2
        }
      }, {
        gap: 5,
        count: 3,
        data: {
          2: 2,
          3: 3
        }
      }, {
        gap: 5,
        count: 5,
        data: {
          1: 3,
          2: 2
        }
      }, {
        gap: 5,
        count: 5,
        data: {
          1: 3,
          2: 2,
          3: 3
        }
      }, {
        gap: 12,
        count: 5,
        data: {
          1: 5,
          2: 5,
          3: 5,
          4: 5,
          5: 5
        }
      } ]
    };
    cc._RF.pop();
  }, {} ],
  EnemyBullet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a22e2i6W49N74x3McScFAzF", "EnemyBullet");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        speed_x: 0,
        speed_y: -200
      },
      onLoad: function onLoad() {
        this.audio = this.node.getComponent(cc.AudioSource);
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        this.node.removeFromParent();
        this.audio.play();
      },
      update: function update(dt) {
        var sx = this.speed_x * dt;
        var sy = this.speed_y * dt;
        this.node.x += sx;
        this.node.y += sy;
        this.node.y < -1200 && this.node.removeFromParent();
      }
    });
    cc._RF.pop();
  }, {} ],
  EnemyManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "081dfsopABO6qYgZHBo0r0F", "EnemyManager");
    "use strict";
    var EnemyManager = cc.Class({
      properties: {
        _parent_node: {
          default: void 0,
          type: cc.node
        },
        _gen_duration: {
          default: 0
        },
        _next_gap: {
          default: 1
        },
        _monster_prefab: {
          default: [],
          type: cc.Prefab
        },
        _barrier_data: {
          default: void 0,
          type: Object
        },
        _barrier_idx: {
          default: 0
        },
        _addDuration: {
          default: 0
        },
        _curBarrierData: {
          default: void 0,
          type: Object
        },
        _waitForAddArray: {
          default: [],
          type: Array
        }
      },
      statics: {
        _instance: null
      },
      init: function init(node, barrier_data, monster_prefab) {
        this._parent_node = node;
        this._barrier_data = barrier_data;
        this._monster_prefab = monster_prefab;
        this._addedSet = new Set();
        this._state = Const.GAME_STATE.IDLE;
      },
      changeState: function changeState(s) {
        this._state = s;
      },
      setState: function setState(state) {
        this._state = state;
      },
      doUpdate: function doUpdate(dt) {
        if (this._state == Const.GAME_STATE.PLAYING) if (this._waitForAddArray.length > 0) {
          this._addDuration += dt;
          if (this._addDuration >= .2) {
            var monster = this._waitForAddArray.shift();
            this._parent_node.addChild(monster);
            this._addedSet.add(monster.getComponent("Enemy"));
          }
        } else {
          this._gen_duration += dt;
          if (this._gen_duration >= this._next_gap) {
            this._gen_duration = 0;
            this.genEnemy();
          }
        }
      },
      genEnemy: function genEnemy() {
        if (!GameController.isPlaying()) return;
        this._barrier_idx >= this._barrier_data.length && (this._barrier_idx = 0);
        if (!this._curBarrierData || this._curBarrierData.count <= 0) {
          this._curBarrierData = Object.assign({}, this._barrier_data[this._barrier_idx]);
          this._next_gap = this._curBarrierData.gap;
          this._barrier_idx += 1;
        }
        this._curBarrierData.count -= 1;
        var dat = this._curBarrierData.data;
        var thiz = this;
        Object.keys(dat).forEach(function(key) {
          cc.log("monster:" + key + ", count:" + dat[key]);
          var count = dat[key];
          var prefab = thiz._monster_prefab[key - 1];
          for (var i = 0; i < count; i++) {
            var monster = cc.instantiate(prefab);
            monster.x = 100 + (Math.random() - .5) * (cc.winSize.width - 200);
            monster.y = cc.winSize.height / 2 + monster.height;
            thiz._waitForAddArray.push(monster);
          }
        });
      },
      onEnemyDie: function onEnemyDie(monster) {
        if (monster) {
          var node = monster;
          var ret = this._addedSet.delete(node);
          cc.log("onEnemyDie, delete=" + ret);
        }
      }
    });
    EnemyManager._instance = new EnemyManager();
    module.exports = EnemyManager;
    cc._RF.pop();
  }, {} ],
  Enemy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d5fc9bLf8JI+pJ/KTelJL7+", "Enemy");
    "use strict";
    var Weapon = require("Weapon");
    var EnemyManager = require("EnemyManager");
    var GameDataManager = require("GameDataManager");
    module.exports = cc.Class({
      extends: cc.Component,
      properties: {
        type: {
          default: 1
        },
        hp: {
          default: 100
        },
        enemy_skin: {
          default: [],
          type: cc.SpriteFrame
        },
        enemy_bullet_prefab: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        var speed_len = 200 + 120 * Math.random();
        var angle = Math.random() * Math.PI * 2;
        this.speed_x = speed_len * Math.cos(angle);
        this.speed_y = speed_len * Math.sin(angle);
        this.anim = this.node.getChildByName("anim");
        this.root = cc.find("Canvas");
        this.game_scene = cc.find("Canvas").getComponent("GameScene");
        this.game_main_ui_layer = cc.find("Canvas/game_main_layer/ui_layer").getComponent("GameMainUILayer");
        this.flag = 0;
        this.player = cc.find("Canvas/game_main_layer/battle_layer/player");
        this.player_component = this.player.getComponent("Player");
        this.hp_label = this.node.getChildByName("hp_label").getComponent(cc.Label);
        this._updateHpLabel();
        this.collider = this.node.getComponent(cc.BoxCollider);
        this.collider.tag = Const.COLLIDER_TAG.ENEMY;
      },
      start: function start() {},
      shoot_enemy_bullet: function shoot_enemy_bullet() {},
      onCollisionEnter: function onCollisionEnter(other, self) {
        if (this._isDead()) return;
        if (!GameController.isPlaying()) return;
        var isWeapon = "bullet" == other.node.name;
        isWeapon && GameController.handlerCollision(other, self);
        if (isWeapon) {
          this.hp -= other.node.getComponent("Weapon").firepower;
          this._updateHpLabel();
          if (this.hp <= 0) {
            this.anim.getComponent(cc.Animation).play();
            this._onDie();
            this.scheduleOnce(function() {
              this.node.removeFromParent();
              this.node.destroy();
            }, .2);
          }
        }
      },
      _onDie: function _onDie() {
        EnemyManager._instance.onEnemyDie(this);
      },
      update: function update(dt) {
        this._updatePosition(dt);
      },
      _updatePosition: function _updatePosition(dt) {
        this._updateSpeed();
        this._applySpeed(dt);
        this._checkEdge();
      },
      _updateSpeed: function _updateSpeed() {
        if (!GameController.isPlaying()) return;
        var win = cc.winSize;
        switch (this.type) {
         case 1:
         case 2:
          if (Math.random() <= .01) {
            var k = Math.random() >= .5 ? 1 : -1;
            this.speed_x += .1 * k * this.speed_x;
          }

         case 3:
          this.node.y < this.player.y && this.speed_y < 0 && Math.random() < .01 && (this.speed_y = -this.speed_y);

         default:
          break;

         case 4:
         case 5:
         case 6:
          var distance = Math.sqrt((this.player.x - this.node.x) * (this.player.x - this.node.x) + (this.player.y - this.node.y) * (this.player.y - this.node.y));
          distance < .6 * win.width && this._makeSpeedCloseToPlayer();
        }
      },
      _makeSpeedCloseToPlayer: function _makeSpeedCloseToPlayer() {
        var direction = cc.v2(this.player.x - this.node.x, this.player.y - this.node.y).normalizeSelf();
        var speed_len = Math.sqrt(this.speed_x * this.speed_x + this.speed_y * this.speed_y);
        var cos_y = direction.y / direction.mag();
        this.speed_y = speed_len * cos_y;
        var cos_x = direction.x / direction.mag();
        this.speed_x = speed_len * cos_x;
      },
      _applySpeed: function _applySpeed(dt) {
        var sx = this.speed_x * dt;
        console.log("speed Before:sx=", sx);
        sx *= GameDataManager._instance._speedFactor;
        var sy = this.speed_y * dt;
        console.log("speed Before:sy=", sy);
        sy *= GameDataManager._instance._speedFactor;
        this.node.x += sx;
        this.node.y += sy;
        console.log("speed After:sx=", sx);
        console.log("speed After:sy=", sy);
        console.log("speedFactor:", GameDataManager._instance._speedFactor);
      },
      _checkEdge: function _checkEdge() {
        var win = cc.winSize;
        (this.node.x < -win.width / 2 || this.node.x > win.width / 2) && (this.speed_x = -1 * this.speed_x);
        this.node.y + this.node.height < -win.height / 2 ? this.node.y = win.height / 2 + this.node.height + 100 : this.node.y > win.height / 2 && this.speed_y > 0 && (this.speed_y = -this.speed_y);
      },
      _updateHpLabel: function _updateHpLabel() {
        this.hp_label.string = Math.max(0, this.hp);
      },
      _isDead: function _isDead() {
        return this.hp <= 0;
      }
    });
    cc._RF.pop();
  }, {
    EnemyManager: "EnemyManager",
    GameDataManager: "GameDataManager",
    Weapon: "Weapon"
  } ],
  GameController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7955bguy0BJipHgVuzj4elG", "GameController");
    "use strict";
    var GameLevelManager = require("../GameScene/Common/GameLevelManager");
    var GameObjectManager = require("../GameScene/Common/GameObjectManager");
    var GameMissionManager = require("../GameScene/Common/GameMissionManager");
    var GameUIManager = require("../GameScene/Common/GameUIManager");
    var GameDataManager = require("../GameScene/Common/GameDataManager");
    var GameController = cc.Class({
      ctor: function ctor() {
        this._game_state = Const.GAME_STATE.IDLE;
      },
      statics: {
        _instance: null
      },
      init: function init() {
        GameLevelManager._instance.init();
        GameObjectManager._instance.init();
        GameMissionManager._instance.init();
        GameUIManager._instance.init();
        GameDataManager._instance.init();
      },
      preStartGame: function preStartGame(mode) {
        if (1 == mode) {
          this._game_state = Const.GAME_STATE.PLAYING;
          var gameLevel = GameLevelManager._instance.getCurGameLevel();
          GameObjectManager._instance.createForLevelMode(gameLevel);
          GameUIManager._instance.startGameForLevelMode(gameLevel);
        } else if (2 == mode) {
          this._game_state = Const.GAME_STATE.PLAYING;
          GameObjectManager._instance.createForEndlessMode();
          GameUIManager._instance.startGameForEndlessMode();
        }
      },
      startGame: function startGame() {
        GameObjectManager._instance.onGameStart();
      },
      pauseGame: function pauseGame() {
        GameUIManager._instance.onGamePause();
        GameObjectManager._instance.onGamePause();
        GameDataManager._instance.setSpeedFactor(.35);
      },
      resumeGame: function resumeGame() {
        GameUIManager._instance.onGameResume();
        GameObjectManager._instance.onGameResume();
        GameDataManager._instance.setSpeedFactor(1);
      },
      preEndGame: function preEndGame() {
        GameObjectManager._instance.onGameSlowlly();
        GameUIManager._instance.onGamePreEnd();
        GameObjectManager._instance.onGamePreEnd();
        GameDataManager._instance.setSpeedFactor(.35);
      },
      endGame: function endGame() {
        GameUIManager._instance.onGameEnd();
        GameObjectManager._instance.onGameEnd();
      },
      restartGame: function restartGame() {
        GameUIManager._instance.onGameRestart();
      },
      handlerCollision: function handlerCollision(other, obj) {
        GameUIManager._instance.onGameCollisionHandle(other, obj);
        GameObjectManager._instance.onGameCollisionHandle(other, obj);
        GameDataManager._instance.onGameCollisionHandle(other, obj);
      },
      getGameState: function getGameState() {
        return this._game_state;
      },
      isPlaying: function isPlaying() {
        return this._game_state == Const.GAME_STATE.PLAYING;
      },
      onPlayerDead: function onPlayerDead() {
        this._game_state = Const.GAME_STATE.PRE_END;
      },
      onEnterStartLayer: function onEnterStartLayer() {
        this._game_state = Const.GAME_STATE.IDLE;
      }
    });
    GameController = new GameController();
    module.exports = GameController;
    cc._RF.pop();
  }, {
    "../GameScene/Common/GameDataManager": "GameDataManager",
    "../GameScene/Common/GameLevelManager": "GameLevelManager",
    "../GameScene/Common/GameMissionManager": "GameMissionManager",
    "../GameScene/Common/GameObjectManager": "GameObjectManager",
    "../GameScene/Common/GameUIManager": "GameUIManager"
  } ],
  GameDataManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c4743wCHdhKT6smcw+J2ovJ", "GameDataManager");
    "use strict";
    var Weapon = require("../GameMain/Weapon");
    var GameUIManager = require("GameUIManager");
    var GameDataManager = cc.Class({
      ctor: function ctor() {},
      statics: {
        _instance: null
      },
      init: function init() {
        this._speedFactor = 1;
        this._score = 0;
      },
      setSpeedFactor: function setSpeedFactor(speedfactor) {
        this._speedFactor = speedfactor;
      },
      onGameCollisionHandle: function onGameCollisionHandle(other, obj) {
        if (obj.tag == Const.COLLIDER_TAG.PLAYER) other.tag == Const.COLLIDER_TAG.TOOL || other.tag == Const.COLLIDER_TAG.ENEMY; else if (obj.tag == Const.COLLIDER_TAG.ENEMY) {
          var weapon = other.node.getComponent(Weapon);
          if (other.tag == Const.COLLIDER_TAG.WEAPON) {
            this._score += weapon.firepower;
            GameUIManager._instance.setScore(this._score);
          }
        }
      }
    });
    GameDataManager._instance = new GameDataManager();
    module.exports = GameDataManager;
    cc._RF.pop();
  }, {
    "../GameMain/Weapon": "Weapon",
    GameUIManager: "GameUIManager"
  } ],
  GameEndLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9fc2fTDvyBNrL5GH6sQkVJ1", "GameEndLayer");
    "use strict";
    var GameController = require("../GameController");
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onLeftBtnClick: function onLeftBtnClick() {
        cc.director.loadScene("scenes/game_scene");
      },
      onRightBtnClick: function onRightBtnClick() {
        cc.director.loadScene("scenes/game_scene");
      }
    });
    cc._RF.pop();
  }, {
    "../GameController": "GameController"
  } ],
  GameLevelManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fc979dIKTVK2ZwGin05tv7t", "GameLevelManager");
    "use strict";
    var GameLevel = require("../GameScene/Common/GameLevel");
    var Weapon = require("../GameScene/GameMain/Weapon");
    var GameLevelManager = cc.Class({
      ctor: function ctor() {},
      statics: {
        _instance: null
      },
      init: function init() {
        this.gameLevel = new GameLevel();
        this.curWeapon = new Weapon();
      },
      getCurGameLevel: function getCurGameLevel() {
        return this.gameLevel;
      },
      getCurWeapon: function getCurWeapon() {
        return this.curWeapon;
      },
      loadGameData: function loadGameData() {}
    });
    GameLevelManager._instance = new GameLevelManager();
    module.exports = GameLevelManager;
    cc._RF.pop();
  }, {
    "../GameScene/Common/GameLevel": void 0,
    "../GameScene/GameMain/Weapon": void 0
  } ],
  GameLevel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "45cb6f0l2pGO44u9ga4rbg5", "GameLevel");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        levelNum: 1,
        missionType: 1,
        missionRequire: 50,
        toolType: 2,
        toolNum: 20
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  GameMainBattleLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0a6527PFe1Fg5WexFhMxUmN", "GameMainBattleLayer");
    "use strict";
    var enemy_js_com = require("Enemy");
    var EnemyManager = require("EnemyManager");
    cc.Class({
      extends: cc.Component,
      properties: {
        monster_prefabs: {
          default: [],
          type: cc.Prefab
        },
        enemy_js_component: {
          default: null,
          type: enemy_js_com
        }
      },
      onLoad: function onLoad() {
        cc.log("onLoad");
        this.player = cc.find("Canvas/game_main_layer/battle_layer/player").getComponent("Player");
        var cur_barrier = 1;
        var barrier_data = Barrier[cur_barrier];
        EnemyManager._instance.init(this.node, barrier_data, this.monster_prefabs);
      },
      start: function start() {
        cc.log("start");
        EnemyManager._instance.setState(Const.GAME_STATE.PLAYING);
      },
      update: function update(dt) {
        EnemyManager._instance.doUpdate(dt);
      }
    });
    cc._RF.pop();
  }, {
    Enemy: "Enemy",
    EnemyManager: "EnemyManager"
  } ],
  GameMainUILayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "80af2nWFrBKOrh7FSN+yFsi", "GameMainUILayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        score_path: "Canvas/game_main_layer/ui_layer/score/label/num",
        level_path: "Canvas/game_main_layer/ui_layer/level/label/num",
        right_bar_path: "Canvas/game_main_layer/ui_layer/right_bar/view/content",
        scroll_view_path: "Canvas/game_main_layer/ui_layer/right_bar",
        game_level: 1
      },
      onLoad: function onLoad() {
        this.kill_num = 0;
        this.lv = 25;
        this.label_score = cc.find(this.score_path).getComponent(cc.Label);
        this.label_level = cc.find(this.level_path).getComponent(cc.Label);
        this.right_bar = cc.find(this.right_bar_path).getComponent("ToolRightBar");
      },
      start: function start() {},
      setScore: function setScore(score) {
        var scoreTxt = score + "";
        score > 1e4 && (scoreTxt = score / 1e4 + "K");
        this.label_score.string = scoreTxt;
      },
      addLevel: function addLevel() {
        this.game_level++;
        this.label_level.string = "" + this.game_level;
      },
      addTool: function addTool(type) {
        cc.log("addTool:" + type);
        this.right_bar.addTool(type);
      }
    });
    cc._RF.pop();
  }, {} ],
  GameMaskLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d26b9n6nlHB6sxy4ROk/jw", "GameMaskLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        var winSize = cc.winSize;
        this.node.width = winSize.width;
        this.node.height = winSize.height;
      }
    });
    cc._RF.pop();
  }, {} ],
  GameMissionManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9ad8dJ/z+JOqawMADtKwgdJ", "GameMissionManager");
    "use strict";
    var GameMissionManager = cc.Class({
      ctor: function ctor() {},
      statics: {
        _instance: null
      },
      init: function init() {}
    });
    GameMissionManager._instance = new GameMissionManager();
    module.exports = GameMissionManager;
    cc._RF.pop();
  }, {} ],
  GameObjectManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3a6f38glz9Dw7sEmOFcxYVi", "GameObjectManager");
    "use strict";
    var ToolManager = require("../GameMain/ToolManager");
    var WeaponManager = require("../GameMain/WeaponManager");
    var EnemyManager = require("../GameMain/EnemyManager");
    var GameLevelManager = require("../Common/GameLevelManager");
    var GameObjectManager = cc.Class({
      ctor: function ctor() {},
      statics: {
        _instance: null
      },
      init: function init() {
        ToolManager._instance.init();
        WeaponManager._instance.init();
      },
      createForLevelMode: function createForLevelMode(gameLevel) {
        ToolManager._instance.autoCreate();
      },
      createForEndlessMode: function createForEndlessMode() {
        ToolManager._instance.autoCreate();
      },
      onGameStart: function onGameStart() {
        var weapon = GameLevelManager._instance.getCurWeapon();
        WeaponManager._instance.useWeapon(weapon);
      },
      onGamePause: function onGamePause() {
        WeaponManager._instance.removeWeapon();
      },
      onGameResume: function onGameResume() {
        this.onGameStart();
      },
      onGameEnd: function onGameEnd() {
        WeaponManager._instance.removeWeapon();
      },
      onGameSlowlly: function onGameSlowlly() {
        WeaponManager._instance.removeWeapon();
      },
      onGamePreEnd: function onGamePreEnd() {},
      onGameCollisionHandle: function onGameCollisionHandle(other, obj) {
        if (obj.tag == Const.COLLIDER_TAG.PLAYER) if (other.tag == Const.COLLIDER_TAG.TOOL) {
          var tool = other.node.getComponent("Tool");
          ToolManager._instance.useTool(tool);
        } else other.tag == Const.COLLIDER_TAG.ENEMY;
      }
    });
    GameObjectManager._instance = new GameObjectManager();
    module.exports = GameObjectManager;
    cc._RF.pop();
  }, {
    "../Common/GameLevelManager": "GameLevelManager",
    "../GameMain/EnemyManager": "EnemyManager",
    "../GameMain/ToolManager": "ToolManager",
    "../GameMain/WeaponManager": "WeaponManager"
  } ],
  GamePreEndLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "93634aT9JVDo7wVaF7EM/Ed", "GamePreEndLayer");
    "use strict";
    var GameController = require("../GameController");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.playagain = this.node;
        this.playagain.zIndex = 100;
      },
      start: function start() {},
      onReplayBtnClick: function onReplayBtnClick() {
        cc.director.loadScene("scenes/game_scene");
      },
      onGiveBtnClick: function onGiveBtnClick() {
        GameController.endGame();
      }
    });
    cc._RF.pop();
  }, {
    "../GameController": "GameController"
  } ],
  GameScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee80etYIOZBC7NZP2nqdTl4", "GameScene");
    "use strict";
    window.GameController = require("GameController");
    cc.Class({
      extends: cc.Component,
      properties: {
        is_enbale: true,
        is_debug: true
      },
      onLoad: function onLoad() {
        if (this.is_enbale) {
          var manager = cc.director.getCollisionManager();
          manager.enabled = true;
          this.is_debug && (manager.enabledDebugDraw = true);
        }
        console.log("ConstTest", Const.GAME_STATE.PRE_END);
        GameController.init();
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    GameController: "GameController"
  } ],
  GameStartLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "77988lNK+tHkIJSD6JHnXoh", "GameStartLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      start: function start() {
        GameController.onEnterStartLayer();
      },
      onLevelModeBtnClick: function onLevelModeBtnClick() {
        GameController.preStartGame(1);
      },
      onEndlessModeBtnClick: function onEndlessModeBtnClick() {
        GameController.preStartGame(2);
      },
      onUpgradeBtnClick: function onUpgradeBtnClick() {},
      onWeaponBtnClick: function onWeaponBtnClick() {}
    });
    cc._RF.pop();
  }, {} ],
  GameUIManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fedbcI3UN1NQpPC37zLviXl", "GameUIManager");
    "use strict";
    var Weapon = require("../GameMain/Weapon");
    var GameUIManager = cc.Class({
      ctor: function ctor() {},
      statics: {
        _instance: null
      },
      init: function init() {
        this.game_main_layer = cc.find("Canvas/game_main_layer");
        this.game_start_layer = cc.find("Canvas/game_start_layer");
        this.game_mask_layer = cc.find("Canvas/game_mask_layer");
        this.game_end_layer = cc.find("Canvas/game_end_layer");
        this.game_preend_layer = cc.find("Canvas/game_preend_layer");
        this.main_ui_layer = cc.find("Canvas/game_main_layer/ui_layer").getComponent("GameMainUILayer");
      },
      startGameForLevelMode: function startGameForLevelMode(gameLevel) {
        this.game_start_layer.active = false;
        this.game_main_layer.active = true;
      },
      startGameForEndlessMode: function startGameForEndlessMode() {
        this.game_start_layer.active = false;
        this.game_main_layer.active = true;
      },
      showMask: function showMask() {
        this.game_mask_layer && (this.game_mask_layer.active = true);
      },
      hideMask: function hideMask() {
        this.game_mask_layer && (this.game_mask_layer.active = false);
      },
      onGameCollisionHandle: function onGameCollisionHandle(other, obj) {
        if (obj.tag == Const.COLLIDER_TAG.PLAYER) if (other.tag == Const.COLLIDER_TAG.TOOL) {
          var tool = other.node.getComponent("Tool");
          this.main_ui_layer.addTool(tool.type);
        } else other.tag == Const.COLLIDER_TAG.ENEMY; else obj.tag == Const.COLLIDER_TAG.ENEMY;
      },
      showGameEndLayer: function showGameEndLayer() {
        this.showMask();
        this.game_end_layer.active = true;
        this.game_preend_layer.active = false;
      },
      showGameStartLayer: function showGameStartLayer() {
        this.game_start_layer.active = true;
        this.game_main_layer.active = false;
        this.game_mask_layer.active = false;
        this.game_preend_layer.active = false;
        this.game_end_layer.active = false;
      },
      showGamePreEndLayer: function showGamePreEndLayer() {
        this.showMask();
        this.game_preend_layer.active = true;
      },
      setScore: function setScore(score) {
        this.main_ui_layer.setScore(score);
      },
      onGameStart: function onGameStart() {},
      onGamePause: function onGamePause() {
        this.showMask();
      },
      onGameResume: function onGameResume() {
        this.hideMask();
      },
      onGameEnd: function onGameEnd() {
        this.hideMask();
        this.showGameEndLayer();
      },
      onGameSlowlly: function onGameSlowlly() {},
      onGamePreEnd: function onGamePreEnd() {
        this.showGamePreEndLayer();
      },
      onGameRestart: function onGameRestart() {
        this.hideMask();
      }
    });
    GameUIManager._instance = new GameUIManager();
    module.exports = GameUIManager;
    cc._RF.pop();
  }, {
    "../GameMain/Weapon": "Weapon"
  } ],
  PlayerManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e2b92Kd1m1O54UxwWDlXTrN", "PlayerManager");
    "use strict";
    var PlayerManager = cc.Class({
      ctor: function ctor() {},
      statics: {
        _instance: null
      },
      init: function init() {
        this.game_main_layer = cc.find("Canvas/game_main_layer");
      },
      autoCreate: function autoCreate() {}
    });
    PlayerManager._instance = new PlayerManager();
    module.exports = PlayerManager;
    cc._RF.pop();
  }, {} ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34976g4+oNIdp6YCUCy0U6G", "Player");
    "use strict";
    var Enemy = require("Enemy");
    var Tool = require("Tool");
    cc.Class({
      extends: cc.Component,
      properties: {
        enemy_path: "Canvas/game_main_layer/Enemy",
        bullet_prefab: {
          type: cc.Prefab,
          default: null
        },
        player_prefab: {
          type: cc.Prefab,
          default: null
        },
        _isDead: {
          default: false
        }
      },
      onLoad: function onLoad() {
        this.firstInit = true;
        this.anim = this.node.getChildByName("anim");
        this.node.y = -cc.view.getVisibleSize().height / 2 + this.node.height;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
          var offset = t.getDelta();
          this.node.x += offset.x;
          this.node.y += offset.y;
          cc.log("TOUCH_MOVE x", this.node.x);
        }.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_START, function(t) {
          this.firstInit ? GameController.startGame() : GameController.resumeGame();
          this.firstInit = false;
        }.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function(t) {
          this.firstInit || GameController.pauseGame();
        }.bind(this), this.node);
        this.shoot_flag = 3;
        this.root = cc.find("Canvas");
        this.collider = this.node.getComponent(cc.BoxCollider);
        this.collider.tag = Const.COLLIDER_TAG.PLAYER;
      },
      start: function start() {},
      onCollisionEnter: function onCollisionEnter(other, self) {
        if (this._isDead) return;
        var isEnemy = other.tag == Const.COLLIDER_TAG.ENEMY;
        var isTool = other.tag == Const.COLLIDER_TAG.TOOL;
        if (isEnemy) {
          this._isDead = true;
          GameController.onPlayerDead();
          this.anim.getComponent(cc.Animation).play();
          this.unschedule(this._shoot_bullet, this);
          this.unschedule(this._shoot_more_bullet, this);
          this.scheduleOnce(function() {
            this.node.removeFromParent();
            GameController.preEndGame();
          }, 1);
        }
        (isEnemy || isTool) && GameController.handlerCollision(other, self);
      },
      play_shoot_bullet: function play_shoot_bullet() {
        this.schedule(this._shoot_bullet, this, .2);
      },
      _shoot_bullet: function _shoot_bullet() {
        if (2 != this.shoot_flag) return;
        var bullet = cc.instantiate(this.bullet_prefab);
        this.node.parent.addChild(bullet);
        bullet.x = this.node.x;
        bullet.y = this.node.y + this.node.height / 2;
      },
      play_shoot_more_bullet: function play_shoot_more_bullet() {
        this.schedule(this._shoot_more_bullet, this, .2);
      },
      _shoot_more_bullet: function _shoot_more_bullet() {
        if (3 != this.shoot_flag) return;
        var bullet = [];
        for (var i = 0; i < 3; i++) {
          bullet[i] = cc.instantiate(this.bullet_prefab);
          this.node.parent.addChild(bullet[i]);
        }
        bullet[0].x = this.node.x;
        bullet[0].y = this.node.y + this.node.height / 2;
        bullet[1].x = this.node.x - 25;
        bullet[1].y = this.node.y + this.node.height / 2;
        bullet[1].getComponent("Weapon").speed_x = -100;
        bullet[2].x = this.node.x + 25;
        bullet[2].y = this.node.y + this.node.height / 2;
        bullet[2].getComponent("Weapon").speed_x = 100;
      },
      isDead: function isDead() {
        return this._isDead;
      }
    });
    cc._RF.pop();
  }, {
    Enemy: "Enemy",
    Tool: "Tool"
  } ],
  ToolManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "15656ObcPRMQaISJa2jDYKr", "ToolManager");
    "use strict";
    var Tool = require("../GameMain/Tool");
    var WeaponManager = require("../GameMain/WeaponManager");
    var ToolManager = cc.Class({
      extends: cc.Component,
      ctor: function ctor() {},
      statics: {
        _instance: null
      },
      init: function init() {
        this.game_main_layer = cc.find("Canvas/game_main_layer");
        this.toolePrefabNames = [ "tools_weapon2", "tools_weapon3", "tools_weapon4", "tools_weapon5", "tools_weapon6" ];
      },
      autoCreate: function autoCreate() {
        this.schedule(this._autoCreate.bind(this), 5);
      },
      _autoCreate: function _autoCreate() {
        var thiz = this;
        var randomIndex = Math.floor(4 * Math.random());
        thiz.toolePrefabName = thiz.toolePrefabNames[randomIndex];
        cc.loader.loadRes(thiz.toolePrefabName, function(errorMessage, loadedResource) {
          if (errorMessage) {
            cc.log("\u8f7d\u5165\u9884\u5236\u8d44\u6e90\u5931\u8d25, \u539f\u56e0:" + errorMessage);
            return;
          }
          if (!(loadedResource instanceof cc.Prefab)) {
            cc.log("\u4f60\u8f7d\u5165\u7684\u4e0d\u662f\u9884\u5236\u8d44\u6e90!");
            return;
          }
          var tools_node = cc.instantiate(loadedResource);
          thiz.game_main_layer.addChild(tools_node);
          tools_node.x = 10 * Math.floor(10 * Math.random() + 1);
          tools_node.y = cc.winSize.height / 2;
        });
      },
      useTool: function useTool(tool) {
        if (tool.isWeapon()) {
          var weapon = WeaponManager._instance.createByType(tool.type);
          WeaponManager._instance.changeWeapon(weapon);
        } else tool.isSubWeapon() || tool.isSkill();
      }
    });
    ToolManager._instance = new ToolManager();
    module.exports = ToolManager;
    cc._RF.pop();
  }, {
    "../GameMain/Tool": "Tool",
    "../GameMain/WeaponManager": "WeaponManager"
  } ],
  ToolRightBar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "61a37ji0ylMEpD9sXquFvKq", "ToolRightBar");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        tool_prefab: {
          default: [],
          type: cc.Prefab
        }
      },
      start: function start() {
        this.layout = this.node.getComponent(cc.Layout);
      },
      addTool: function addTool(type) {
        var idx = (type - 1) % this.tool_prefab.length;
        var tool = cc.instantiate(this.tool_prefab[idx]);
        tool.getComponent("Tool").init(true, this.node.width);
        this.node.addChild(tool);
      }
    });
    cc._RF.pop();
  }, {} ],
  Tool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "21c0bTXRtZF94GmPkA/NB0c", "Tool");
    "use strict";
    var GameDataManager = require("GameDataManager");
    cc.Class({
      extends: cc.Component,
      properties: {
        category: 1,
        type: 1,
        appear_life_time: {
          default: 10
        },
        in_right_bar: {
          default: false
        },
        right_bar_life_time: {
          default: 8
        },
        right_bar: {
          default: null,
          type: Object
        },
        _timePass: 0,
        _hasBlink: false
      },
      onLoad: function onLoad() {
        Math.random() >= .5 ? this.speed_x = 150 : this.speed_x = -150;
        this.speed_y = -200;
        this.flag = 0;
        this.collider = this.node.getComponent(cc.BoxCollider);
        this.collider.tag = Const.COLLIDER_TAG.TOOL;
      },
      init: function init(in_right_bar, layout_width) {
        this.in_right_bar = in_right_bar;
        if (in_right_bar) {
          var scale = 1 * layout_width / this.node.width;
          this.node.scaleX = scale;
          this.node.scaleY = scale;
          this.node.x = 0;
          this.node.y = 0;
          this.node.getComponent(cc.BoxCollider).enable = false;
        }
      },
      start: function start() {},
      isWeapon: function isWeapon() {
        return 1 == this.category;
      },
      isSubWeapon: function isSubWeapon() {
        return 2 == this.category;
      },
      isSkill: function isSkill() {
        return 3 == this.category;
      },
      getType: function getType() {
        return 1;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        this.scheduleOnce(function() {
          this.node.removeFromParent();
          this.node.destroy();
        }, .2);
      },
      update: function update(dt) {
        this.in_right_bar ? this._updateForRightBar(dt) : this._updateForAppear(dt);
      },
      _updateForAppear: function _updateForAppear(dt) {
        var sx = this.speed_x * dt * GameDataManager._instance._speedFactor;
        var sy = this.speed_y * dt * GameDataManager._instance._speedFactor;
        this.node.x += sx;
        this.node.y += sy;
        var size = cc.winSize;
        (this.node.x < -size.width / 2 || this.node.x > size.width / 2) && (this.speed_x = -1 * this.speed_x);
        (this.node.y < -size.height / 2 || this.node.y >= size.height / 2) && (this.speed_y = -this.speed_y);
        this._timePass += dt;
        if (!this._hasBlink && this.appear_life_time - this._timePass <= 4) {
          var action = cc.blink(4, 15);
          this.node.runAction(action);
          this._hasBlink = true;
        }
        if (this._timePass >= this.appear_life_time) {
          this.node.stopAllActions();
          this.node.removeFromParent();
          this.node.destroy();
        }
      },
      _updateForRightBar: function _updateForRightBar(dt) {
        this._timePass += dt;
        if (!this._hasBlink && this.right_bar_life_time - this._timePass <= 3) {
          var action = cc.blink(3, 15);
          this.node.runAction(action);
          this._hasBlink = true;
        }
        if (this._timePass >= this.right_bar_life_time) {
          this.node.stopAllActions();
          this.node.removeFromParent();
          this.node.destroy();
        }
      }
    });
    cc._RF.pop();
  }, {
    GameDataManager: "GameDataManager"
  } ],
  WeaponManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4e148Os82lADKHOCqs7FQ68", "WeaponManager");
    "use strict";
    var Weapon = require("../GameMain/Weapon");
    var WeaponManager = cc.Class({
      extends: cc.Component,
      ctor: function ctor() {},
      statics: {
        _instance: null
      },
      init: function init() {
        this.game_main_layer = cc.find("Canvas/game_main_layer");
        this.player = cc.find("Canvas/game_main_layer/battle_layer/player");
        this.weaponGroups = new cc.Node();
        this.curWeaponNum = 0;
      },
      autoCreate: function autoCreate() {},
      createByType: function createByType(type) {
        var weapon = new Weapon();
        weapon.type = type;
        return weapon;
      },
      useWeapon: function useWeapon(weapon) {
        this.weaponGroups = new cc.Node();
        var weaponGroups = this.weaponGroups;
        this.game_main_layer.addChild(weaponGroups);
        this.curWeaponNum = weapon.type;
        this._schedule_target = this.useMoreBulletWeapon.bind(this);
        this.schedule(this._schedule_target, .1);
      },
      changeWeapon: function changeWeapon(weapon) {
        this.removeWeapon();
        this.useWeapon(weapon);
      },
      removeWeapon: function removeWeapon() {
        this.unschedule(this._schedule_target, this);
        this.weaponGroups.removeFromParent();
        this.weaponGroups.destroy();
        cc.log("removeWeapon");
      },
      useOneBulletWeapon: function useOneBulletWeapon() {
        this.useMoreBulletWeapon(1);
      },
      useTwoBulletWeapon: function useTwoBulletWeapon() {
        this.useMoreBulletWeapon(2);
      },
      useThreeBulletWeapon: function useThreeBulletWeapon() {
        this.useMoreBulletWeapon(3);
      },
      useFourBulletWeapon: function useFourBulletWeapon() {
        this.useMoreBulletWeapon(4);
      },
      useMoreBulletWeapon: function useMoreBulletWeapon() {
        cc.log("useMoreBulletWeapon");
        var thiz = this;
        var num = this.curWeaponNum;
        cc.loader.loadRes("bullet", function(errorMessage, loadedResource) {
          if (errorMessage) {
            cc.log("\u8f7d\u5165\u9884\u5236\u8d44\u6e90\u5931\u8d25, \u539f\u56e0:" + errorMessage);
            return;
          }
          if (!(loadedResource instanceof cc.Prefab)) {
            cc.log("\u4f60\u8f7d\u5165\u7684\u4e0d\u662f\u9884\u5236\u8d44\u6e90!");
            return;
          }
          var bullet = [];
          var startX = thiz.player.x;
          var startY = thiz.player.y + thiz.player.height / 2 - 40;
          var horizontalSpace = 0;
          var verticalSpace = 0;
          for (var i = 0; i < num; i++) {
            bullet[i] = cc.instantiate(loadedResource);
            thiz.weaponGroups.addChild(bullet[i]);
            if (0 == i) {
              horizontalSpace = 1.4 * bullet[0].width;
              verticalSpace = bullet[0].height / 4;
            }
            bullet[i].y = startY;
            if (num % 2 == 0) {
              var half = num / 2;
              if (i >= half) {
                var indexDistant = Math.abs(i - half);
                bullet[i].x = startX + horizontalSpace / 2 + horizontalSpace * indexDistant;
                num > 3 && (bullet[i].y = startY + verticalSpace * indexDistant);
              } else {
                var _indexDistant = Math.abs(half - 1 - i);
                bullet[i].x = startX - horizontalSpace / 2 - horizontalSpace * _indexDistant;
                num > 3 && (bullet[i].y = startY + verticalSpace * _indexDistant);
              }
            } else {
              var middleIndex = Math.floor(num / 2);
              var _indexDistant2 = Math.abs(i - middleIndex);
              if (i > middleIndex) {
                bullet[i].x = startX + horizontalSpace * _indexDistant2;
                num > 3 && (bullet[i].y = startY + verticalSpace * _indexDistant2);
              } else if (i < middleIndex) {
                bullet[i].x = startX - horizontalSpace * _indexDistant2;
                num > 3 && (bullet[i].y = startY + verticalSpace * _indexDistant2);
              } else bullet[i].x = startX;
            }
          }
        });
      }
    });
    WeaponManager._instance = new WeaponManager();
    module.exports = WeaponManager;
    cc._RF.pop();
  }, {
    "../GameMain/Weapon": "Weapon"
  } ],
  Weapon: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ea980X6oBVAN5Wyb4WWJ9Td", "Weapon");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        type: {
          default: 1
        },
        firepower: {
          default: 20
        }
      },
      onLoad: function onLoad() {
        this.speed_x = 0;
        this.speed_y = 800;
        this.audio = this.node.getComponent(cc.AudioSource);
        this.collider = this.node.getComponent(cc.BoxCollider);
        this.collider.tag = Const.COLLIDER_TAG.WEAPON;
      },
      start: function start() {},
      onCollisionEnter: function onCollisionEnter(other, self) {
        this.node.removeFromParent();
        this.audio.play();
      },
      update: function update(dt) {
        var sx = this.speed_x * dt;
        var sy = this.speed_y * dt;
        this.node.x += sx;
        this.node.y += sy;
        var windowSize = cc.view.getVisibleSize();
        var halfWidth = windowSize.width / 2;
        var halfHeight = windowSize.height / 2;
        if (this.node.y > halfHeight || this.node.y < -halfHeight || this.node.x < -halfWidth || this.node.x > halfWidth) {
          this.node.removeFromParent();
          return;
        }
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "GameDataManager", "GameLevel", "GameLevelManager", "GameMaskLayer", "GameMissionManager", "GameObjectManager", "GameUIManager", "Const", "GameController", "GameEndLayer", "Enemy", "EnemyBullet", "EnemyManager", "GameMainBattleLayer", "GameMainUILayer", "Player", "PlayerManager", "Tool", "ToolManager", "ToolRightBar", "Weapon", "WeaponManager", "GamePreEndLayer", "GameScene", "GameStartLayer" ]);