parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"gKvF":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.DOWN=exports.UP=exports.RIGHT=exports.LEFT=void 0,exports.LEFT=[0,-1],exports.RIGHT=[0,1],exports.UP=[-1,0],exports.DOWN=[1,0];
},{}],"UnXq":[function(require,module,exports) {
"use strict";function o(o){return void 0===o&&(o=1),Math.floor(Math.random()*o)}function t(){return o(2)+1}function e(){return[o(4),o(4)]}function n(o){return[Math.floor(o/4),o%4]}function r(o){return 4*o[0]+o[1]}function p(o){return o[Math.floor(Math.random()*o.length)]}Object.defineProperty(exports,"__esModule",{value:!0}),exports.pickRandomOne=exports.toIdx=exports.toRowCol=exports.getRandomPoint=exports.getOneOrTwo=exports.getRandomInt=void 0,exports.getRandomInt=o,exports.getOneOrTwo=t,exports.getRandomPoint=e,exports.toRowCol=n,exports.toIdx=r,exports.pickRandomOne=p;
},{}],"LJBG":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(){this.observers=new Set}return e.prototype.on=function(e,r){this.observers.add({type:e,handler:r})},e.prototype.off=function(e){var r=this;Array.from(this.observers).filter(function(r){return r.type===e}).forEach(function(e){r.observers.delete(e)})},e.prototype.emit=function(e,r){void 0===r&&(r=void 0),Array.from(this.observers).filter(function(r){return r.type===e}).forEach(function(e){e.handler(r)})},e}();exports.default=e;
},{}],"FFSb":[function(require,module,exports) {
"use strict";var t=this&&this.__extends||function(){var t=function(e,r){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])})(e,r)};return function(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}}(),e=this&&this.__assign||function(){return(e=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)},r=this&&this.__spreadArrays||function(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),o=0;for(e=0;e<r;e++)for(var i=arguments[e],s=0,u=i.length;s<u;s++,o++)n[o]=i[s];return n},n=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.Matrix=void 0;var o=require("../interfaces"),i=require("../utils"),s=n(require("./index")),u=function(n){function s(){var t=n.call(this)||this;return t.nextPos=null,t.init(),t}return t(s,n),s.prototype.init=function(){this.m=Array.from({length:16},function(){return{number:0,score:0}});for(var t=0;t<3;t++){var e=i.getRandomPoint(),r=i.pickRandomOne([1,2,3]);this.mutate(e,{number:r})}this.emit("init"),this.setScore(),this.setNext()},s.prototype.setNextPos=function(t){var e=-1,r=-1,n=[];if(t==o.LEFT||t==o.RIGHT){t==o.LEFT?e=3:t==o.RIGHT&&(e=0);for(var s=0;s<4;s++)0==this.at([s,e]).number&&n.push([s,e])}else{t==o.UP?r=3:t==o.DOWN&&(r=0);for(var u=0;u<4;u++)0==this.at([r,u]).number&&n.push([r,u])}0==n.length&&(this.nextPos=null),this.nextPos=i.pickRandomOne(n)},s.prototype.addNext=function(t){var e;return null!==(e=this.nextPos)&&void 0!==e||this.setNextPos(t),null!=this.nextPos&&(this.mutate(this.nextPos,{number:this.next}),this.emit("add",{nextPos:this.nextPos,number:this.next}),this.setNext(),this.nextPos=null,!0)},s.prototype.isFinished=function(){var t=this;return 0==[o.UP,o.DOWN,o.LEFT,o.RIGHT].map(function(e){return t.getMoveableCellIndices(e).length}).reduce(function(t,e){return t+e},0)},s.prototype.setNext=function(){var t=i.pickRandomOne([1,2,3]);if(1==t||2==t){var e=this.m.map(function(t){return t.number}).filter(function(t){return 1==t}).length,r=this.m.map(function(t){return t.number}).filter(function(t){return 2==t}).length;e>r+2?t=2:r>e+2&&(t=1)}this.next=t,this.emit("set-next",this.next)},s.prototype.getScore=function(){var t;return null!==(t=this.m.map(function(t){return t.score}).reduce(function(t,e){return t+e},0))&&void 0!==t?t:0},s.prototype.setScore=function(){this.emit("set-score",this.getScore())},s.prototype.merge=function(t){var e=this,r=t[0],n=t[1],o=0,s=[];return this.getMoveableCellIndices(t).map(function(t){return i.toRowCol(t)}).forEach(function(t){var u=t[0],a=t[1],c=u+r,h=a+n,f=e.at([c,h]),p=e.at([u,a]);0!=f.number&&s.push({idx:i.toIdx([c,h]),before:f.number,after:p.number+f.number}),e.mutate([c,h],{number:f.number+p.number,score:f.score+p.score+2}),e.mutate([u,a],{number:0,score:1}),o+=1}),this.emit("merge",s),o>0&&this.setScore(),o},s.prototype.mutate=function(t,r){var n,o=i.toIdx(t);this.m=Object.assign([],this.m,((n={})[o]=e(e({},this.at(o)),r),n))},s.prototype.at=function(t){var e="number"==typeof t?t:i.toIdx(t);return this.m[e]},s.prototype.getMoveableCellIndices=function(t){if(!t)return[];var e=t[0],r=t[1],n=[],s=t==o.LEFT||t==o.RIGHT,u=0,c=0;t==o.LEFT?c=1:t==o.RIGHT?c=2:t==o.UP?u=1:t==o.DOWN&&(u=2);for(var h=0;h<12;h++){var f=e+u,p=r+c;!a(this.at([f,p]).number,this.at([u,c]).number)&&-1==n.indexOf(i.toIdx([f,p]))||0==this.at([u,c]).number||n.push(i.toIdx([u,c])),s?(h%4==3&&(c-=r),u=(u+1)%4):(h%4==3&&(u-=e),c=(c+1)%4)}return n},s.prototype.iterate=function(t){this.m.forEach(function(e,n){t(r(i.toRowCol(n),[n,e]))})},s}(s.default);function a(t,e){return 0==t||0==e||(t!=e&&t+e==3||t==e&&t+e!=2&&t+e!=4)}exports.Matrix=u;
},{"../interfaces":"gKvF","../utils":"UnXq","./index":"LJBG"}],"yp1Z":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./models/matrix"),i=require("./interfaces"),e=require("./utils"),r=200,n=.6,s=function(){function r(){this.matrix=new t.Matrix,this.isDragging=!1,this.moveableCells=[],this.maxPos=0,this.delta=0,this.pos=0,this.x=null,this.y=null,this.isMoving=!1,this.$=document.getElementById("board"),this.bindHandlers(),this.setMaxPos(),this.matrix.init()}return r.prototype.bindHandlers=function(){var t=this;this.matrix.on("add",function(i){var e=i.nextPos,r=i.number;t.animateNext(e,r).then(function(){t.render.bind(t)()})}),this.matrix.on("init",this.render.bind(this)),this.matrix.on("merge",function(i){console.log(i),t.flipMergedCards(i).then(function(){t.render.bind(t)})}),this.matrix.on("set-next",u.bind(this)),this.matrix.on("set-score",l.bind(this)),window.addEventListener("resize",this.onResize.bind(this)),window.addEventListener("mousedown",this.dragStart.bind(this)),window.addEventListener("mouseup",this.dragEnd.bind(this)),window.addEventListener("mouseleave",this.dragEnd.bind(this)),window.addEventListener("mousemove",this.dragging.bind(this)),window.addEventListener("touchstart",this.dragStart.bind(this)),window.addEventListener("touchend",this.dragEnd.bind(this)),window.addEventListener("touchmove",this.dragging.bind(this)),window.addEventListener("keydown",this.onKeyDown.bind(this))},r.prototype.flipMergedCards=function(t,i){var r=this;void 0===i&&(i=200);var n=null,s=this.direction,o=s[0],d=s[1],c=h(0,180,i),u=this.isVertical()?"rotateY":"rotateX",l=h(180,0,i);t.forEach(function(t){var i=t.idx,n=(t.before,t.after,e.toRowCol(i)),s=n[0],a=n[1],h=e.toIdx([s-o,a-d]),c=r.getCardNodeByIdx(h);c&&(c.style.display="none")});var m=!1;return new Promise(function(s){0==t.length&&s();requestAnimationFrame(function o(d){n||(n=d);var h=d-n;h>=i/2&&(m=!0),t.forEach(function(t){var i=t.idx,n=t.before,s=t.after,o=r.$.querySelector('.card[idx="'+i+'"]'),d=e.toRowCol(i),f=d[0],x=d[1],v=f*r.maxPos,p=x*r.maxPos;a(o,m?s:n),o.style.zIndex="20",o.style.transform="translate("+p+"px, "+v+"px) "+u+"("+Math.floor(m?l(h):c(h))+"deg)"}),d>n+i?s():requestAnimationFrame(o)})})},r.prototype.onKeyDown=function(t){var e=this;switch(t.key){case"ArrowUp":this.direction=i.UP;break;case"ArrowDown":this.direction=i.DOWN;break;case"ArrowLeft":this.direction=i.LEFT;break;case"ArrowRight":this.direction=i.RIGHT}this.animateCards(0,this.maxPos,60).then(function(){e.move()})},r.prototype.onResize=function(){this.setMaxPos(),this.resizeCards(),this.translateCards(0)},r.prototype.dragStart=function(t){var i=c(t),e=i.clientX,r=i.clientY;this.x=e,this.y=r,this.isDragging=!0},r.prototype.dragEnd=function(){var t=this,i=Math.min(this.maxPos,this.delta);i/this.maxPos>n?this.animateCards(i,this.maxPos,70).then(function(){t.move()}):this.animateCards(i,0,70).then(function(){t.isDragging=!1,t.direction=null,t.pos=null})},r.prototype.move=function(){(this.isDragging=!1,this.delta=0,this.direction)&&(this.matrix.merge(this.direction)>0&&this.matrix.addNext(this.direction),this.direction=null)},r.prototype.animateCards=function(t,i,e){var r=this;void 0===t&&(t=0),void 0===i&&(i=this.maxPos),void 0===e&&(e=100);var n=1==this.isMoving;this.isMoving=!0;var s=null,o=this.translateCards.bind(this),a=h(t,i,e);return new Promise(function(t,d){n&&d();requestAnimationFrame(function n(d){if(s||(s=d),d>s+e)return t(),m(!1),r.isMoving=!1,void o(i);o(a(d-s)),requestAnimationFrame(n)})})},r.prototype.animateNext=function(t,i,e){var r=this;void 0===e&&(e=100);var n=d(99),s=this.direction,o=s[0],c=s[1];this.$.appendChild(n),a(n,i),n.style.zIndex="10";var u=h(t[0]-o,t[0],e),l=h(t[1]-c,t[1],e),m=h(0,1,e);n.style.transform="translate("+l(0)*this.maxPos+"px, "+u(0)*this.maxPos+"px)",this.resizeCards();var f=null;return new Promise(function(t,i){requestAnimationFrame(function i(s){f||(f=s);var o=s-f;if(n.style.transform="translate("+l(o)*r.maxPos+"px, "+u(o)*r.maxPos+"px)",n.style.opacity=""+m(o),s>f+e)return r.$.removeChild(n),void t();requestAnimationFrame(i)})})},r.prototype.dragging=function(t){var i=this;if(this.isDragging){var e=c(t),r=e.clientX,s=e.clientY,a=r-this.x,d=s-this.y;if(0!=a||0!=d){this.x=r,this.y=s;var h=o(a,d);this.direction||(this.direction=h,this.moveableCells=this.matrix.getMoveableCellIndices(h).map(function(t){return i.getCardNodeByIdx(t)}),this.pos=this.isVertical()?r:s);var u=((this.isVertical()?r:s)-this.pos)*(this.isVertical()?this.direction[1]:this.direction[0]);u<0?this.direction=null:(m(u/this.maxPos>n),this.delta=u,this.translateCards(Math.min(u,this.maxPos)))}}},r.prototype.translateCards=function(t){var i,e=this,r=null!==(i=this.direction)&&void 0!==i?i:[0,0],n=r[0],s=r[1],o=this.matrix.getMoveableCellIndices(this.direction);this.matrix.iterate(function(i){var r=i[0],a=i[1],d=i[2];if(0!=i[3].number){var h=r*e.maxPos,c=a*e.maxPos;-1!=o.indexOf(d)&&(h+=t*n,c+=t*s);var u=e.$.querySelector('.card[idx="'+d+'"]');u.style.zIndex=""+e.matrix.at(d).score,u.style.transform="translate("+c+"px, "+h+"px)"}})},r.prototype.isVertical=function(){return this.direction==i.LEFT||this.direction==i.RIGHT},r.prototype.render=function(){var t=this;if(this.$.querySelectorAll(".card").forEach(function(i){t.$.removeChild(i)}),this.matrix.iterate(function(i){i[0],i[1];var e=i[2],r=i[3];if(0!=r.number){var n=d(e);a(n,r.number),t.$.appendChild(n)}}),this.resizeCards(),this.translateCards(0),0!=this.matrix.getScore()&&this.matrix.isFinished())return alert("님 주금! 당신의 점수 ["+this.matrix.getScore()+"]"),void this.matrix.init()},r.prototype.resizeCards=function(){var t=this;this.$.querySelectorAll(".card").forEach(function(i){i instanceof HTMLDivElement&&(i.style.width=i.style.height=t.getCardSize()+"px")})},r.prototype.getCardSize=function(){return this.$.querySelector(".cell").offsetHeight},r.prototype.setMaxPos=function(){if(0==this.$.childNodes.length)return 0;var t=parseInt(getComputedStyle(this.$).rowGap);this.maxPos=t+this.getCardSize()},r.prototype.getCardPositionByIdx=function(t){var i=this.$.querySelector('.cell[idx="'+t+'"]').getBoundingClientRect();return[i.top,i.left]},r.prototype.getCardNodeByIdx=function(t){return this.$.querySelector('.card[idx="'+t+'"]')},r}();function o(t,e){return Math.abs(t)>Math.abs(e)?t>0?i.RIGHT:i.LEFT:e>0?i.DOWN:i.UP}function a(t,i){t.innerText=""+i,0==i?t.classList.remove("card"):t.classList.add("card"),t.setAttribute("value",i+"")}function d(t){var i=document.createElement("div");return i.classList.add("card"),void 0!==t&&i.setAttribute("idx",t),i}function h(t,i,e){return function(r){return r/e*(i-t)+t}}function c(t){return t instanceof MouseEvent?t:t.touches[0]}function u(t){document.body.querySelector("#next-number").innerText=""+t}function l(t){document.body.querySelector("#score-number").innerText=""+t}function m(t){var i=document.body.querySelector("#score");t?i.classList.add("highlight"):i.classList.remove("highlight")}exports.default=s;
},{"./models/matrix":"FFSb","./interfaces":"gKvF","./utils":"UnXq"}],"TSA1":[function(require,module,exports) {

},{}],"QCba":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var r=e(require("./Board"));require("./styles/index.css"),require("./styles/cards.css"),new r.default;
},{"./Board":"yp1Z","./styles/index.css":"TSA1","./styles/cards.css":"TSA1"}]},{},["QCba"], null)
//# sourceMappingURL=threes-clone.c25ca9e7.js.map