(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{28:function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"a",(function(){return a})),n.d(t,"c",(function(){return s}));var r=n(24),i=n.n(r)()("PLAY"),c={active:!1,menu:!1},o=i("START"),a=i("MENU_TOGGLE"),u=i("END"),s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c,t=arguments.length>1?arguments[1]:void 0;return Object(r.isType)(t,o)?Object.assign(Object.assign({},e),{active:!0,menu:!1}):Object(r.isType)(t,u)?Object.assign(Object.assign({},e),{active:!1}):Object(r.isType)(t,a)?Object.assign(Object.assign({},e),{menu:!e.menu}):e}},29:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"c",(function(){return s})),n.d(t,"b",(function(){return b})),n.d(t,"d",(function(){return p}));var r=n(24);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var o=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},a=n.n(r)()("meteo"),u=a("UPDATE"),s=a("REPLACE_METEO"),b=a("REMOVE_METEO"),l=a("RESET"),f={},p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f,t=arguments.length>1?arguments[1]:void 0;if(Object(r.isType)(t,u))return Object.assign(Object.assign({},e),t.payload);if(Object(r.isType)(t,s))return Object.assign(Object.assign({},e),c({},t.payload.guid,Object.assign(Object.assign({},e[t.payload.guid]),t.payload)));if(Object(r.isType)(t,b)){var n=t.payload,a=n,p=(e[a],o(e,["symbol"===i(a)?a:a+""]));return p}return Object(r.isType)(t,l)?f:e}},30:function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return u}));var r=n(24),i=n.n(r)()("LOAD"),c={spaceShip:!1,meteolites:!1},o=i("UPDATE"),a=i("RESET"),u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c,t=arguments.length>1?arguments[1]:void 0;return Object(r.isType)(t,o)?Object.assign(Object.assign({},e),t.payload):Object(r.isType)(t,a)?c:e}},33:function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return b}));var r=n(24),i=n.n(r)()("SCORE"),c=i("POINT_SET"),o=i("POINT_INC"),a=i("POINT_DEC"),u=i("POINT_RESET"),s={point:0},b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s,t=arguments.length>1?arguments[1]:void 0;return Object(r.isType)(t,c)?Object.assign(Object.assign({},e),{point:t.payload}):Object(r.isType)(t,o)?Object.assign(Object.assign({},e),{point:e.point+t.payload}):Object(r.isType)(t,a)?Object.assign(Object.assign({},e),{point:e.point-t.payload}):Object(r.isType)(t,u)?Object.assign(Object.assign({},e),{point:0}):e}},34:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return u}));var r=n(24),i=n.n(r)()("SPACESHIP"),c=i("UPDATE"),o=i("RESET"),a={flightSpeed:.5,isClashed:!1,isRotation:!1,position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:1,y:1,z:1}},u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a,t=arguments.length>1?arguments[1]:void 0;return Object(r.isType)(t,c)?Object.assign(Object.assign({},e),t.payload):Object(r.isType)(t,o)?a:e}},35:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"c",(function(){return b})),n.d(t,"b",(function(){return l})),n.d(t,"d",(function(){return y}));var r=n(24);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var o=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},a=n.n(r)()("LASER"),u=a("UPDATE"),s=a("ADD"),b=a("REPLACE"),l=a("REMOVE"),f=a("RESET"),p={},O=0,y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p,t=arguments.length>1?arguments[1]:void 0;if(Object(r.isType)(t,u))return Object.assign(Object.assign({},e),t.payload);if(Object(r.isType)(t,s)){var n=Object.assign(Object.assign({},e),c({},O,Object.assign({guid:O},t.payload)));return O+=1,n}if(Object(r.isType)(t,b))return Object.assign(Object.assign({},e),c({},t.payload.guid,Object.assign(Object.assign({},e[t.payload.guid]),t.payload)));if(Object(r.isType)(t,l)){var a=t.payload,y=a,d=(e[y],o(e,["symbol"===i(y)?y:y+""]));return d}return Object(r.isType)(t,f)?p:e}},40:function(e,t,n){"use strict";var r=n(38),i=n(24),c=n.n(i),o=n(33),a=n(28),u=n(34),s=c()("CAMERA"),b=s("CAMERA/UPDATE"),l=s("CAMERA/RESET"),f={near:9,distance:15},p=n(29),O=n(35),y=n(30),d=c()("root")("UPDATE"),j=Object(r.b)({score:o.b,play:a.c,spaceShip:u.b,cam:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f,t=arguments.length>1?arguments[1]:void 0;return Object(i.isType)(t,b)?Object.assign(Object.assign({},e),t.payload):Object(i.isType)(t,l)?f:e},meteos:p.d,lasers:O.d,load:y.b});t.a=Object(r.c)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j(void 0,{type:""}),t=arguments.length>1?arguments[1]:void 0;return Object(i.isType)(t,d)?Object.assign(Object.assign({},e),t.payload):j(e,t)}))},66:function(e,t,n){"use strict";n.r(t);var r=n(0),i=n.n(r),c=n(25),o=n(40),a=n(6),u=n(28);function s(){var e=function(e,t){t||(t=e.slice(0));return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: column;\n  position: fixed;\n  background: rgba(255, 255, 255, 0.4);\n  bottom: 0;\n  right: 0;\n  padding: 12px;\n"]);return s=function(){return e},e}var b=function(e){!function(e){if(null==e)throw new TypeError("Cannot destructure undefined")}(e);var t=Object(c.c)((function(e){return e.score.point})),n=Object(c.c)((function(e){var t=e.meteos;return Object.keys(t).length})),o=Object(c.b)(),a=Object(r.useCallback)((function(){return o(Object(u.a)())}),[o]);return i.a.createElement(l,null,i.a.createElement("div",null,"POINTS: ",t),i.a.createElement("div",null,"METEOLITES: ",n),i.a.createElement("button",{onClick:a},"MENU"))},l=a.a.div(s());function f(){var e=function(e,t){t||(t=e.slice(0));return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: rgba(0, 0, 0, 0.4);\n  padding: 12px;\n  display: flex;\n  justify-content: center;\n  align-content: center;\n  align-items: center;\n"]);return f=function(){return e},e}var p=a.a.div(f()),O=function(){var e=Object(c.c)((function(e){var t=e.play;return t.active&&!t.menu})),t=Object(c.c)((function(e){return e.load})),n=Object(c.b)(),o=Object(r.useCallback)((function(){return n(Object(u.b)())}),[n]);return e?null:i.a.createElement(p,null,Object.values(t).some((function(e){return!e}))?i.a.createElement("div",null,"loading..."):i.a.createElement("button",{onClick:o},"START"))};t.default=function(){return i.a.createElement(c.a,{store:o.a},i.a.createElement(r.Fragment,null,i.a.createElement(O,null),i.a.createElement(b,null)))}}}]);