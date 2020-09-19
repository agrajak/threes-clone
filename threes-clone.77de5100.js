// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"interfaces.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOWN = exports.UP = exports.RIGHT = exports.LEFT = void 0;
exports.LEFT = [0, -1];
exports.RIGHT = [0, 1];
exports.UP = [-1, 0];
exports.DOWN = [1, 0];
},{}],"utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickRandomOne = exports.toIdx = exports.toRowCol = exports.getRandomPoint = exports.getOneOrTwo = exports.getRandomInt = void 0;

function getRandomInt(max) {
  if (max === void 0) {
    max = 1;
  }

  return Math.floor(Math.random() * max);
}

exports.getRandomInt = getRandomInt;

function getOneOrTwo() {
  return getRandomInt(2) + 1;
}

exports.getOneOrTwo = getOneOrTwo;

function getRandomPoint() {
  return [getRandomInt(4), getRandomInt(4)];
}

exports.getRandomPoint = getRandomPoint;

function toRowCol(idx) {
  return [Math.floor(idx / 4), idx % 4];
}

exports.toRowCol = toRowCol;

function toIdx(_a) {
  var row = _a[0],
      col = _a[1];
  return row * 4 + col;
}

exports.toIdx = toIdx;

function pickRandomOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

exports.pickRandomOne = pickRandomOne;
},{}],"models/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Model =
/** @class */
function () {
  function Model() {
    this.observers = new Set();
  }

  Model.prototype.on = function (type, handler) {
    this.observers.add({
      type: type,
      handler: handler
    });
  };

  Model.prototype.off = function (type) {
    var _this = this;

    Array.from(this.observers).filter(function (x) {
      return x.type === type;
    }).forEach(function (item) {
      _this.observers.delete(item);
    });
  };

  Model.prototype.emit = function (type, payload) {
    if (payload === void 0) {
      payload = undefined;
    }

    Array.from(this.observers).filter(function (x) {
      return x.type === type;
    }).forEach(function (observer) {
      observer.handler(payload);
    });
  };

  return Model;
}();

exports.default = Model;
},{}],"models/matrix.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Matrix = void 0;

var interfaces_1 = require("../interfaces");

var utils_1 = require("../utils");

var index_1 = __importDefault(require("./index"));

var Matrix =
/** @class */
function (_super) {
  __extends(Matrix, _super);

  function Matrix() {
    var _this = _super.call(this) || this;

    _this.nextPos = null;

    _this.init();

    return _this;
  }

  Matrix.prototype.set = function (arr) {
    this.m = Array.from({
      length: 16
    }, function () {
      return {
        number: 0,
        score: 0
      };
    });
    this.m.forEach(function (item, idx) {
      var _a = utils_1.toRowCol(idx),
          row = _a[0],
          col = _a[1];

      item.number = arr[row][col];
    });
  };

  Matrix.prototype.init = function () {
    this.m = Array.from({
      length: 16
    }, function () {
      return {
        number: 0,
        score: 0
      };
    });

    for (var i = 0; i < 3; i++) {
      var point = utils_1.getRandomPoint();
      var value = utils_1.pickRandomOne([1, 2, 3]);
      this.mutate(point, {
        number: value
      });
    }

    this.emit("init");
    this.setScore();
    this.setNext();
  };

  Matrix.prototype.setNextPos = function (direction) {
    var col = -1,
        row = -1;
    var available = [];
    var isVertical = direction == interfaces_1.LEFT || direction == interfaces_1.RIGHT;

    if (isVertical) {
      if (direction == interfaces_1.LEFT) col = 3;else if (direction == interfaces_1.RIGHT) col = 0;

      for (var row_1 = 0; row_1 < 4; row_1++) {
        if (this.at([row_1, col]).number == 0) {
          available.push([row_1, col]);
        }
      }
    } else {
      if (direction == interfaces_1.UP) row = 3;else if (direction == interfaces_1.DOWN) row = 0;

      for (var col_1 = 0; col_1 < 4; col_1++) {
        if (this.at([row, col_1]).number == 0) {
          available.push([row, col_1]);
        }
      }
    }

    if (available.length == 0) {
      this.nextPos = null;
    }

    this.nextPos = utils_1.pickRandomOne(available);
  };

  Matrix.prototype.addNext = function (direction) {
    var _a;

    (_a = this.nextPos) !== null && _a !== void 0 ? _a : this.setNextPos(direction);
    if (this.nextPos == null) return false;
    this.mutate(this.nextPos, {
      number: this.next
    });
    this.emit("add", {
      nextPos: this.nextPos,
      number: this.next
    });
    this.setNext();
    this.nextPos = null;
    return true;
  };

  Matrix.prototype.isFinished = function () {
    var _this = this;

    return [interfaces_1.UP, interfaces_1.DOWN, interfaces_1.LEFT, interfaces_1.RIGHT].map(function (direction) {
      return _this.getMoveableCellIndices(direction).length;
    }).reduce(function (a, b) {
      return a + b;
    }, 0) == 0;
  };

  Matrix.prototype.setNext = function () {
    var pick = utils_1.pickRandomOne([1, 2, 3]);

    if (pick == 1 || pick == 2) {
      var numOfOne = this.m.map(function (cell) {
        return cell.number;
      }).filter(function (x) {
        return x == 1;
      }).length;
      var numOfTwo = this.m.map(function (cell) {
        return cell.number;
      }).filter(function (x) {
        return x == 2;
      }).length;
      if (numOfOne > numOfTwo + 2) pick = 2;else if (numOfTwo > numOfOne + 2) pick = 1;
    }

    this.next = pick;
    this.emit("set-next", this.next);
  };

  Matrix.prototype.getScore = function () {
    var _a;

    return (_a = this.m.map(function (x) {
      return x.score;
    }).reduce(function (a, b) {
      return a + b;
    }, 0)) !== null && _a !== void 0 ? _a : 0;
  };

  Matrix.prototype.setScore = function () {
    this.emit("set-score", this.getScore());
  };

  Matrix.prototype.move = function (direction) {
    if (!direction) return;
    var merged = this.merge(direction);
    if (merged > 0) this.addNext(direction);
    this.emit("move");
  };

  Matrix.prototype.merge = function (direction) {
    var _this = this;

    var dx = direction[0],
        dy = direction[1];
    var cnt = 0;
    var merged = [];
    var indices = this.getMoveableCellIndices(direction);
    indices.map(function (idx) {
      return utils_1.toRowCol(idx);
    }).forEach(function (_a) {
      var row = _a[0],
          col = _a[1];

      var _x = row + dx,
          _y = col + dy;

      var oldCell = _this.at([_x, _y]);

      var newCell = _this.at([row, col]);

      if (oldCell.number != 0) merged.push({
        idx: utils_1.toIdx([_x, _y]),
        row: _x,
        col: _y,
        before: oldCell.number,
        after: newCell.number + oldCell.number
      });

      _this.mutate([_x, _y], {
        number: oldCell.number + newCell.number,
        score: oldCell.score + newCell.score + oldCell.number
      });

      _this.mutate([row, col], {
        number: 0,
        score: 1
      });

      cnt += 1;
    });
    this.emit("merge", merged);
    if (cnt > 0) this.setScore();
    return cnt;
  };

  Matrix.prototype.mutate = function (point, value) {
    var _a;

    var idx = utils_1.toIdx(point);
    this.m = Object.assign([], this.m, (_a = {}, _a[idx] = __assign(__assign({}, this.at(idx)), value), _a));
  };

  Matrix.prototype.at = function (param) {
    var idx = typeof param == "number" ? param : utils_1.toIdx(param);
    return this.m[idx];
  };

  Matrix.prototype.getMoveableCellIndices = function (direction) {
    if (!direction) return [];
    var dx = direction[0],
        dy = direction[1];
    var indices = [];
    var isVertical = direction == interfaces_1.LEFT || direction == interfaces_1.RIGHT;
    var row = 0,
        col = 0;
    if (direction == interfaces_1.LEFT) col = 1;else if (direction == interfaces_1.RIGHT) col = 2;else if (direction == interfaces_1.UP) row = 1;else if (direction == interfaces_1.DOWN) row = 2;

    for (var i = 0; i < 12; i++) {
      var _x = dx + row,
          _y = dy + col;

      if ((isMergable(this.at([_x, _y]).number, this.at([row, col]).number) || indices.indexOf(utils_1.toIdx([_x, _y])) != -1) && this.at([row, col]).number != 0) {
        indices.push(utils_1.toIdx([row, col]));
      }

      if (isVertical) {
        if (i % 4 == 3) {
          col -= dy;
        }

        row = (row + 1) % 4;
      } else {
        if (i % 4 == 3) {
          row -= dx;
        }

        col = (col + 1) % 4;
      }
    }

    return indices;
  };

  Matrix.prototype.iterate = function (callback) {
    this.m.forEach(function (cell, idx) {
      callback(__spreadArrays(utils_1.toRowCol(idx), [idx, cell]));
    });
  };

  return Matrix;
}(index_1.default);

exports.Matrix = Matrix;

function isMergable(a, b) {
  if (a == 0 || b == 0) return true;
  if (a != b && a + b == 3) return true;
  if (a == b && a + b != 2 && a + b != 4) return true;
  return false;
}
},{"../interfaces":"interfaces.ts","../utils":"utils.ts","./index":"models/index.ts"}],"animation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linear = exports.BoardAnimation = exports.animationBuilder = void 0;

function animationBuilder(onResolve, onRun, duration) {
  if (duration === void 0) {
    duration = 100;
  }

  var startAt = null;
  return new Promise(function (resolve) {
    var step = function step(timestamp) {
      if (!startAt) startAt = timestamp;

      if (timestamp > startAt + duration) {
        onResolve && onResolve();
        resolve();
        return;
      }

      onRun && onRun(timestamp - startAt);
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
}

exports.animationBuilder = animationBuilder;

var BoardAnimation =
/** @class */
function () {
  function BoardAnimation(board) {
    this.board = board;
  }

  return BoardAnimation;
}();

exports.BoardAnimation = BoardAnimation;

function linear(from, to, duration) {
  return function (timestamp) {
    return timestamp / duration * (to - from) + from;
  };
}

exports.linear = linear;
},{}],"Header.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = void 0;

var animation_1 = require("./animation");

var Header =
/** @class */
function () {
  function Header() {
    this.score = 0;
    this.$ = document.getElementById("header");
  }

  Header.prototype.setNext = function (next) {
    this.$.querySelector("#next-number").innerText = "" + next;
    this.next = next;
  };

  Header.prototype.setScore = function (score) {
    var _this = this;

    var duration = 200;
    var dScore = animation_1.linear(this.score, score, duration);
    var animation = animation_1.animationBuilder(function () {}, function (dt) {
      _this.displayScore(Math.floor(dScore(dt)));
    }, duration);
    console.log(animation);
    animation.then();
    this.score = score;
  };

  Header.prototype.displayScore = function (score) {
    this.$.querySelector("#score-number").innerText = "" + score;
  };

  Header.prototype.highlightNext = function (flag) {
    var scoreBox = this.$.querySelector("#score");
    if (flag) scoreBox.classList.add("highlight");else scoreBox.classList.remove("highlight");
  };

  return Header;
}();

exports.Header = Header;
},{"./animation":"animation.ts"}],"Board.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var matrix_1 = require("./models/matrix");

var interfaces_1 = require("./interfaces");

var utils_1 = require("./utils");

var Header_1 = require("./Header");

var animation_1 = require("./animation");

var DURATION = 200;
var SEMIAUTO_PUSH_RATIO = 0.6;

var Board =
/** @class */
function () {
  function Board() {
    this.matrix = new matrix_1.Matrix();
    this.isDragging = false;
    this.delta = 0;
    this.pos = 0;
    this.x = null;
    this.y = null;
    this.isMoving = false;
    this.$ = document.getElementById("board");
    this.header = new Header_1.Header();
    this.bindHandlers();
    this.matrix.init();
  }

  Board.prototype.bindHandlers = function () {
    var _this = this;

    this.matrix.on("add", function (_a) {
      var nextPos = _a.nextPos,
          number = _a.number;

      _this.animateNext(nextPos, number).then(function () {
        _this.render.bind(_this)();

        if (_this.matrix.getScore() != 0 && _this.matrix.isFinished()) {
          setTimeout(function () {
            alert("\uB2D8 \uC8FC\uAE08! \uB2F9\uC2E0\uC758 \uC810\uC218 [" + _this.matrix.getScore() + "]");

            _this.matrix.init();
          }, 500);
          return;
        }
      });
    });
    this.matrix.on("init", this.render.bind(this));
    this.matrix.on("merge", function (merged) {
      _this.flipMergedCards(merged);
    });
    this.matrix.on("set-next", this.header.setNext.bind(this.header));
    this.matrix.on("set-score", this.header.setScore.bind(this.header));
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("mousedown", this.dragStart.bind(this));
    window.addEventListener("mouseup", this.dragEnd.bind(this));
    window.addEventListener("mouseleave", this.dragEnd.bind(this));
    window.addEventListener("mousemove", this.dragging.bind(this));
    window.addEventListener("touchstart", this.dragStart.bind(this));
    window.addEventListener("touchend", this.dragEnd.bind(this));
    window.addEventListener("touchmove", this.dragging.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));
  };

  Board.prototype.flipMergedCards = function (merged, duration) {
    var _this = this;

    if (duration === void 0) {
      duration = 200;
    }

    var startAt = null;
    var maxPos = this.calculateMaxPos();
    var _a = this.direction,
        dx = _a[0],
        dy = _a[1];
    var rotate = animation_1.linear(0, 180, duration);
    var rotateDirection = this.isVertical() ? "rotateY" : "rotateX";
    var reverseRotate = animation_1.linear(180, 0, duration);
    merged.forEach(function (_a) {
      var row = _a.row,
          col = _a.col;
      var deMergedIdx = utils_1.toIdx([row - dx, col - dy]);

      var node = _this.getCardNodeByIdx(deMergedIdx);

      if (node) {
        node.style.display = "none";
      }
    });
    var halfWayDone = false;
    return new Promise(function (resolve) {
      if (merged.length == 0) resolve();

      var step = function step(timestamp) {
        if (!startAt) startAt = timestamp;
        var dt = timestamp - startAt;
        if (dt >= duration / 2) halfWayDone = true;
        merged.forEach(function (_a) {
          var idx = _a.idx,
              row = _a.row,
              col = _a.col,
              before = _a.before,
              after = _a.after;

          var node = _this.getCardNodeByIdx(idx);

          var x = row * maxPos,
              y = col * maxPos;
          changeCardNode(node, halfWayDone ? after : before);
          node.style.zIndex = "20";
          node.style.transform = "translate(" + y + "px, " + x + "px) " + rotateDirection + "(" + Math.floor(halfWayDone ? reverseRotate(dt) : rotate(dt)) + "deg)";
        });

        if (timestamp > startAt + duration) {
          resolve();
          return;
        }

        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

  Board.prototype.onKeyDown = function (event) {
    var _this = this;

    var maxPos = this.calculateMaxPos();
    var key = event.key;
    this.direction = null;

    switch (key) {
      case "ArrowUp":
        this.direction = interfaces_1.UP;
        break;

      case "ArrowDown":
        this.direction = interfaces_1.DOWN;
        break;

      case "ArrowLeft":
        this.direction = interfaces_1.LEFT;
        break;

      case "ArrowRight":
        this.direction = interfaces_1.RIGHT;
        break;
    }

    if (!this.direction) return;
    this.animateCards(0, maxPos, 60).then(function () {
      _this.matrix.move(_this.direction);
    });
  };

  Board.prototype.onResize = function () {
    this.resizeCards();
    this.translateCards(0);
  };

  Board.prototype.dragStart = function (event) {
    var _a = touchEventHelper(event),
        clientX = _a.clientX,
        clientY = _a.clientY;

    this.x = clientX;
    this.y = clientY;
    this.isDragging = true;
  };

  Board.prototype.dragEnd = function () {
    var _this = this;

    var maxPos = this.calculateMaxPos();
    var delta = Math.min(maxPos, this.delta);

    if (delta / maxPos > SEMIAUTO_PUSH_RATIO) {
      this.animateCards(delta, maxPos, 70).then(function () {
        _this.matrix.move(_this.direction);

        _this.header.highlightNext(false);

        _this.delta = 0;
        _this.isDragging = false;
        _this.direction = null;
      });
    } else {
      this.animateCards(delta, 0, 70).then(function () {
        _this.isDragging = false;
        _this.direction = null;
        _this.pos = null;
      });
    }
  };

  Board.prototype.animateCards = function (from, to, duration) {
    if (from === void 0) {
      from = 0;
    }

    if (to === void 0) {
      to = 1;
    }

    if (duration === void 0) {
      duration = 100;
    }

    var isLocked = this.isMoving == true;
    var startAt = null;
    var translateCards = this.translateCards.bind(this);
    var d = animation_1.linear(from, to, duration);
    return new Promise(function (resolve, reject) {
      var step = function step(timestamp) {
        if (!startAt) startAt = timestamp;
        var dt = timestamp - startAt;

        if (timestamp > startAt + duration) {
          resolve();
          translateCards(to);
          return;
        }

        translateCards(d(dt));
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

  Board.prototype.animateNext = function (nextPos, number, duration) {
    var _this = this;

    if (duration === void 0) {
      duration = 100;
    }

    var node = createCardNode(99);
    var _a = this.direction,
        dx = _a[0],
        dy = _a[1];
    this.$.appendChild(node);
    changeCardNode(node, number);
    node.style.zIndex = "10";
    var x = animation_1.linear(nextPos[0] - dx, nextPos[0], duration);
    var y = animation_1.linear(nextPos[1] - dy, nextPos[1], duration);
    var maxPos = this.calculateMaxPos();
    var opacity = animation_1.linear(0, 1, duration);
    node.style.transform = "translate(" + y(0) * maxPos + "px, " + x(0) * maxPos + "px)";
    this.resizeCards();
    var startAt = null;
    return new Promise(function (resolve, reject) {
      var step = function step(timestamp) {
        if (!startAt) startAt = timestamp;
        var dt = timestamp - startAt;
        node.style.transform = "translate(" + y(dt) * maxPos + "px, " + x(dt) * maxPos + "px)";
        node.style.opacity = "" + opacity(dt);

        if (timestamp > startAt + duration) {
          _this.$.removeChild(node);

          resolve();
          return;
        }

        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

  Board.prototype.dragging = function (event) {
    if (!this.isDragging) return;

    var _a = touchEventHelper(event),
        clientX = _a.clientX,
        clientY = _a.clientY;

    var maxPos = this.calculateMaxPos();
    var dx = clientX - this.x,
        dy = clientY - this.y;
    if (dx == 0 && dy == 0) return;
    this.x = clientX;
    this.y = clientY;
    var direction = getDirectionFromMovement(dx, dy);

    if (!this.direction) {
      this.direction = direction;
      this.pos = this.isVertical() ? clientX : clientY;
    }

    var pos = this.isVertical() ? clientX : clientY;
    /**
     * delta: 방향에 따른 상대 거리. 내가 맨처음에 의도한 방향으로 움직이고 있으면 부호가 +, 반대 방향으로 움직이고 있으면 -
     */

    var delta = (pos - this.pos) * (this.isVertical() ? this.direction[1] : this.direction[0]);

    if (delta < 0) {
      this.direction = null;
      return;
    }

    this.header.highlightNext(delta / maxPos > SEMIAUTO_PUSH_RATIO);
    this.delta = delta;
    this.translateCards(Math.min(delta, maxPos));
  };

  Board.prototype.translateCards = function (delta) {
    var _this = this;

    var _a;

    var _b = (_a = this.direction) !== null && _a !== void 0 ? _a : [0, 0],
        dx = _b[0],
        dy = _b[1];

    var indices = this.matrix.getMoveableCellIndices(this.direction);
    var maxPos = this.calculateMaxPos();
    this.matrix.iterate(function (_a) {
      var row = _a[0],
          col = _a[1],
          idx = _a[2],
          cell = _a[3];
      if (cell.number == 0) return;
      var y = row * maxPos,
          x = col * maxPos;

      if (indices.indexOf(idx) != -1) {
        y += delta * dx;
        x += delta * dy;
      }

      var node = _this.getCardNodeByIdx(idx);

      node.style.zIndex = "" + _this.matrix.at(idx).score;
      node.style.transform = "translate(" + x + "px, " + y + "px)";
    });
  };

  Board.prototype.isVertical = function () {
    return this.direction == interfaces_1.LEFT || this.direction == interfaces_1.RIGHT;
  };

  Board.prototype.render = function () {
    var _this = this;

    this.$.querySelectorAll(".card").forEach(function (node) {
      _this.$.removeChild(node);
    });
    this.matrix.iterate(function (_a) {
      var row = _a[0],
          col = _a[1],
          idx = _a[2],
          cell = _a[3];
      if (cell.number == 0) return;
      var node = createCardNode(idx);
      changeCardNode(node, cell.number);

      _this.$.appendChild(node);
    });
    this.resizeCards();
    this.translateCards(0);
  };

  Board.prototype.resizeCards = function () {
    var _this = this;

    this.$.querySelectorAll(".card").forEach(function (node) {
      if (!(node instanceof HTMLDivElement)) return;
      node.style.width = node.style.height = _this.calculateCardSize() + "px";
    });
  };

  Board.prototype.calculateCardSize = function () {
    var cellNode = this.$.querySelector(".cell");
    return cellNode.offsetHeight;
  };

  Board.prototype.calculateMaxPos = function () {
    if (this.$.childNodes.length == 0) return 0;
    var gapSize = parseInt(getComputedStyle(this.$).rowGap);
    return gapSize + this.calculateCardSize();
  };

  Board.prototype.getCardPositionByIdx = function (idx) {
    var _a = this.$.querySelector(".cell[idx=\"" + idx + "\"]").getBoundingClientRect(),
        top = _a.top,
        left = _a.left;

    return [top, left];
  };

  Board.prototype.getCardNodeByIdx = function (idx) {
    return this.$.querySelector(".card[idx=\"" + idx + "\"]");
  };

  return Board;
}();

exports.default = Board;

function getDirectionFromMovement(movementX, movementY) {
  if (Math.abs(movementX) > Math.abs(movementY)) {
    if (movementX > 0) return interfaces_1.RIGHT;else return interfaces_1.LEFT;
  } else {
    if (movementY > 0) return interfaces_1.DOWN;else return interfaces_1.UP;
  }
}

function changeCardNode(node, value) {
  node.innerText = "" + value;

  if (value == 0) {
    node.classList.remove("card");
  } else {
    node.classList.add("card");
  }

  node.setAttribute("value", value + "");
}

function createCardNode(idx) {
  var node = document.createElement("div");
  node.classList.add("card");

  if (idx !== undefined) {
    node.setAttribute("idx", idx);
  }

  return node;
}

function touchEventHelper(event) {
  if (event instanceof MouseEvent) return event;
  return event.touches[0];
}
},{"./models/matrix":"models/matrix.ts","./interfaces":"interfaces.ts","./utils":"utils.ts","./Header":"Header.ts","./animation":"animation.ts"}],"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"styles/cards.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Board_1 = __importDefault(require("./Board"));

require("./styles/index.css");

require("./styles/cards.css");

(function () {
  new Board_1.default();
})();
},{"./Board":"Board.ts","./styles/index.css":"styles/index.css","./styles/cards.css":"styles/cards.css"}],"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39181" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/threes-clone.77de5100.js.map