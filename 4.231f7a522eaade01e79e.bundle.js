(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{46:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var c=n(5),a=n(44),r=n(50);function u(e,t){var n=Object(c.c)(r.a);Object(a.b)((function(t,c){n&&e(t,c)}),t)}},50:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var c=function(e){return!e.play.menu&&e.play.active&&!e.spaceShip.isClashed}},71:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n.n(c),r=Object(c.lazy)((function(){return Promise.all([n.e(0),n.e(3)]).then(n.bind(null,68))})),u=Object(c.lazy)((function(){return Promise.all([n.e(0),n.e(2)]).then(n.bind(null,69))})),i=Object(c.lazy)((function(){return n.e(6).then(n.bind(null,70))})),o=function(){return a.a.createElement(c.Suspense,{fallback:null},a.a.createElement(r,null),a.a.createElement(u,{num:100}),a.a.createElement(i,null))},l=n(5),s=n(21),f=n(46),m=function(){var e=Object(l.b)();return Object(f.a)((function(){return e(Object(s.a)(1))})),null},b=n(44),v=n(22),p=document.getElementById("app");var d=function(){var e=Object(b.d)(),t=e.camera,n=e.raycaster,a=e.mouse,r=e.aspect,u=Object(l.c)((function(e){return e.spaceShip})),i=Object(l.c)((function(e){return e.cam})).distance,o=Object(l.b)(),s=Object(c.useCallback)((function(e,c){var r=p.getBoundingClientRect();a.x=(e-r.left)/r.width*2-1,a.y=-(c-r.top)/r.height*2+1,n.setFromCamera(a,t)}),[t,a,n]),f=Object(c.useCallback)((function(e){e.preventDefault(),s(e.clientX,e.clientY)}),[s]),m=Object(c.useCallback)((function(e){return e.preventDefault()}),[]);Object(c.useLayoutEffect)((function(){return p.addEventListener("pointermove",f),p.addEventListener("mousemove",f),p.addEventListener("touchmove",m,{passive:!1}),function(){p.removeEventListener("pointermove",f),p.removeEventListener("mousemove",f),p.removeEventListener("touchmove",m)}}),[f,m]),Object(c.useLayoutEffect)((function(){o(Object(v.a)({far:t.far,near:t.near,aspect:r}))}),[r,t,o]),Object(b.b)((function(e){e.camera.position.z=u.position.z+i}))};t.default=function(){return d(),a.a.createElement(c.Fragment,null,a.a.createElement("hemisphereLight",{args:[15658751,2236962,1],position:[0,0,10],intensity:.6}),a.a.createElement(m,null),a.a.createElement(o,null))}}}]);