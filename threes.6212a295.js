parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"gKvF":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.DOWN=exports.UP=exports.RIGHT=exports.LEFT=void 0,exports.LEFT=[0,-1],exports.RIGHT=[0,1],exports.UP=[-1,0],exports.DOWN=[1,0];
},{}],"UnXq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.touchEventHelper=exports.createCardNode=exports.changeCardNode=exports.getDirectionFromMovement=exports.pickRandomOne=exports.toIdx=exports.toRowCol=exports.getRandomPoint=exports.getOneOrTwo=exports.getRandomInt=void 0;var t=require("./interfaces");function e(t){return void 0===t&&(t=1),Math.floor(Math.random()*t)}function o(){return e(2)+1}function r(){return[e(4),e(4)]}function n(t){return[Math.floor(t/4),t%4]}function s(t){return 4*t[0]+t[1]}function a(t){return t[Math.floor(Math.random()*t.length)]}function i(e,o){return Math.abs(e)>Math.abs(o)?e>0?t.RIGHT:t.LEFT:o>0?t.DOWN:t.UP}function c(t,e){t.innerText=""+e,0==e?t.classList.remove("card"):t.classList.add("card"),t.setAttribute("value",e+"")}function d(t){var e=document.createElement("div");return e.classList.add("card"),void 0!==t&&e.setAttribute("idx",t),e}function u(t){return t instanceof MouseEvent?t:t.touches[0]}exports.getRandomInt=e,exports.getOneOrTwo=o,exports.getRandomPoint=r,exports.toRowCol=n,exports.toIdx=s,exports.pickRandomOne=a,exports.getDirectionFromMovement=i,exports.changeCardNode=c,exports.createCardNode=d,exports.touchEventHelper=u;
},{"./interfaces":"gKvF"}],"LJBG":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(){this.observers=new Set}return e.prototype.on=function(e,r){this.observers.add({type:e,handler:r})},e.prototype.off=function(e){var r=this;Array.from(this.observers).filter(function(r){return r.type===e}).forEach(function(e){r.observers.delete(e)})},e.prototype.emit=function(e,r){void 0===r&&(r=void 0),Array.from(this.observers).filter(function(r){return r.type===e}).forEach(function(e){e.handler(r)})},e}();exports.default=e;
},{}],"FFSb":[function(require,module,exports) {
"use strict";var t=this&&this.__extends||function(){var t=function(e,r){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])})(e,r)};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}(),e=this&&this.__assign||function(){return(e=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)},r=this&&this.__spreadArrays||function(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),o=0;for(e=0;e<r;e++)for(var i=arguments[e],s=0,u=i.length;s<u;s++,o++)n[o]=i[s];return n},n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.Matrix=void 0;var o=require("../interfaces"),i=require("../utils"),s=n(require("./index")),u=function(n){function s(){var t=n.call(this)||this;return t.nextPos=null,t.init(),t}return t(s,n),s.prototype.set=function(t){this.m=Array.from({length:16},function(){return{number:0,score:0}}),this.m.forEach(function(e,r){var n=i.toRowCol(r),o=n[0],s=n[1];e.number=t[o][s]})},s.prototype.init=function(){this.m=Array.from({length:16},function(){return{number:0,score:0}});for(var t=0;t<3;t++){var e=i.getRandomPoint(),r=i.pickRandomOne([1,2,3]);this.mutate(e,{number:r})}this.emit("init"),this.setScore(),this.setNext()},s.prototype.setNextPos=function(t){var e=-1,r=-1,n=[];if(t==o.LEFT||t==o.RIGHT){t==o.LEFT?e=3:t==o.RIGHT&&(e=0);for(var s=0;s<4;s++)0==this.at([s,e]).number&&n.push([s,e])}else{t==o.UP?r=3:t==o.DOWN&&(r=0);for(var u=0;u<4;u++)0==this.at([r,u]).number&&n.push([r,u])}0==n.length&&(this.nextPos=null),this.nextPos=i.pickRandomOne(n)},s.prototype.addNext=function(t){var e;return null!==(e=this.nextPos)&&void 0!==e||this.setNextPos(t),null!=this.nextPos&&(this.mutate(this.nextPos,{number:this.next}),this.emit("add",{nextPos:this.nextPos,number:this.next}),this.setNext(),this.nextPos=null,!0)},s.prototype.isFinished=function(){var t=this;return 0==[o.UP,o.DOWN,o.LEFT,o.RIGHT].map(function(e){return t.getMoveableCellIndices(e).length}).reduce(function(t,e){return t+e},0)},s.prototype.setNext=function(){var t=i.pickRandomOne([1,2,3]);if(1==t||2==t){var e=this.m.map(function(t){return t.number}).filter(function(t){return 1==t}).length,r=this.m.map(function(t){return t.number}).filter(function(t){return 2==t}).length;e>r+2?t=2:r>e+2&&(t=1)}this.next=t,this.emit("set-next",this.next)},s.prototype.getScore=function(){var t;return null!==(t=this.m.map(function(t){return t.score}).reduce(function(t,e){return t+e},0))&&void 0!==t?t:0},s.prototype.setScore=function(){this.emit("set-score",this.getScore())},s.prototype.move=function(t){t&&(this.merge(t)>0&&this.addNext(t),this.emit("move"))},s.prototype.merge=function(t){var e=this,r=t[0],n=t[1],o=0,s=[];return this.getMoveableCellIndices(t).map(function(t){return i.toRowCol(t)}).forEach(function(t){var u=t[0],a=t[1],c=u+r,h=a+n,f=e.at([c,h]),p=e.at([u,a]);0!=f.number&&s.push({idx:i.toIdx([c,h]),row:c,col:h,before:f.number,after:p.number+f.number}),e.mutate([c,h],{number:f.number+p.number,score:f.score+p.score+f.number}),e.mutate([u,a],{number:0,score:1}),o+=1}),this.emit("merge",s),o>0&&this.setScore(),o},s.prototype.mutate=function(t,r){var n,o=i.toIdx(t);this.m=Object.assign([],this.m,((n={})[o]=e(e({},this.at(o)),r),n))},s.prototype.at=function(t){var e="number"==typeof t?t:i.toIdx(t);return this.m[e]},s.prototype.getMoveableCellIndices=function(t){if(!t)return[];var e=t[0],r=t[1],n=[],s=t==o.LEFT||t==o.RIGHT,u=0,c=0;t==o.LEFT?c=1:t==o.RIGHT?c=2:t==o.UP?u=1:t==o.DOWN&&(u=2);for(var h=0;h<12;h++){var f=e+u,p=r+c;!a(this.at([f,p]).number,this.at([u,c]).number)&&-1==n.indexOf(i.toIdx([f,p]))||0==this.at([u,c]).number||n.push(i.toIdx([u,c])),s?(h%4==3&&(c-=r),u=(u+1)%4):(h%4==3&&(u-=e),c=(c+1)%4)}return n},s.prototype.iterate=function(t){this.m.forEach(function(e,n){t(r(i.toRowCol(n),[n,e]))})},s}(s.default);function a(t,e){return 0==t||0==e||(t!=e&&t+e==3||t==e&&t+e!=2&&t+e!=4)}exports.Matrix=u;
},{"../interfaces":"gKvF","../utils":"UnXq","./index":"LJBG"}],"IQA9":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.delay=exports.linear=exports.BoardAnimation=exports.animationFactory=void 0;var r=require("./utils");function t(r,t,o){void 0===o&&(o=100);var e=null;return new Promise(function(n){requestAnimationFrame(function a(i){if(e||(e=i),i>e+o)return t&&t(o),r&&r(),void n();t&&t(i-e),requestAnimationFrame(a)})})}exports.animationFactory=t;var o=function(){function o(r){this.board=r}return o.prototype.animateCards=function(r,o,n){var a=this;void 0===r&&(r=0),void 0===o&&(o=1),void 0===n&&(n=100);var i=e(r,o,n);return t(null,function(r){return a.board.translateCards(i(r))},n)},o.prototype.animateNext=function(o,n,a){var i=this;void 0===a&&(a=100);var d=r.createCardNode(99);this.board.$.appendChild(d),r.changeCardNode(d,n),d.style.zIndex="10";var s=this.board.direction,u=s[0],c=s[1],l=this.board.calculateMaxPos(),f=e(o[0]-u,o[0],a),p=e(o[1]-c,o[1],a),v=e(0,1,a);return d.style.transform="translate("+p(0)*l+"px, "+f(0)*l+"px)",this.board.resizeCards(),t(function(){i.board.$.removeChild(d)},function(r){d.style.transform="translate("+p(r)*l+"px, "+f(r)*l+"px)",d.style.opacity=""+v(r)},a)},o.prototype.flipBoard=function(r,o){void 0===r&&(r=200);var n=e(0,180,r),a=this.board.$,i=!1;return t(null,function(t){var e=t>=r/2;e&&!i&&(i=!0,o()),a.style.transform="rotateY("+(e?180-n(t):n(t))+"deg)"},r)},o.prototype.flipMergedCards=function(o,n){var a=this;void 0===n&&(n=200);var i=this.board.calculateMaxPos(),d=this.board.direction,s=d[0],u=d[1],c=e(0,180,n),l=this.board.isVertical()?"rotateY":"rotateX";return 0==o.length?Promise.resolve():(o.forEach(function(t){var o=t.row,e=t.col;a.board.hideCardByIdx(r.toIdx([o-s,e-u]))}),t(null,function(t){var e=t>=n/2;o.forEach(function(o){var n=o.idx,d=o.row,s=o.col,u=o.before,f=o.after,p=a.board.getCardNodeByIdx(n),v=d*i,x=s*i;r.changeCardNode(p,e?f:u),p.style.zIndex="20",p.style.transform="translate("+x+"px, "+v+"px) "+l+"("+Math.floor(e?180-c(t):c(t))+"deg)"})},n))},o}();function e(r,t,o){return function(e){return e/o*(t-r)+r}}function n(r){return void 0===r&&(r=0),new Promise(function(t){setTimeout(function(){return t()},r)})}exports.BoardAnimation=o,exports.linear=e,exports.delay=n;
},{"./utils":"UnXq"}],"R8hd":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Header=void 0;var e=require("./animation"),t=function(){function t(e){var t=this;this.score=0,this.board=e,this.$=document.getElementById("header"),this.$.addEventListener("click",function(e){if(e.target instanceof HTMLDivElement&&"help"==e.target.id){if(t.board.$.classList.contains("note"))return void t.board.animation.flipBoard(200,t.board.render.bind(t.board));t.board.animation.flipBoard(200,t.board.renderNote.bind(t.board))}})}return t.prototype.setNext=function(e){this.$.querySelector("#next-number").innerText=""+e,this.next=e},t.prototype.setScore=function(t){var r=this,o=e.linear(this.score,t,200),i=e.animationFactory(null,function(e){r.displayScore(Math.floor(o(e)))},200);console.log(i),i.then(),this.score=t},t.prototype.displayScore=function(e){this.$.querySelector("#score-number").innerText=""+e},t.prototype.highlightNext=function(e){var t=this.$.querySelector("#score");e?t.classList.add("highlight"):t.classList.remove("highlight")},t}();exports.Header=t;
},{"./animation":"IQA9"}],"yp1Z":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./models/matrix"),i=require("./interfaces"),e=require("./utils"),n=require("./Header"),r=require("./animation"),s=200,a=.6,o=function(){function s(){this.matrix=new t.Matrix,this.isDragging=!1,this.delta=0,this.pos=0,this.x=null,this.y=null,this.isMoving=!1,this.$=document.getElementById("board"),this.header=new n.Header(this),this.animation=new r.BoardAnimation(this),this.bindHandlers(),this.matrix.init()}return s.prototype.bindHandlers=function(){var t=this;this.matrix.on("add",function(i){var e=i.nextPos,n=i.number;t.animation.animateNext(e,n).then(function(){t.render.bind(t)(),0!=t.matrix.getScore()&&t.matrix.isFinished()&&setTimeout(function(){alert("님 주금! 당신의 점수 ["+t.matrix.getScore()+"]"),t.matrix.init()},500)})}),this.matrix.on("init",this.render.bind(this)),this.matrix.on("merge",function(i){t.animation.flipMergedCards(i)}),this.matrix.on("set-next",this.header.setNext.bind(this.header)),this.matrix.on("set-score",this.header.setScore.bind(this.header)),window.addEventListener("resize",this.onResize.bind(this)),window.addEventListener("mousedown",this.dragStart.bind(this)),window.addEventListener("mouseup",this.dragEnd.bind(this)),window.addEventListener("mouseleave",this.dragEnd.bind(this)),window.addEventListener("mousemove",this.dragging.bind(this)),window.addEventListener("touchstart",this.dragStart.bind(this)),window.addEventListener("touchend",this.dragEnd.bind(this)),window.addEventListener("touchmove",this.dragging.bind(this)),window.addEventListener("keydown",this.onKeyDown.bind(this))},s.prototype.onKeyDown=function(t){var e=this,n=this.calculateMaxPos(),r=t.key;switch(this.direction=null,r){case"ArrowUp":this.direction=i.UP;break;case"ArrowDown":this.direction=i.DOWN;break;case"ArrowLeft":this.direction=i.LEFT;break;case"ArrowRight":this.direction=i.RIGHT}this.direction&&this.animation.animateCards(0,n,60).then(function(){e.matrix.move(e.direction)})},s.prototype.onResize=function(){this.resizeCards(),this.translateCards(0)},s.prototype.dragStart=function(t){var i=e.touchEventHelper(t),n=i.clientX,r=i.clientY;this.x=n,this.y=r,this.isDragging=!0},s.prototype.dragEnd=function(){var t=this,i=this.calculateMaxPos(),e=Math.min(i,this.delta);e/i>a?this.animation.animateCards(e,i,70).then(function(){t.matrix.move(t.direction),t.header.highlightNext(!1),t.delta=0,t.isDragging=!1,t.direction=null}):this.animation.animateCards(e,0,70).then(function(){t.isDragging=!1,t.direction=null,t.pos=null})},s.prototype.dragging=function(t){if(this.isDragging){var i=e.touchEventHelper(t),n=i.clientX,r=i.clientY,s=this.calculateMaxPos(),o=n-this.x,d=r-this.y;if(0!=o||0!=d){this.x=n,this.y=r;var h=e.getDirectionFromMovement(o,d);this.direction||(this.direction=h,this.pos=this.isVertical()?n:r);var c=((this.isVertical()?n:r)-this.pos)*(this.isVertical()?this.direction[1]:this.direction[0]);c<0?this.direction=null:(this.header.highlightNext(c/s>a),this.delta=c,this.translateCards(Math.min(c,s)))}}},s.prototype.translateCards=function(t){var i,e=this,n=null!==(i=this.direction)&&void 0!==i?i:[0,0],r=n[0],s=n[1],a=this.matrix.getMoveableCellIndices(this.direction),o=this.calculateMaxPos();this.matrix.iterate(function(i){var n=i[0],d=i[1],h=i[2];if(0!=i[3].number){var c=n*o,l=d*o;-1!=a.indexOf(h)&&(c+=t*r,l+=t*s);var u=e.getCardNodeByIdx(h);u.style.zIndex=""+e.matrix.at(h).score,u.style.transform="translate("+l+"px, "+c+"px)"}})},s.prototype.isVertical=function(){return this.direction==i.LEFT||this.direction==i.RIGHT},s.prototype.render=function(){var t=this;this.$.innerHTML="",this.$.classList.remove("note");for(var i=0;i<16;i++){var n=document.createElement("div");n.classList.add("cell"),n.setAttribute("idx",""+i),this.$.appendChild(n)}this.$.querySelectorAll(".card").forEach(function(i){t.$.removeChild(i)}),this.matrix.iterate(function(i){i[0],i[1];var n=i[2],r=i[3];if(0!=r.number){var s=e.createCardNode(n);e.changeCardNode(s,r.number),t.$.appendChild(s)}}),this.resizeCards(),this.translateCards(0)},s.prototype.renderNote=function(){this.$.innerHTML='<div class="note">\n      1과 2를 제외한 숫자는 같은 수 끼리만 합쳐질 수 있고, 1과 2는 서로만 합체 가능합니다. Threes!의 클론 사이트입니다. 방향키와 스와이프를 사용할 수 있습니다.</div>',this.$.classList.add("note")},s.prototype.resizeCards=function(){var t=this;this.$.querySelectorAll(".card").forEach(function(i){i instanceof HTMLDivElement&&(i.style.width=i.style.height=t.calculateCardSize()+"px")})},s.prototype.hideCardByIdx=function(t){var i=this.getCardNodeByIdx(t);i&&(i.style.display="none")},s.prototype.calculateCardSize=function(){return this.$.querySelector(".cell").offsetHeight},s.prototype.calculateMaxPos=function(){return 0==this.$.childNodes.length?0:parseInt(getComputedStyle(this.$).rowGap)+this.calculateCardSize()},s.prototype.getCardPositionByIdx=function(t){var i=this.$.querySelector('.cell[idx="'+t+'"]').getBoundingClientRect();return[i.top,i.left]},s.prototype.getCardNodeByIdx=function(t){return this.$.querySelector('.card[idx="'+t+'"]')},s}();exports.default=o;
},{"./models/matrix":"FFSb","./interfaces":"gKvF","./utils":"UnXq","./Header":"R8hd","./animation":"IQA9"}],"TSA1":[function(require,module,exports) {

},{}],"QCba":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var r=e(require("./Board"));require("./styles/index.css"),require("./styles/cards.css"),new r.default;
},{"./Board":"yp1Z","./styles/index.css":"TSA1","./styles/cards.css":"TSA1"}]},{},["QCba"], null)
//# sourceMappingURL=threes.6212a295.js.map