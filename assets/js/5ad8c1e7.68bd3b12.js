"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[632],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>f});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),d=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=d(e.components);return a.createElement(p.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),c=d(n),m=r,f=c["".concat(p,".").concat(m)]||c[m]||u[m]||o;return n?a.createElement(f,i(i({ref:t},s),{},{components:n})):a.createElement(f,i({ref:t},s))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[c]="string"==typeof e?e:r,i[1]=l;for(var d=2;d<o;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8558:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var a=n(7462),r=(n(7294),n(3905));const o={sidebar_position:2,slug:"ez-api-custom-middleware",description:"EZAPI Custom Middleware",title:"Custom Middleware"},i="Custom Middleware",l={unversionedId:"middleware/custom-middleware",id:"middleware/custom-middleware",title:"Custom Middleware",description:"EZAPI Custom Middleware",source:"@site/docs/middleware/custom-middleware.md",sourceDirName:"middleware",slug:"/middleware/ez-api-custom-middleware",permalink:"/ezapi/middleware/ez-api-custom-middleware",draft:!1,editUrl:"https://github.com/mtranter/ezapi/tree/main/docs/docs/middleware/custom-middleware.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,slug:"ez-api-custom-middleware",description:"EZAPI Custom Middleware",title:"Custom Middleware"},sidebar:"tutorialSidebar",previous:{title:"Usage",permalink:"/ezapi/middleware/ez-api-middleware"},next:{title:"Backends",permalink:"/ezapi/category/backends"}},p={},d=[{value:"Simple Example - Logging",id:"simple-example---logging",level:3},{value:"A more complex example - Composition",id:"a-more-complex-example---composition",level:3},{value:"Deep Dive",id:"deep-dive",level:3}],s={toc:d},c="wrapper";function u(e){let{components:t,...n}=e;return(0,r.kt)(c,(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"custom-middleware"},"Custom Middleware"),(0,r.kt)("p",null,"Writing your own middleware is a possible using the ",(0,r.kt)("inlineCode",{parentName:"p"},"HttpMiddleware")," functions supplied in the ",(0,r.kt)("inlineCode",{parentName:"p"},"@ezapi/router-core")," package."),(0,r.kt)("h3",{id:"simple-example---logging"},"Simple Example - Logging"),(0,r.kt)("p",null,"You can create a middleware that logs all requests and responses using the following code:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},'import { HttpMiddleware } from "@ezapi/router-core";\n\nexport const LoggingMiddleware = HttpMiddleware.of(\n  async (originalRequest, handler) => {\n    console.log(`Request`, originalRequest);\n    const response = handler(originalRequest);\n    console.log(`Response`, response);\n    return response;\n  }\n);\n')),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"LoggingMiddleware")," is an example of a middleware that logs information before and after executing the handler. In this case, it logs the original request and the response."),(0,r.kt)("p",null,"Middleware can be thought of as handler decorators, allowing you to add functionality before and/or after the handler is executed. You can also provide extra arguments to the wrapped handler or modify the output of the handler as needed."),(0,r.kt)("h3",{id:"a-more-complex-example---composition"},"A more complex example - Composition"),(0,r.kt)("p",null,"EZApi middleware is composable and type-safe. Composability means that you can stack multiple middleware instances together, and the type checker will ensure that it's done safely."),(0,r.kt)("p",null,"A metaphor for this is function composition, where you can safely compose functions ",(0,r.kt)("inlineCode",{parentName:"p"},"fab: A => B")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"fbc: B => C")," to form the function ",(0,r.kt)("inlineCode",{parentName:"p"},"fac: A => C"),"."),(0,r.kt)("p",null,"To facilitate building middleware that satisfies type-safe composition, the ",(0,r.kt)("inlineCode",{parentName:"p"},"HttpMiddleware.of")," function has a complex generic type signature:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"\nconst Middleware = {\n  of: <InputToNewHandler, InputToWrappedHandler, OutputFromNewHandler, OutputFromWrappedHandler>\n}\n")),(0,r.kt)("p",null,"In this example, we'll demonstrate building a middleware instance that depends on a previous middleware being added to the middleware chain."),(0,r.kt)("p",null,"Specifically, our middleware will make a call to an OAuth ",(0,r.kt)("inlineCode",{parentName:"p"},"/userinfo")," endpoint to obtain the ID Token details from an OAuth server. This middleware will depend on the JWT token having already been validated, for example, by using the ",(0,r.kt)("inlineCode",{parentName:"p"},"@ezapi/jwt-middleware")," instance."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},'const IdMiddleware = <Response>() => {\n  type JsonMiddlewareInjectedProps = { jwtToken: string }; // type we expect to be provided\n  type IdMiddlewareInjectedProps = { username: string }; // additional props that we will provide\n  HttpMiddleware.of<\n    JsonMiddlewareInjectedProps,\n    IdMiddlewareInjectedProps,\n    Response, // agnostic of response\n    Response // agnostic of response\n  >(async (orginalRequest, wrappedHandler) => {\n    const token = orginalRequest.jwtToken;\n    const idClaims = await fetch("https://api.my-auth-provider/oauth2/token", {\n      headers: {\n        Authorization: `Bearer ${token}`,\n      },\n    }).then((resp) => resp.json());\n    const username = idClaims.username;\n    return wrappedHandler({ ...orginalRequest, username });\n  });\n};\n')),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"IdMiddleware")," function is designed to be agnostic of the response type. To achieve this, we need to provide the response type as a generic parameter when calling ",(0,r.kt)("inlineCode",{parentName:"p"},"IdMiddleware()"),". This allows TypeScript to infer the correct response type when using ",(0,r.kt)("inlineCode",{parentName:"p"},"withMiddleware(IdMiddleware())"),"."),(0,r.kt)("h3",{id:"deep-dive"},"Deep Dive"),(0,r.kt)("p",null,"EZApi handlers are simple function types."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"type Handler<A, B> = (a: A) => B | Promise<B>;\n")),(0,r.kt)("p",null,"This is typescript speak for a function that takes any value of type A and returns a value of some type B (or a promise of B)."),(0,r.kt)("p",null,"A valid HttpHandler is defined as"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},'import { Request, Response } from "@ezapi/router-core";\n\ntype HttpHandler = Handler<Request, Response<string | Buffer>>;\n')),(0,r.kt)("p",null,"A Middleware instance is just a construct that takes some handler, and transforms it to another type of handler."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"type Middleware<InA, InB, OutA, OutB> = (\n  handler: Handler<InA & InB, OutR2>\n) => Handler<InA, OutR1>;\n")),(0,r.kt)("p",null,"For example, the ",(0,r.kt)("inlineCode",{parentName:"p"},"JsonMiddleware")," takes some type of HttpHandler: ",(0,r.kt)("inlineCode",{parentName:"p"},"Handler<Request & {jsonBody: unknown}, unknown>")," and translates it into a vanilla ",(0,r.kt)("inlineCode",{parentName:"p"},"Handler<Request, Response>")," type."),(0,r.kt)("p",null,"The inspiration for this abstraction comes from the Scala library Http4s: ",(0,r.kt)("a",{parentName:"p",href:"https://http4s.org/v0.21/middleware/"},"https://http4s.org/v0.21/middleware/")))}u.isMDXComponent=!0}}]);