(()=>{function x(n){return!Array.isArray(n)&&typeof n=="object"&&n}function _(n){return Array.isArray(n)}function re(n,e,r=null){return _(e)?n.filter(t=>r?e.filter(i=>r(t,i)).length:e.indexOf(t)!==-1):[]}function I(n,...e){if(globalThis.webqit||(globalThis.webqit={}),globalThis.webqit.refs||Object.defineProperty(globalThis.webqit,"refs",{value:new U}),!arguments.length)return globalThis.webqit.refs;let r=globalThis.webqit.refs.get(n);r||(r=new U,globalThis.webqit.refs.set(n,r));let t,i;for(;t=e.shift();)(i=r)&&!(r=r.get(t))&&(r=new U,i.set(t,r));return r}var U=class extends Map{constructor(...e){super(...e),this.observers=new Set}set(e,r){let t=super.set(e,r);return this.fire("set",e,r,e),t}delete(e){let r=super.delete(e);return this.fire("delete",e),r}has(e){return this.fire("has",e),super.has(e)}get(e){return this.fire("get",e),super.get(e)}keyNames(){return Array.from(super.keys())}observe(e,r,t){let i={type:e,key:r,callback:t};return this.observers.add(i),()=>this.observers.delete(i)}unobserve(e,r,t){if(Array.isArray(e)||Array.isArray(r))throw new Error('The "type" and "key" arguments can only be strings.');for(let i of this.observers)!(Z([e,"*"],i.type)&&Z([r,"*"],i.key)&&i.callback===t)||this.observers.delete(i)}fire(e,r,...t){for(let i of this.observers)!(Z([e,"*"],i.type)&&Z([r,"*"],i.key))||i.callback(...t)}},Z=(n,e)=>Array.isArray(e)?re(n,e).length:n.includes(e);function j(n){return typeof n=="function"}function V(n){return n===null||n===""}function q(n){return arguments.length&&(n===void 0||typeof n>"u")}function A(n){return Array.isArray(n)||typeof n=="object"&&n||j(n)}function ne(n){return V(n)||q(n)||n===!1||n===0||A(n)&&!Object.keys(n).length}function w(n){return j(n)||n&&{}.toString.call(n)==="[object function]"}function W(n){return n instanceof Number||typeof n=="number"}function P(n){return W(n)||n!==!0&&n!==!1&&n!==null&&n!==""&&!isNaN(n*1)}function $(n){return n instanceof String||typeof n=="string"&&n!==null}function ie(n){return!$(n)&&!q(n.length)}function O(n,e=!0){return _(n)?n:!e&&x(n)?[n]:n!==!1&&n!==0&&ne(n)?[]:ie(n)?Array.prototype.slice.call(n):x(n)?Object.values(n):[n]}function G(n,e,r={},t={}){e=O(e).slice();for(var i=n;!q(i)&&!V(i)&&e.length;){var o=e.shift();if(!(r.get?r.get(i,o):A(i)?o in i:i[o])){t.exists=!1;return}i=r.get?r.get(i,o):i[o]}return t.exists=!0,i}function se(n,e,r,t={},i={}){let o=(l,m,f)=>i.set?i.set(l,m,f):(P(e[u])&&_(l)?l.push(f):l[m]=f,!0);e=O(e);for(var s=n,u=0;u<e.length;u++)if(u<e.length-1){if(!s||!A(s)&&!w(s))return!1;var a=G(s,e[u],i);if(!A(a)){if(i.buildTree===!1)return!1;a=w(i.buildTree)?i.buildTree(u):P(e[u+1])?[]:{};var c=o(s,e[u],a);if(!c)return!1}s=a}else return o(s,e[u],r)}var B=class{constructor(e,r=!1){Object.defineProperty(this,"window",{value:e}),Object.defineProperty(this,"readCallbacks",{value:new Set}),Object.defineProperty(this,"writeCallbacks",{value:new Set}),Object.defineProperty(this,"_synthesis",{value:0,writable:!0}),!r&&this.window.requestAnimationFrame?this._loop():this._synthesis++}get synthesis(){return this._synthesis}async synthesizeWhile(e){this._synthesis++,this._fulfill();let r=await e();return this._synthesis--,r}_fulfill(){for(let e of this.readCallbacks)e(),this.readCallbacks.delete(e);for(let e of this.writeCallbacks)e(),this.writeCallbacks.delete(e)}_loop(){this.window.requestAnimationFrame(()=>{this._fulfill(),this._loop()})}onread(e,r=!1){if(r)return new Promise(t=>{this.synthesis?t(e()):this.readCallbacks.add(()=>{t(e())})});this.synthesis?Promise.resolve().then(e):this.readCallbacks.add(e)}onwrite(e,r=!1){if(r)return new Promise(t=>{this.synthesis?t(e()):this.writeCallbacks.add(()=>{t(e())})});this.synthesis?Promise.resolve().then(e):this.writeCallbacks.add(e)}cycle(e,r,t){this.onread(()=>{let i=e(t),o=s=>{s!==void 0&&this.onwrite(()=>{let u=r(s,t),a=c=>{c!==void 0&&this.cycle(e,r,c)};u instanceof Promise?u.then(a):a(u)})};i instanceof Promise?i.then(o):o(i)})}};function we(n){return(n=n.trim())&&n.startsWith("(")&&n.endsWith(")")}function ee(n,e,r,t=!0){r=(Array.isArray(r)?r:[r]).map(s=>(s+"").replace("(",t?"(.//":"(./")).join("|");let i=[],o;try{let s=n.document.evaluate(r,e,null,n.XPathResult.ANY_TYPE);for(;o=s.iterateNext();)i.push(o)}catch{}return i}function xe(n,e,r){r=(Array.isArray(r)?r:[r]).map(t=>(t+"").replace("(","(self::")).join("|");try{return n.document.evaluate(`${r}`,e,null,n.XPathResult.BOOLEAN_TYPE).booleanValue}catch{}}function z(n,e,r,t=!1){let i=e.getRootNode(),o=r.getRootNode();return i===o?e.contains(r):t&&o instanceof n.ShadowRoot?z(n,e,o.host,t):!1}function be(n,e="|"){return[...n].reduce(([r,t,i,o],s)=>!r&&t===0&&(Array.isArray(e)?e:[e]).includes(s)?[r,t,[""].concat(i)]:(!r&&["(","[","{"].includes(s)&&!i[0].endsWith("\\")&&t++,!r&&[")","]","}"].includes(s)&&!i[0].endsWith("\\")&&t--,['"',"'","`"].includes(s)&&!i[0].endsWith("\\")&&(r=r===s?null:r||s),i[0]+=s,[r,t,i]),[null,0,[""]])[2].reverse()}var C=class{constructor(e){this.content=e,this.type=typeof e=="string"?"selector":"instance",this.kind=this.type==="instance"?null:we(e)?"xpath":"css",this.kind==="xpath"&&(this.isXpathAttr=be(e.trim().slice(1,-1),"@").length>1)}toString(){return this.content}};var k=class{constructor(e,r,t){this.context=e,this.namespace=r,this.window=e.defaultView||e.ownerDocument?.defaultView||t,this.document=this.window.document,this.webqit=this.window.webqit,Object.defineProperty(this,"#",{value:{}})}resolveArgs(e){if(w(e[0])?e=[[],...e]:x(e[0])&&!(e[0]instanceof C)&&e.length===1?e=[[],void 0,e[0]]:x(e[1])&&e.length===2?e=[O(e[0],!1),void 0,e[1]]:e[0]=O(e[0],!1),e[0].filter(r=>typeof r!="string"&&!(r instanceof C)&&!(r instanceof this.window.Node)).length)throw new Error("Argument #2 must be either a string or a Node object, or a list of those.");return e[0]=e[0].map(r=>r instanceof C?r:new C(r)),e}registry(...e){return I("realdom.realtime",this.window,this.namespace,...e)}createSignalGenerator(){return{generate(){return this.lastController?.abort(),this.lastController=new AbortController,{signal:this.lastController.signal}},disconnect(){this.lastController?.abort()}}}forEachMatchingContext(e,r,t){let{window:i}=this,o=Array.isArray(r)?r:[r],s=new Set;for(let[u,a]of this.registry(e))for(let[c,l]of a){let m=o.filter(f=>z(i,c,f.target,u==="cross-roots")?["subtree","cross-roots"].includes(u)||f.target===c:!1);if(!!m.length){Array.isArray(r)||(m=m[0]);for(let f of l)s.add([f,m,c])}}for(let[u,a,c]of s)t.call(i,u,a,c)}disconnectables(e,...r){let t={disconnect(){r.forEach(i=>i&&w(i.disconnect)&&i.disconnect()||w(i)&&i()||x(i)&&(i.disconnected=!0))}};return e&&e.addEventListener("abort",()=>t.disconnect()),t}};var F=class extends k{constructor(e,...r){super(e,"attr",...r)}get(e,r=void 0,t={}){let i=typeof e=="string"||e instanceof C;[e=[],r=void 0,t={}]=this.resolveArgs(arguments);let{context:o}=this,s=Se(o,e);if(!r)return s;let u=t.lifecycleSignals&&this.createSignalGenerator();if(i)for(let a of s){let c=u?.generate()||{};r(a,c,o)}else{let a=u?.generate()||{};r(s,a,o)}if(t.live){u&&(t={...t,signalGenerator:u});let a=this.observe(i?e[0]:e,r,{newValue:!0,...t});return this.disconnectables(t.signal,a)}}observe(e,r,t={}){let i=typeof e=="string"||e instanceof C;if([e=[],r,t={}]=this.resolveArgs(arguments),["sync","intercept"].includes(t.timing))return this.observeSync(i?e[0]:e,r,t);if(t.timing&&t.timing!=="async")throw new Error(`Timing option "${t.timing}" invalid.`);let{context:o,window:s,webqit:u}=this;t.eventDetails&&!u.realdom.attrInterceptionHooks?.intercepting&&Oe.call(s,"intercept",()=>{});let a=new s.MutationObserver(f=>{f=Ae(f).map(p=>Ee.call(s,p)),ve.call(s,m,f,o)}),c={attributes:!0,attributeOldValue:t.oldValue,subtree:t.subtree&&!0};e.length&&(c.attributeFilter=e.map(f=>f+"")),a.observe(o,c);let l=t.signalGenerator||t.lifecycleSignals&&this.createSignalGenerator(),m={context:o,spec:e,callback:r,params:t,atomics:new Map,originalFilterIsString:i,signalGenerator:l,disconnectable:a};return this.disconnectables(t.signal,a,l)}observeSync(e,r,t={}){let i=typeof e=="string"||e instanceof C;[e,r,t={}]=this.resolveArgs(arguments);let{context:o,window:s}=this;if(t.timing&&!["sync","intercept"].includes(t.timing))throw new Error(`Timing option "${t.timing}" invalid.`);let u=t.timing==="intercept"?"intercept":"sync",a=t.subtree==="cross-roots"?"cross-roots":t.subtree?"subtree":"children";this.registry(u).size||Oe.call(s,u,g=>{this.forEachMatchingContext(u,g,ve)});let c={disconnect(){p.delete(m),p.size||f.delete(o)}},l=t.signalGenerator||t.lifecycleSignals&&this.createSignalGenerator(),m={context:o,spec:e,callback:r,params:t,atomics:new Map,originalFilterIsString:i,signalGenerator:l,disconnectable:c},f=this.registry(u,a);f.has(o)||f.set(o,new Set);let p=f.get(o);return p.add(m),this.disconnectables(t.signal,c,l)}};function Ae(n){return n.reduce((e,r,t)=>e[t-1]?.attributeName===r.attributeName||I(r.target,"internalAttrInteractions").get(r.attributeName)?e:e.concat(r),[])}function ve(n,e){let{context:r,spec:t,callback:i,params:o,atomics:s,originalFilterIsString:u,signalGenerator:a}=n,c=t.map(f=>f+"");if(o.atomic&&!s.size?e=Se(r,t,e):o.timing!=="async"&&t.length&&(e=e.filter(f=>c.includes(f.name))),!e.length)return;o.newValue===null&&o.oldValue===null&&o.eventDetails||(e=e.map(f=>{let p;return o.eventDetails||({event:p,...f}=f),!o.oldValue&&"oldValue"in f&&({oldValue:p,...f}=f),!o.newValue&&"value"in f?{value:p,...f}=f:o.newValue&&typeof f.value>"u"&&(f={...f,value:te(f.target,f.name,()=>f.target.getAttribute(f.name))}),f})),o.atomic&&(e.forEach(f=>s.set(f.name,f)),e=Array.from(s.entries()).map(([,f])=>f));let l=u?e[0]:e,m=a?.generate()||{};i(l,m,r)}function te(n,e,r){let t=I(n,"internalAttrInteractions").get(e);I(n,"internalAttrInteractions").set(e,!0);let i=r();return I(n,"internalAttrInteractions").set(e,t),i}function Se(n,e,r=[]){let t={event:null,type:"attribute"};return e.length?e.map(o=>(o=o+"",r.find(s=>s.name===o)||{target:n,name:o,value:te(n,o,()=>n.getAttribute(o)),...t})):Array.from(n.attributes).map(o=>r.find(s=>s.name===o.nodeName)||{target:n,name:o.nodeName,value:te(n,o.nodeName,()=>o.nodeValue),...t})}function Ee({target:n,attributeName:e,value:r,oldValue:t}){let s=(this.webqit.realdom.attrInterceptionRecords?.get(n)||{})[e]?.[0]||"mutation";return{target:n,name:e,value:r,oldValue:t,type:"observation",event:s}}function Oe(n,e){let r=this,{webqit:t,document:i,Element:o}=r;t.realdom.attrInterceptionHooks||Object.defineProperty(t.realdom,"attrInterceptionHooks",{value:new Map}),t.realdom.attrInterceptionHooks.has(n)||t.realdom.attrInterceptionHooks.set(n,new Set),t.realdom.attrInterceptionHooks.get(n).add(e);let s=()=>t.realdom.attrInterceptionHooks.get(n).delete(e);if(t.realdom.attrInterceptionHooks?.intercepting)return s;console.warn("Attr mutation APIs are now being intercepted."),t.realdom.attrInterceptionHooks.intercepting=!0,Object.defineProperty(t.realdom,"attrInterceptionRecords",{value:new Map});let u=(l,m)=>{t.realdom.attrInterceptionRecords.has(l.target)||t.realdom.attrInterceptionRecords.set(l.target,{});let f=t.realdom.attrInterceptionRecords.get(l.target);if(f[l.name]=f[l.name]||[],f[l.name].unshift(l.event),I(l.target,"internalAttrInteractions").get(l.name))return m();t.realdom.attrInterceptionHooks.get("intercept")?.forEach(g=>g([l]));let p=m();return t.realdom.attrInterceptionHooks.get("sync")?.forEach(g=>g([l])),p};new r.MutationObserver(l=>{l=l.filter(m=>!(r.webqit.realdom.attrInterceptionRecords?.get(m.target)||{})[m.attributeName]?.shift()),l=Ae(l).map(m=>Ee.call(r,m)),l.length&&(t.realdom.attrInterceptionHooks.get("intercept")?.forEach(m=>m(l)),t.realdom.attrInterceptionHooks.get("sync")?.forEach(m=>m(l)))}).observe(i,{attributes:!0,subtree:!0,attributeOldValue:!0});let c=Object.create(null);return["setAttribute","removeAttribute","toggleAttribute"].forEach(l=>{c[l]=o.prototype[l],o.prototype[l]=function(...m){let f,p=te(this,m[0],()=>this.getAttribute(m[0]));["setAttribute","toggleAttribute"].includes(l)&&(f=m[1]),l==="toggleAttribute"&&f===void 0&&(f=p===null);let g={target:this,name:m[0],value:f,oldValue:p,type:"interception",event:[this,l]};return u(g,()=>c[l].call(this,...m))}}),s}var X=class extends k{constructor(e,...r){super(e,"tree",...r)}attr(e,r=void 0,t={}){let{context:i,window:o}=this;return new F(i,o).get(...arguments)}query(e,r=void 0,t={}){[e,r=void 0,t={}]=this.resolveArgs(arguments);let{context:i}=this,o=new Map,s=c=>(o.has(c)||o.set(c,{target:c,entrants:[],exits:[],type:"query",event:null}),o.get(c));if(!t.generation||t.generation==="entrants"){if(!e.length)[...i.children].forEach(c=>s(i).entrants.push(c));else if(e.every(c=>c.type==="selector")){let[c,l]=e.reduce(([f,p],g)=>g.kind==="xpath"?[f,p.concat(g)]:[f.concat(g),p],[[],[]]),m=[];t.subtree?(c.length&&m.push(...i.querySelectorAll(c.join(","))),l.length&&m.push(...ee(this.window,i,l))):(c.length&&m.push(...[...i.children].filter(f=>f.matches(c))),l.length&&m.push(...ee(this.window,i,l,!1))),m.forEach(f=>s(f.parentNode||i).entrants.push(f))}}if(!r)return o;let u={disconnected:!1},a=r&&t.lifecycleSignals&&this.createSignalGenerator();for(let[,c]of o){if(u.disconnected)break;let l=a?.generate()||{};r(c,l,i)}if(t.live){a&&(t={...t,signalGenerator:a});let c=this.observe(e,r,t);return this.disconnectables(t.signal,u,c)}return this.disconnectables(t.signal,u,a)}children(e,r=void 0,t={}){return[e,r=void 0,t={}]=this.resolveArgs(arguments),this.query(e,r,{...t,subtree:!1})}subtree(e,r=void 0,t={}){return[e,r=void 0,t={}]=this.resolveArgs(arguments),this.query(e,r,{...t,subtree:!0})}observe(e,r,t={}){if([e,r,t={}]=this.resolveArgs(arguments),["sync","intercept"].includes(t.timing))return this.observeSync(e,r,t);if(t.timing&&t.timing!=="async")throw new Error(`Timing option "${t.timing}" invalid.`);let{context:i,window:o,webqit:s,document:u}=this;t.eventDetails&&(s.realdom.domInterceptionRecordsAlwaysOn=!0),(u.readyState==="loading"||s.realdom.domInterceptionRecordsAlwaysOn)&&!s.realdom.domInterceptionHooks?.intercepting&&Ie.call(o,"sync",()=>{});let a=new o.MutationObserver(m=>m.forEach(f=>{ue.call(o,l,Te.call(o,f),i)}));a.observe(i,{childList:!0,subtree:t.subtree&&!0});let c=t.signalGenerator||t.lifecycleSignals&&this.createSignalGenerator(),l={context:i,spec:e,callback:r,params:t,signalGenerator:c,disconnectable:a};if(t.staticSensitivity){let m=Ce.call(o,l);return this.disconnectables(t.signal,a,c,m)}return this.disconnectables(t.signal,a,c)}observeSync(e,r,t={}){[e,r,t={}]=this.resolveArgs(arguments);let{context:i,window:o}=this;if(t.timing&&!["sync","intercept"].includes(t.timing))throw new Error(`Timing option "${t.timing}" invalid.`);let s=t.timing==="intercept"?"intercept":"sync",u=t.subtree==="cross-roots"?"cross-roots":t.subtree?"subtree":"children";this.registry(s).size||Ie.call(o,s,g=>{this.forEachMatchingContext(s,g,ue)});let a=new o.MutationObserver(g=>g.forEach(b=>{Array.isArray((b=Te.call(o,b)).event)||ue.call(o,m,b,i)}));a.observe(i,{childList:!0,subtree:t.subtree&&!0});let c={disconnect(){a.disconnect(),p.delete(m),p.size||f.delete(i)}},l=t.signalGenerator||t.lifecycleSignals&&this.createSignalGenerator(),m={context:i,spec:e,callback:r,params:t,signalGenerator:l,disconnectable:c},f=this.registry(s,u);f.has(i)||f.set(i,new Set);let p=f.get(i);if(p.add(m),t.staticSensitivity){let g=Ce.call(o,m);return this.disconnectables(t.signal,c,l,g)}return this.disconnectables(t.signal,c,l)}track(e,r,t={}){return t={subtree:!0,...t},this.observe(e,i=>{i.entrants.length&&r(!0,Array.isArray(e)?i.entrants:i.entrants[0]),i.exits.length&&r(!1,Array.isArray(e)?i.exits:i.exits[0])},t)}};function Ce(n){let e=this,{context:r,spec:t,callback:i,params:o,signalGenerator:s}=n,u=t.filter(p=>p.kind==="css"),a=p=>p.match(/\.([\w-]+)/g)?.length?["class"]:[],c=p=>p.match(/#([\w-]+)/g)?.length?["id"]:[],l=p=>[...p.matchAll(/\[([^\=\]]+)(\=[^\]]+)?\]/g)].map(g=>g[1]).concat(a(p)).concat(c(p));if(!(n.$attrs=Array.from(new Set(u.filter(p=>(p+"").includes("[")).reduce((p,g)=>p.concat(l(g+"")),[])))).length)return;let m=new Set,f=new Set;return m.push=p=>(f.delete(p),m.add(p)),f.push=p=>(m.delete(p),f.add(p)),n.$deliveryCache={entrants:m,exits:f},new F(r,e).observe(n.$attrs,p=>{let g=new Map,b=y=>(g.has(y)||g.set(y,{target:y,entrants:[],exits:[],type:"static",event:null}),g.get(y)),Q=new WeakMap,d=y=>(Q.has(y)||Q.set(y,u.some(v=>y.matches(v+""))),Q.get(y));for(let y of p)["entrants","exits"].forEach(v=>{o.generation&&v!==o.generation||n.$deliveryCache[v].has(y.target)||(v==="entrants"?!d(y.target):d(y.target))||(n.$deliveryCache[v].push(y.target),b(y.target)[v].push(y.target),b(y.target).event=y.event)});for(let[,y]of g){let v=s?.generate()||{};i(y,v,r)}},{subtree:o.subtree,timing:o.timing,eventDetails:o.eventDetails})}function ue(n,e){let{context:r,spec:t,callback:i,params:o,signalGenerator:s,$deliveryCache:u}=n,a={...e,entrants:[],exits:[]};if(o.eventDetails||delete a.event,["entrants","exits"].forEach(l=>{if(!(o.generation&&l!==o.generation)&&(t.length?a[l]=Xe.call(this,t,o.subtree==="cross-roots",e[l],e.event!=="parse"):a[l]=[...e[l]],!!u))for(let m of a[l])u[l].push(m)}),!a.entrants.length&&!a.exits.length)return;let c=s?.generate()||{};i(a,c,r)}function Xe(n,e,r,t){r=Array.isArray(r)?r:[...r];let i=(o,s)=>{if(s.type==="selector"){let u=s.isXpathAttr?[]:o.filter(a=>s.kind==="xpath"?xe(this,a,s+""):a.matches&&a.matches(s+""));if((t||s.isXpathAttr)&&(u=o.reduce((a,c)=>s.kind==="xpath"?[...a,...ee(this,c,s,t)]:c.querySelectorAll?[...a,...c.querySelectorAll(s+"")]:a,u)),u.length)return u}else if(o.includes(s.content)||t&&o.some(u=>z(this,u,s.content,e)))return[s.content]};return r.$$searchCache||(r.$$searchCache=new Map),n.reduce((o,s)=>{let u;return r.$$searchCache.has(s.content)?u=r.$$searchCache.get(s.content):(u=i(r,s)||[],s.type==="instance"&&r.$$searchCache.set(s.content,u)),o.concat(u)},[])}function Te({target:n,addedNodes:e,removedNodes:r}){let t=this,i;return i=O(e).reduce((o,s)=>o||t.webqit.realdom.domInterceptionRecords?.get(s),null),i=O(r).reduce((o,s)=>o||t.webqit.realdom.domInterceptionRecords?.get(s),i),i=i||t.document.readyState==="loading"&&"parse"||"mutation",{target:n,entrants:e,exits:r,type:"observation",event:i}}function Ie(n,e){let r=this,{webqit:t,document:i,Node:o,CharacterData:s,Element:u,HTMLElement:a,HTMLTemplateElement:c,DocumentFragment:l}=r;t.realdom.domInterceptionHooks||Object.defineProperty(t.realdom,"domInterceptionHooks",{value:new Map}),t.realdom.domInterceptionNoRecurse||Object.defineProperty(t.realdom,"domInterceptionNoRecurse",{value:new Map}),t.realdom.domInterceptionHooks.has(n)||t.realdom.domInterceptionHooks.set(n,new Set),t.realdom.domInterceptionHooks.get(n).add(e);let m=()=>t.realdom.domInterceptionHooks.get(n).delete(e);if(t.realdom.domInterceptionHooks?.intercepting)return m;console.warn("DOM mutation APIs are now being intercepted."),t.realdom.domInterceptionHooks.intercepting=!0,Object.defineProperty(t.realdom,"domInterceptionRecords",{value:new Map});let f=(d,y,v)=>{t.realdom.domInterceptionNoRecurse.set(d,y);let h=v();return t.realdom.domInterceptionNoRecurse.delete(d),h},p=(d,y)=>{d.entrants.concat(d.exits).forEach(h=>{clearTimeout(t.realdom.domInterceptionRecords.get(h)?.timeout),t.realdom.domInterceptionRecords.set(h,d.event);let T=setTimeout(()=>{t.realdom.domInterceptionRecords.delete(h)},0);Object.defineProperty(d.event,"timeout",{value:T,configurable:!0})}),t.realdom.domInterceptionHooks.get("intercept")?.forEach(h=>h(d));let v=y();return t.realdom.domInterceptionHooks.get("sync")?.forEach(h=>h(d)),v},g={ShadowRoot:["innerHTML"],DocumentFragment:["replaceChildren","append","prepend"],Document:["replaceChildren","append","prepend"],HTMLElement:["outerText","innerText"],Element:["append","prepend","before","after","insertAdjacentElement","insertAdjacentHTML","remove","replaceChildren","replaceWith","setHTML","innerHTML","outerHTML"],CharacterData:["before","after","remove","replaceWith"],Node:["insertBefore","replaceChild","removeChild","appendChild","textContent","nodeValue"]},b={ShadowRoot:Object.create(null),DocumentFragment:Object.create(null),Document:Object.create(null),HTMLElement:Object.create(null),Element:Object.create(null),CharacterData:Object.create(null),Node:Object.create(null)};return new Set(Object.values(g).reduce((d,y)=>d.concat(y),[])).forEach(d=>{Object.keys(g).forEach(h=>{if(!g[h].includes(d))return;let T=Object.getOwnPropertyDescriptor(r[h].prototype,d);!T||(Object.defineProperty(r[h].prototype,d,"value"in T?{...T,value:y}:{...T,set:v}),b[h][d]=T)});function y(...h){let T=Object.keys(b).find(E=>this instanceof r[E]&&d in b[E]),D=b[T],N=()=>D[d].value.call(this,...h);if(t.realdom.domInterceptionNoRecurse.get(this)===d)return N();let M=[],S=[],L=this;["insertBefore"].includes(d)?S=[h[0]]:["insertAdjacentElement","insertAdjacentHTML"].includes(d)?(S=[h[1]],["beforebegin","afterend"].includes(h[0])&&(L=this.parentNode)):["setHTML","replaceChildren"].includes(d)?(M=[...this.childNodes],S=d==="replaceChildren"?[...h]:[h[0]]):["replaceWith","remove"].includes(d)?(M=[this],S=d==="replaceWith"?[...h]:[],L=this.parentNode):["replaceChild"].includes(d)?(M=[h[1]],S=[h[0]]):["removeChild"].includes(d)?M=[...h]:(S=[...h],["before","after"].includes(d)&&(L=this.parentNode));let J=d;if(["insertAdjacentHTML","setHTML"].includes(d)){let E=this.nodeName;if(d==="insertAdjacentHTML"&&["beforebegin","afterend"].includes(h[0])){if(!this.parentNode)return D[d].value.call(this,...h);E=this.parentNode.nodeName}let Y=i.createElement(E);D.setHTML.value.call(Y,S[0],d==="setHTML"?h[1]:{}),S=[...Y.childNodes],d==="insertAdjacentHTML"?(J="insertAdjacentElement",h[1]=new l,f(h[1],"append",()=>h[1].append(...Y.childNodes))):(J="replaceChildren",h=[...Y.childNodes])}return p({target:L,entrants:S,exits:M,type:"interception",event:[this,d]},()=>D[J].value.call(this,...h))}function v(h){let T=Object.keys(b).find(H=>this instanceof r[H]&&d in b[H]),D=b[T],N=()=>D[d].set.call(this,h);if(t.realdom.domInterceptionNoRecurse.get(this)===d)return N();let M=[],S=[],L=this;if(["outerHTML","outerText"].includes(d)?(M=[this],L=this.parentNode):M=[...this.childNodes],["outerHTML","innerHTML"].includes(d)){let H=this.nodeName;if(d==="outerHTML"){if(!this.parentNode)return N();H=this.parentNode.nodeName}let E=i.createElement(H==="TEMPLATE"||H.includes("-")?"div":H);f(E,d,()=>E[d]=h),S=this instanceof c?[]:[...E.childNodes],d==="outerHTML"?(h=new l,f(h,"append",()=>h.append(...E.childNodes)),N=()=>f(this,"replaceWith",()=>u.prototype.replaceWith.call(this,h))):this instanceof c?N=()=>f(this.conten,"replaceChildren",()=>this.content.replaceChildren(...E.childNodes)):N=()=>f(this,"replaceChildren",()=>u.prototype.replaceChildren.call(this,...E.childNodes))}return p({target:L,entrants:S,exits:M,type:"interception",event:[this,d]},N)}}),m}function Pe(){Qe.call(this),Je.call(this),Ye.call(this)}function Qe(){let n=this;n.CSS||(n.CSS={}),n.CSS.escape||(n.CSS.escape=e=>e.replace(/([\:@\~\$\&])/g,"\\$1"))}function Je(){let n=this;"isConnected"in n.Node.prototype||Object.defineProperty(n.Node.prototype,"isConnected",{get:function(){return!this.ownerDocument||!(this.ownerDocument.compareDocumentPosition(this)&this.DOCUMENT_POSITION_DISCONNECTED)}})}function Ye(){let n=this;n.Element.prototype.matches||(n.Element.prototype.matches=n.Element.prototype.matchesSelector||n.Element.prototype.mozMatchesSelector||n.Element.prototype.msMatchesSelector||n.Element.prototype.oMatchesSelector||n.Element.prototype.webkitMatchesSelector||function(e){for(var r=(this.document||this.ownerDocument).querySelectorAll(e),t=r.length;--t>=0&&r.item(t)!==this;);return t>-1})}function Me(){let n=this;if(n.webqit||(n.webqit={}),n.webqit.realdom)return n.webqit.realdom;n.webqit.realdom={},Pe.call(n),n.webqit.realdom.meta=(...r)=>Ze.call(n,...r),n.webqit.realdom.ready=(...r)=>ce.call(n,...r),n.webqit.realdom.realtime=(r,t="dom")=>{if(t==="dom")return new X(r,n);if(t==="attr")return new F(r,n)};let e=new B(n);return n.webqit.realdom.schedule=(r,...t)=>e[`on${r}`](...t),n.webqit.realdom.synthesizeWhile=(...r)=>e.synthesizeWhile(...r),n.webqit.realdom}function ce(...n){let e="interactive",r;$(n[0])?(e=n[0],w(n[1])&&(r=n[1])):w(n[0])&&(r=n[0]);let t={interactive:["interactive","complete"],complete:["complete"]};if(!t[e])throw new Error(`Invalid ready-state timing: ${e}.`);let i=this;if(!r)return i.webqit.realdom.readyStatePromises||(i.webqit.realdom.readyStatePromises={interactive:new Promise(o=>ce.call(this,"interactive",o)),complete:new Promise(o=>ce.call(this,"complete",o))}),i.webqit.realdom.readyStatePromises[e];if(t[e].includes(i.document.readyState))return r(i);i.webqit.realdom.readyStateCallbacks||(i.webqit.realdom.readyStateCallbacks={interactive:[],complete:[]},i.document.addEventListener("readystatechange",()=>{let o=i.document.readyState;for(let s of i.webqit.realdom.readyStateCallbacks[o].splice(0))s(i)},!1)),i.webqit.realdom.readyStateCallbacks[e].push(r)}function Ze(n){let e=this,r={},t;return(t=e.document.querySelector(`meta[name="${n}"]`))&&(r=(t.content||"").split(";").filter(i=>i).reduce((i,o)=>{let s=o.split("=").map(u=>u.trim());return se(i,s[0].split("."),s[1]==="true"?!0:s[1]==="false"?!1:P(s[1])?parseInt(s[1]):s[1]),i},{})),{get name(){return n},get content(){return t.content},json(){return JSON.parse(JSON.stringify(r))}}}Me.call(window);})();
//# sourceMappingURL=main.js.map
