(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{44:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var c=n(5),r=n(42);function a(e,t){var n=Object(c.c)((function(e){return e.play.active&&!e.spaceShip.isClashed}));Object(r.b)((function(t,c){n&&e(t,c)}),t)}},66:function(e,t,n){"use strict";n.r(t);var c=n(0),r=n.n(c),a=n(5),u=n(42),i=Object(c.lazy)((function(){return Promise.all([n.e(0),n.e(3)]).then(n.bind(null,64))})),o=Object(c.lazy)((function(){return Promise.all([n.e(0),n.e(2)]).then(n.bind(null,69))})),l=Object(c.lazy)((function(){return n.e(4).then(n.bind(null,65))})),s=function(){return r.a.createElement(c.Suspense,{fallback:null},r.a.createElement(i,null),r.a.createElement(o,{num:100}),r.a.createElement(l,null))},m=n(20),b=n(44),f=function(){var e=Object(a.b)();return Object(b.a)((function(){return e(Object(m.a)(1))})),null},v=document.getElementById("app");t.default=function(){var e=Object(u.d)(),t=e.camera,n=e.raycaster,i=e.mouse,o=Object(a.c)((function(e){return e.spaceShip})),l=Object(a.c)((function(e){return e.cam})).distance,m=Object(c.useCallback)((function(e,c){var r=v.getBoundingClientRect();i.x=(e-r.left)/r.width*2-1,i.y=-(c-r.top)/r.height*2+1,n.setFromCamera(i,t)}),[t,i,n]),b=Object(c.useCallback)((function(e){e.preventDefault(),m(e.clientX,e.clientY)}),[m]),p=Object(c.useCallback)((function(e){return e.preventDefault()}),[]);return Object(c.useLayoutEffect)((function(){return v.addEventListener("pointermove",b),v.addEventListener("mousemove",b),v.addEventListener("touchmove",p,{passive:!1}),function(){v.removeEventListener("pointermove",b),v.removeEventListener("mousemove",b),v.removeEventListener("touchmove",p)}}),[b,p]),Object(u.b)((function(e){e.camera.position.z=o.position.z+l})),r.a.createElement(c.Fragment,null,r.a.createElement("hemisphereLight",{args:[15658751,2236962,1],position:[0,0,10],intensity:.6}),r.a.createElement(f,null),r.a.createElement(s,null))}}}]);