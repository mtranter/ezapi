"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[746],{3905:(e,r,t)=>{t.d(r,{Zo:()=>l,kt:()=>y});var n=t(7294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function u(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=n.createContext({}),s=function(e){var r=n.useContext(p),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},l=function(e){var r=s(e.components);return n.createElement(p.Provider,{value:r},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),c=s(t),d=o,y=c["".concat(p,".").concat(d)]||c[d]||m[d]||a;return t?n.createElement(y,i(i({ref:r},l),{},{components:t})):n.createElement(y,i({ref:r},l))}));function y(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var u={};for(var p in r)hasOwnProperty.call(r,p)&&(u[p]=r[p]);u.originalType=e,u[c]="string"==typeof e?e:o,i[1]=u;for(var s=2;s<a;s++)i[s]=t[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},8251:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>p,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>u,toc:()=>s});var n=t(7462),o=(t(7294),t(3905));const a={sidebar_position:3,title:"Modular Apps",slug:"ez-api-modular-routing"},i="Modular Applications",u={unversionedId:"router/modular-apps",id:"router/modular-apps",title:"Modular Apps",description:"It can be cumbersome to use a single Router/RouterBuilder instance for large web apps.",source:"@site/docs/router/modular-apps.md",sourceDirName:"router",slug:"/router/ez-api-modular-routing",permalink:"/ezapi/router/ez-api-modular-routing",draft:!1,editUrl:"https://github.com/mtranter/ezapi/tree/main/docs/docs/router/modular-apps.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,title:"Modular Apps",slug:"ez-api-modular-routing"},sidebar:"tutorialSidebar",previous:{title:"Typed Routing",permalink:"/ezapi/router/ex-api-typed-routing"},next:{title:"Testing",permalink:"/ezapi/router/testing-ez-api-routing"}},p={},s=[],l={toc:s},c="wrapper";function m(e){let{components:r,...t}=e;return(0,o.kt)(c,(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"modular-applications"},"Modular Applications"),(0,o.kt)("p",null,"It can be cumbersome to use a single Router/RouterBuilder instance for large web apps."),(0,o.kt)("p",null,"For this use cases, the ",(0,o.kt)("inlineCode",{parentName:"p"},"ApiBuilder")," object is supplied. It's API is quite simple."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},'// people.ts\nconst peopleRoutes = RouteBuilder.route(\n  "searchPeople",\n  "GET",\n  "/?{name}&{age:int}"\n);\nexport const peopleRouter = peopleRoutes.build({\n  searchPeople: async (req) => {\n    const nameQuery: string = req.queryParams.name;\n    const ageQuery: number = req.queryParams.age;\n    return Ok(JSON.stringify({ nameQuery, ageQuery }));\n  },\n});\n\n// cars.ts\nconst carRoutes = RouteBuilder.route("searchCars", "GET", "/?{make}&{model}");\nexport const carRouter = carRoutes.build({\n  searchCars: async (req) => {\n    const makeQuery = req.queryParams.make;\n    const modelQuery = req.queryParams.model;\n    return Ok(JSON.stringify({ makeQuery, modelQuery }));\n  },\n});\n\n// api.ts\nimport { peopleRouter } from \'./people.ts\'\nimport { carRouter } from \'./cars.ts\'\nconst api: Router = ApiBuilder.build({\n  "/people": peopleRouter,\n  "/cars": carRouter,\n});\n')))}m.isMDXComponent=!0}}]);