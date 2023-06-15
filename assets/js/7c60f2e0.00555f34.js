"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[831],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>g});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,o=e.originalType,u=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),c=s(r),f=i,g=c["".concat(u,".").concat(f)]||c[f]||d[f]||o;return r?n.createElement(g,a(a({ref:t},l),{},{components:r})):n.createElement(g,a({ref:t},l))}));function g(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=r.length,a=new Array(o);a[0]=f;var p={};for(var u in t)hasOwnProperty.call(t,u)&&(p[u]=t[u]);p.originalType=e,p[c]="string"==typeof e?e:i,a[1]=p;for(var s=2;s<o;s++)a[s]=r[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},7301:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>p,toc:()=>s});var n=r(7462),i=(r(7294),r(3905));const o={sidebar_position:1,title:"Basic Routing",slug:"ez-api-basic-routing"},a="Basic Routing",p={unversionedId:"router/basic-routing",id:"router/basic-routing",title:"Basic Routing",description:"The DSL for EZ API is designed to be simple, intuitive, and type-safe.",source:"@site/docs/router/basic-routing.md",sourceDirName:"router",slug:"/router/ez-api-basic-routing",permalink:"/ezapi/router/ez-api-basic-routing",draft:!1,editUrl:"https://github.com/mtranter/ezapi/tree/main/docs/docs/router/basic-routing.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,title:"Basic Routing",slug:"ez-api-basic-routing"},sidebar:"tutorialSidebar",previous:{title:"The Router",permalink:"/ezapi/category/the-router"},next:{title:"Typed Routing",permalink:"/ezapi/router/ex-api-typed-routing"}},u={},s=[],l={toc:s},c="wrapper";function d(e){let{components:t,...r}=e;return(0,i.kt)(c,(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"basic-routing"},"Basic Routing"),(0,i.kt)("p",null,"The DSL for EZ API is designed to be simple, intuitive, and type-safe."),(0,i.kt)("p",null,"EZ API intentionally separates the route definitions from the handling of the routes."),(0,i.kt)("p",null,"A basic route definition might look like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},'import { RouteBuilder, Ok } from "@ezapi/router-core";\nconst routeDefinitions = RouteBuilder.route("pingPong", "GET", "/ping");\n')),(0,i.kt)("p",null,'This route definition defines a single simple route named "pingPong". It models a ',(0,i.kt)("inlineCode",{parentName:"p"},"GET")," request to the path ",(0,i.kt)("inlineCode",{parentName:"p"},"/ping"),"."),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"build()")," function on the RouteBuilder takes an object that maps route names to handlers.\nThis is strongly typed and will fail to compile if the appropriate handler is not supplied."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},'routeDefinitions.build({\n  pingPong: (req) => Ok("PONG!"),\n});\n')))}d.isMDXComponent=!0}}]);