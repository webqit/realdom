(()=>{function x(r){return!Array.isArray(r)&&typeof r=="object"&&r}function G(r,...t){globalThis.WebQitInternalsRegistry||(globalThis.WebQitInternalsRegistry=new Map);var n=globalThis.WebQitInternalsRegistry.get(r);if(!n){if(n=new Map,t[0]===!1)return n;globalThis.WebQitInternalsRegistry.set(r,n)}for(var e,i;e=t.shift();)if((i=n)&&!(n=n.get(e))){if(n=new Map,t[0]===!1)return n;i.set(e,n)}return n}function _(r){return Array.isArray(r)}function H(r){return typeof r=="function"}function F(r){return r===null||r===""}function E(r){return arguments.length&&(r===void 0||typeof r>"u")}function O(r){return Array.isArray(r)||typeof r=="object"&&r||H(r)}function B(r){return F(r)||E(r)||r===!1||r===0||O(r)&&!Object.keys(r).length}function w(r){return H(r)||r&&{}.toString.call(r)==="[object function]"}function L(r){return r instanceof Number||typeof r=="number"}function C(r){return L(r)||r!==!0&&r!==!1&&r!==null&&r!==""&&!isNaN(r*1)}function V(r){return r instanceof String||typeof r=="string"&&r!==null}function W(r){return!V(r)&&!E(r.length)}function v(r,t=!0){return _(r)?r:!t&&x(r)?[r]:r!==!1&&r!==0&&B(r)?[]:W(r)?Array.prototype.slice.call(r):x(r)?Object.values(r):[r]}function R(r,t,n={},e={}){t=v(t).slice();for(var i=r;!E(i)&&!F(i)&&t.length;){var o=t.shift();if(!(n.get?n.get(i,o):O(i)?o in i:i[o])){e.exists=!1;return}i=n.get?n.get(i,o):i[o]}return e.exists=!0,i}function j(r,t,n,e={},i={}){let o=(f,u,p)=>i.set?i.set(f,u,p):(C(t[a])&&_(f)?f.push(p):f[u]=p,!0);t=v(t);for(var s=r,a=0;a<t.length;a++)if(a<t.length-1){if(!s||!O(s)&&!w(s))return!1;var m=R(s,t[a],i);if(!O(m)){if(i.buildTree===!1)return!1;m=w(i.buildTree)?i.buildTree(a):C(t[a+1])?[]:{};var l=o(s,t[a],m);if(!l)return!1}s=m}else return o(s,t[a],n)}var ee=r=>class{constructor(n=!0){Object.defineProperty(this,"window",{value:r}),Object.defineProperty(this,"readCallbacks",{value:new Set}),Object.defineProperty(this,"writeCallbacks",{value:new Set}),this.async=n,this.window.requestAnimationFrame?this._run():this.async=!1}_run(){this.window.requestAnimationFrame(()=>{this.readCallbacks.forEach(n=>{n()||this.readCallbacks.delete(n)}),this.writeCallbacks.forEach(n=>{n()||this.writeCallbacks.delete(n)}),this._run()})}onread(n,e=!1){if(e)return new Promise((i,o)=>{this.async===!1?n(i,o):this.readCallbacks.add(()=>{n(i,o)})});this.async===!1?n():this.readCallbacks.add(n)}onwrite(n,e=!1){if(e)return new Promise((i,o)=>{this.async===!1?n(i,o):this.writeCallbacks.add(()=>{n(i,o)})});this.async===!1?n():this.writeCallbacks.add(n)}cycle(n,e,i){this.onread(()=>{let o=n(i),s=a=>{a!==void 0&&this.onwrite(()=>{let m=e(a,i),l=f=>{f!==void 0&&this.cycle(n,e,f)};m instanceof Promise?m.then(l):l(m)})};o instanceof Promise?o.then(s):s(o)})}};var M=class{constructor(t,n,e){this.context=t,this.namespace=n,this.window=t.defaultView||t.ownerDocument?.defaultView||e,this.document=this.window.document,this.webqit=this.window.webqit,Object.defineProperty(this,"#",{value:{}})}resolveArgs(t){return w(t[0])?t=[[],...t]:x(t[0])&&t.length===1?t=[[],void 0,t[0]]:x(t[1])&&t.length===2?t=[v(t[0],!1),void 0,t[1]]:t[0]=v(t[0],!1),t}registry(...t){return G(this.window,"dom.realtime",this.namespace,...t)}createSignalGenerator(){return{generate(){return this.lastController?.abort(),this.lastController=new AbortController,{signal:this.lastController.signal}},disconnect(){this.lastController?.abort()}}}forEachMatchingContext(t,n,e){let{window:i}=this,o=Array.isArray(n)?n:[n],s=new Set;for(let[a,m]of this.registry(t))for(let[l,f]of m){let u=o.filter(p=>l.contains(p.target)?a==="subtree"||p.target===l:!1);if(!!u.length){Array.isArray(n)||(u=u[0]);for(let p of f)s.add([p,u,l])}}for(let[a,m,l]of s)e.call(this,a,m,l)}disconnectables(t,...n){let e={disconnect(){n.forEach(i=>i&&w(i.disconnect)&&i.disconnect()||w(i)&&i()||x(i)&&(i.disconnected=!0))}};return t&&t.addEventListener("abort",()=>e.disconnect()),e}};var S=class extends M{constructor(t,...n){super(t,"attr",...n)}get(t,n=void 0,e={}){let i=typeof t=="string";[t=[],n=void 0,e={}]=this.resolveArgs(arguments);let{context:o}=this,s=fe(o,t),a=i?s[0]:s;if(!n)return a;let m=n&&e.lifecycleSignals&&this.createSignalGenerator(),l=m?.generate()||{};if(n(a,l,o),e.live){m&&(e={...e,signalGenerator:m});let f=this.observe(i?t[0]:t,n,{newValue:!0,...e});return this.disconnectables(e.signal,f)}}observe(t,n,e={}){let i=typeof t=="string";if([t=[],n,e={}]=this.resolveArgs(arguments),["sync","intercept"].includes(e.timing))return this.observeSync(i?t[0]:t,n,e);if(e.timing&&e.timing!=="async")throw new Error(`Timing option "${e.timing}" invalid.`);let{context:o,window:s,webqit:a}=this;e.eventDetails&&!a.dom.attrInterceptionHooks?.intercepting&&ie.call(s,"intercept",()=>{});let m=new s.MutationObserver(p=>{p=oe(p).map(g=>se.call(s,g)),ne.call(s,u,p,o)}),l={attributes:!0,attributeOldValue:e.oldValue,subtree:e.subtree};t.length&&(l.attributeFilter=t),m.observe(o,l);let f=e.signalGenerator||e.lifecycleSignals&&this.createSignalGenerator(),u={context:o,filter:t,callback:n,params:e,atomics:new Map,originalFilterIsString:i,signalGenerator:f,disconnectable:m};return this.disconnectables(e.signal,m,f)}observeSync(t,n,e={}){let i=typeof t=="string";[t,n,e={}]=this.resolveArgs(arguments);let{context:o,window:s}=this;if(e.timing&&!["sync","intercept"].includes(e.timing))throw new Error(`Timing option "${e.timing}" invalid.`);let a=e.timing==="intercept"?"intercept":"sync",m=e.subtree?"subtree":"children";this.registry(a).size||ie.call(s,a,c=>{this.forEachMatchingContext(a,c,ne)});let l={disconnect(){g.delete(u),g.size||p.delete(o)}},f=e.signalGenerator||e.lifecycleSignals&&this.createSignalGenerator(),u={context:o,filter:t,callback:n,params:e,atomics:new Map,originalFilterIsString:i,signalGenerator:f,disconnectable:l},p=this.registry(a,m);p.has(o)||p.set(o,new Set);let g=p.get(o);return g.add(u),this.disconnectables(e.signal,l,f)}};function oe(r){return r.reduce((t,n,e)=>t[e-1]?.attributeName===n.attributeName?t:t.concat(n),[])}function ne(r,t){let{context:n,filter:e,callback:i,params:o,atomics:s,originalFilterIsString:a,signalGenerator:m}=r;o.atomic&&!s.size&&(t=fe(n,e,t)),o.newValue===null&&o.oldValue===null||(t=t.map(u=>{let p;return!o.oldValue&&"oldValue"in u&&({oldValue:p,...u}=u),!o.newValue&&"value"in u?{value:p,...u}=u:o.newValue&&typeof u.value>"u"&&(u={...u,value:u.target.getAttribute(u.name)}),u})),o.atomic&&(t.forEach(u=>s.set(u.name,u)),t=Array.from(s.entries()).map(([,u])=>u));let l=a?t[0]:t,f=m?.generate()||{};i(l,f,n)}function fe(r,t,n=[]){let e={event:null,type:"attribute"};return t.length?t.map(o=>n.find(s=>s.name===o)||{target:r,name:o,value:r.getAttribute(o),...e}):Array.from(r.attributes).map(o=>n.find(s=>s.name===o.nodeName)||{target:r,name:o.nodeName,value:o.nodeValue,...e})}function se({target:r,attributeName:t,value:n,oldValue:e}){let s=(this.webqit.dom.attrInterceptionRecords?.get(r)||{})[t]||"mutation";return{target:r,name:t,value:n,oldValue:e,type:"observation",event:s}}function ie(r,t){let n=this,{webqit:e,document:i,Element:o}=n;e.dom.attrInterceptionHooks||(e.dom.attrInterceptionHooks=new Map),e.dom.attrInterceptionHooks.has(r)||e.dom.attrInterceptionHooks.set(r,new Set),e.dom.attrInterceptionHooks.get(r).add(t);let s=()=>e.dom.attrInterceptionHooks.get(r).delete(t);if(e.dom.attrInterceptionHooks?.intercepting)return s;console.warn("Attr mutation APIs are now being intercepted."),e.dom.attrInterceptionHooks.intercepting=!0,e.dom.attrInterceptionRecords=new Map;let a=(f,u)=>{e.dom.attrInterceptionRecords.has(f.target)||e.dom.attrInterceptionRecords.set(f.target,{});let p=e.dom.attrInterceptionRecords.get(f.target);clearTimeout(p[f.name]?.timeout),p[f.name]=f.event;let g=setTimeout(()=>{delete p[f.name]},0);Object.defineProperty(f.event,"timeout",{value:g,configurable:!0}),e.dom.attrInterceptionHooks.get("intercept")?.forEach(h=>h([f]));let c=u();return e.dom.attrInterceptionHooks.get("sync")?.forEach(h=>h([f])),c};new n.MutationObserver(f=>{f=oe(f).map(u=>se.call(n,u)).filter((u,p)=>!Array.isArray(u.event)),f.length&&(e.dom.attrInterceptionHooks.get("intercept")?.forEach(u=>u(f)),e.dom.attrInterceptionHooks.get("sync")?.forEach(u=>u(f)))}).observe(i,{attributes:!0,subtree:!0,attributeOldValue:!0});let l=Object.create(null);return["setAttribute","removeAttribute","toggleAttribute"].forEach(f=>{l[f]=o.prototype[f],o.prototype[f]=function(...u){let p,g=this.getAttribute(u[0]);["setAttribute","toggleAttribute"].includes(f)&&(p=u[1]),f==="toggleAttribute"&&p===void 0&&(p=g===null);let c={target:this,name:u[0],value:p,oldValue:g,type:"interception",event:[this,f]};return a(c,()=>l[f].call(this,...u))}}),s}var q=class extends M{constructor(t,...n){super(t,"tree",...n)}attr(t,n=void 0,e={}){let{context:i,window:o}=this;return new S(i,o).get(...arguments)}query(t,n=void 0,e={}){[t,n=void 0,e={}]=this.resolveArgs(arguments);let{context:i}=this,o=new Map,s=l=>(o.has(l)||o.set(l,{target:l,entrants:[],exits:[],type:"query",event:null}),o.get(l));if((!e.generation||e.generation==="entrants")&&(t.length?t.every(l=>typeof l=="string")&&(t=t.join(","))&&(e.subtree?i.querySelectorAll(t):[...i.children].filter(f=>f.matches(t))).forEach(f=>s(f.parentNode||i).entrants.push(f)):[...i.children].forEach(l=>s(i).entrants.push(l))),!n)return o;let a={disconnected:!1},m=n&&e.lifecycleSignals&&this.createSignalGenerator();for(let[,l]of o){if(a.disconnected)break;let f=m?.generate()||{};n(l,f,i)}if(e.live){m&&(e={...e,signalGenerator:m});let l=this.observe(t,n,e);return this.disconnectables(e.signal,a,l)}return this.disconnectables(e.signal,a,m)}children(t,n=void 0,e={}){return[t,n=void 0,e={}]=this.resolveArgs(arguments),this.query(t,n,{...e,subtree:!1})}subtree(t,n=void 0,e={}){return[t,n=void 0,e={}]=this.resolveArgs(arguments),this.query(t,n,{...e,subtree:!0})}observe(t,n,e={}){if([t,n,e={}]=this.resolveArgs(arguments),["sync","intercept"].includes(e.timing))return this.observeSync(t,n,e);if(e.timing&&e.timing!=="async")throw new Error(`Timing option "${e.timing}" invalid.`);let{context:i,window:o,webqit:s,document:a}=this;e.eventDetails&&(s.dom.domInterceptionRecordsAlwaysOn=!0),(a.readyState==="loading"||s.dom.domInterceptionRecordsAlwaysOn)&&!s.dom.domInterceptionHooks?.intercepting&&le.call(o,"sync",()=>{});let m=new o.MutationObserver(u=>u.forEach(p=>{ce.call(o,f,me.call(o,p),i)}));m.observe(i,{childList:!0,subtree:e.subtree});let l=e.signalGenerator||e.lifecycleSignals&&this.createSignalGenerator(),f={context:i,selectors:t,callback:n,params:e,signalGenerator:l,disconnectable:m};if(e.staticSensitivity){let u=ue.call(o,f);return this.disconnectables(e.signal,m,l,u)}return this.disconnectables(e.signal,m,l)}observeSync(t,n,e={}){[t,n,e={}]=this.resolveArgs(arguments);let{context:i,window:o}=this;if(e.timing&&!["sync","intercept"].includes(e.timing))throw new Error(`Timing option "${e.timing}" invalid.`);let s=e.timing==="intercept"?"intercept":"sync",a=e.subtree?"subtree":"children";this.registry(s).size||le.call(o,s,g=>{this.forEachMatchingContext(s,g,ce)});let m={disconnect(){p.delete(f),p.size||u.delete(i)}},l=e.signalGenerator||e.lifecycleSignals&&this.createSignalGenerator(),f={context:i,selectors:t,callback:n,params:e,signalGenerator:l,disconnectable:m},u=this.registry(s,a);u.has(i)||u.set(i,new Set);let p=u.get(i);if(p.add(f),e.staticSensitivity){let g=ue.call(o,f);return this.disconnectables(e.signal,m,l,g)}return this.disconnectables(e.signal,m,l)}};function ue(r){let t=this,{context:n,selectors:e,callback:i,params:o,signalGenerator:s}=r,a=f=>[...f.matchAll(/\[([^\=\]]+)(\=[^\]]+)?\]/g)].map(u=>u[1]);if(!(r.$attrs=e.filter(f=>typeof f=="string"&&f.includes("[")).reduce((f,u)=>f.concat(a(u)),[])).length)return;let m=new Set,l=new Set;return m.push=f=>(l.delete(f),m.add(f)),l.push=f=>(m.delete(f),l.add(f)),r.$deliveryCache={entrants:m,exits:l},new S(n,t).observe(r.$attrs,f=>{let u=new Map,p=h=>(u.has(h)||u.set(h,{target:h,entrants:[],exits:[],type:"static",event:null}),u.get(h)),g=new WeakMap,c=h=>(g.has(h)||g.set(h,e.some(d=>h.matches(d))),g.get(h));for(let h of f)["entrants","exits"].forEach(d=>{o.generation&&d!==o.generation||r.$deliveryCache[d].has(h.target)||(d==="entrants"?!c(h.target):c(h.target))||(r.$deliveryCache[d].push(h.target),p(h.target)[d].push(h.target),p(h.target).event=h.event)});for(let[,h]of u){let d=s?.generate()||{};i(h,d,n)}},{subtree:o.subtree,timing:o.timing,eventDetails:o.eventDetails})}function ce(r,t){let{context:n,selectors:e,callback:i,params:o,signalGenerator:s,$deliveryCache:a}=r,m={...t,entrants:[],exits:[]};if(["entrants","exits"].forEach(f=>{if(!(o.generation&&f!==o.generation)&&(e.length?m[f]=Me(e,t[f],t.event!=="parse"):m[f]=[...t[f]],!!a))for(let u of m[f])a[f].push(u)}),!m.entrants.length&&!m.exits.length)return;let l=s?.generate()||{};i(m,l,n)}function Me(r,t,n){t=Array.isArray(t)?t:[...t];let e=(i,o)=>{if(i=i.filter(s=>s.matches),typeof o=="string"){let s=i.filter(a=>a.matches(o));if(n&&(s=i.reduce((a,m)=>[...a,...m.querySelectorAll(o)],s)),s.length)return s}else if(i.includes(o)||n&&i.some(s=>s.contains(o)))return[o]};return t.$$searchCache||(t.$$searchCache=new Map),r.reduce((i,o)=>{let s;return t.$$searchCache.has(o)?s=t.$$searchCache.get(o):(s=e(t,o)||[],x(o)&&t.$$searchCache.set(o,s)),i.concat(s)},[])}function me({target:r,addedNodes:t,removedNodes:n}){let e=this,i;return i=v(t).reduce((o,s)=>o||e.webqit.dom.domInterceptionRecords?.get(s),null),i=v(n).reduce((o,s)=>o||e.webqit.dom.domInterceptionRecords?.get(s),i),i=i||e.document.readyState==="loading"&&"parse"||"mutation",{target:r,entrants:t,exits:n,type:"observation",event:i}}function le(r,t){let n=this,{webqit:e,document:i,Node:o,Element:s,HTMLElement:a,HTMLTemplateElement:m,DocumentFragment:l}=n;e.dom.domInterceptionHooks||(e.dom.domInterceptionHooks=new Map),e.dom.domInterceptionHooks.has(r)||e.dom.domInterceptionHooks.set(r,new Set),e.dom.domInterceptionHooks.get(r).add(t);let f=()=>e.dom.domInterceptionHooks.get(r).delete(t);if(e.dom.domInterceptionHooks?.intercepting)return f;console.warn("DOM mutation APIs are now being intercepted."),e.dom.domInterceptionHooks.intercepting=!0,e.dom.domInterceptionRecords=new Map;let u=()=>!0,p=(c,h)=>{u()?c.entrants.concat(c.exits).forEach(y=>{clearTimeout(e.dom.domInterceptionRecords.get(y)?.timeout),e.dom.domInterceptionRecords.set(y,c.event);let b=setTimeout(()=>{e.dom.domInterceptionRecords.delete(y)},0);Object.defineProperty(c.event,"timeout",{value:b,configurable:!0})}):e.dom.domInterceptionRecords.clear(),e.dom.domInterceptionHooks.get("intercept")?.forEach(y=>y(c));let d=h();return e.dom.domInterceptionHooks.get("sync")?.forEach(y=>y(c)),d};if(u()){let c=new n.MutationObserver(h=>h.forEach(d=>{Array.isArray((d=me.call(n,d)).event)||(e.dom.domInterceptionHooks.get("intercept")?.forEach(y=>y(d)),e.dom.domInterceptionHooks.get("sync")?.forEach(y=>y(d)))}));c.observe(i,{childList:!0,subtree:!0}),i.addEventListener("readystatechange",()=>!u()&&c.disconnect())}let g=Object.create(null);return["insertBefore","insertAdjacentElement","insertAdjacentHTML","setHTML","replaceChildren","replaceWith","remove","replaceChild","removeChild","before","after","append","prepend","appendChild"].forEach(c=>{let h=["insertBefore","replaceChild","removeChild","appendChild"].includes(c)?o:s;g[c]=h.prototype[c],g[c]&&(h.prototype[c]=function(...d){let y=()=>g[c].call(this,...d);if(!(this instanceof s||this instanceof l))return y();let b=[],A=[],I=this;["insertBefore"].includes(c)?A=[d[0]]:["insertAdjacentElement","insertAdjacentHTML"].includes(c)?(A=[d[1]],["beforebegin","afterend"].includes(d[0])&&(I=this.parentNode)):["setHTML","replaceChildren"].includes(c)?(b=[...this.childNodes],A=c==="replaceChildren"?[...d]:[d[0]]):["replaceWith","remove"].includes(c)?(b=[this],A=c==="replaceWith"?[...d]:[],I=this.parentNode):["replaceChild"].includes(c)?(b=[d[1]],A=[d[0]]):["removeChild"].includes(c)?b=[...d]:(A=[...d],["before","after"].includes(c)&&(I=this.parentNode));let N=c;if(["insertAdjacentHTML","setHTML"].includes(c)){let T=this.nodeName;if(c==="insertAdjacentHTML"&&["beforebegin","afterend"].includes(d[0])){if(!this.parentNode)return g[c].call(this,...d);T=this.parentNode.nodeName}let $=i.createElement(T);g.setHTML.call($,A[0],c==="setHTML"?d[1]:{}),A=[...$.childNodes],c==="insertAdjacentHTML"?(N="insertAdjacentElement",d[1]=new l,d[1].______isTemp=!0,d[1].append(...$.childNodes)):(N="replaceChildren",d=[...$.childNodes])}return p({target:I,entrants:A,exits:b,type:"interception",event:[this,c]},()=>g[N].call(this,...d))})}),["outerHTML","outerText","innerHTML","innerText","textContent","nodeValue"].forEach(c=>{let h=["textContent","nodeValue"].includes(c)?o:["outerText","innerText"].includes(c)?a:s;g[c]=Object.getOwnPropertyDescriptor(h.prototype,c),Object.defineProperty(h.prototype,c,{...g[c],set:function(d){let y=()=>g[c].set.call(this,d);if(!(this instanceof s))return y();let b=[],A=[],I=this;if(["outerHTML","outerText"].includes(c)?(b=[this],I=this.parentNode):b=[...this.childNodes],["outerHTML","innerHTML"].includes(c)){let D=this.nodeName;if(c==="outerHTML"){if(!this.parentNode)return y();D=this.parentNode.nodeName}let T=i.createElement(D==="TEMPLATE"?"div":D);g[c].set.call(T,d),A=this instanceof m?[]:[...T.childNodes],c==="outerHTML"?(d=new l,d.______isTemp=!0,d.append(...T.childNodes),y=()=>g.replaceWith.call(this,d)):this instanceof m?y=()=>this.content.replaceChildren(...T.childNodes):y=()=>g.replaceChildren.call(this,...T.childNodes)}return p({target:I,entrants:A,exits:b,type:"interception",event:[this,c]},y)}})}),["append","prepend","replaceChildren"].forEach(c=>{[i,l.prototype].forEach(h=>{let d=h[c];h[c]=function(...y){if(this.______isTemp)return d.call(this,...y);let b=c==="replaceChildren"?[...this.childNodes]:[];return p({target:this,entrants:y,exits:b,type:"interception",event:[this,c]},()=>d.call(this,...y))}})}),f}function ae(){He.call(this),Pe.call(this),qe.call(this)}function He(){let r=this;r.CSS||(r.CSS={}),r.CSS.escape||(r.CSS.escape=t=>t.replace(/([\:@\~\$\&])/g,"\\$1"))}function Pe(){let r=this;"isConnected"in r.Node.prototype||Object.defineProperty(r.Node.prototype,"isConnected",{get:function(){return!this.ownerDocument||!(this.ownerDocument.compareDocumentPosition(this)&this.DOCUMENT_POSITION_DISCONNECTED)}})}function qe(){let r=this;r.Element.prototype.matches||(r.Element.prototype.matches=r.Element.prototype.matchesSelector||r.Element.prototype.mozMatchesSelector||r.Element.prototype.msMatchesSelector||r.Element.prototype.oMatchesSelector||r.Element.prototype.webkitMatchesSelector||function(t){for(var n=(this.document||this.ownerDocument).querySelectorAll(t),e=n.length;--e>=0&&n.item(e)!==this;);return e>-1})}function de(){let r=this;if(r.webqit||(r.webqit={}),r.webqit.dom)return r.webqit.dom;r.webqit.dom={},ae.call(r);let t=ee(r);return r.webqit.dom.Reflow=new t,r.webqit.dom.DOMRealtime=q,r.webqit.dom.AttrRealtime=S,r.webqit.dom.realtime=(n,e="tree")=>{if(e==="tree")return new q(n,r);if(e==="attr")return new S(n,r)},r.webqit.dom.ready=Fe.bind(r),r.webqit.dom.meta=Le.bind(r),r.webqit.dom}function Fe(r){let t=this;t.document.readyState==="complete"?r(t):(t.document.domReadyCallbacks||(t.document.domReadyCallbacks=[],t.document.addEventListener("DOMContentLoaded",()=>{t.document.domReadyCallbacks.splice(0).forEach(n=>n(t))},!1)),t.document.domReadyCallbacks.push(r))}function Le(r){let t=this,n,e;return(e=t.document.querySelector(`meta[name="${r}"]`))&&(n=(e.content||"").split(";").filter(i=>i).reduce((i,o)=>{let s=o.split("=").map(a=>a.trim());return j(i,s[0].split("."),s[1]==="true"?!0:s[1]==="false"?!1:C(s[1])?parseInt(s[1]):s[1]),i},{})),{get name(){return r},get content(){return e.content},json(){return JSON.parse(JSON.stringify(n))}}}de.call(window);})();
//# sourceMappingURL=main.js.map
