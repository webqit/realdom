(()=>{function _(r){return!Array.isArray(r)&&typeof r=="object"&&r}function k(r,...t){globalThis.WebQitInternalsRegistry||(globalThis.WebQitInternalsRegistry=new Map);var n=globalThis.WebQitInternalsRegistry.get(r);if(!n){if(n=new Map,t[0]===!1)return n;globalThis.WebQitInternalsRegistry.set(r,n)}for(var e,i;e=t.shift();)if((i=n)&&!(n=n.get(e))){if(n=new Map,t[0]===!1)return n;i.set(e,n)}return n}function g(r){return Array.isArray(r)}function P(r){return typeof r=="function"}function F(r){return r===null||r===""}function C(r){return arguments.length&&(r===void 0||typeof r>"u")}function w(r){return Array.isArray(r)||typeof r=="object"&&r||P(r)}function G(r){return F(r)||C(r)||r===!1||r===0||w(r)&&!Object.keys(r).length}function y(r){return P(r)||r&&{}.toString.call(r)==="[object function]"}function L(r){return r instanceof Number||typeof r=="number"}function A(r){return L(r)||r!==!0&&r!==!1&&r!==null&&r!==""&&!isNaN(r*1)}function V(r){return r instanceof String||typeof r=="string"&&r!==null}function U(r){return!V(r)&&!C(r.length)}function W(r,...t){return t.forEach(n=>{r.indexOf(n)<0&&r.push(n)}),r}function j(e,t){t=t||Object.prototype,t=t&&!g(t)?[t]:t;for(var n=[],e=e;e&&(!t||t.indexOf(e)<0)&&e.name!=="default";)n.push(e),e=e?Object.getPrototypeOf(e):null;return n}function z(r,t){var n=[];return j(r,t).forEach(e=>{W(n,...Object.getOwnPropertyNames(e))}),n}function E(r,t,n=!1,e=!1,i=!1){var o=0,f=r.shift();if((A(f)||f===!0||f===!1)&&(o=f,f=r.shift()),!r.length)throw new Error("_merge() requires two or more array/objects.");return r.forEach((a,p)=>{!w(a)&&!y(a)||(n?z(a):Object.keys(a)).forEach(c=>{if(!!t(c,f,a,p)){var s=f[c],u=a[c];if((g(s)&&g(u)||_(s)&&_(u))&&(o===!0||o>0))f[c]=g(s)&&g(u)?[]:{},E([A(o)?o-1:o,f[c],s,u],t,n,e,i);else if(g(f)&&g(a))e?f[c]=u:f.push(u);else try{i?Object.defineProperty(f,c,Object.getOwnPropertyDescriptor(a,c)):f[c]=a[c]}catch{}}})}),f}function R(...r){return E(r,(t,n,e)=>!0,!1,!1,!1)}function v(r,t=!0){return g(r)?r:!t&&_(r)?[r]:r!==!1&&r!==0&&G(r)?[]:U(r)?Array.prototype.slice.call(r):_(r)?Object.values(r):[r]}function M(r,t,n={},e={}){t=v(t).slice();for(var i=r;!C(i)&&!F(i)&&t.length;){var o=t.shift();if(!(n.get?n.get(i,o):w(i)?o in i:i[o])){e.exists=!1;return}i=n.get?n.get(i,o):i[o]}return e.exists=!0,i}function Q(r,t,n,e={},i={}){let o=(s,u,d)=>i.set?i.set(s,u,d):(A(t[a])&&g(s)?s.push(d):s[u]=d,!0);t=v(t);for(var f=r,a=0;a<t.length;a++)if(a<t.length-1){if(!f||!w(f)&&!y(f))return!1;var p=M(f,t[a],i);if(!w(p)){if(i.buildTree===!1)return!1;p=y(i.buildTree)?i.buildTree(a):A(t[a+1])?[]:{};var c=o(f,t[a],p);if(!c)return!1}f=p}else return o(f,t[a],n)}var te=r=>class{constructor(n=!0){Object.defineProperty(this,"window",{value:r}),Object.defineProperty(this,"readCallbacks",{value:new Set}),Object.defineProperty(this,"writeCallbacks",{value:new Set}),this.async=n,this.window.requestAnimationFrame?this._run():this.async=!1}_run(){this.window.requestAnimationFrame(()=>{this.readCallbacks.forEach(n=>{n()||this.readCallbacks.delete(n)}),this.writeCallbacks.forEach(n=>{n()||this.writeCallbacks.delete(n)}),this._run()})}onread(n,e=!1){if(e)return new Promise((i,o)=>{this.async===!1?n(i,o):this.readCallbacks.add(()=>{n(i,o)})});this.async===!1?n():this.readCallbacks.add(n)}onwrite(n,e=!1){if(e)return new Promise((i,o)=>{this.async===!1?n(i,o):this.writeCallbacks.add(()=>{n(i,o)})});this.async===!1?n():this.writeCallbacks.add(n)}cycle(n,e,i){this.onread(()=>{let o=n(i),f=a=>{a!==void 0&&this.onwrite(()=>{let p=e(a,i),c=s=>{s!==void 0&&this.cycle(n,e,s)};p instanceof Promise?p.then(c):c(p)})};o instanceof Promise?o.then(f):f(o)})}};var H=class{constructor(t,n,e){this.context=t,this.namespace=n,this.window=t.defaultView||t.ownerDocument?.defaultView||e,this.document=this.window.document,this.wq=this.window.wq,Object.defineProperty(this,"#",{value:{}})}resolveArgs(t){return y(t[0])?t=[[],...t]:_(t[0])&&t.length===1?t=[[],void 0,t[0]]:_(t[1])&&t.length===2?t=[v(t[0],!1),void 0,t[1]]:t[0]=v(t[0],!1),t}registry(...t){return k(this.window,"dom.realtime",this.namespace,...t)}createSignalGenerator(){return{generate(){return this.lastController?.abort(),this.lastController=new AbortController,{signal:this.lastController.signal}},disconnect(){this.lastController?.abort()}}}forEachMatchingContext(t,n,e){let{window:i}=this,o=Array.isArray(n)?n:[n];this.registry(t).forEach((f,a)=>{f.forEach((p,c)=>{let s=o.filter(u=>u.target===c||a==="subtree"&&(c===i.document&&u.target.isConnected||c.contains(u.target)));s.length&&p.forEach(u=>e.call(this,u,Array.isArray(n)?s:s[0],c))})})}disconnectables(t,...n){let e={disconnect(){n.forEach(i=>i&&y(i.disconnect)&&i.disconnect()||y(i)&&i()||_(i)&&(i.disconnected=!0))}};return t&&t.addEventListener("abort",()=>e.disconnect()),e}};var S=class extends H{constructor(t,...n){super(t,"attr",...n)}get(t,n=void 0,e={}){let i=typeof t=="string";[t=[],n=void 0,e={}]=this.resolveArgs(arguments);let{context:o}=this,f=se(o,t),a=i?f[0]:f;if(!n)return a;if(n(a,{},o),e.live){let p=this.observe(t,n,e);return this.disconnectables(e.signal,p)}}observe(t,n,e={}){let i=typeof t=="string";if([t=[],n,e={}]=this.resolveArgs(arguments),["sync","intercept"].includes(e.timing))return this.observeSync(t,n,e);if(e.timing&&e.timing!=="async")throw new Error(`Timing option "${e.timing}" invalid.`);let{context:o,window:f,wq:a}=this;e.eventDetails&&!a.attrInterceptionHooks?.intercepting&&oe.call(f,"intercept",()=>{});let p=new f.MutationObserver(d=>{d=fe(d).map(l=>ue.call(f,l)),ie.call(f,u,d,o)}),c={attributes:!0,attributeOldValue:e.oldValue,subtree:e.subtree};t.length&&(c.attributeFilter=t),p.observe(o,c);let s=e.lifecycleSignals&&this.createSignalGenerator(),u={context:o,filter:t,callback:n,params:e,parrallels:new Map,originalFilterIsString:i,signalGenerator:s,disconnectable:p};return this.disconnectables(e.signal,p,s)}observeSync(t,n,e={}){let i=typeof t=="string";[t,n,e={}]=this.resolveArgs(arguments);let{context:o,window:f}=this;if(e.timing&&!["sync","intercept"].includes(e.timing))throw new Error(`Timing option "${e.timing}" invalid.`);let a=e.timing==="intercept"?"intercept":"sync",p=e.subtree?"subtree":"children";this.registry(a).size||oe.call(f,a,x=>{this.forEachMatchingContext(a,x,ie)});let c={disconnect(){l.delete(u),l.size||d.delete(o)}},s=e.lifecycleSignals&&this.createSignalGenerator(),u={context:o,filter:t,callback:n,params:e,parrallels:new Map,originalFilterIsString:i,signalGenerator:s,disconnectable:c},d=this.registry(a,p);d.has(o)||d.set(o,new Set);let l=d.get(o);return l.add(u),this.disconnectables(e.signal,c,s)}};function fe(r){return r.reduce((t,n,e)=>t[e-1]?.attributeName===n.attributeName?t:t.concat(n),[])}function ie(r,t){let{context:n,filter:e,callback:i,params:o,parrallels:f,originalFilterIsString:a,signalGenerator:p}=r;o.parrallels&&!f.size&&(t=se(n,e,t)),o.newValue===null&&o.oldValue===null||(t=t.map(u=>{let d;return!o.oldValue&&"oldValue"in u?{oldValue:d,...u}=u:!o.newValue&&"value"in u?{value:d,...u}=u:o.newValue&&typeof u.value>"u"&&(u={...u,value:u.target.getAttribute(u.name)}),u})),o.parrallels&&(t.forEach(u=>f.set(u.name,u)),t=Array.from(f.entries()).map(([,u])=>u));let c=a?t[0]:t,s=p?.generate()||{};i(c,s,n)}function se(r,t,n=[]){let e={event:null,type:"attribute"};return t.length?t.map(o=>n.find(f=>f.name===o)||{target:r,name:o,value:r.getAttribute(o),...e}):Array.from(r.attributes).map(o=>n.find(f=>f.name===o.nodeName)||{target:r,name:o.nodeName,value:o.nodeValue,...e})}function ue({target:r,attributeName:t,value:n,oldValue:e}){let f=(this.wq.attrInterceptionRecords?.get(r)||{})[t]||"mutation";return{target:r,name:t,value:n,oldValue:e,type:"observation",event:f}}function oe(r,t){let n=this,{wq:e,document:i,Element:o}=n;e.attrInterceptionHooks||(e.attrInterceptionHooks=new Map),e.attrInterceptionHooks.has(r)||e.attrInterceptionHooks.set(r,new Set),e.attrInterceptionHooks.get(r).add(t);let f=()=>e.attrInterceptionHooks.get(r).delete(t);if(e.attrInterceptionHooks?.intercepting)return f;console.warn("Attr mutation APIs are now being intercepted."),e.attrInterceptionHooks.intercepting=!0,e.attrInterceptionRecords=new Map;let a=(s,u)=>{e.attrInterceptionRecords.has(s.target)||e.attrInterceptionRecords.set(s.target,{});let d=e.attrInterceptionRecords.get(s.target);clearTimeout(d[s.name]?.timeout),d[s.name]=s.event;let l=setTimeout(()=>{delete d[s.name]},0);Object.defineProperty(s.event,"timeout",{value:l}),e.attrInterceptionHooks.get("intercept")?.forEach(m=>m([s]));let x=u();return e.attrInterceptionHooks.get("sync")?.forEach(m=>m([s])),x};new n.MutationObserver(s=>{s=fe(s).map(u=>ue.call(n,u)).filter((u,d)=>!Array.isArray(u.event)),s.length&&(e.attrInterceptionHooks.get("intercept")?.forEach(u=>u(s)),e.attrInterceptionHooks.get("sync")?.forEach(u=>u(s)))}).observe(i,{attributes:!0,subtree:!0,attributeOldValue:!0});let c=Object.create(null);return["setAttribute","removeAttribute","toggleAttribute"].forEach(s=>{c[s]=o.prototype[s],o.prototype[s]=function(...u){let d,l=this.getAttribute(u[0]);["setAttribute","toggleAttribute"].includes(s)&&(d=u[1]),s==="toggleAttribute"&&d===void 0&&(d=l===null);let x={target:this,name:u[0],value:d,oldValue:l,type:"interception",event:[this,s]};return a(x,()=>c[s].call(this,...u))}}),f}var q=class extends H{constructor(t,...n){super(t,"tree",...n)}attr(t,n=void 0,e={}){let{context:i,window:o}=this;return new S(i,o).get(...arguments)}query(t,n=void 0,e={}){[t,n=void 0,e={}]=this.resolveArgs(arguments);let{context:i}=this,o=new Map,f=c=>(o.has(c)||o.set(c,{target:c,entrants:[],exits:[],type:"query",event:null}),o.get(c));if((!e.on||e.on==="connected")&&(t.length?t.every(c=>typeof c=="string")&&(t=t.join(","))&&(e.subtree?i.querySelectorAll(t):[...i.children].filter(s=>s.matches(t))).forEach(s=>f(s.parentNode||i).entrants.push(s)):[...i.children].forEach(c=>f(i).entrants.push(c))),!n)return o;let a={disconnected:!1},p=n&&e.lifecycleSignals&&this.createSignalGenerator();for(let[,c]of o){if(a.disconnected)break;let s=p?.generate()||{};n(c,s,i)}if(e.live){let c=this.observe(t,n,e);return this.disconnectables(e.signal,a,p,c)}return this.disconnectables(e.signal,a,p)}children(t,n=void 0,e={}){return[t,n=void 0,e={}]=this.resolveArgs(arguments),this.query(t,n,{...e,subtree:!1})}subtree(t,n=void 0,e={}){return[t,n=void 0,e={}]=this.resolveArgs(arguments),this.query(t,n,{...e,subtree:!0})}observe(t,n,e={}){if([t,n,e={}]=this.resolveArgs(arguments),["sync","intercept"].includes(e.timing))return this.observeSync(t,n,e);if(e.timing&&e.timing!=="async")throw new Error(`Timing option "${e.timing}" invalid.`);let{context:i,window:o,wq:f,document:a}=this;e.eventDetails&&(f.domInterceptionRecordsAlwaysOn=!0),(a.readyState==="loading"||f.domInterceptionRecordsAlwaysOn)&&!f.domInterceptionHooks?.intercepting&&me.call(o,"sync",()=>{});let p=new o.MutationObserver(u=>u.forEach(d=>{ce.call(o,s,ae.call(o,d),i)}));p.observe(i,{childList:!0,subtree:e.subtree});let c=e.lifecycleSignals&&this.createSignalGenerator(),s={context:i,selectors:t,callback:n,params:e,signalGenerator:c,disconnectable:p};if(e.staticSensitivity){let u=le.call(o,s);return this.disconnectables(e.signal,p,c,u)}return this.disconnectables(e.signal,p,c)}observeSync(t,n,e={}){[t,n,e={}]=this.resolveArgs(arguments);let{context:i,window:o}=this;if(e.timing&&!["sync","intercept"].includes(e.timing))throw new Error(`Timing option "${e.timing}" invalid.`);let f=e.timing==="intercept"?"intercept":"sync",a=e.subtree?"subtree":"children";this.registry(f).size||me.call(o,f,l=>{this.forEachMatchingContext(f,l,ce)});let p={disconnect(){d.delete(s),d.size||u.delete(i)}},c=e.lifecycleSignals&&this.createSignalGenerator(),s={context:i,selectors:t,callback:n,params:e,signalGenerator:c,disconnectable:p},u=this.registry(f,a);u.has(i)||u.set(i,new Set);let d=u.get(i);if(d.add(s),e.staticSensitivity){let l=le.call(o,s);return this.disconnectables(e.signal,p,c,l)}return this.disconnectables(e.signal,p,c)}};function le(r){let t=this,{context:n,selectors:e,callback:i,params:o,signalGenerator:f}=r,a=s=>[...s.matchAll(/\[([^\=\]]+)(\=[^\]]+)?\]/g)].map(u=>u[1]);if(!(r.$attrs=e.filter(s=>typeof s=="string"&&s.includes("[")).reduce((s,u)=>s.concat(a(u)),[])).length)return;let p=new Set,c=new Set;return p.push=s=>(c.delete(s),p.add(s)),c.push=s=>(p.delete(s),c.add(s)),r.$deliveryCache={entrants:p,exits:c},new S(n,t).observe(r.$attrs,s=>{let u=new Map,d=m=>(u.has(m)||u.set(m,{target:m,entrants:[],exits:[],type:"static",event:null}),u.get(m)),l=new WeakMap,x=m=>(l.has(m)||l.set(m,e.some(h=>m.matches(h))),l.get(m));for(let m of s)["entrants","exits"].forEach(h=>{o.generation&&h!==o.generation||r.$deliveryCache[h].has(m.target)||(h==="entrants"?!x(m.target):x(m.target))||(r.$deliveryCache[h].push(m.target),d(m.target)[h].push(m.target),d(m.target).event=m.event)});for(let[,m]of u){let h=f?.generate()||{};i(m,h,n)}},{subtree:o.subtree,timing:o.timing,eventDetails:o.eventDetails})}function ce(r,t){let{context:n,selectors:e,callback:i,params:o,signalGenerator:f,$deliveryCache:a}=r,p={...t,entrants:[],exits:[]};if(["entrants","exits"].forEach(s=>{if(!(o.generation&&s!==o.generation)&&(e.length?p[s]=Ie(e,t[s],t.event!=="parse"):p[s]=[...t[s]],!!a))for(let u of p[s])a[s].push(u)}),!p.entrants.length&&!p.exits.length)return;let c=f?.generate()||{};i(p,c,n)}function Ie(r,t,n){t=Array.isArray(t)?t:[...t];let e=(i,o)=>{if(i=i.filter(f=>f.matches),typeof o=="string"){let f=i.filter(a=>a.matches(o));if(n&&(f=i.reduce((a,p)=>[...a,...p.querySelectorAll(o)],f)),f.length)return f}else if(i.includes(o)||n&&i.some(f=>f.contains(o)))return[o]};return t.$$searchCache||(t.$$searchCache=new Map),r.reduce((i,o)=>{let f;return t.$$searchCache.has(o)?f=t.$$searchCache.get(o):(f=e(t,o)||[],_(o)&&t.$$searchCache.set(o,f)),i.concat(f)},[])}function ae({target:r,addedNodes:t,removedNodes:n}){let e=this,i;return i=v(t).reduce((o,f)=>o||e.wq.domInterceptionRecords?.get(f),null),i=v(n).reduce((o,f)=>o||e.wq.domInterceptionRecords?.get(f),i),i=i||e.document.readyState==="loading"&&"parse"||"mutation",{target:r,entrants:t,exits:n,type:"observation",event:i}}function me(r,t){let n=this,{wq:e,document:i,Node:o,Element:f,HTMLElement:a,HTMLTemplateElement:p,DocumentFragment:c}=n;e.domInterceptionHooks||(e.domInterceptionHooks=new Map),e.domInterceptionHooks.has(r)||e.domInterceptionHooks.set(r,new Set),e.domInterceptionHooks.get(r).add(t);let s=()=>e.domInterceptionHooks.get(r).delete(t);if(e.domInterceptionHooks?.intercepting)return s;console.warn("DOM mutation APIs are now being intercepted."),e.domInterceptionHooks.intercepting=!0,e.domInterceptionRecords=new Map;let u=(l,x)=>{i.readyState==="loading"||e.domInterceptionRecordsAlwaysOn?l.entrants.concat(l.exits).forEach(h=>{clearTimeout(e.domInterceptionRecords.get(h)?.timeout),e.domInterceptionRecords.set(h,l.event);let O=setTimeout(()=>{e.domInterceptionRecords.delete(h)},0);Object.defineProperty(l.event,"timeout",{value:O})}):e.domInterceptionRecords.clear(),e.domInterceptionHooks.get("intercept")?.forEach(h=>h(l));let m=x();return e.domInterceptionHooks.get("sync")?.forEach(h=>h(l)),m};if(i.readyState==="loading"){let l=new n.MutationObserver(x=>x.forEach(m=>{Array.isArray((m=ae.call(n,m)).event)||(e.domInterceptionHooks.get("intercept")?.forEach(h=>h(m)),e.domInterceptionHooks.get("sync")?.forEach(h=>h(m)))}));l.observe(i,{childList:!0,subtree:!0}),i.addEventListener("readystatechange",()=>l.disconnect())}let d=Object.create(null);return["insertBefore","insertAdjacentElement","insertAdjacentHTML","setHTML","replaceChildren","replaceWith","remove","replaceChild","removeChild","before","after","append","prepend","appendChild"].forEach(l=>{let x=["insertBefore","replaceChild","removeChild","appendChild"].includes(l)?o:f;d[l]=x.prototype[l],d[l]&&(x.prototype[l]=function(...m){let h=()=>d[l].call(this,...m);if(!(this instanceof f||this instanceof c))return h();let O=[],b=[],I=this;["insertBefore"].includes(l)?b=[m[0]]:["insertAdjacentElement","insertAdjacentHTML"].includes(l)?(b=[m[1]],["beforebegin","afterend"].includes(m[0])&&(I=this.parentNode)):["setHTML","replaceChildren"].includes(l)?(O=[...this.childNodes],b=l==="replaceChildren"?[...m]:[m[0]]):["replaceWith","remove"].includes(l)?(O=[this],b=l==="replaceWith"?[...m]:[],I=this.parentNode):["replaceChild"].includes(l)?(O=[m[1]],b=[m[0]]):["removeChild"].includes(l)?O=[...m]:(b=[...m],["before","after"].includes(l)&&(I=this.parentNode));let N=l;if(["insertAdjacentHTML","setHTML"].includes(l)){let T=this.nodeName;if(l==="insertAdjacentHTML"&&["beforebegin","afterend"].includes(m[0])){if(!this.parentNode)return d[l].call(this,...m);T=this.parentNode.nodeName}let $=i.createElement(T);d.setHTML.call($,b[0],l==="setHTML"?m[1]:{}),b=[...$.childNodes],l==="insertAdjacentHTML"?(N="insertAdjacentElement",m[1]=new c,m[1].______isTemp=!0,m[1].append(...$.childNodes)):(N="replaceChildren",m=[...$.childNodes])}return u({target:I,entrants:b,exits:O,type:"interception",event:[this,l]},()=>d[N].call(this,...m))})}),["outerHTML","outerText","innerHTML","innerText","textContent","nodeValue"].forEach(l=>{let x=["textContent","nodeValue"].includes(l)?o:["outerText","innerText"].includes(l)?a:f;d[l]=Object.getOwnPropertyDescriptor(x.prototype,l),Object.defineProperty(x.prototype,l,{...d[l],set:function(m){let h=()=>d[l].set.call(this,m);if(!(this instanceof f))return h();let O=[],b=[],I=this;if(["outerHTML","outerText"].includes(l)?(O=[this],I=this.parentNode):O=[...this.childNodes],["outerHTML","innerHTML"].includes(l)){let D=this.nodeName;if(l==="outerHTML"){if(!this.parentNode)return h();D=this.parentNode.nodeName}let T=i.createElement(D==="TEMPLATE"?"div":D);d[l].set.call(T,m),b=this instanceof p?[]:[...T.childNodes],l==="outerHTML"?(m=new c,m.______isTemp=!0,m.append(...T.childNodes),h=()=>d.replaceWith.call(this,m)):this instanceof p?h=()=>this.content.replaceChildren(...T.childNodes):h=()=>d.replaceChildren.call(this,...T.childNodes)}return u({target:I,entrants:b,exits:O,type:"interception",event:[this,l]},h)}})}),["append","prepend","replaceChildren"].forEach(l=>{[i,c.prototype].forEach(x=>{let m=x[l];x[l]=function(...h){if(this.______isTemp)return m.call(this,...h);let O=l==="replaceChildren"?[...this.childNodes]:[];return u({target:this,entrants:h,exits:O,type:"interception",event:[this,l]},()=>m.call(this,...h))}})}),s}function pe(){Me.call(this),He.call(this),Pe.call(this)}function Me(){let r=this;r.CSS||(r.CSS={}),r.CSS.escape||(r.CSS.escape=t=>t.replace(/([\:@\~\$\&])/g,"\\$1"))}function He(){let r=this;"isConnected"in r.Node.prototype||Object.defineProperty(r.Node.prototype,"isConnected",{get:function(){return!this.ownerDocument||!(this.ownerDocument.compareDocumentPosition(this)&this.DOCUMENT_POSITION_DISCONNECTED)}})}function Pe(){let r=this;r.Element.prototype.matches||(r.Element.prototype.matches=r.Element.prototype.matchesSelector||r.Element.prototype.mozMatchesSelector||r.Element.prototype.msMatchesSelector||r.Element.prototype.oMatchesSelector||r.Element.prototype.webkitMatchesSelector||function(t){for(var n=(this.document||this.ownerDocument).querySelectorAll(t),e=n.length;--e>=0&&n.item(e)!==this;);return e>-1})}function de(){let r=this;if(r.wq||(r.wq={}),r.wq.dom)return r.wq.dom;r.wq.dom={},pe.call(r);let t=te(r);return r.wq.dom.Reflow=new t,r.wq.dom.DOMRealtime=q,r.wq.dom.AttrRealtime=S,r.wq.dom.realtime=(n,e="tree")=>{if(e==="tree")return new q(n,r);if(e==="attr")return new S(n,r)},r.wq.dom.ready=qe.bind(r),r.wq.dom.meta=Fe.bind(r),r.wq.dom}function qe(r){let t=this;t.document.readyState==="complete"?r(t):(t.document.domReadyCallbacks||(t.document.domReadyCallbacks=[],t.document.addEventListener("DOMContentLoaded",()=>{t.document.domReadyCallbacks.splice(0).forEach(n=>n(t))},!1)),t.document.domReadyCallbacks.push(r))}function Fe(r,t=!1){let n=this,e={content:{}};return!(e.el=n.document.querySelector(`meta[name="${r}"]`))&&t&&(e.el=n.document.createElement("meta"),e.el.setAttribute("name",r),n.document.head.append(e.el)),e.el&&(e.content=(e.el.getAttribute("content")||"").split(";").filter(i=>i).reduce((i,o)=>{let f=o.split("=").map(a=>a.trim());return Q(i,f[0].split("."),f[1]==="true"?!0:f[1]==="false"?!1:A(f[1])?parseInt(f[1]):f[1]),i},{})),e.get=function(i){return JSON.parse(JSON.stringify(M(this.content,i.split("."))))},e.copy=function(){return JSON.parse(JSON.stringify(this.content))},e.copyWithDefaults=function(...i){return i.length?R(!0,{},...i.reverse().concat(this.content)):this.copy()},e}de.call(window);})();
//# sourceMappingURL=main.js.map
