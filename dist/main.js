(()=>{function x(r){return!Array.isArray(r)&&typeof r=="object"&&r}function V(r,...t){globalThis.WebQitInternalsRegistry||(globalThis.WebQitInternalsRegistry=new Map);var n=globalThis.WebQitInternalsRegistry.get(r);if(!n){if(n=new Map,t[0]===!1)return n;globalThis.WebQitInternalsRegistry.set(r,n)}for(var e,o;e=t.shift();)if((o=n)&&!(n=n.get(e))){if(n=new Map,t[0]===!1)return n;o.set(e,n)}return n}function g(r){return Array.isArray(r)}function q(r){return typeof r=="function"}function L(r){return r===null||r===""}function S(r){return arguments.length&&(r===void 0||typeof r>"u")}function v(r){return Array.isArray(r)||typeof r=="object"&&r||q(r)}function U(r){return L(r)||S(r)||r===!1||r===0||v(r)&&!Object.keys(r).length}function w(r){return q(r)||r&&{}.toString.call(r)==="[object function]"}function N(r){return r instanceof Number||typeof r=="number"}function C(r){return N(r)||r!==!0&&r!==!1&&r!==null&&r!==""&&!isNaN(r*1)}function k(r){return r instanceof String||typeof r=="string"&&r!==null}function j(r){return!k(r)&&!S(r.length)}function B(r,...t){return t.forEach(n=>{r.indexOf(n)<0&&r.push(n)}),r}function z(e,t){t=t||Object.prototype,t=t&&!g(t)?[t]:t;for(var n=[],e=e;e&&(!t||t.indexOf(e)<0)&&e.name!=="default";)n.push(e),e=e?Object.getPrototypeOf(e):null;return n}function J(r,t){var n=[];return z(r,t).forEach(e=>{B(n,...Object.getOwnPropertyNames(e))}),n}function E(r,t,n=!1,e=!1,o=!1){var i=0,f=r.shift();if((C(f)||f===!0||f===!1)&&(i=f,f=r.shift()),!r.length)throw new Error("_merge() requires two or more array/objects.");return r.forEach((l,a)=>{!v(l)&&!w(l)||(n?J(l):Object.keys(l)).forEach(c=>{if(!!t(c,f,l,a)){var s=f[c],u=l[c];if((g(s)&&g(u)||x(s)&&x(u))&&(i===!0||i>0))f[c]=g(s)&&g(u)?[]:{},E([C(i)?i-1:i,f[c],s,u],t,n,e,o);else if(g(f)&&g(l))e?f[c]=u:f.push(u);else try{o?Object.defineProperty(f,c,Object.getOwnPropertyDescriptor(l,c)):f[c]=l[c]}catch{}}})}),f}function R(...r){return E(r,(t,n,e)=>!0,!1,!1,!1)}function O(r,t=!0){return g(r)?r:!t&&x(r)?[r]:r!==!1&&r!==0&&U(r)?[]:j(r)?Array.prototype.slice.call(r):x(r)?Object.values(r):[r]}function H(r,t,n={},e={}){t=O(t).slice();for(var o=r;!S(o)&&!L(o)&&t.length;){var i=t.shift();if(!(n.get?n.get(o,i):v(o)?i in o:o[i])){e.exists=!1;return}o=n.get?n.get(o,i):o[i]}return e.exists=!0,o}function X(r,t,n,e={},o={}){let i=(s,u,p)=>o.set?o.set(s,u,p):(C(t[l])&&g(s)?s.push(p):s[u]=p,!0);t=O(t);for(var f=r,l=0;l<t.length;l++)if(l<t.length-1){if(!f||!v(f)&&!w(f))return!1;var a=H(f,t[l],o);if(!v(a)){if(o.buildTree===!1)return!1;a=w(o.buildTree)?o.buildTree(l):C(t[l+1])?[]:{};var c=i(f,t[l],a);if(!c)return!1}f=a}else return i(f,t[l],n)}var re=r=>class{constructor(n=!0){Object.defineProperty(this,"window",{value:r}),Object.defineProperty(this,"readCallbacks",{value:new Set}),Object.defineProperty(this,"writeCallbacks",{value:new Set}),this.async=n,this.window.requestAnimationFrame?this._run():this.async=!1}_run(){this.window.requestAnimationFrame(()=>{this.readCallbacks.forEach(n=>{n()||this.readCallbacks.delete(n)}),this.writeCallbacks.forEach(n=>{n()||this.writeCallbacks.delete(n)}),this._run()})}onread(n,e=!1){if(e)return new Promise((o,i)=>{this.async===!1?n(o,i):this.readCallbacks.add(()=>{n(o,i)})});this.async===!1?n():this.readCallbacks.add(n)}onwrite(n,e=!1){if(e)return new Promise((o,i)=>{this.async===!1?n(o,i):this.writeCallbacks.add(()=>{n(o,i)})});this.async===!1?n():this.writeCallbacks.add(n)}cycle(n,e,o){this.onread(()=>{let i=n(o),f=l=>{l!==void 0&&this.onwrite(()=>{let a=e(l,o),c=s=>{s!==void 0&&this.cycle(n,e,s)};a instanceof Promise?a.then(c):c(a)})};i instanceof Promise?i.then(f):f(i)})}};var P=class{constructor(t,n,e){this.context=t,this.namespace=n,this.window=t.defaultView||t.ownerDocument?.defaultView||e,this.document=this.window.document,this.wq=this.window.wq,Object.defineProperty(this,"#",{value:{}})}resolveArgs(t){return w(t[0])?t=[[],...t]:x(t[0])&&t.length===1?t=[[],void 0,t[0]]:x(t[1])&&t.length===2?t=[O(t[0],!1),void 0,t[1]]:t[0]=O(t[0],!1),t}registry(...t){return V(this.window,"dom.realtime",this.namespace,...t)}createSignalGenerator(){return{generate(){return this.lastController?.abort(),this.lastController=new AbortController,{signal:this.lastController.signal}},disconnect(){this.lastController?.abort()}}}forEachMatchingContext(t,n,e){let{window:o}=this,i=Array.isArray(n)?n:[n],f=new Set;for(let[l,a]of this.registry(t))for(let[c,s]of a){let u=i.filter(p=>c.contains(p.target)?l==="subtree"||p.target===c:!1);if(!!u.length){Array.isArray(n)||(u=u[0]);for(let p of s)f.add([p,u,c])}}for(let[l,a,c]of f)e.call(this,l,a,c)}disconnectables(t,...n){let e={disconnect(){n.forEach(o=>o&&w(o.disconnect)&&o.disconnect()||w(o)&&o()||x(o)&&(o.disconnected=!0))}};return t&&t.addEventListener("abort",()=>e.disconnect()),e}};var T=class extends P{constructor(t,...n){super(t,"attr",...n)}get(t,n=void 0,e={}){let o=typeof t=="string";[t=[],n=void 0,e={}]=this.resolveArgs(arguments);let{context:i}=this,f=ue(i,t),l=o?f[0]:f;if(!n)return l;let a=n&&e.lifecycleSignals&&this.createSignalGenerator(),c=a?.generate()||{};if(n(l,c,i),e.live){a&&(e={...e,signalGenerator:a});let s=this.observe(o?t[0]:t,n,{newValue:!0,...e});return this.disconnectables(e.signal,s)}}observe(t,n,e={}){let o=typeof t=="string";if([t=[],n,e={}]=this.resolveArgs(arguments),["sync","intercept"].includes(e.timing))return this.observeSync(o?t[0]:t,n,e);if(e.timing&&e.timing!=="async")throw new Error(`Timing option "${e.timing}" invalid.`);let{context:i,window:f,wq:l}=this;e.eventDetails&&!l.dom.attrInterceptionHooks?.intercepting&&fe.call(f,"intercept",()=>{});let a=new f.MutationObserver(p=>{p=se(p).map(_=>ce.call(f,_)),ie.call(f,u,p,i)}),c={attributes:!0,attributeOldValue:e.oldValue,subtree:e.subtree};t.length&&(c.attributeFilter=t),a.observe(i,c);let s=e.signalGenerator||e.lifecycleSignals&&this.createSignalGenerator(),u={context:i,filter:t,callback:n,params:e,atomics:new Map,originalFilterIsString:o,signalGenerator:s,disconnectable:a};return this.disconnectables(e.signal,a,s)}observeSync(t,n,e={}){let o=typeof t=="string";[t,n,e={}]=this.resolveArgs(arguments);let{context:i,window:f}=this;if(e.timing&&!["sync","intercept"].includes(e.timing))throw new Error(`Timing option "${e.timing}" invalid.`);let l=e.timing==="intercept"?"intercept":"sync",a=e.subtree?"subtree":"children";this.registry(l).size||fe.call(f,l,m=>{this.forEachMatchingContext(l,m,ie)});let c={disconnect(){_.delete(u),_.size||p.delete(i)}},s=e.signalGenerator||e.lifecycleSignals&&this.createSignalGenerator(),u={context:i,filter:t,callback:n,params:e,atomics:new Map,originalFilterIsString:o,signalGenerator:s,disconnectable:c},p=this.registry(l,a);p.has(i)||p.set(i,new Set);let _=p.get(i);return _.add(u),this.disconnectables(e.signal,c,s)}};function se(r){return r.reduce((t,n,e)=>t[e-1]?.attributeName===n.attributeName?t:t.concat(n),[])}function ie(r,t){let{context:n,filter:e,callback:o,params:i,atomics:f,originalFilterIsString:l,signalGenerator:a}=r;i.atomic&&!f.size&&(t=ue(n,e,t)),i.newValue===null&&i.oldValue===null||(t=t.map(u=>{let p;return!i.oldValue&&"oldValue"in u&&({oldValue:p,...u}=u),!i.newValue&&"value"in u?{value:p,...u}=u:i.newValue&&typeof u.value>"u"&&(u={...u,value:u.target.getAttribute(u.name)}),u})),i.atomic&&(t.forEach(u=>f.set(u.name,u)),t=Array.from(f.entries()).map(([,u])=>u));let c=l?t[0]:t,s=a?.generate()||{};o(c,s,n)}function ue(r,t,n=[]){let e={event:null,type:"attribute"};return t.length?t.map(i=>n.find(f=>f.name===i)||{target:r,name:i,value:r.getAttribute(i),...e}):Array.from(r.attributes).map(i=>n.find(f=>f.name===i.nodeName)||{target:r,name:i.nodeName,value:i.nodeValue,...e})}function ce({target:r,attributeName:t,value:n,oldValue:e}){let f=(this.wq.dom.attrInterceptionRecords?.get(r)||{})[t]||"mutation";return{target:r,name:t,value:n,oldValue:e,type:"observation",event:f}}function fe(r,t){let n=this,{wq:e,document:o,Element:i}=n;e.dom.attrInterceptionHooks||(e.dom.attrInterceptionHooks=new Map),e.dom.attrInterceptionHooks.has(r)||e.dom.attrInterceptionHooks.set(r,new Set),e.dom.attrInterceptionHooks.get(r).add(t);let f=()=>e.dom.attrInterceptionHooks.get(r).delete(t);if(e.dom.attrInterceptionHooks?.intercepting)return f;console.warn("Attr mutation APIs are now being intercepted."),e.dom.attrInterceptionHooks.intercepting=!0,e.dom.attrInterceptionRecords=new Map;let l=(s,u)=>{e.dom.attrInterceptionRecords.has(s.target)||e.dom.attrInterceptionRecords.set(s.target,{});let p=e.dom.attrInterceptionRecords.get(s.target);clearTimeout(p[s.name]?.timeout),p[s.name]=s.event;let _=setTimeout(()=>{delete p[s.name]},0);Object.defineProperty(s.event,"timeout",{value:_,configurable:!0}),e.dom.attrInterceptionHooks.get("intercept")?.forEach(h=>h([s]));let m=u();return e.dom.attrInterceptionHooks.get("sync")?.forEach(h=>h([s])),m};new n.MutationObserver(s=>{s=se(s).map(u=>ce.call(n,u)).filter((u,p)=>!Array.isArray(u.event)),s.length&&(e.dom.attrInterceptionHooks.get("intercept")?.forEach(u=>u(s)),e.dom.attrInterceptionHooks.get("sync")?.forEach(u=>u(s)))}).observe(o,{attributes:!0,subtree:!0,attributeOldValue:!0});let c=Object.create(null);return["setAttribute","removeAttribute","toggleAttribute"].forEach(s=>{c[s]=i.prototype[s],i.prototype[s]=function(...u){let p,_=this.getAttribute(u[0]);["setAttribute","toggleAttribute"].includes(s)&&(p=u[1]),s==="toggleAttribute"&&p===void 0&&(p=_===null);let m={target:this,name:u[0],value:p,oldValue:_,type:"interception",event:[this,s]};return l(m,()=>c[s].call(this,...u))}}),f}var F=class extends P{constructor(t,...n){super(t,"tree",...n)}attr(t,n=void 0,e={}){let{context:o,window:i}=this;return new T(o,i).get(...arguments)}query(t,n=void 0,e={}){[t,n=void 0,e={}]=this.resolveArgs(arguments);let{context:o}=this,i=new Map,f=c=>(i.has(c)||i.set(c,{target:c,entrants:[],exits:[],type:"query",event:null}),i.get(c));if((!e.generation||e.generation==="entrants")&&(t.length?t.every(c=>typeof c=="string")&&(t=t.join(","))&&(e.subtree?o.querySelectorAll(t):[...o.children].filter(s=>s.matches(t))).forEach(s=>f(s.parentNode||o).entrants.push(s)):[...o.children].forEach(c=>f(o).entrants.push(c))),!n)return i;let l={disconnected:!1},a=n&&e.lifecycleSignals&&this.createSignalGenerator();for(let[,c]of i){if(l.disconnected)break;let s=a?.generate()||{};n(c,s,o)}if(e.live){a&&(e={...e,signalGenerator:a});let c=this.observe(t,n,e);return this.disconnectables(e.signal,l,c)}return this.disconnectables(e.signal,l,a)}children(t,n=void 0,e={}){return[t,n=void 0,e={}]=this.resolveArgs(arguments),this.query(t,n,{...e,subtree:!1})}subtree(t,n=void 0,e={}){return[t,n=void 0,e={}]=this.resolveArgs(arguments),this.query(t,n,{...e,subtree:!0})}observe(t,n,e={}){if([t,n,e={}]=this.resolveArgs(arguments),["sync","intercept"].includes(e.timing))return this.observeSync(t,n,e);if(e.timing&&e.timing!=="async")throw new Error(`Timing option "${e.timing}" invalid.`);let{context:o,window:i,wq:f,document:l}=this;e.eventDetails&&(f.dom.domInterceptionRecordsAlwaysOn=!0),(l.readyState==="loading"||f.dom.domInterceptionRecordsAlwaysOn)&&!f.dom.domInterceptionHooks?.intercepting&&ae.call(i,"sync",()=>{});let a=new i.MutationObserver(u=>u.forEach(p=>{me.call(i,s,de.call(i,p),o)}));a.observe(o,{childList:!0,subtree:e.subtree});let c=e.signalGenerator||e.lifecycleSignals&&this.createSignalGenerator(),s={context:o,selectors:t,callback:n,params:e,signalGenerator:c,disconnectable:a};if(e.staticSensitivity){let u=le.call(i,s);return this.disconnectables(e.signal,a,c,u)}return this.disconnectables(e.signal,a,c)}observeSync(t,n,e={}){[t,n,e={}]=this.resolveArgs(arguments);let{context:o,window:i}=this;if(e.timing&&!["sync","intercept"].includes(e.timing))throw new Error(`Timing option "${e.timing}" invalid.`);let f=e.timing==="intercept"?"intercept":"sync",l=e.subtree?"subtree":"children";this.registry(f).size||ae.call(i,f,_=>{this.forEachMatchingContext(f,_,me)});let a={disconnect(){p.delete(s),p.size||u.delete(o)}},c=e.signalGenerator||e.lifecycleSignals&&this.createSignalGenerator(),s={context:o,selectors:t,callback:n,params:e,signalGenerator:c,disconnectable:a},u=this.registry(f,l);u.has(o)||u.set(o,new Set);let p=u.get(o);if(p.add(s),e.staticSensitivity){let _=le.call(i,s);return this.disconnectables(e.signal,a,c,_)}return this.disconnectables(e.signal,a,c)}};function le(r){let t=this,{context:n,selectors:e,callback:o,params:i,signalGenerator:f}=r,l=s=>[...s.matchAll(/\[([^\=\]]+)(\=[^\]]+)?\]/g)].map(u=>u[1]);if(!(r.$attrs=e.filter(s=>typeof s=="string"&&s.includes("[")).reduce((s,u)=>s.concat(l(u)),[])).length)return;let a=new Set,c=new Set;return a.push=s=>(c.delete(s),a.add(s)),c.push=s=>(a.delete(s),c.add(s)),r.$deliveryCache={entrants:a,exits:c},new T(n,t).observe(r.$attrs,s=>{let u=new Map,p=h=>(u.has(h)||u.set(h,{target:h,entrants:[],exits:[],type:"static",event:null}),u.get(h)),_=new WeakMap,m=h=>(_.has(h)||_.set(h,e.some(d=>h.matches(d))),_.get(h));for(let h of s)["entrants","exits"].forEach(d=>{i.generation&&d!==i.generation||r.$deliveryCache[d].has(h.target)||(d==="entrants"?!m(h.target):m(h.target))||(r.$deliveryCache[d].push(h.target),p(h.target)[d].push(h.target),p(h.target).event=h.event)});for(let[,h]of u){let d=f?.generate()||{};o(h,d,n)}},{subtree:i.subtree,timing:i.timing,eventDetails:i.eventDetails})}function me(r,t){let{context:n,selectors:e,callback:o,params:i,signalGenerator:f,$deliveryCache:l}=r,a={...t,entrants:[],exits:[]};if(["entrants","exits"].forEach(s=>{if(!(i.generation&&s!==i.generation)&&(e.length?a[s]=Me(e,t[s],t.event!=="parse"):a[s]=[...t[s]],!!l))for(let u of a[s])l[s].push(u)}),!a.entrants.length&&!a.exits.length)return;let c=f?.generate()||{};o(a,c,n)}function Me(r,t,n){t=Array.isArray(t)?t:[...t];let e=(o,i)=>{if(o=o.filter(f=>f.matches),typeof i=="string"){let f=o.filter(l=>l.matches(i));if(n&&(f=o.reduce((l,a)=>[...l,...a.querySelectorAll(i)],f)),f.length)return f}else if(o.includes(i)||n&&o.some(f=>f.contains(i)))return[i]};return t.$$searchCache||(t.$$searchCache=new Map),r.reduce((o,i)=>{let f;return t.$$searchCache.has(i)?f=t.$$searchCache.get(i):(f=e(t,i)||[],x(i)&&t.$$searchCache.set(i,f)),o.concat(f)},[])}function de({target:r,addedNodes:t,removedNodes:n}){let e=this,o;return o=O(t).reduce((i,f)=>i||e.wq.dom.domInterceptionRecords?.get(f),null),o=O(n).reduce((i,f)=>i||e.wq.dom.domInterceptionRecords?.get(f),o),o=o||e.document.readyState==="loading"&&"parse"||"mutation",{target:r,entrants:t,exits:n,type:"observation",event:o}}function ae(r,t){let n=this,{wq:e,document:o,Node:i,Element:f,HTMLElement:l,HTMLTemplateElement:a,DocumentFragment:c}=n;e.dom.domInterceptionHooks||(e.dom.domInterceptionHooks=new Map),e.dom.domInterceptionHooks.has(r)||e.dom.domInterceptionHooks.set(r,new Set),e.dom.domInterceptionHooks.get(r).add(t);let s=()=>e.dom.domInterceptionHooks.get(r).delete(t);if(e.dom.domInterceptionHooks?.intercepting)return s;console.warn("DOM mutation APIs are now being intercepted."),e.dom.domInterceptionHooks.intercepting=!0,e.dom.domInterceptionRecords=new Map;let u=()=>!0,p=(m,h)=>{u()?m.entrants.concat(m.exits).forEach(y=>{clearTimeout(e.dom.domInterceptionRecords.get(y)?.timeout),e.dom.domInterceptionRecords.set(y,m.event);let b=setTimeout(()=>{e.dom.domInterceptionRecords.delete(y)},0);Object.defineProperty(m.event,"timeout",{value:b,configurable:!0})}):e.dom.domInterceptionRecords.clear(),e.dom.domInterceptionHooks.get("intercept")?.forEach(y=>y(m));let d=h();return e.dom.domInterceptionHooks.get("sync")?.forEach(y=>y(m)),d};if(u()){let m=new n.MutationObserver(h=>h.forEach(d=>{Array.isArray((d=de.call(n,d)).event)||(e.dom.domInterceptionHooks.get("intercept")?.forEach(y=>y(d)),e.dom.domInterceptionHooks.get("sync")?.forEach(y=>y(d)))}));m.observe(o,{childList:!0,subtree:!0}),o.addEventListener("readystatechange",()=>!u()&&m.disconnect())}let _=Object.create(null);return["insertBefore","insertAdjacentElement","insertAdjacentHTML","setHTML","replaceChildren","replaceWith","remove","replaceChild","removeChild","before","after","append","prepend","appendChild"].forEach(m=>{let h=["insertBefore","replaceChild","removeChild","appendChild"].includes(m)?i:f;_[m]=h.prototype[m],_[m]&&(h.prototype[m]=function(...d){let y=()=>_[m].call(this,...d);if(!(this instanceof f||this instanceof c))return y();let b=[],A=[],M=this;["insertBefore"].includes(m)?A=[d[0]]:["insertAdjacentElement","insertAdjacentHTML"].includes(m)?(A=[d[1]],["beforebegin","afterend"].includes(d[0])&&(M=this.parentNode)):["setHTML","replaceChildren"].includes(m)?(b=[...this.childNodes],A=m==="replaceChildren"?[...d]:[d[0]]):["replaceWith","remove"].includes(m)?(b=[this],A=m==="replaceWith"?[...d]:[],M=this.parentNode):["replaceChild"].includes(m)?(b=[d[1]],A=[d[0]]):["removeChild"].includes(m)?b=[...d]:(A=[...d],["before","after"].includes(m)&&(M=this.parentNode));let D=m;if(["insertAdjacentHTML","setHTML"].includes(m)){let I=this.nodeName;if(m==="insertAdjacentHTML"&&["beforebegin","afterend"].includes(d[0])){if(!this.parentNode)return _[m].call(this,...d);I=this.parentNode.nodeName}let G=o.createElement(I);_.setHTML.call(G,A[0],m==="setHTML"?d[1]:{}),A=[...G.childNodes],m==="insertAdjacentHTML"?(D="insertAdjacentElement",d[1]=new c,d[1].______isTemp=!0,d[1].append(...G.childNodes)):(D="replaceChildren",d=[...G.childNodes])}return p({target:M,entrants:A,exits:b,type:"interception",event:[this,m]},()=>_[D].call(this,...d))})}),["outerHTML","outerText","innerHTML","innerText","textContent","nodeValue"].forEach(m=>{let h=["textContent","nodeValue"].includes(m)?i:["outerText","innerText"].includes(m)?l:f;_[m]=Object.getOwnPropertyDescriptor(h.prototype,m),Object.defineProperty(h.prototype,m,{..._[m],set:function(d){let y=()=>_[m].set.call(this,d);if(!(this instanceof f))return y();let b=[],A=[],M=this;if(["outerHTML","outerText"].includes(m)?(b=[this],M=this.parentNode):b=[...this.childNodes],["outerHTML","innerHTML"].includes(m)){let $=this.nodeName;if(m==="outerHTML"){if(!this.parentNode)return y();$=this.parentNode.nodeName}let I=o.createElement($==="TEMPLATE"?"div":$);_[m].set.call(I,d),A=this instanceof a?[]:[...I.childNodes],m==="outerHTML"?(d=new c,d.______isTemp=!0,d.append(...I.childNodes),y=()=>_.replaceWith.call(this,d)):this instanceof a?y=()=>this.content.replaceChildren(...I.childNodes):y=()=>_.replaceChildren.call(this,...I.childNodes)}return p({target:M,entrants:A,exits:b,type:"interception",event:[this,m]},y)}})}),["append","prepend","replaceChildren"].forEach(m=>{[o,c.prototype].forEach(h=>{let d=h[m];h[m]=function(...y){if(this.______isTemp)return d.call(this,...y);let b=m==="replaceChildren"?[...this.childNodes]:[];return p({target:this,entrants:y,exits:b,type:"interception",event:[this,m]},()=>d.call(this,...y))}})}),s}function pe(){He.call(this),Pe.call(this),qe.call(this)}function He(){let r=this;r.CSS||(r.CSS={}),r.CSS.escape||(r.CSS.escape=t=>t.replace(/([\:@\~\$\&])/g,"\\$1"))}function Pe(){let r=this;"isConnected"in r.Node.prototype||Object.defineProperty(r.Node.prototype,"isConnected",{get:function(){return!this.ownerDocument||!(this.ownerDocument.compareDocumentPosition(this)&this.DOCUMENT_POSITION_DISCONNECTED)}})}function qe(){let r=this;r.Element.prototype.matches||(r.Element.prototype.matches=r.Element.prototype.matchesSelector||r.Element.prototype.mozMatchesSelector||r.Element.prototype.msMatchesSelector||r.Element.prototype.oMatchesSelector||r.Element.prototype.webkitMatchesSelector||function(t){for(var n=(this.document||this.ownerDocument).querySelectorAll(t),e=n.length;--e>=0&&n.item(e)!==this;);return e>-1})}function he(){let r=this;if(r.wq||(r.wq={}),r.wq.dom)return r.wq.dom;r.wq.dom={},pe.call(r);let t=re(r);return r.wq.dom.Reflow=new t,r.wq.dom.DOMRealtime=F,r.wq.dom.AttrRealtime=T,r.wq.dom.realtime=(n,e="tree")=>{if(e==="tree")return new F(n,r);if(e==="attr")return new T(n,r)},r.wq.dom.ready=Fe.bind(r),r.wq.dom.meta=Le.bind(r),r.wq.dom}function Fe(r){let t=this;t.document.readyState==="complete"?r(t):(t.document.domReadyCallbacks||(t.document.domReadyCallbacks=[],t.document.addEventListener("DOMContentLoaded",()=>{t.document.domReadyCallbacks.splice(0).forEach(n=>n(t))},!1)),t.document.domReadyCallbacks.push(r))}function Le(r,t=!1){let n=this,e={content:{}};return!(e.el=n.document.querySelector(`meta[name="${r}"]`))&&t&&(e.el=n.document.createElement("meta"),e.el.setAttribute("name",r),n.document.head.append(e.el)),e.el&&(e.content=(e.el.getAttribute("content")||"").split(";").filter(o=>o).reduce((o,i)=>{let f=i.split("=").map(l=>l.trim());return X(o,f[0].split("."),f[1]==="true"?!0:f[1]==="false"?!1:C(f[1])?parseInt(f[1]):f[1]),o},{})),e.get=function(o){return JSON.parse(JSON.stringify(H(this.content,o.split("."))))},e.copy=function(){return JSON.parse(JSON.stringify(this.content))},e.copyWithDefaults=function(...o){return o.length?R(!0,{},...o.reverse().concat(this.content)):this.copy()},e}he.call(window);})();
//# sourceMappingURL=main.js.map
