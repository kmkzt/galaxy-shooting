import{u as a,d as p,b as n,P as d,S as m,R as e,h as E,e as f,s as P}from"./index-BKV0M9LI.js";import{u as S}from"./useMeteoData-B3AjO9Us.js";const b=({})=>{const c=a(({score:t})=>t.point),r=a(({spaceShip:t})=>Math.floor(t.position.z)),i=a(({meteos:t})=>Object.keys(t).length),{set:l}=S({patternNum:4}),s=p(),o=n.useCallback(()=>s(d()),[s]),u=n.useCallback(()=>{s(m({isClashed:!1,position:{x:0,y:0,z:0}})),o(),l(100)},[s,o,l]);return n.useEffect(()=>{document.hasFocus()||o()}),e.createElement(h,null,e.createElement("div",null,"POINTS: ",c),e.createElement("div",null,"SHIP POSITION: ",r),e.createElement("div",null,"METEOLITES: ",i),e.createElement("button",{onClick:o},"MENU"),e.createElement("button",{onClick:u},"RESTART"))},h=E.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  position: fixed;
  background: rgba(255, 255, 255, 0.4);
  bottom: 0;
  right: 0;
  padding: 12px;
`,C=()=>e.createElement(f,{store:P},e.createElement(b,null));export{C as default};
