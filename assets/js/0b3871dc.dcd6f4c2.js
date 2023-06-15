"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[688],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},y=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),c=s(r),y=a,m=c["".concat(u,".").concat(y)]||c[y]||d[y]||o;return r?n.createElement(m,i(i({ref:t},l),{},{components:r})):n.createElement(m,i({ref:t},l))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=y;var p={};for(var u in t)hasOwnProperty.call(t,u)&&(p[u]=t[u]);p.originalType=e,p[c]="string"==typeof e?e:a,i[1]=p;for(var s=2;s<o;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}y.displayName="MDXCreateElement"},5942:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>p,toc:()=>s});var n=r(7462),a=(r(7294),r(3905));const o={sidebar_position:2,slug:"ex-api-typed-routing"},i="Typed Routing",p={unversionedId:"router/typed-routing",id:"router/typed-routing",title:"Typed Routing",description:"The DSL provides some typesafe candy for developer productivity",source:"@site/docs/router/typed-routing.md",sourceDirName:"router",slug:"/router/ex-api-typed-routing",permalink:"/ezapi/router/ex-api-typed-routing",draft:!1,editUrl:"https://github.com/mtranter/ezapi/tree/main/docs/docs/router/typed-routing.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,slug:"ex-api-typed-routing"},sidebar:"tutorialSidebar",previous:{title:"Basic Routing",permalink:"/ezapi/router/ez-api-basic-routing"},next:{title:"Modular Apps",permalink:"/ezapi/router/ez-api-modular-routing"}},u={},s=[{value:"Path Params",id:"path-params",level:3},{value:"Query Strings",id:"query-strings",level:3},{value:"Optional Query String Params",id:"optional-query-string-params",level:4}],l={toc:s},c="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(c,(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"typed-routing"},"Typed Routing"),(0,a.kt)("p",null,"The DSL provides some typesafe candy for developer productivity"),(0,a.kt)("h3",{id:"path-params"},"Path Params"),(0,a.kt)("p",null,"Any path params defined in the URL template, will appear on the handler Request object under the ",(0,a.kt)("inlineCode",{parentName:"p"},"pathParams")," property."),(0,a.kt)("p",null,"For example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},'const routeDefinitions = RouteBuilder.route(\n  "getPersonById",\n  "GET",\n  "/people/{id}"\n).build({\n  getPersonById: async (req) => {\n    const personId: string = req.pathParams.id; // <-- typesafe fun!\n    return Ok("OK");\n  },\n});\n')),(0,a.kt)("p",null,"These params can also be explicitly typed"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},'const routeDefinitions = RouteBuilder.route(\n  "getPersonById",\n  "GET",\n  "/people/{id:int}"\n).build({\n  getPersonById: async (req) => {\n    const personId: number = req.pathParams.id; // <-- more typesafe fun!\n    return Ok("OK");\n  },\n});\n')),(0,a.kt)("p",null,"At the moment, the only types available are int, float and string. This has been designed to be extensible"),(0,a.kt)("admonition",{title:"ToDo ",type:"danger"},(0,a.kt)("p",{parentName:"admonition"},"Test and document extending the url parameter parser")),(0,a.kt)("h3",{id:"query-strings"},"Query Strings"),(0,a.kt)("p",null,"These same code candy works for query strings"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},'import { RouteBuilder, Ok } from "@ezapi/router-core";\nconst routeDefinitions = RouteBuilder.route("searchPeople", "GET", "/people?{name}&{age:int}")\n  .build({\n    getPersonById: async (req) => {\n      const nameQuery: string = req.queryParams.name\n      const ageQuery: number = req.queryParams.age\n      return Ok("OK")\n    }\n  })\n')),(0,a.kt)("p",null,"The above route definition will not much a request without the name and age query parameters."),(0,a.kt)("h4",{id:"optional-query-string-params"},"Optional Query String Params"),(0,a.kt)("p",null,"If you wish a query parameter to be optional, you can post-fix it with a ",(0,a.kt)("inlineCode",{parentName:"p"},"?")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},'import { RouteBuilder, Ok } from "@ezapi/router-core";\nconst routeDefinitions = RouteBuilder.route("searchPeople", "GET", "/people?{name?}&{age?:int}")\n  .build({\n    getPersonById: async (req) => {\n      const nameQuery: string | undefined = req.queryParams.name\n      const ageQuery: number | undefined = req.queryParams.age\n      return Ok("OK")\n    }\n  })\n')))}d.isMDXComponent=!0}}]);