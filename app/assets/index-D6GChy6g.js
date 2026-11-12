(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function W0(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var qm={exports:{}},Zl={},Ym={exports:{}},$e={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ja=Symbol.for("react.element"),X0=Symbol.for("react.portal"),$0=Symbol.for("react.fragment"),q0=Symbol.for("react.strict_mode"),Y0=Symbol.for("react.profiler"),K0=Symbol.for("react.provider"),Z0=Symbol.for("react.context"),Q0=Symbol.for("react.forward_ref"),J0=Symbol.for("react.suspense"),e_=Symbol.for("react.memo"),t_=Symbol.for("react.lazy"),Eh=Symbol.iterator;function n_(t){return t===null||typeof t!="object"?null:(t=Eh&&t[Eh]||t["@@iterator"],typeof t=="function"?t:null)}var Km={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Zm=Object.assign,Qm={};function Xs(t,e,n){this.props=t,this.context=e,this.refs=Qm,this.updater=n||Km}Xs.prototype.isReactComponent={};Xs.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Xs.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Jm(){}Jm.prototype=Xs.prototype;function cf(t,e,n){this.props=t,this.context=e,this.refs=Qm,this.updater=n||Km}var uf=cf.prototype=new Jm;uf.constructor=cf;Zm(uf,Xs.prototype);uf.isPureReactComponent=!0;var Th=Array.isArray,eg=Object.prototype.hasOwnProperty,df={current:null},tg={key:!0,ref:!0,__self:!0,__source:!0};function ng(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)eg.call(e,i)&&!tg.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),u=0;u<o;u++)l[u]=arguments[u+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:Ja,type:t,key:s,ref:a,props:r,_owner:df.current}}function i_(t,e){return{$$typeof:Ja,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function ff(t){return typeof t=="object"&&t!==null&&t.$$typeof===Ja}function r_(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var wh=/\/+/g;function yc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?r_(""+t.key):e.toString(36)}function el(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case Ja:case X0:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+yc(a,0):i,Th(r)?(n="",t!=null&&(n=t.replace(wh,"$&/")+"/"),el(r,e,n,"",function(u){return u})):r!=null&&(ff(r)&&(r=i_(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(wh,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",Th(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+yc(s,o);a+=el(s,e,n,l,r)}else if(l=n_(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+yc(s,o++),a+=el(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function oo(t,e,n){if(t==null)return t;var i=[],r=0;return el(t,i,"","",function(s){return e.call(n,s,r++)}),i}function s_(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var on={current:null},tl={transition:null},a_={ReactCurrentDispatcher:on,ReactCurrentBatchConfig:tl,ReactCurrentOwner:df};function ig(){throw Error("act(...) is not supported in production builds of React.")}$e.Children={map:oo,forEach:function(t,e,n){oo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return oo(t,function(){e++}),e},toArray:function(t){return oo(t,function(e){return e})||[]},only:function(t){if(!ff(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};$e.Component=Xs;$e.Fragment=$0;$e.Profiler=Y0;$e.PureComponent=cf;$e.StrictMode=q0;$e.Suspense=J0;$e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=a_;$e.act=ig;$e.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=Zm({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=df.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)eg.call(e,l)&&!tg.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var u=0;u<l;u++)o[u]=arguments[u+2];i.children=o}return{$$typeof:Ja,type:t.type,key:r,ref:s,props:i,_owner:a}};$e.createContext=function(t){return t={$$typeof:Z0,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:K0,_context:t},t.Consumer=t};$e.createElement=ng;$e.createFactory=function(t){var e=ng.bind(null,t);return e.type=t,e};$e.createRef=function(){return{current:null}};$e.forwardRef=function(t){return{$$typeof:Q0,render:t}};$e.isValidElement=ff;$e.lazy=function(t){return{$$typeof:t_,_payload:{_status:-1,_result:t},_init:s_}};$e.memo=function(t,e){return{$$typeof:e_,type:t,compare:e===void 0?null:e}};$e.startTransition=function(t){var e=tl.transition;tl.transition={};try{t()}finally{tl.transition=e}};$e.unstable_act=ig;$e.useCallback=function(t,e){return on.current.useCallback(t,e)};$e.useContext=function(t){return on.current.useContext(t)};$e.useDebugValue=function(){};$e.useDeferredValue=function(t){return on.current.useDeferredValue(t)};$e.useEffect=function(t,e){return on.current.useEffect(t,e)};$e.useId=function(){return on.current.useId()};$e.useImperativeHandle=function(t,e,n){return on.current.useImperativeHandle(t,e,n)};$e.useInsertionEffect=function(t,e){return on.current.useInsertionEffect(t,e)};$e.useLayoutEffect=function(t,e){return on.current.useLayoutEffect(t,e)};$e.useMemo=function(t,e){return on.current.useMemo(t,e)};$e.useReducer=function(t,e,n){return on.current.useReducer(t,e,n)};$e.useRef=function(t){return on.current.useRef(t)};$e.useState=function(t){return on.current.useState(t)};$e.useSyncExternalStore=function(t,e,n){return on.current.useSyncExternalStore(t,e,n)};$e.useTransition=function(){return on.current.useTransition()};$e.version="18.3.1";Ym.exports=$e;var Se=Ym.exports;const o_=W0(Se);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l_=Se,c_=Symbol.for("react.element"),u_=Symbol.for("react.fragment"),d_=Object.prototype.hasOwnProperty,f_=l_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h_={key:!0,ref:!0,__self:!0,__source:!0};function rg(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)d_.call(e,i)&&!h_.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:c_,type:t,key:s,ref:a,props:r,_owner:f_.current}}Zl.Fragment=u_;Zl.jsx=rg;Zl.jsxs=rg;qm.exports=Zl;var c=qm.exports,sg={exports:{}},wn={},ag={exports:{}},og={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(I,ee){var ie=I.length;I.push(ee);e:for(;0<ie;){var de=ie-1>>>1,Ne=I[de];if(0<r(Ne,ee))I[de]=ee,I[ie]=Ne,ie=de;else break e}}function n(I){return I.length===0?null:I[0]}function i(I){if(I.length===0)return null;var ee=I[0],ie=I.pop();if(ie!==ee){I[0]=ie;e:for(var de=0,Ne=I.length,qe=Ne>>>1;de<qe;){var J=2*(de+1)-1,se=I[J],me=J+1,pe=I[me];if(0>r(se,ie))me<Ne&&0>r(pe,se)?(I[de]=pe,I[me]=ie,de=me):(I[de]=se,I[J]=ie,de=J);else if(me<Ne&&0>r(pe,ie))I[de]=pe,I[me]=ie,de=me;else break e}}return ee}function r(I,ee){var ie=I.sortIndex-ee.sortIndex;return ie!==0?ie:I.id-ee.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],u=[],f=1,p=null,h=3,m=!1,v=!1,x=!1,g=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(I){for(var ee=n(u);ee!==null;){if(ee.callback===null)i(u);else if(ee.startTime<=I)i(u),ee.sortIndex=ee.expirationTime,e(l,ee);else break;ee=n(u)}}function T(I){if(x=!1,y(I),!v)if(n(l)!==null)v=!0,V(P);else{var ee=n(u);ee!==null&&Z(T,ee.startTime-I)}}function P(I,ee){v=!1,x&&(x=!1,d(N),N=-1),m=!0;var ie=h;try{for(y(ee),p=n(l);p!==null&&(!(p.expirationTime>ee)||I&&!w());){var de=p.callback;if(typeof de=="function"){p.callback=null,h=p.priorityLevel;var Ne=de(p.expirationTime<=ee);ee=t.unstable_now(),typeof Ne=="function"?p.callback=Ne:p===n(l)&&i(l),y(ee)}else i(l);p=n(l)}if(p!==null)var qe=!0;else{var J=n(u);J!==null&&Z(T,J.startTime-ee),qe=!1}return qe}finally{p=null,h=ie,m=!1}}var R=!1,A=null,N=-1,K=5,S=-1;function w(){return!(t.unstable_now()-S<K)}function Y(){if(A!==null){var I=t.unstable_now();S=I;var ee=!0;try{ee=A(!0,I)}finally{ee?F():(R=!1,A=null)}}else R=!1}var F;if(typeof _=="function")F=function(){_(Y)};else if(typeof MessageChannel<"u"){var k=new MessageChannel,q=k.port2;k.port1.onmessage=Y,F=function(){q.postMessage(null)}}else F=function(){g(Y,0)};function V(I){A=I,R||(R=!0,F())}function Z(I,ee){N=g(function(){I(t.unstable_now())},ee)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(I){I.callback=null},t.unstable_continueExecution=function(){v||m||(v=!0,V(P))},t.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):K=0<I?Math.floor(1e3/I):5},t.unstable_getCurrentPriorityLevel=function(){return h},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(I){switch(h){case 1:case 2:case 3:var ee=3;break;default:ee=h}var ie=h;h=ee;try{return I()}finally{h=ie}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(I,ee){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var ie=h;h=I;try{return ee()}finally{h=ie}},t.unstable_scheduleCallback=function(I,ee,ie){var de=t.unstable_now();switch(typeof ie=="object"&&ie!==null?(ie=ie.delay,ie=typeof ie=="number"&&0<ie?de+ie:de):ie=de,I){case 1:var Ne=-1;break;case 2:Ne=250;break;case 5:Ne=1073741823;break;case 4:Ne=1e4;break;default:Ne=5e3}return Ne=ie+Ne,I={id:f++,callback:ee,priorityLevel:I,startTime:ie,expirationTime:Ne,sortIndex:-1},ie>de?(I.sortIndex=ie,e(u,I),n(l)===null&&I===n(u)&&(x?(d(N),N=-1):x=!0,Z(T,ie-de))):(I.sortIndex=Ne,e(l,I),v||m||(v=!0,V(P))),I},t.unstable_shouldYield=w,t.unstable_wrapCallback=function(I){var ee=h;return function(){var ie=h;h=ee;try{return I.apply(this,arguments)}finally{h=ie}}}})(og);ag.exports=og;var p_=ag.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var m_=Se,Tn=p_;function le(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var lg=new Set,Da={};function zr(t,e){Ls(t,e),Ls(t+"Capture",e)}function Ls(t,e){for(Da[t]=e,t=0;t<e.length;t++)lg.add(e[t])}var Ti=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),bu=Object.prototype.hasOwnProperty,g_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Ah={},Ch={};function v_(t){return bu.call(Ch,t)?!0:bu.call(Ah,t)?!1:g_.test(t)?Ch[t]=!0:(Ah[t]=!0,!1)}function __(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function x_(t,e,n,i){if(e===null||typeof e>"u"||__(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function ln(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Gt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Gt[t]=new ln(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Gt[e]=new ln(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Gt[t]=new ln(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Gt[t]=new ln(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Gt[t]=new ln(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Gt[t]=new ln(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Gt[t]=new ln(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Gt[t]=new ln(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Gt[t]=new ln(t,5,!1,t.toLowerCase(),null,!1,!1)});var hf=/[\-:]([a-z])/g;function pf(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(hf,pf);Gt[e]=new ln(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(hf,pf);Gt[e]=new ln(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(hf,pf);Gt[e]=new ln(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Gt[t]=new ln(t,1,!1,t.toLowerCase(),null,!1,!1)});Gt.xlinkHref=new ln("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Gt[t]=new ln(t,1,!1,t.toLowerCase(),null,!0,!0)});function mf(t,e,n,i){var r=Gt.hasOwnProperty(e)?Gt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(x_(e,n,r,i)&&(n=null),i||r===null?v_(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Pi=m_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,lo=Symbol.for("react.element"),cs=Symbol.for("react.portal"),us=Symbol.for("react.fragment"),gf=Symbol.for("react.strict_mode"),Pu=Symbol.for("react.profiler"),cg=Symbol.for("react.provider"),ug=Symbol.for("react.context"),vf=Symbol.for("react.forward_ref"),Nu=Symbol.for("react.suspense"),Lu=Symbol.for("react.suspense_list"),_f=Symbol.for("react.memo"),zi=Symbol.for("react.lazy"),dg=Symbol.for("react.offscreen"),Rh=Symbol.iterator;function ea(t){return t===null||typeof t!="object"?null:(t=Rh&&t[Rh]||t["@@iterator"],typeof t=="function"?t:null)}var yt=Object.assign,Sc;function va(t){if(Sc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Sc=e&&e[1]||""}return`
`+Sc+t}var Mc=!1;function Ec(t,e){if(!t||Mc)return"";Mc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){i=u}t.call(e.prototype)}else{try{throw Error()}catch(u){i=u}t()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var r=u.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Mc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?va(t):""}function y_(t){switch(t.tag){case 5:return va(t.type);case 16:return va("Lazy");case 13:return va("Suspense");case 19:return va("SuspenseList");case 0:case 2:case 15:return t=Ec(t.type,!1),t;case 11:return t=Ec(t.type.render,!1),t;case 1:return t=Ec(t.type,!0),t;default:return""}}function Du(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case us:return"Fragment";case cs:return"Portal";case Pu:return"Profiler";case gf:return"StrictMode";case Nu:return"Suspense";case Lu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case ug:return(t.displayName||"Context")+".Consumer";case cg:return(t._context.displayName||"Context")+".Provider";case vf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case _f:return e=t.displayName||null,e!==null?e:Du(t.type)||"Memo";case zi:e=t._payload,t=t._init;try{return Du(t(e))}catch{}}return null}function S_(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Du(e);case 8:return e===gf?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function rr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function fg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function M_(t){var e=fg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function co(t){t._valueTracker||(t._valueTracker=M_(t))}function hg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=fg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function yl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Iu(t,e){var n=e.checked;return yt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function bh(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=rr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function pg(t,e){e=e.checked,e!=null&&mf(t,"checked",e,!1)}function Uu(t,e){pg(t,e);var n=rr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Fu(t,e.type,n):e.hasOwnProperty("defaultValue")&&Fu(t,e.type,rr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Ph(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Fu(t,e,n){(e!=="number"||yl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var _a=Array.isArray;function Ms(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+rr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Ou(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(le(91));return yt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Nh(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(le(92));if(_a(n)){if(1<n.length)throw Error(le(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:rr(n)}}function mg(t,e){var n=rr(e.value),i=rr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Lh(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function gg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ku(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?gg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var uo,vg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(uo=uo||document.createElement("div"),uo.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=uo.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Ia(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ea={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},E_=["Webkit","ms","Moz","O"];Object.keys(Ea).forEach(function(t){E_.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ea[e]=Ea[t]})});function _g(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ea.hasOwnProperty(t)&&Ea[t]?(""+e).trim():e+"px"}function xg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=_g(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var T_=yt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Bu(t,e){if(e){if(T_[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(le(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(le(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(le(61))}if(e.style!=null&&typeof e.style!="object")throw Error(le(62))}}function zu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ju=null;function xf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Hu=null,Es=null,Ts=null;function Dh(t){if(t=no(t)){if(typeof Hu!="function")throw Error(le(280));var e=t.stateNode;e&&(e=nc(e),Hu(t.stateNode,t.type,e))}}function yg(t){Es?Ts?Ts.push(t):Ts=[t]:Es=t}function Sg(){if(Es){var t=Es,e=Ts;if(Ts=Es=null,Dh(t),e)for(t=0;t<e.length;t++)Dh(e[t])}}function Mg(t,e){return t(e)}function Eg(){}var Tc=!1;function Tg(t,e,n){if(Tc)return t(e,n);Tc=!0;try{return Mg(t,e,n)}finally{Tc=!1,(Es!==null||Ts!==null)&&(Eg(),Sg())}}function Ua(t,e){var n=t.stateNode;if(n===null)return null;var i=nc(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(le(231,e,typeof n));return n}var Vu=!1;if(Ti)try{var ta={};Object.defineProperty(ta,"passive",{get:function(){Vu=!0}}),window.addEventListener("test",ta,ta),window.removeEventListener("test",ta,ta)}catch{Vu=!1}function w_(t,e,n,i,r,s,a,o,l){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(f){this.onError(f)}}var Ta=!1,Sl=null,Ml=!1,Gu=null,A_={onError:function(t){Ta=!0,Sl=t}};function C_(t,e,n,i,r,s,a,o,l){Ta=!1,Sl=null,w_.apply(A_,arguments)}function R_(t,e,n,i,r,s,a,o,l){if(C_.apply(this,arguments),Ta){if(Ta){var u=Sl;Ta=!1,Sl=null}else throw Error(le(198));Ml||(Ml=!0,Gu=u)}}function jr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function wg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Ih(t){if(jr(t)!==t)throw Error(le(188))}function b_(t){var e=t.alternate;if(!e){if(e=jr(t),e===null)throw Error(le(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Ih(r),t;if(s===i)return Ih(r),e;s=s.sibling}throw Error(le(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(le(189))}}if(n.alternate!==i)throw Error(le(190))}if(n.tag!==3)throw Error(le(188));return n.stateNode.current===n?t:e}function Ag(t){return t=b_(t),t!==null?Cg(t):null}function Cg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Cg(t);if(e!==null)return e;t=t.sibling}return null}var Rg=Tn.unstable_scheduleCallback,Uh=Tn.unstable_cancelCallback,P_=Tn.unstable_shouldYield,N_=Tn.unstable_requestPaint,Ct=Tn.unstable_now,L_=Tn.unstable_getCurrentPriorityLevel,yf=Tn.unstable_ImmediatePriority,bg=Tn.unstable_UserBlockingPriority,El=Tn.unstable_NormalPriority,D_=Tn.unstable_LowPriority,Pg=Tn.unstable_IdlePriority,Ql=null,oi=null;function I_(t){if(oi&&typeof oi.onCommitFiberRoot=="function")try{oi.onCommitFiberRoot(Ql,t,void 0,(t.current.flags&128)===128)}catch{}}var Qn=Math.clz32?Math.clz32:O_,U_=Math.log,F_=Math.LN2;function O_(t){return t>>>=0,t===0?32:31-(U_(t)/F_|0)|0}var fo=64,ho=4194304;function xa(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Tl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=xa(o):(s&=a,s!==0&&(i=xa(s)))}else a=n&~r,a!==0?i=xa(a):s!==0&&(i=xa(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Qn(e),r=1<<n,i|=t[n],e&=~r;return i}function k_(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function B_(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Qn(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=k_(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function Wu(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Ng(){var t=fo;return fo<<=1,!(fo&4194240)&&(fo=64),t}function wc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function eo(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Qn(e),t[e]=n}function z_(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Qn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Sf(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Qn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var at=0;function Lg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Dg,Mf,Ig,Ug,Fg,Xu=!1,po=[],qi=null,Yi=null,Ki=null,Fa=new Map,Oa=new Map,Hi=[],j_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Fh(t,e){switch(t){case"focusin":case"focusout":qi=null;break;case"dragenter":case"dragleave":Yi=null;break;case"mouseover":case"mouseout":Ki=null;break;case"pointerover":case"pointerout":Fa.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Oa.delete(e.pointerId)}}function na(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=no(e),e!==null&&Mf(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function H_(t,e,n,i,r){switch(e){case"focusin":return qi=na(qi,t,e,n,i,r),!0;case"dragenter":return Yi=na(Yi,t,e,n,i,r),!0;case"mouseover":return Ki=na(Ki,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Fa.set(s,na(Fa.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Oa.set(s,na(Oa.get(s)||null,t,e,n,i,r)),!0}return!1}function Og(t){var e=wr(t.target);if(e!==null){var n=jr(e);if(n!==null){if(e=n.tag,e===13){if(e=wg(n),e!==null){t.blockedOn=e,Fg(t.priority,function(){Ig(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function nl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=$u(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);ju=i,n.target.dispatchEvent(i),ju=null}else return e=no(n),e!==null&&Mf(e),t.blockedOn=n,!1;e.shift()}return!0}function Oh(t,e,n){nl(t)&&n.delete(e)}function V_(){Xu=!1,qi!==null&&nl(qi)&&(qi=null),Yi!==null&&nl(Yi)&&(Yi=null),Ki!==null&&nl(Ki)&&(Ki=null),Fa.forEach(Oh),Oa.forEach(Oh)}function ia(t,e){t.blockedOn===e&&(t.blockedOn=null,Xu||(Xu=!0,Tn.unstable_scheduleCallback(Tn.unstable_NormalPriority,V_)))}function ka(t){function e(r){return ia(r,t)}if(0<po.length){ia(po[0],t);for(var n=1;n<po.length;n++){var i=po[n];i.blockedOn===t&&(i.blockedOn=null)}}for(qi!==null&&ia(qi,t),Yi!==null&&ia(Yi,t),Ki!==null&&ia(Ki,t),Fa.forEach(e),Oa.forEach(e),n=0;n<Hi.length;n++)i=Hi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Hi.length&&(n=Hi[0],n.blockedOn===null);)Og(n),n.blockedOn===null&&Hi.shift()}var ws=Pi.ReactCurrentBatchConfig,wl=!0;function G_(t,e,n,i){var r=at,s=ws.transition;ws.transition=null;try{at=1,Ef(t,e,n,i)}finally{at=r,ws.transition=s}}function W_(t,e,n,i){var r=at,s=ws.transition;ws.transition=null;try{at=4,Ef(t,e,n,i)}finally{at=r,ws.transition=s}}function Ef(t,e,n,i){if(wl){var r=$u(t,e,n,i);if(r===null)Uc(t,e,i,Al,n),Fh(t,i);else if(H_(r,t,e,n,i))i.stopPropagation();else if(Fh(t,i),e&4&&-1<j_.indexOf(t)){for(;r!==null;){var s=no(r);if(s!==null&&Dg(s),s=$u(t,e,n,i),s===null&&Uc(t,e,i,Al,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Uc(t,e,i,null,n)}}var Al=null;function $u(t,e,n,i){if(Al=null,t=xf(i),t=wr(t),t!==null)if(e=jr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=wg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Al=t,null}function kg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(L_()){case yf:return 1;case bg:return 4;case El:case D_:return 16;case Pg:return 536870912;default:return 16}default:return 16}}var Wi=null,Tf=null,il=null;function Bg(){if(il)return il;var t,e=Tf,n=e.length,i,r="value"in Wi?Wi.value:Wi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return il=r.slice(t,1<i?1-i:void 0)}function rl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function mo(){return!0}function kh(){return!1}function An(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?mo:kh,this.isPropagationStopped=kh,this}return yt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=mo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=mo)},persist:function(){},isPersistent:mo}),e}var $s={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wf=An($s),to=yt({},$s,{view:0,detail:0}),X_=An(to),Ac,Cc,ra,Jl=yt({},to,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Af,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==ra&&(ra&&t.type==="mousemove"?(Ac=t.screenX-ra.screenX,Cc=t.screenY-ra.screenY):Cc=Ac=0,ra=t),Ac)},movementY:function(t){return"movementY"in t?t.movementY:Cc}}),Bh=An(Jl),$_=yt({},Jl,{dataTransfer:0}),q_=An($_),Y_=yt({},to,{relatedTarget:0}),Rc=An(Y_),K_=yt({},$s,{animationName:0,elapsedTime:0,pseudoElement:0}),Z_=An(K_),Q_=yt({},$s,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),J_=An(Q_),ex=yt({},$s,{data:0}),zh=An(ex),tx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},nx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ix={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function rx(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=ix[t])?!!e[t]:!1}function Af(){return rx}var sx=yt({},to,{key:function(t){if(t.key){var e=tx[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=rl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?nx[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Af,charCode:function(t){return t.type==="keypress"?rl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?rl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),ax=An(sx),ox=yt({},Jl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),jh=An(ox),lx=yt({},to,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Af}),cx=An(lx),ux=yt({},$s,{propertyName:0,elapsedTime:0,pseudoElement:0}),dx=An(ux),fx=yt({},Jl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),hx=An(fx),px=[9,13,27,32],Cf=Ti&&"CompositionEvent"in window,wa=null;Ti&&"documentMode"in document&&(wa=document.documentMode);var mx=Ti&&"TextEvent"in window&&!wa,zg=Ti&&(!Cf||wa&&8<wa&&11>=wa),Hh=" ",Vh=!1;function jg(t,e){switch(t){case"keyup":return px.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Hg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ds=!1;function gx(t,e){switch(t){case"compositionend":return Hg(e);case"keypress":return e.which!==32?null:(Vh=!0,Hh);case"textInput":return t=e.data,t===Hh&&Vh?null:t;default:return null}}function vx(t,e){if(ds)return t==="compositionend"||!Cf&&jg(t,e)?(t=Bg(),il=Tf=Wi=null,ds=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return zg&&e.locale!=="ko"?null:e.data;default:return null}}var _x={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Gh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!_x[t.type]:e==="textarea"}function Vg(t,e,n,i){yg(i),e=Cl(e,"onChange"),0<e.length&&(n=new wf("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Aa=null,Ba=null;function xx(t){ev(t,0)}function ec(t){var e=ps(t);if(hg(e))return t}function yx(t,e){if(t==="change")return e}var Gg=!1;if(Ti){var bc;if(Ti){var Pc="oninput"in document;if(!Pc){var Wh=document.createElement("div");Wh.setAttribute("oninput","return;"),Pc=typeof Wh.oninput=="function"}bc=Pc}else bc=!1;Gg=bc&&(!document.documentMode||9<document.documentMode)}function Xh(){Aa&&(Aa.detachEvent("onpropertychange",Wg),Ba=Aa=null)}function Wg(t){if(t.propertyName==="value"&&ec(Ba)){var e=[];Vg(e,Ba,t,xf(t)),Tg(xx,e)}}function Sx(t,e,n){t==="focusin"?(Xh(),Aa=e,Ba=n,Aa.attachEvent("onpropertychange",Wg)):t==="focusout"&&Xh()}function Mx(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return ec(Ba)}function Ex(t,e){if(t==="click")return ec(e)}function Tx(t,e){if(t==="input"||t==="change")return ec(e)}function wx(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ei=typeof Object.is=="function"?Object.is:wx;function za(t,e){if(ei(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!bu.call(e,r)||!ei(t[r],e[r]))return!1}return!0}function $h(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function qh(t,e){var n=$h(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=$h(n)}}function Xg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Xg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function $g(){for(var t=window,e=yl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=yl(t.document)}return e}function Rf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function Ax(t){var e=$g(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Xg(n.ownerDocument.documentElement,n)){if(i!==null&&Rf(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=qh(n,s);var a=qh(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var Cx=Ti&&"documentMode"in document&&11>=document.documentMode,fs=null,qu=null,Ca=null,Yu=!1;function Yh(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Yu||fs==null||fs!==yl(i)||(i=fs,"selectionStart"in i&&Rf(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ca&&za(Ca,i)||(Ca=i,i=Cl(qu,"onSelect"),0<i.length&&(e=new wf("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=fs)))}function go(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var hs={animationend:go("Animation","AnimationEnd"),animationiteration:go("Animation","AnimationIteration"),animationstart:go("Animation","AnimationStart"),transitionend:go("Transition","TransitionEnd")},Nc={},qg={};Ti&&(qg=document.createElement("div").style,"AnimationEvent"in window||(delete hs.animationend.animation,delete hs.animationiteration.animation,delete hs.animationstart.animation),"TransitionEvent"in window||delete hs.transitionend.transition);function tc(t){if(Nc[t])return Nc[t];if(!hs[t])return t;var e=hs[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in qg)return Nc[t]=e[n];return t}var Yg=tc("animationend"),Kg=tc("animationiteration"),Zg=tc("animationstart"),Qg=tc("transitionend"),Jg=new Map,Kh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function lr(t,e){Jg.set(t,e),zr(e,[t])}for(var Lc=0;Lc<Kh.length;Lc++){var Dc=Kh[Lc],Rx=Dc.toLowerCase(),bx=Dc[0].toUpperCase()+Dc.slice(1);lr(Rx,"on"+bx)}lr(Yg,"onAnimationEnd");lr(Kg,"onAnimationIteration");lr(Zg,"onAnimationStart");lr("dblclick","onDoubleClick");lr("focusin","onFocus");lr("focusout","onBlur");lr(Qg,"onTransitionEnd");Ls("onMouseEnter",["mouseout","mouseover"]);Ls("onMouseLeave",["mouseout","mouseover"]);Ls("onPointerEnter",["pointerout","pointerover"]);Ls("onPointerLeave",["pointerout","pointerover"]);zr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));zr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));zr("onBeforeInput",["compositionend","keypress","textInput","paste"]);zr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));zr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));zr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ya="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Px=new Set("cancel close invalid load scroll toggle".split(" ").concat(ya));function Zh(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,R_(i,e,void 0,t),t.currentTarget=null}function ev(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,u=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;Zh(r,o,u),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,u=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;Zh(r,o,u),s=l}}}if(Ml)throw t=Gu,Ml=!1,Gu=null,t}function ht(t,e){var n=e[ed];n===void 0&&(n=e[ed]=new Set);var i=t+"__bubble";n.has(i)||(tv(e,t,2,!1),n.add(i))}function Ic(t,e,n){var i=0;e&&(i|=4),tv(n,t,i,e)}var vo="_reactListening"+Math.random().toString(36).slice(2);function ja(t){if(!t[vo]){t[vo]=!0,lg.forEach(function(n){n!=="selectionchange"&&(Px.has(n)||Ic(n,!1,t),Ic(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[vo]||(e[vo]=!0,Ic("selectionchange",!1,e))}}function tv(t,e,n,i){switch(kg(e)){case 1:var r=G_;break;case 4:r=W_;break;default:r=Ef}n=r.bind(null,e,n,t),r=void 0,!Vu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Uc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=wr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}Tg(function(){var u=s,f=xf(n),p=[];e:{var h=Jg.get(t);if(h!==void 0){var m=wf,v=t;switch(t){case"keypress":if(rl(n)===0)break e;case"keydown":case"keyup":m=ax;break;case"focusin":v="focus",m=Rc;break;case"focusout":v="blur",m=Rc;break;case"beforeblur":case"afterblur":m=Rc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=Bh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=q_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=cx;break;case Yg:case Kg:case Zg:m=Z_;break;case Qg:m=dx;break;case"scroll":m=X_;break;case"wheel":m=hx;break;case"copy":case"cut":case"paste":m=J_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=jh}var x=(e&4)!==0,g=!x&&t==="scroll",d=x?h!==null?h+"Capture":null:h;x=[];for(var _=u,y;_!==null;){y=_;var T=y.stateNode;if(y.tag===5&&T!==null&&(y=T,d!==null&&(T=Ua(_,d),T!=null&&x.push(Ha(_,T,y)))),g)break;_=_.return}0<x.length&&(h=new m(h,v,null,n,f),p.push({event:h,listeners:x}))}}if(!(e&7)){e:{if(h=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",h&&n!==ju&&(v=n.relatedTarget||n.fromElement)&&(wr(v)||v[wi]))break e;if((m||h)&&(h=f.window===f?f:(h=f.ownerDocument)?h.defaultView||h.parentWindow:window,m?(v=n.relatedTarget||n.toElement,m=u,v=v?wr(v):null,v!==null&&(g=jr(v),v!==g||v.tag!==5&&v.tag!==6)&&(v=null)):(m=null,v=u),m!==v)){if(x=Bh,T="onMouseLeave",d="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(x=jh,T="onPointerLeave",d="onPointerEnter",_="pointer"),g=m==null?h:ps(m),y=v==null?h:ps(v),h=new x(T,_+"leave",m,n,f),h.target=g,h.relatedTarget=y,T=null,wr(f)===u&&(x=new x(d,_+"enter",v,n,f),x.target=y,x.relatedTarget=g,T=x),g=T,m&&v)t:{for(x=m,d=v,_=0,y=x;y;y=Wr(y))_++;for(y=0,T=d;T;T=Wr(T))y++;for(;0<_-y;)x=Wr(x),_--;for(;0<y-_;)d=Wr(d),y--;for(;_--;){if(x===d||d!==null&&x===d.alternate)break t;x=Wr(x),d=Wr(d)}x=null}else x=null;m!==null&&Qh(p,h,m,x,!1),v!==null&&g!==null&&Qh(p,g,v,x,!0)}}e:{if(h=u?ps(u):window,m=h.nodeName&&h.nodeName.toLowerCase(),m==="select"||m==="input"&&h.type==="file")var P=yx;else if(Gh(h))if(Gg)P=Tx;else{P=Mx;var R=Sx}else(m=h.nodeName)&&m.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(P=Ex);if(P&&(P=P(t,u))){Vg(p,P,n,f);break e}R&&R(t,h,u),t==="focusout"&&(R=h._wrapperState)&&R.controlled&&h.type==="number"&&Fu(h,"number",h.value)}switch(R=u?ps(u):window,t){case"focusin":(Gh(R)||R.contentEditable==="true")&&(fs=R,qu=u,Ca=null);break;case"focusout":Ca=qu=fs=null;break;case"mousedown":Yu=!0;break;case"contextmenu":case"mouseup":case"dragend":Yu=!1,Yh(p,n,f);break;case"selectionchange":if(Cx)break;case"keydown":case"keyup":Yh(p,n,f)}var A;if(Cf)e:{switch(t){case"compositionstart":var N="onCompositionStart";break e;case"compositionend":N="onCompositionEnd";break e;case"compositionupdate":N="onCompositionUpdate";break e}N=void 0}else ds?jg(t,n)&&(N="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(N="onCompositionStart");N&&(zg&&n.locale!=="ko"&&(ds||N!=="onCompositionStart"?N==="onCompositionEnd"&&ds&&(A=Bg()):(Wi=f,Tf="value"in Wi?Wi.value:Wi.textContent,ds=!0)),R=Cl(u,N),0<R.length&&(N=new zh(N,t,null,n,f),p.push({event:N,listeners:R}),A?N.data=A:(A=Hg(n),A!==null&&(N.data=A)))),(A=mx?gx(t,n):vx(t,n))&&(u=Cl(u,"onBeforeInput"),0<u.length&&(f=new zh("onBeforeInput","beforeinput",null,n,f),p.push({event:f,listeners:u}),f.data=A))}ev(p,e)})}function Ha(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Cl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Ua(t,n),s!=null&&i.unshift(Ha(t,s,r)),s=Ua(t,e),s!=null&&i.push(Ha(t,s,r))),t=t.return}return i}function Wr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Qh(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,u=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&u!==null&&(o=u,r?(l=Ua(n,s),l!=null&&a.unshift(Ha(n,l,o))):r||(l=Ua(n,s),l!=null&&a.push(Ha(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var Nx=/\r\n?/g,Lx=/\u0000|\uFFFD/g;function Jh(t){return(typeof t=="string"?t:""+t).replace(Nx,`
`).replace(Lx,"")}function _o(t,e,n){if(e=Jh(e),Jh(t)!==e&&n)throw Error(le(425))}function Rl(){}var Ku=null,Zu=null;function Qu(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Ju=typeof setTimeout=="function"?setTimeout:void 0,Dx=typeof clearTimeout=="function"?clearTimeout:void 0,ep=typeof Promise=="function"?Promise:void 0,Ix=typeof queueMicrotask=="function"?queueMicrotask:typeof ep<"u"?function(t){return ep.resolve(null).then(t).catch(Ux)}:Ju;function Ux(t){setTimeout(function(){throw t})}function Fc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),ka(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);ka(e)}function Zi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function tp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var qs=Math.random().toString(36).slice(2),si="__reactFiber$"+qs,Va="__reactProps$"+qs,wi="__reactContainer$"+qs,ed="__reactEvents$"+qs,Fx="__reactListeners$"+qs,Ox="__reactHandles$"+qs;function wr(t){var e=t[si];if(e)return e;for(var n=t.parentNode;n;){if(e=n[wi]||n[si]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=tp(t);t!==null;){if(n=t[si])return n;t=tp(t)}return e}t=n,n=t.parentNode}return null}function no(t){return t=t[si]||t[wi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function ps(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(le(33))}function nc(t){return t[Va]||null}var td=[],ms=-1;function cr(t){return{current:t}}function mt(t){0>ms||(t.current=td[ms],td[ms]=null,ms--)}function ct(t,e){ms++,td[ms]=t.current,t.current=e}var sr={},Qt=cr(sr),hn=cr(!1),Lr=sr;function Ds(t,e){var n=t.type.contextTypes;if(!n)return sr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function pn(t){return t=t.childContextTypes,t!=null}function bl(){mt(hn),mt(Qt)}function np(t,e,n){if(Qt.current!==sr)throw Error(le(168));ct(Qt,e),ct(hn,n)}function nv(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(le(108,S_(t)||"Unknown",r));return yt({},n,i)}function Pl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||sr,Lr=Qt.current,ct(Qt,t),ct(hn,hn.current),!0}function ip(t,e,n){var i=t.stateNode;if(!i)throw Error(le(169));n?(t=nv(t,e,Lr),i.__reactInternalMemoizedMergedChildContext=t,mt(hn),mt(Qt),ct(Qt,t)):mt(hn),ct(hn,n)}var _i=null,ic=!1,Oc=!1;function iv(t){_i===null?_i=[t]:_i.push(t)}function kx(t){ic=!0,iv(t)}function ur(){if(!Oc&&_i!==null){Oc=!0;var t=0,e=at;try{var n=_i;for(at=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}_i=null,ic=!1}catch(r){throw _i!==null&&(_i=_i.slice(t+1)),Rg(yf,ur),r}finally{at=e,Oc=!1}}return null}var gs=[],vs=0,Nl=null,Ll=0,Pn=[],Nn=0,Dr=null,xi=1,yi="";function xr(t,e){gs[vs++]=Ll,gs[vs++]=Nl,Nl=t,Ll=e}function rv(t,e,n){Pn[Nn++]=xi,Pn[Nn++]=yi,Pn[Nn++]=Dr,Dr=t;var i=xi;t=yi;var r=32-Qn(i)-1;i&=~(1<<r),n+=1;var s=32-Qn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,xi=1<<32-Qn(e)+r|n<<r|i,yi=s+t}else xi=1<<s|n<<r|i,yi=t}function bf(t){t.return!==null&&(xr(t,1),rv(t,1,0))}function Pf(t){for(;t===Nl;)Nl=gs[--vs],gs[vs]=null,Ll=gs[--vs],gs[vs]=null;for(;t===Dr;)Dr=Pn[--Nn],Pn[Nn]=null,yi=Pn[--Nn],Pn[Nn]=null,xi=Pn[--Nn],Pn[Nn]=null}var Mn=null,Sn=null,vt=!1,$n=null;function sv(t,e){var n=Dn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function rp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Mn=t,Sn=Zi(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Mn=t,Sn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Dr!==null?{id:xi,overflow:yi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Dn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Mn=t,Sn=null,!0):!1;default:return!1}}function nd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function id(t){if(vt){var e=Sn;if(e){var n=e;if(!rp(t,e)){if(nd(t))throw Error(le(418));e=Zi(n.nextSibling);var i=Mn;e&&rp(t,e)?sv(i,n):(t.flags=t.flags&-4097|2,vt=!1,Mn=t)}}else{if(nd(t))throw Error(le(418));t.flags=t.flags&-4097|2,vt=!1,Mn=t}}}function sp(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Mn=t}function xo(t){if(t!==Mn)return!1;if(!vt)return sp(t),vt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Qu(t.type,t.memoizedProps)),e&&(e=Sn)){if(nd(t))throw av(),Error(le(418));for(;e;)sv(t,e),e=Zi(e.nextSibling)}if(sp(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(le(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Sn=Zi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Sn=null}}else Sn=Mn?Zi(t.stateNode.nextSibling):null;return!0}function av(){for(var t=Sn;t;)t=Zi(t.nextSibling)}function Is(){Sn=Mn=null,vt=!1}function Nf(t){$n===null?$n=[t]:$n.push(t)}var Bx=Pi.ReactCurrentBatchConfig;function sa(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(le(309));var i=n.stateNode}if(!i)throw Error(le(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(le(284));if(!n._owner)throw Error(le(290,t))}return t}function yo(t,e){throw t=Object.prototype.toString.call(e),Error(le(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function ap(t){var e=t._init;return e(t._payload)}function ov(t){function e(d,_){if(t){var y=d.deletions;y===null?(d.deletions=[_],d.flags|=16):y.push(_)}}function n(d,_){if(!t)return null;for(;_!==null;)e(d,_),_=_.sibling;return null}function i(d,_){for(d=new Map;_!==null;)_.key!==null?d.set(_.key,_):d.set(_.index,_),_=_.sibling;return d}function r(d,_){return d=tr(d,_),d.index=0,d.sibling=null,d}function s(d,_,y){return d.index=y,t?(y=d.alternate,y!==null?(y=y.index,y<_?(d.flags|=2,_):y):(d.flags|=2,_)):(d.flags|=1048576,_)}function a(d){return t&&d.alternate===null&&(d.flags|=2),d}function o(d,_,y,T){return _===null||_.tag!==6?(_=Gc(y,d.mode,T),_.return=d,_):(_=r(_,y),_.return=d,_)}function l(d,_,y,T){var P=y.type;return P===us?f(d,_,y.props.children,T,y.key):_!==null&&(_.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===zi&&ap(P)===_.type)?(T=r(_,y.props),T.ref=sa(d,_,y),T.return=d,T):(T=dl(y.type,y.key,y.props,null,d.mode,T),T.ref=sa(d,_,y),T.return=d,T)}function u(d,_,y,T){return _===null||_.tag!==4||_.stateNode.containerInfo!==y.containerInfo||_.stateNode.implementation!==y.implementation?(_=Wc(y,d.mode,T),_.return=d,_):(_=r(_,y.children||[]),_.return=d,_)}function f(d,_,y,T,P){return _===null||_.tag!==7?(_=Nr(y,d.mode,T,P),_.return=d,_):(_=r(_,y),_.return=d,_)}function p(d,_,y){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Gc(""+_,d.mode,y),_.return=d,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case lo:return y=dl(_.type,_.key,_.props,null,d.mode,y),y.ref=sa(d,null,_),y.return=d,y;case cs:return _=Wc(_,d.mode,y),_.return=d,_;case zi:var T=_._init;return p(d,T(_._payload),y)}if(_a(_)||ea(_))return _=Nr(_,d.mode,y,null),_.return=d,_;yo(d,_)}return null}function h(d,_,y,T){var P=_!==null?_.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return P!==null?null:o(d,_,""+y,T);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case lo:return y.key===P?l(d,_,y,T):null;case cs:return y.key===P?u(d,_,y,T):null;case zi:return P=y._init,h(d,_,P(y._payload),T)}if(_a(y)||ea(y))return P!==null?null:f(d,_,y,T,null);yo(d,y)}return null}function m(d,_,y,T,P){if(typeof T=="string"&&T!==""||typeof T=="number")return d=d.get(y)||null,o(_,d,""+T,P);if(typeof T=="object"&&T!==null){switch(T.$$typeof){case lo:return d=d.get(T.key===null?y:T.key)||null,l(_,d,T,P);case cs:return d=d.get(T.key===null?y:T.key)||null,u(_,d,T,P);case zi:var R=T._init;return m(d,_,y,R(T._payload),P)}if(_a(T)||ea(T))return d=d.get(y)||null,f(_,d,T,P,null);yo(_,T)}return null}function v(d,_,y,T){for(var P=null,R=null,A=_,N=_=0,K=null;A!==null&&N<y.length;N++){A.index>N?(K=A,A=null):K=A.sibling;var S=h(d,A,y[N],T);if(S===null){A===null&&(A=K);break}t&&A&&S.alternate===null&&e(d,A),_=s(S,_,N),R===null?P=S:R.sibling=S,R=S,A=K}if(N===y.length)return n(d,A),vt&&xr(d,N),P;if(A===null){for(;N<y.length;N++)A=p(d,y[N],T),A!==null&&(_=s(A,_,N),R===null?P=A:R.sibling=A,R=A);return vt&&xr(d,N),P}for(A=i(d,A);N<y.length;N++)K=m(A,d,N,y[N],T),K!==null&&(t&&K.alternate!==null&&A.delete(K.key===null?N:K.key),_=s(K,_,N),R===null?P=K:R.sibling=K,R=K);return t&&A.forEach(function(w){return e(d,w)}),vt&&xr(d,N),P}function x(d,_,y,T){var P=ea(y);if(typeof P!="function")throw Error(le(150));if(y=P.call(y),y==null)throw Error(le(151));for(var R=P=null,A=_,N=_=0,K=null,S=y.next();A!==null&&!S.done;N++,S=y.next()){A.index>N?(K=A,A=null):K=A.sibling;var w=h(d,A,S.value,T);if(w===null){A===null&&(A=K);break}t&&A&&w.alternate===null&&e(d,A),_=s(w,_,N),R===null?P=w:R.sibling=w,R=w,A=K}if(S.done)return n(d,A),vt&&xr(d,N),P;if(A===null){for(;!S.done;N++,S=y.next())S=p(d,S.value,T),S!==null&&(_=s(S,_,N),R===null?P=S:R.sibling=S,R=S);return vt&&xr(d,N),P}for(A=i(d,A);!S.done;N++,S=y.next())S=m(A,d,N,S.value,T),S!==null&&(t&&S.alternate!==null&&A.delete(S.key===null?N:S.key),_=s(S,_,N),R===null?P=S:R.sibling=S,R=S);return t&&A.forEach(function(Y){return e(d,Y)}),vt&&xr(d,N),P}function g(d,_,y,T){if(typeof y=="object"&&y!==null&&y.type===us&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case lo:e:{for(var P=y.key,R=_;R!==null;){if(R.key===P){if(P=y.type,P===us){if(R.tag===7){n(d,R.sibling),_=r(R,y.props.children),_.return=d,d=_;break e}}else if(R.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===zi&&ap(P)===R.type){n(d,R.sibling),_=r(R,y.props),_.ref=sa(d,R,y),_.return=d,d=_;break e}n(d,R);break}else e(d,R);R=R.sibling}y.type===us?(_=Nr(y.props.children,d.mode,T,y.key),_.return=d,d=_):(T=dl(y.type,y.key,y.props,null,d.mode,T),T.ref=sa(d,_,y),T.return=d,d=T)}return a(d);case cs:e:{for(R=y.key;_!==null;){if(_.key===R)if(_.tag===4&&_.stateNode.containerInfo===y.containerInfo&&_.stateNode.implementation===y.implementation){n(d,_.sibling),_=r(_,y.children||[]),_.return=d,d=_;break e}else{n(d,_);break}else e(d,_);_=_.sibling}_=Wc(y,d.mode,T),_.return=d,d=_}return a(d);case zi:return R=y._init,g(d,_,R(y._payload),T)}if(_a(y))return v(d,_,y,T);if(ea(y))return x(d,_,y,T);yo(d,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,_!==null&&_.tag===6?(n(d,_.sibling),_=r(_,y),_.return=d,d=_):(n(d,_),_=Gc(y,d.mode,T),_.return=d,d=_),a(d)):n(d,_)}return g}var Us=ov(!0),lv=ov(!1),Dl=cr(null),Il=null,_s=null,Lf=null;function Df(){Lf=_s=Il=null}function If(t){var e=Dl.current;mt(Dl),t._currentValue=e}function rd(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function As(t,e){Il=t,Lf=_s=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(dn=!0),t.firstContext=null)}function Un(t){var e=t._currentValue;if(Lf!==t)if(t={context:t,memoizedValue:e,next:null},_s===null){if(Il===null)throw Error(le(308));_s=t,Il.dependencies={lanes:0,firstContext:t}}else _s=_s.next=t;return e}var Ar=null;function Uf(t){Ar===null?Ar=[t]:Ar.push(t)}function cv(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Uf(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ai(t,i)}function Ai(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var ji=!1;function Ff(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function uv(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ei(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Qi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Ze&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ai(t,n)}return r=i.interleaved,r===null?(e.next=e,Uf(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ai(t,n)}function sl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Sf(t,n)}}function op(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Ul(t,e,n,i){var r=t.updateQueue;ji=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,u=l.next;l.next=null,a===null?s=u:a.next=u,a=l;var f=t.alternate;f!==null&&(f=f.updateQueue,o=f.lastBaseUpdate,o!==a&&(o===null?f.firstBaseUpdate=u:o.next=u,f.lastBaseUpdate=l))}if(s!==null){var p=r.baseState;a=0,f=u=l=null,o=s;do{var h=o.lane,m=o.eventTime;if((i&h)===h){f!==null&&(f=f.next={eventTime:m,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var v=t,x=o;switch(h=e,m=n,x.tag){case 1:if(v=x.payload,typeof v=="function"){p=v.call(m,p,h);break e}p=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=x.payload,h=typeof v=="function"?v.call(m,p,h):v,h==null)break e;p=yt({},p,h);break e;case 2:ji=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,h=r.effects,h===null?r.effects=[o]:h.push(o))}else m={eventTime:m,lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},f===null?(u=f=m,l=p):f=f.next=m,a|=h;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;h=o,o=h.next,h.next=null,r.lastBaseUpdate=h,r.shared.pending=null}}while(!0);if(f===null&&(l=p),r.baseState=l,r.firstBaseUpdate=u,r.lastBaseUpdate=f,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Ur|=a,t.lanes=a,t.memoizedState=p}}function lp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(le(191,r));r.call(i)}}}var io={},li=cr(io),Ga=cr(io),Wa=cr(io);function Cr(t){if(t===io)throw Error(le(174));return t}function Of(t,e){switch(ct(Wa,e),ct(Ga,t),ct(li,io),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:ku(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=ku(e,t)}mt(li),ct(li,e)}function Fs(){mt(li),mt(Ga),mt(Wa)}function dv(t){Cr(Wa.current);var e=Cr(li.current),n=ku(e,t.type);e!==n&&(ct(Ga,t),ct(li,n))}function kf(t){Ga.current===t&&(mt(li),mt(Ga))}var _t=cr(0);function Fl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var kc=[];function Bf(){for(var t=0;t<kc.length;t++)kc[t]._workInProgressVersionPrimary=null;kc.length=0}var al=Pi.ReactCurrentDispatcher,Bc=Pi.ReactCurrentBatchConfig,Ir=0,xt=null,Pt=null,Ft=null,Ol=!1,Ra=!1,Xa=0,zx=0;function Xt(){throw Error(le(321))}function zf(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ei(t[n],e[n]))return!1;return!0}function jf(t,e,n,i,r,s){if(Ir=s,xt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,al.current=t===null||t.memoizedState===null?Gx:Wx,t=n(i,r),Ra){s=0;do{if(Ra=!1,Xa=0,25<=s)throw Error(le(301));s+=1,Ft=Pt=null,e.updateQueue=null,al.current=Xx,t=n(i,r)}while(Ra)}if(al.current=kl,e=Pt!==null&&Pt.next!==null,Ir=0,Ft=Pt=xt=null,Ol=!1,e)throw Error(le(300));return t}function Hf(){var t=Xa!==0;return Xa=0,t}function ni(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ft===null?xt.memoizedState=Ft=t:Ft=Ft.next=t,Ft}function Fn(){if(Pt===null){var t=xt.alternate;t=t!==null?t.memoizedState:null}else t=Pt.next;var e=Ft===null?xt.memoizedState:Ft.next;if(e!==null)Ft=e,Pt=t;else{if(t===null)throw Error(le(310));Pt=t,t={memoizedState:Pt.memoizedState,baseState:Pt.baseState,baseQueue:Pt.baseQueue,queue:Pt.queue,next:null},Ft===null?xt.memoizedState=Ft=t:Ft=Ft.next=t}return Ft}function $a(t,e){return typeof e=="function"?e(t):e}function zc(t){var e=Fn(),n=e.queue;if(n===null)throw Error(le(311));n.lastRenderedReducer=t;var i=Pt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,u=s;do{var f=u.lane;if((Ir&f)===f)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:t(i,u.action);else{var p={lane:f,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(o=l=p,a=i):l=l.next=p,xt.lanes|=f,Ur|=f}u=u.next}while(u!==null&&u!==s);l===null?a=i:l.next=o,ei(i,e.memoizedState)||(dn=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,xt.lanes|=s,Ur|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function jc(t){var e=Fn(),n=e.queue;if(n===null)throw Error(le(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);ei(s,e.memoizedState)||(dn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function fv(){}function hv(t,e){var n=xt,i=Fn(),r=e(),s=!ei(i.memoizedState,r);if(s&&(i.memoizedState=r,dn=!0),i=i.queue,Vf(gv.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ft!==null&&Ft.memoizedState.tag&1){if(n.flags|=2048,qa(9,mv.bind(null,n,i,r,e),void 0,null),Ot===null)throw Error(le(349));Ir&30||pv(n,e,r)}return r}function pv(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=xt.updateQueue,e===null?(e={lastEffect:null,stores:null},xt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function mv(t,e,n,i){e.value=n,e.getSnapshot=i,vv(e)&&_v(t)}function gv(t,e,n){return n(function(){vv(e)&&_v(t)})}function vv(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ei(t,n)}catch{return!0}}function _v(t){var e=Ai(t,1);e!==null&&Jn(e,t,1,-1)}function cp(t){var e=ni();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:$a,lastRenderedState:t},e.queue=t,t=t.dispatch=Vx.bind(null,xt,t),[e.memoizedState,t]}function qa(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=xt.updateQueue,e===null?(e={lastEffect:null,stores:null},xt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function xv(){return Fn().memoizedState}function ol(t,e,n,i){var r=ni();xt.flags|=t,r.memoizedState=qa(1|e,n,void 0,i===void 0?null:i)}function rc(t,e,n,i){var r=Fn();i=i===void 0?null:i;var s=void 0;if(Pt!==null){var a=Pt.memoizedState;if(s=a.destroy,i!==null&&zf(i,a.deps)){r.memoizedState=qa(e,n,s,i);return}}xt.flags|=t,r.memoizedState=qa(1|e,n,s,i)}function up(t,e){return ol(8390656,8,t,e)}function Vf(t,e){return rc(2048,8,t,e)}function yv(t,e){return rc(4,2,t,e)}function Sv(t,e){return rc(4,4,t,e)}function Mv(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Ev(t,e,n){return n=n!=null?n.concat([t]):null,rc(4,4,Mv.bind(null,e,t),n)}function Gf(){}function Tv(t,e){var n=Fn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&zf(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function wv(t,e){var n=Fn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&zf(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Av(t,e,n){return Ir&21?(ei(n,e)||(n=Ng(),xt.lanes|=n,Ur|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,dn=!0),t.memoizedState=n)}function jx(t,e){var n=at;at=n!==0&&4>n?n:4,t(!0);var i=Bc.transition;Bc.transition={};try{t(!1),e()}finally{at=n,Bc.transition=i}}function Cv(){return Fn().memoizedState}function Hx(t,e,n){var i=er(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Rv(t))bv(e,n);else if(n=cv(t,e,n,i),n!==null){var r=nn();Jn(n,t,i,r),Pv(n,e,i)}}function Vx(t,e,n){var i=er(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Rv(t))bv(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,ei(o,a)){var l=e.interleaved;l===null?(r.next=r,Uf(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=cv(t,e,r,i),n!==null&&(r=nn(),Jn(n,t,i,r),Pv(n,e,i))}}function Rv(t){var e=t.alternate;return t===xt||e!==null&&e===xt}function bv(t,e){Ra=Ol=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Pv(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Sf(t,n)}}var kl={readContext:Un,useCallback:Xt,useContext:Xt,useEffect:Xt,useImperativeHandle:Xt,useInsertionEffect:Xt,useLayoutEffect:Xt,useMemo:Xt,useReducer:Xt,useRef:Xt,useState:Xt,useDebugValue:Xt,useDeferredValue:Xt,useTransition:Xt,useMutableSource:Xt,useSyncExternalStore:Xt,useId:Xt,unstable_isNewReconciler:!1},Gx={readContext:Un,useCallback:function(t,e){return ni().memoizedState=[t,e===void 0?null:e],t},useContext:Un,useEffect:up,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,ol(4194308,4,Mv.bind(null,e,t),n)},useLayoutEffect:function(t,e){return ol(4194308,4,t,e)},useInsertionEffect:function(t,e){return ol(4,2,t,e)},useMemo:function(t,e){var n=ni();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=ni();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Hx.bind(null,xt,t),[i.memoizedState,t]},useRef:function(t){var e=ni();return t={current:t},e.memoizedState=t},useState:cp,useDebugValue:Gf,useDeferredValue:function(t){return ni().memoizedState=t},useTransition:function(){var t=cp(!1),e=t[0];return t=jx.bind(null,t[1]),ni().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=xt,r=ni();if(vt){if(n===void 0)throw Error(le(407));n=n()}else{if(n=e(),Ot===null)throw Error(le(349));Ir&30||pv(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,up(gv.bind(null,i,s,t),[t]),i.flags|=2048,qa(9,mv.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=ni(),e=Ot.identifierPrefix;if(vt){var n=yi,i=xi;n=(i&~(1<<32-Qn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Xa++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=zx++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Wx={readContext:Un,useCallback:Tv,useContext:Un,useEffect:Vf,useImperativeHandle:Ev,useInsertionEffect:yv,useLayoutEffect:Sv,useMemo:wv,useReducer:zc,useRef:xv,useState:function(){return zc($a)},useDebugValue:Gf,useDeferredValue:function(t){var e=Fn();return Av(e,Pt.memoizedState,t)},useTransition:function(){var t=zc($a)[0],e=Fn().memoizedState;return[t,e]},useMutableSource:fv,useSyncExternalStore:hv,useId:Cv,unstable_isNewReconciler:!1},Xx={readContext:Un,useCallback:Tv,useContext:Un,useEffect:Vf,useImperativeHandle:Ev,useInsertionEffect:yv,useLayoutEffect:Sv,useMemo:wv,useReducer:jc,useRef:xv,useState:function(){return jc($a)},useDebugValue:Gf,useDeferredValue:function(t){var e=Fn();return Pt===null?e.memoizedState=t:Av(e,Pt.memoizedState,t)},useTransition:function(){var t=jc($a)[0],e=Fn().memoizedState;return[t,e]},useMutableSource:fv,useSyncExternalStore:hv,useId:Cv,unstable_isNewReconciler:!1};function Wn(t,e){if(t&&t.defaultProps){e=yt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function sd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:yt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var sc={isMounted:function(t){return(t=t._reactInternals)?jr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=nn(),r=er(t),s=Ei(i,r);s.payload=e,n!=null&&(s.callback=n),e=Qi(t,s,r),e!==null&&(Jn(e,t,r,i),sl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=nn(),r=er(t),s=Ei(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Qi(t,s,r),e!==null&&(Jn(e,t,r,i),sl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=nn(),i=er(t),r=Ei(n,i);r.tag=2,e!=null&&(r.callback=e),e=Qi(t,r,i),e!==null&&(Jn(e,t,i,n),sl(e,t,i))}};function dp(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!za(n,i)||!za(r,s):!0}function Nv(t,e,n){var i=!1,r=sr,s=e.contextType;return typeof s=="object"&&s!==null?s=Un(s):(r=pn(e)?Lr:Qt.current,i=e.contextTypes,s=(i=i!=null)?Ds(t,r):sr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=sc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function fp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&sc.enqueueReplaceState(e,e.state,null)}function ad(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Ff(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Un(s):(s=pn(e)?Lr:Qt.current,r.context=Ds(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(sd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&sc.enqueueReplaceState(r,r.state,null),Ul(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Os(t,e){try{var n="",i=e;do n+=y_(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Hc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function od(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var $x=typeof WeakMap=="function"?WeakMap:Map;function Lv(t,e,n){n=Ei(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){zl||(zl=!0,vd=i),od(t,e)},n}function Dv(t,e,n){n=Ei(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){od(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){od(t,e),typeof i!="function"&&(Ji===null?Ji=new Set([this]):Ji.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function hp(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new $x;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=oy.bind(null,t,e,n),e.then(t,t))}function pp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function mp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ei(-1,1),e.tag=2,Qi(n,e,1))),n.lanes|=1),t)}var qx=Pi.ReactCurrentOwner,dn=!1;function tn(t,e,n,i){e.child=t===null?lv(e,null,n,i):Us(e,t.child,n,i)}function gp(t,e,n,i,r){n=n.render;var s=e.ref;return As(e,r),i=jf(t,e,n,i,s,r),n=Hf(),t!==null&&!dn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ci(t,e,r)):(vt&&n&&bf(e),e.flags|=1,tn(t,e,i,r),e.child)}function vp(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Qf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,Iv(t,e,s,i,r)):(t=dl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:za,n(a,i)&&t.ref===e.ref)return Ci(t,e,r)}return e.flags|=1,t=tr(s,i),t.ref=e.ref,t.return=e,e.child=t}function Iv(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(za(s,i)&&t.ref===e.ref)if(dn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(dn=!0);else return e.lanes=t.lanes,Ci(t,e,r)}return ld(t,e,n,i,r)}function Uv(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ct(ys,yn),yn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ct(ys,yn),yn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ct(ys,yn),yn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ct(ys,yn),yn|=i;return tn(t,e,r,n),e.child}function Fv(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function ld(t,e,n,i,r){var s=pn(n)?Lr:Qt.current;return s=Ds(e,s),As(e,r),n=jf(t,e,n,i,s,r),i=Hf(),t!==null&&!dn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ci(t,e,r)):(vt&&i&&bf(e),e.flags|=1,tn(t,e,n,r),e.child)}function _p(t,e,n,i,r){if(pn(n)){var s=!0;Pl(e)}else s=!1;if(As(e,r),e.stateNode===null)ll(t,e),Nv(e,n,i),ad(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,u=n.contextType;typeof u=="object"&&u!==null?u=Un(u):(u=pn(n)?Lr:Qt.current,u=Ds(e,u));var f=n.getDerivedStateFromProps,p=typeof f=="function"||typeof a.getSnapshotBeforeUpdate=="function";p||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==u)&&fp(e,a,i,u),ji=!1;var h=e.memoizedState;a.state=h,Ul(e,i,a,r),l=e.memoizedState,o!==i||h!==l||hn.current||ji?(typeof f=="function"&&(sd(e,n,f,i),l=e.memoizedState),(o=ji||dp(e,n,o,i,h,l,u))?(p||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=u,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,uv(t,e),o=e.memoizedProps,u=e.type===e.elementType?o:Wn(e.type,o),a.props=u,p=e.pendingProps,h=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Un(l):(l=pn(n)?Lr:Qt.current,l=Ds(e,l));var m=n.getDerivedStateFromProps;(f=typeof m=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==p||h!==l)&&fp(e,a,i,l),ji=!1,h=e.memoizedState,a.state=h,Ul(e,i,a,r);var v=e.memoizedState;o!==p||h!==v||hn.current||ji?(typeof m=="function"&&(sd(e,n,m,i),v=e.memoizedState),(u=ji||dp(e,n,u,i,h,v,l)||!1)?(f||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,v,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,v,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),a.props=i,a.state=v,a.context=l,i=u):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),i=!1)}return cd(t,e,n,i,s,r)}function cd(t,e,n,i,r,s){Fv(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&ip(e,n,!1),Ci(t,e,s);i=e.stateNode,qx.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=Us(e,t.child,null,s),e.child=Us(e,null,o,s)):tn(t,e,o,s),e.memoizedState=i.state,r&&ip(e,n,!0),e.child}function Ov(t){var e=t.stateNode;e.pendingContext?np(t,e.pendingContext,e.pendingContext!==e.context):e.context&&np(t,e.context,!1),Of(t,e.containerInfo)}function xp(t,e,n,i,r){return Is(),Nf(r),e.flags|=256,tn(t,e,n,i),e.child}var ud={dehydrated:null,treeContext:null,retryLane:0};function dd(t){return{baseLanes:t,cachePool:null,transitions:null}}function kv(t,e,n){var i=e.pendingProps,r=_t.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ct(_t,r&1),t===null)return id(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=lc(a,i,0,null),t=Nr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=dd(n),e.memoizedState=ud,t):Wf(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return Yx(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=tr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=tr(o,s):(s=Nr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?dd(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=ud,i}return s=t.child,t=s.sibling,i=tr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Wf(t,e){return e=lc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function So(t,e,n,i){return i!==null&&Nf(i),Us(e,t.child,null,n),t=Wf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Yx(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Hc(Error(le(422))),So(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=lc({mode:"visible",children:i.children},r,0,null),s=Nr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Us(e,t.child,null,a),e.child.memoizedState=dd(a),e.memoizedState=ud,s);if(!(e.mode&1))return So(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(le(419)),i=Hc(s,i,void 0),So(t,e,a,i)}if(o=(a&t.childLanes)!==0,dn||o){if(i=Ot,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ai(t,r),Jn(i,t,r,-1))}return Zf(),i=Hc(Error(le(421))),So(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=ly.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Sn=Zi(r.nextSibling),Mn=e,vt=!0,$n=null,t!==null&&(Pn[Nn++]=xi,Pn[Nn++]=yi,Pn[Nn++]=Dr,xi=t.id,yi=t.overflow,Dr=e),e=Wf(e,i.children),e.flags|=4096,e)}function yp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),rd(t.return,e,n)}function Vc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function Bv(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(tn(t,e,i.children,n),i=_t.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&yp(t,n,e);else if(t.tag===19)yp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ct(_t,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Fl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Vc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Fl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Vc(e,!0,n,null,s);break;case"together":Vc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function ll(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Ci(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Ur|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(le(153));if(e.child!==null){for(t=e.child,n=tr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=tr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Kx(t,e,n){switch(e.tag){case 3:Ov(e),Is();break;case 5:dv(e);break;case 1:pn(e.type)&&Pl(e);break;case 4:Of(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ct(Dl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ct(_t,_t.current&1),e.flags|=128,null):n&e.child.childLanes?kv(t,e,n):(ct(_t,_t.current&1),t=Ci(t,e,n),t!==null?t.sibling:null);ct(_t,_t.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return Bv(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ct(_t,_t.current),i)break;return null;case 22:case 23:return e.lanes=0,Uv(t,e,n)}return Ci(t,e,n)}var zv,fd,jv,Hv;zv=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};fd=function(){};jv=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Cr(li.current);var s=null;switch(n){case"input":r=Iu(t,r),i=Iu(t,i),s=[];break;case"select":r=yt({},r,{value:void 0}),i=yt({},i,{value:void 0}),s=[];break;case"textarea":r=Ou(t,r),i=Ou(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Rl)}Bu(n,i);var a;n=null;for(u in r)if(!i.hasOwnProperty(u)&&r.hasOwnProperty(u)&&r[u]!=null)if(u==="style"){var o=r[u];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Da.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in i){var l=i[u];if(o=r!=null?r[u]:void 0,i.hasOwnProperty(u)&&l!==o&&(l!=null||o!=null))if(u==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(u,n)),n=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Da.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&ht("scroll",t),s||o===l||(s=[])):(s=s||[]).push(u,l))}n&&(s=s||[]).push("style",n);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};Hv=function(t,e,n,i){n!==i&&(e.flags|=4)};function aa(t,e){if(!vt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function $t(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Zx(t,e,n){var i=e.pendingProps;switch(Pf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $t(e),null;case 1:return pn(e.type)&&bl(),$t(e),null;case 3:return i=e.stateNode,Fs(),mt(hn),mt(Qt),Bf(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(xo(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,$n!==null&&(yd($n),$n=null))),fd(t,e),$t(e),null;case 5:kf(e);var r=Cr(Wa.current);if(n=e.type,t!==null&&e.stateNode!=null)jv(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(le(166));return $t(e),null}if(t=Cr(li.current),xo(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[si]=e,i[Va]=s,t=(e.mode&1)!==0,n){case"dialog":ht("cancel",i),ht("close",i);break;case"iframe":case"object":case"embed":ht("load",i);break;case"video":case"audio":for(r=0;r<ya.length;r++)ht(ya[r],i);break;case"source":ht("error",i);break;case"img":case"image":case"link":ht("error",i),ht("load",i);break;case"details":ht("toggle",i);break;case"input":bh(i,s),ht("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ht("invalid",i);break;case"textarea":Nh(i,s),ht("invalid",i)}Bu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&_o(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&_o(i.textContent,o,t),r=["children",""+o]):Da.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&ht("scroll",i)}switch(n){case"input":co(i),Ph(i,s,!0);break;case"textarea":co(i),Lh(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Rl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=gg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[si]=e,t[Va]=i,zv(t,e,!1,!1),e.stateNode=t;e:{switch(a=zu(n,i),n){case"dialog":ht("cancel",t),ht("close",t),r=i;break;case"iframe":case"object":case"embed":ht("load",t),r=i;break;case"video":case"audio":for(r=0;r<ya.length;r++)ht(ya[r],t);r=i;break;case"source":ht("error",t),r=i;break;case"img":case"image":case"link":ht("error",t),ht("load",t),r=i;break;case"details":ht("toggle",t),r=i;break;case"input":bh(t,i),r=Iu(t,i),ht("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=yt({},i,{value:void 0}),ht("invalid",t);break;case"textarea":Nh(t,i),r=Ou(t,i),ht("invalid",t);break;default:r=i}Bu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?xg(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&vg(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Ia(t,l):typeof l=="number"&&Ia(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Da.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ht("scroll",t):l!=null&&mf(t,s,l,a))}switch(n){case"input":co(t),Ph(t,i,!1);break;case"textarea":co(t),Lh(t);break;case"option":i.value!=null&&t.setAttribute("value",""+rr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Ms(t,!!i.multiple,s,!1):i.defaultValue!=null&&Ms(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Rl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return $t(e),null;case 6:if(t&&e.stateNode!=null)Hv(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(le(166));if(n=Cr(Wa.current),Cr(li.current),xo(e)){if(i=e.stateNode,n=e.memoizedProps,i[si]=e,(s=i.nodeValue!==n)&&(t=Mn,t!==null))switch(t.tag){case 3:_o(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&_o(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[si]=e,e.stateNode=i}return $t(e),null;case 13:if(mt(_t),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(vt&&Sn!==null&&e.mode&1&&!(e.flags&128))av(),Is(),e.flags|=98560,s=!1;else if(s=xo(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(le(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(le(317));s[si]=e}else Is(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;$t(e),s=!1}else $n!==null&&(yd($n),$n=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||_t.current&1?Nt===0&&(Nt=3):Zf())),e.updateQueue!==null&&(e.flags|=4),$t(e),null);case 4:return Fs(),fd(t,e),t===null&&ja(e.stateNode.containerInfo),$t(e),null;case 10:return If(e.type._context),$t(e),null;case 17:return pn(e.type)&&bl(),$t(e),null;case 19:if(mt(_t),s=e.memoizedState,s===null)return $t(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)aa(s,!1);else{if(Nt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Fl(t),a!==null){for(e.flags|=128,aa(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ct(_t,_t.current&1|2),e.child}t=t.sibling}s.tail!==null&&Ct()>ks&&(e.flags|=128,i=!0,aa(s,!1),e.lanes=4194304)}else{if(!i)if(t=Fl(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),aa(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!vt)return $t(e),null}else 2*Ct()-s.renderingStartTime>ks&&n!==1073741824&&(e.flags|=128,i=!0,aa(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Ct(),e.sibling=null,n=_t.current,ct(_t,i?n&1|2:n&1),e):($t(e),null);case 22:case 23:return Kf(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?yn&1073741824&&($t(e),e.subtreeFlags&6&&(e.flags|=8192)):$t(e),null;case 24:return null;case 25:return null}throw Error(le(156,e.tag))}function Qx(t,e){switch(Pf(e),e.tag){case 1:return pn(e.type)&&bl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Fs(),mt(hn),mt(Qt),Bf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return kf(e),null;case 13:if(mt(_t),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(le(340));Is()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return mt(_t),null;case 4:return Fs(),null;case 10:return If(e.type._context),null;case 22:case 23:return Kf(),null;case 24:return null;default:return null}}var Mo=!1,Kt=!1,Jx=typeof WeakSet=="function"?WeakSet:Set,ye=null;function xs(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Et(t,e,i)}else n.current=null}function hd(t,e,n){try{n()}catch(i){Et(t,e,i)}}var Sp=!1;function ey(t,e){if(Ku=wl,t=$g(),Rf(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,u=0,f=0,p=t,h=null;t:for(;;){for(var m;p!==n||r!==0&&p.nodeType!==3||(o=a+r),p!==s||i!==0&&p.nodeType!==3||(l=a+i),p.nodeType===3&&(a+=p.nodeValue.length),(m=p.firstChild)!==null;)h=p,p=m;for(;;){if(p===t)break t;if(h===n&&++u===r&&(o=a),h===s&&++f===i&&(l=a),(m=p.nextSibling)!==null)break;p=h,h=p.parentNode}p=m}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Zu={focusedElem:t,selectionRange:n},wl=!1,ye=e;ye!==null;)if(e=ye,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,ye=t;else for(;ye!==null;){e=ye;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var x=v.memoizedProps,g=v.memoizedState,d=e.stateNode,_=d.getSnapshotBeforeUpdate(e.elementType===e.type?x:Wn(e.type,x),g);d.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var y=e.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(le(163))}}catch(T){Et(e,e.return,T)}if(t=e.sibling,t!==null){t.return=e.return,ye=t;break}ye=e.return}return v=Sp,Sp=!1,v}function ba(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&hd(e,n,s)}r=r.next}while(r!==i)}}function ac(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function pd(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function Vv(t){var e=t.alternate;e!==null&&(t.alternate=null,Vv(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[si],delete e[Va],delete e[ed],delete e[Fx],delete e[Ox])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Gv(t){return t.tag===5||t.tag===3||t.tag===4}function Mp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Gv(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function md(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Rl));else if(i!==4&&(t=t.child,t!==null))for(md(t,e,n),t=t.sibling;t!==null;)md(t,e,n),t=t.sibling}function gd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(gd(t,e,n),t=t.sibling;t!==null;)gd(t,e,n),t=t.sibling}var jt=null,Xn=!1;function Di(t,e,n){for(n=n.child;n!==null;)Wv(t,e,n),n=n.sibling}function Wv(t,e,n){if(oi&&typeof oi.onCommitFiberUnmount=="function")try{oi.onCommitFiberUnmount(Ql,n)}catch{}switch(n.tag){case 5:Kt||xs(n,e);case 6:var i=jt,r=Xn;jt=null,Di(t,e,n),jt=i,Xn=r,jt!==null&&(Xn?(t=jt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):jt.removeChild(n.stateNode));break;case 18:jt!==null&&(Xn?(t=jt,n=n.stateNode,t.nodeType===8?Fc(t.parentNode,n):t.nodeType===1&&Fc(t,n),ka(t)):Fc(jt,n.stateNode));break;case 4:i=jt,r=Xn,jt=n.stateNode.containerInfo,Xn=!0,Di(t,e,n),jt=i,Xn=r;break;case 0:case 11:case 14:case 15:if(!Kt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&hd(n,e,a),r=r.next}while(r!==i)}Di(t,e,n);break;case 1:if(!Kt&&(xs(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){Et(n,e,o)}Di(t,e,n);break;case 21:Di(t,e,n);break;case 22:n.mode&1?(Kt=(i=Kt)||n.memoizedState!==null,Di(t,e,n),Kt=i):Di(t,e,n);break;default:Di(t,e,n)}}function Ep(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new Jx),e.forEach(function(i){var r=cy.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function jn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:jt=o.stateNode,Xn=!1;break e;case 3:jt=o.stateNode.containerInfo,Xn=!0;break e;case 4:jt=o.stateNode.containerInfo,Xn=!0;break e}o=o.return}if(jt===null)throw Error(le(160));Wv(s,a,r),jt=null,Xn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(u){Et(r,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Xv(e,t),e=e.sibling}function Xv(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(jn(e,t),ti(t),i&4){try{ba(3,t,t.return),ac(3,t)}catch(x){Et(t,t.return,x)}try{ba(5,t,t.return)}catch(x){Et(t,t.return,x)}}break;case 1:jn(e,t),ti(t),i&512&&n!==null&&xs(n,n.return);break;case 5:if(jn(e,t),ti(t),i&512&&n!==null&&xs(n,n.return),t.flags&32){var r=t.stateNode;try{Ia(r,"")}catch(x){Et(t,t.return,x)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&pg(r,s),zu(o,a);var u=zu(o,s);for(a=0;a<l.length;a+=2){var f=l[a],p=l[a+1];f==="style"?xg(r,p):f==="dangerouslySetInnerHTML"?vg(r,p):f==="children"?Ia(r,p):mf(r,f,p,u)}switch(o){case"input":Uu(r,s);break;case"textarea":mg(r,s);break;case"select":var h=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?Ms(r,!!s.multiple,m,!1):h!==!!s.multiple&&(s.defaultValue!=null?Ms(r,!!s.multiple,s.defaultValue,!0):Ms(r,!!s.multiple,s.multiple?[]:"",!1))}r[Va]=s}catch(x){Et(t,t.return,x)}}break;case 6:if(jn(e,t),ti(t),i&4){if(t.stateNode===null)throw Error(le(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(x){Et(t,t.return,x)}}break;case 3:if(jn(e,t),ti(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{ka(e.containerInfo)}catch(x){Et(t,t.return,x)}break;case 4:jn(e,t),ti(t);break;case 13:jn(e,t),ti(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(qf=Ct())),i&4&&Ep(t);break;case 22:if(f=n!==null&&n.memoizedState!==null,t.mode&1?(Kt=(u=Kt)||f,jn(e,t),Kt=u):jn(e,t),ti(t),i&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!f&&t.mode&1)for(ye=t,f=t.child;f!==null;){for(p=ye=f;ye!==null;){switch(h=ye,m=h.child,h.tag){case 0:case 11:case 14:case 15:ba(4,h,h.return);break;case 1:xs(h,h.return);var v=h.stateNode;if(typeof v.componentWillUnmount=="function"){i=h,n=h.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(x){Et(i,n,x)}}break;case 5:xs(h,h.return);break;case 22:if(h.memoizedState!==null){wp(p);continue}}m!==null?(m.return=h,ye=m):wp(p)}f=f.sibling}e:for(f=null,p=t;;){if(p.tag===5){if(f===null){f=p;try{r=p.stateNode,u?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=p.stateNode,l=p.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=_g("display",a))}catch(x){Et(t,t.return,x)}}}else if(p.tag===6){if(f===null)try{p.stateNode.nodeValue=u?"":p.memoizedProps}catch(x){Et(t,t.return,x)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;f===p&&(f=null),p=p.return}f===p&&(f=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:jn(e,t),ti(t),i&4&&Ep(t);break;case 21:break;default:jn(e,t),ti(t)}}function ti(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(Gv(n)){var i=n;break e}n=n.return}throw Error(le(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Ia(r,""),i.flags&=-33);var s=Mp(t);gd(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=Mp(t);md(t,o,a);break;default:throw Error(le(161))}}catch(l){Et(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function ty(t,e,n){ye=t,$v(t)}function $v(t,e,n){for(var i=(t.mode&1)!==0;ye!==null;){var r=ye,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||Mo;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||Kt;o=Mo;var u=Kt;if(Mo=a,(Kt=l)&&!u)for(ye=r;ye!==null;)a=ye,l=a.child,a.tag===22&&a.memoizedState!==null?Ap(r):l!==null?(l.return=a,ye=l):Ap(r);for(;s!==null;)ye=s,$v(s),s=s.sibling;ye=r,Mo=o,Kt=u}Tp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,ye=s):Tp(t)}}function Tp(t){for(;ye!==null;){var e=ye;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Kt||ac(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Kt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Wn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&lp(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}lp(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var f=u.memoizedState;if(f!==null){var p=f.dehydrated;p!==null&&ka(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(le(163))}Kt||e.flags&512&&pd(e)}catch(h){Et(e,e.return,h)}}if(e===t){ye=null;break}if(n=e.sibling,n!==null){n.return=e.return,ye=n;break}ye=e.return}}function wp(t){for(;ye!==null;){var e=ye;if(e===t){ye=null;break}var n=e.sibling;if(n!==null){n.return=e.return,ye=n;break}ye=e.return}}function Ap(t){for(;ye!==null;){var e=ye;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{ac(4,e)}catch(l){Et(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Et(e,r,l)}}var s=e.return;try{pd(e)}catch(l){Et(e,s,l)}break;case 5:var a=e.return;try{pd(e)}catch(l){Et(e,a,l)}}}catch(l){Et(e,e.return,l)}if(e===t){ye=null;break}var o=e.sibling;if(o!==null){o.return=e.return,ye=o;break}ye=e.return}}var ny=Math.ceil,Bl=Pi.ReactCurrentDispatcher,Xf=Pi.ReactCurrentOwner,In=Pi.ReactCurrentBatchConfig,Ze=0,Ot=null,bt=null,Vt=0,yn=0,ys=cr(0),Nt=0,Ya=null,Ur=0,oc=0,$f=0,Pa=null,un=null,qf=0,ks=1/0,gi=null,zl=!1,vd=null,Ji=null,Eo=!1,Xi=null,jl=0,Na=0,_d=null,cl=-1,ul=0;function nn(){return Ze&6?Ct():cl!==-1?cl:cl=Ct()}function er(t){return t.mode&1?Ze&2&&Vt!==0?Vt&-Vt:Bx.transition!==null?(ul===0&&(ul=Ng()),ul):(t=at,t!==0||(t=window.event,t=t===void 0?16:kg(t.type)),t):1}function Jn(t,e,n,i){if(50<Na)throw Na=0,_d=null,Error(le(185));eo(t,n,i),(!(Ze&2)||t!==Ot)&&(t===Ot&&(!(Ze&2)&&(oc|=n),Nt===4&&Vi(t,Vt)),mn(t,i),n===1&&Ze===0&&!(e.mode&1)&&(ks=Ct()+500,ic&&ur()))}function mn(t,e){var n=t.callbackNode;B_(t,e);var i=Tl(t,t===Ot?Vt:0);if(i===0)n!==null&&Uh(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Uh(n),e===1)t.tag===0?kx(Cp.bind(null,t)):iv(Cp.bind(null,t)),Ix(function(){!(Ze&6)&&ur()}),n=null;else{switch(Lg(i)){case 1:n=yf;break;case 4:n=bg;break;case 16:n=El;break;case 536870912:n=Pg;break;default:n=El}n=t0(n,qv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function qv(t,e){if(cl=-1,ul=0,Ze&6)throw Error(le(327));var n=t.callbackNode;if(Cs()&&t.callbackNode!==n)return null;var i=Tl(t,t===Ot?Vt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Hl(t,i);else{e=i;var r=Ze;Ze|=2;var s=Kv();(Ot!==t||Vt!==e)&&(gi=null,ks=Ct()+500,Pr(t,e));do try{sy();break}catch(o){Yv(t,o)}while(!0);Df(),Bl.current=s,Ze=r,bt!==null?e=0:(Ot=null,Vt=0,e=Nt)}if(e!==0){if(e===2&&(r=Wu(t),r!==0&&(i=r,e=xd(t,r))),e===1)throw n=Ya,Pr(t,0),Vi(t,i),mn(t,Ct()),n;if(e===6)Vi(t,i);else{if(r=t.current.alternate,!(i&30)&&!iy(r)&&(e=Hl(t,i),e===2&&(s=Wu(t),s!==0&&(i=s,e=xd(t,s))),e===1))throw n=Ya,Pr(t,0),Vi(t,i),mn(t,Ct()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(le(345));case 2:yr(t,un,gi);break;case 3:if(Vi(t,i),(i&130023424)===i&&(e=qf+500-Ct(),10<e)){if(Tl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){nn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Ju(yr.bind(null,t,un,gi),e);break}yr(t,un,gi);break;case 4:if(Vi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Qn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Ct()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*ny(i/1960))-i,10<i){t.timeoutHandle=Ju(yr.bind(null,t,un,gi),i);break}yr(t,un,gi);break;case 5:yr(t,un,gi);break;default:throw Error(le(329))}}}return mn(t,Ct()),t.callbackNode===n?qv.bind(null,t):null}function xd(t,e){var n=Pa;return t.current.memoizedState.isDehydrated&&(Pr(t,e).flags|=256),t=Hl(t,e),t!==2&&(e=un,un=n,e!==null&&yd(e)),t}function yd(t){un===null?un=t:un.push.apply(un,t)}function iy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ei(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Vi(t,e){for(e&=~$f,e&=~oc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Qn(e),i=1<<n;t[n]=-1,e&=~i}}function Cp(t){if(Ze&6)throw Error(le(327));Cs();var e=Tl(t,0);if(!(e&1))return mn(t,Ct()),null;var n=Hl(t,e);if(t.tag!==0&&n===2){var i=Wu(t);i!==0&&(e=i,n=xd(t,i))}if(n===1)throw n=Ya,Pr(t,0),Vi(t,e),mn(t,Ct()),n;if(n===6)throw Error(le(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,yr(t,un,gi),mn(t,Ct()),null}function Yf(t,e){var n=Ze;Ze|=1;try{return t(e)}finally{Ze=n,Ze===0&&(ks=Ct()+500,ic&&ur())}}function Fr(t){Xi!==null&&Xi.tag===0&&!(Ze&6)&&Cs();var e=Ze;Ze|=1;var n=In.transition,i=at;try{if(In.transition=null,at=1,t)return t()}finally{at=i,In.transition=n,Ze=e,!(Ze&6)&&ur()}}function Kf(){yn=ys.current,mt(ys)}function Pr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,Dx(n)),bt!==null)for(n=bt.return;n!==null;){var i=n;switch(Pf(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&bl();break;case 3:Fs(),mt(hn),mt(Qt),Bf();break;case 5:kf(i);break;case 4:Fs();break;case 13:mt(_t);break;case 19:mt(_t);break;case 10:If(i.type._context);break;case 22:case 23:Kf()}n=n.return}if(Ot=t,bt=t=tr(t.current,null),Vt=yn=e,Nt=0,Ya=null,$f=oc=Ur=0,un=Pa=null,Ar!==null){for(e=0;e<Ar.length;e++)if(n=Ar[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}Ar=null}return t}function Yv(t,e){do{var n=bt;try{if(Df(),al.current=kl,Ol){for(var i=xt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Ol=!1}if(Ir=0,Ft=Pt=xt=null,Ra=!1,Xa=0,Xf.current=null,n===null||n.return===null){Nt=1,Ya=e,bt=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=Vt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,f=o,p=f.tag;if(!(f.mode&1)&&(p===0||p===11||p===15)){var h=f.alternate;h?(f.updateQueue=h.updateQueue,f.memoizedState=h.memoizedState,f.lanes=h.lanes):(f.updateQueue=null,f.memoizedState=null)}var m=pp(a);if(m!==null){m.flags&=-257,mp(m,a,o,s,e),m.mode&1&&hp(s,u,e),e=m,l=u;var v=e.updateQueue;if(v===null){var x=new Set;x.add(l),e.updateQueue=x}else v.add(l);break e}else{if(!(e&1)){hp(s,u,e),Zf();break e}l=Error(le(426))}}else if(vt&&o.mode&1){var g=pp(a);if(g!==null){!(g.flags&65536)&&(g.flags|=256),mp(g,a,o,s,e),Nf(Os(l,o));break e}}s=l=Os(l,o),Nt!==4&&(Nt=2),Pa===null?Pa=[s]:Pa.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=Lv(s,l,e);op(s,d);break e;case 1:o=l;var _=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(Ji===null||!Ji.has(y)))){s.flags|=65536,e&=-e,s.lanes|=e;var T=Dv(s,o,e);op(s,T);break e}}s=s.return}while(s!==null)}Qv(n)}catch(P){e=P,bt===n&&n!==null&&(bt=n=n.return);continue}break}while(!0)}function Kv(){var t=Bl.current;return Bl.current=kl,t===null?kl:t}function Zf(){(Nt===0||Nt===3||Nt===2)&&(Nt=4),Ot===null||!(Ur&268435455)&&!(oc&268435455)||Vi(Ot,Vt)}function Hl(t,e){var n=Ze;Ze|=2;var i=Kv();(Ot!==t||Vt!==e)&&(gi=null,Pr(t,e));do try{ry();break}catch(r){Yv(t,r)}while(!0);if(Df(),Ze=n,Bl.current=i,bt!==null)throw Error(le(261));return Ot=null,Vt=0,Nt}function ry(){for(;bt!==null;)Zv(bt)}function sy(){for(;bt!==null&&!P_();)Zv(bt)}function Zv(t){var e=e0(t.alternate,t,yn);t.memoizedProps=t.pendingProps,e===null?Qv(t):bt=e,Xf.current=null}function Qv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=Qx(n,e),n!==null){n.flags&=32767,bt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Nt=6,bt=null;return}}else if(n=Zx(n,e,yn),n!==null){bt=n;return}if(e=e.sibling,e!==null){bt=e;return}bt=e=t}while(e!==null);Nt===0&&(Nt=5)}function yr(t,e,n){var i=at,r=In.transition;try{In.transition=null,at=1,ay(t,e,n,i)}finally{In.transition=r,at=i}return null}function ay(t,e,n,i){do Cs();while(Xi!==null);if(Ze&6)throw Error(le(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(le(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(z_(t,s),t===Ot&&(bt=Ot=null,Vt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Eo||(Eo=!0,t0(El,function(){return Cs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=In.transition,In.transition=null;var a=at;at=1;var o=Ze;Ze|=4,Xf.current=null,ey(t,n),Xv(n,t),Ax(Zu),wl=!!Ku,Zu=Ku=null,t.current=n,ty(n),N_(),Ze=o,at=a,In.transition=s}else t.current=n;if(Eo&&(Eo=!1,Xi=t,jl=r),s=t.pendingLanes,s===0&&(Ji=null),I_(n.stateNode),mn(t,Ct()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(zl)throw zl=!1,t=vd,vd=null,t;return jl&1&&t.tag!==0&&Cs(),s=t.pendingLanes,s&1?t===_d?Na++:(Na=0,_d=t):Na=0,ur(),null}function Cs(){if(Xi!==null){var t=Lg(jl),e=In.transition,n=at;try{if(In.transition=null,at=16>t?16:t,Xi===null)var i=!1;else{if(t=Xi,Xi=null,jl=0,Ze&6)throw Error(le(331));var r=Ze;for(Ze|=4,ye=t.current;ye!==null;){var s=ye,a=s.child;if(ye.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var u=o[l];for(ye=u;ye!==null;){var f=ye;switch(f.tag){case 0:case 11:case 15:ba(8,f,s)}var p=f.child;if(p!==null)p.return=f,ye=p;else for(;ye!==null;){f=ye;var h=f.sibling,m=f.return;if(Vv(f),f===u){ye=null;break}if(h!==null){h.return=m,ye=h;break}ye=m}}}var v=s.alternate;if(v!==null){var x=v.child;if(x!==null){v.child=null;do{var g=x.sibling;x.sibling=null,x=g}while(x!==null)}}ye=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,ye=a;else e:for(;ye!==null;){if(s=ye,s.flags&2048)switch(s.tag){case 0:case 11:case 15:ba(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,ye=d;break e}ye=s.return}}var _=t.current;for(ye=_;ye!==null;){a=ye;var y=a.child;if(a.subtreeFlags&2064&&y!==null)y.return=a,ye=y;else e:for(a=_;ye!==null;){if(o=ye,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:ac(9,o)}}catch(P){Et(o,o.return,P)}if(o===a){ye=null;break e}var T=o.sibling;if(T!==null){T.return=o.return,ye=T;break e}ye=o.return}}if(Ze=r,ur(),oi&&typeof oi.onPostCommitFiberRoot=="function")try{oi.onPostCommitFiberRoot(Ql,t)}catch{}i=!0}return i}finally{at=n,In.transition=e}}return!1}function Rp(t,e,n){e=Os(n,e),e=Lv(t,e,1),t=Qi(t,e,1),e=nn(),t!==null&&(eo(t,1,e),mn(t,e))}function Et(t,e,n){if(t.tag===3)Rp(t,t,n);else for(;e!==null;){if(e.tag===3){Rp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ji===null||!Ji.has(i))){t=Os(n,t),t=Dv(e,t,1),e=Qi(e,t,1),t=nn(),e!==null&&(eo(e,1,t),mn(e,t));break}}e=e.return}}function oy(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=nn(),t.pingedLanes|=t.suspendedLanes&n,Ot===t&&(Vt&n)===n&&(Nt===4||Nt===3&&(Vt&130023424)===Vt&&500>Ct()-qf?Pr(t,0):$f|=n),mn(t,e)}function Jv(t,e){e===0&&(t.mode&1?(e=ho,ho<<=1,!(ho&130023424)&&(ho=4194304)):e=1);var n=nn();t=Ai(t,e),t!==null&&(eo(t,e,n),mn(t,n))}function ly(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Jv(t,n)}function cy(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(le(314))}i!==null&&i.delete(e),Jv(t,n)}var e0;e0=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||hn.current)dn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return dn=!1,Kx(t,e,n);dn=!!(t.flags&131072)}else dn=!1,vt&&e.flags&1048576&&rv(e,Ll,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;ll(t,e),t=e.pendingProps;var r=Ds(e,Qt.current);As(e,n),r=jf(null,e,i,t,r,n);var s=Hf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,pn(i)?(s=!0,Pl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Ff(e),r.updater=sc,e.stateNode=r,r._reactInternals=e,ad(e,i,t,n),e=cd(null,e,i,!0,s,n)):(e.tag=0,vt&&s&&bf(e),tn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(ll(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=dy(i),t=Wn(i,t),r){case 0:e=ld(null,e,i,t,n);break e;case 1:e=_p(null,e,i,t,n);break e;case 11:e=gp(null,e,i,t,n);break e;case 14:e=vp(null,e,i,Wn(i.type,t),n);break e}throw Error(le(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Wn(i,r),ld(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Wn(i,r),_p(t,e,i,r,n);case 3:e:{if(Ov(e),t===null)throw Error(le(387));i=e.pendingProps,s=e.memoizedState,r=s.element,uv(t,e),Ul(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Os(Error(le(423)),e),e=xp(t,e,i,n,r);break e}else if(i!==r){r=Os(Error(le(424)),e),e=xp(t,e,i,n,r);break e}else for(Sn=Zi(e.stateNode.containerInfo.firstChild),Mn=e,vt=!0,$n=null,n=lv(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Is(),i===r){e=Ci(t,e,n);break e}tn(t,e,i,n)}e=e.child}return e;case 5:return dv(e),t===null&&id(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,Qu(i,r)?a=null:s!==null&&Qu(i,s)&&(e.flags|=32),Fv(t,e),tn(t,e,a,n),e.child;case 6:return t===null&&id(e),null;case 13:return kv(t,e,n);case 4:return Of(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Us(e,null,i,n):tn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Wn(i,r),gp(t,e,i,r,n);case 7:return tn(t,e,e.pendingProps,n),e.child;case 8:return tn(t,e,e.pendingProps.children,n),e.child;case 12:return tn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,ct(Dl,i._currentValue),i._currentValue=a,s!==null)if(ei(s.value,a)){if(s.children===r.children&&!hn.current){e=Ci(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ei(-1,n&-n),l.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var f=u.pending;f===null?l.next=l:(l.next=f.next,f.next=l),u.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),rd(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(le(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),rd(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}tn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,As(e,n),r=Un(r),i=i(r),e.flags|=1,tn(t,e,i,n),e.child;case 14:return i=e.type,r=Wn(i,e.pendingProps),r=Wn(i.type,r),vp(t,e,i,r,n);case 15:return Iv(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Wn(i,r),ll(t,e),e.tag=1,pn(i)?(t=!0,Pl(e)):t=!1,As(e,n),Nv(e,i,r),ad(e,i,r,n),cd(null,e,i,!0,t,n);case 19:return Bv(t,e,n);case 22:return Uv(t,e,n)}throw Error(le(156,e.tag))};function t0(t,e){return Rg(t,e)}function uy(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Dn(t,e,n,i){return new uy(t,e,n,i)}function Qf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function dy(t){if(typeof t=="function")return Qf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===vf)return 11;if(t===_f)return 14}return 2}function tr(t,e){var n=t.alternate;return n===null?(n=Dn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function dl(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")Qf(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case us:return Nr(n.children,r,s,e);case gf:a=8,r|=8;break;case Pu:return t=Dn(12,n,e,r|2),t.elementType=Pu,t.lanes=s,t;case Nu:return t=Dn(13,n,e,r),t.elementType=Nu,t.lanes=s,t;case Lu:return t=Dn(19,n,e,r),t.elementType=Lu,t.lanes=s,t;case dg:return lc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case cg:a=10;break e;case ug:a=9;break e;case vf:a=11;break e;case _f:a=14;break e;case zi:a=16,i=null;break e}throw Error(le(130,t==null?t:typeof t,""))}return e=Dn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Nr(t,e,n,i){return t=Dn(7,t,i,e),t.lanes=n,t}function lc(t,e,n,i){return t=Dn(22,t,i,e),t.elementType=dg,t.lanes=n,t.stateNode={isHidden:!1},t}function Gc(t,e,n){return t=Dn(6,t,null,e),t.lanes=n,t}function Wc(t,e,n){return e=Dn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function fy(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=wc(0),this.expirationTimes=wc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=wc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Jf(t,e,n,i,r,s,a,o,l){return t=new fy(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Dn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ff(s),t}function hy(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:cs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function n0(t){if(!t)return sr;t=t._reactInternals;e:{if(jr(t)!==t||t.tag!==1)throw Error(le(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(pn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(le(171))}if(t.tag===1){var n=t.type;if(pn(n))return nv(t,n,e)}return e}function i0(t,e,n,i,r,s,a,o,l){return t=Jf(n,i,!0,t,r,s,a,o,l),t.context=n0(null),n=t.current,i=nn(),r=er(n),s=Ei(i,r),s.callback=e??null,Qi(n,s,r),t.current.lanes=r,eo(t,r,i),mn(t,i),t}function cc(t,e,n,i){var r=e.current,s=nn(),a=er(r);return n=n0(n),e.context===null?e.context=n:e.pendingContext=n,e=Ei(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Qi(r,e,a),t!==null&&(Jn(t,r,a,s),sl(t,r,a)),a}function Vl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function bp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function eh(t,e){bp(t,e),(t=t.alternate)&&bp(t,e)}function py(){return null}var r0=typeof reportError=="function"?reportError:function(t){console.error(t)};function th(t){this._internalRoot=t}uc.prototype.render=th.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(le(409));cc(t,e,null,null)};uc.prototype.unmount=th.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Fr(function(){cc(null,t,null,null)}),e[wi]=null}};function uc(t){this._internalRoot=t}uc.prototype.unstable_scheduleHydration=function(t){if(t){var e=Ug();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Hi.length&&e!==0&&e<Hi[n].priority;n++);Hi.splice(n,0,t),n===0&&Og(t)}};function nh(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function dc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Pp(){}function my(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var u=Vl(a);s.call(u)}}var a=i0(e,i,t,0,null,!1,!1,"",Pp);return t._reactRootContainer=a,t[wi]=a.current,ja(t.nodeType===8?t.parentNode:t),Fr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var u=Vl(l);o.call(u)}}var l=Jf(t,0,!1,null,null,!1,!1,"",Pp);return t._reactRootContainer=l,t[wi]=l.current,ja(t.nodeType===8?t.parentNode:t),Fr(function(){cc(e,l,n,i)}),l}function fc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=Vl(a);o.call(l)}}cc(e,a,t,r)}else a=my(n,e,t,r,i);return Vl(a)}Dg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=xa(e.pendingLanes);n!==0&&(Sf(e,n|1),mn(e,Ct()),!(Ze&6)&&(ks=Ct()+500,ur()))}break;case 13:Fr(function(){var i=Ai(t,1);if(i!==null){var r=nn();Jn(i,t,1,r)}}),eh(t,1)}};Mf=function(t){if(t.tag===13){var e=Ai(t,134217728);if(e!==null){var n=nn();Jn(e,t,134217728,n)}eh(t,134217728)}};Ig=function(t){if(t.tag===13){var e=er(t),n=Ai(t,e);if(n!==null){var i=nn();Jn(n,t,e,i)}eh(t,e)}};Ug=function(){return at};Fg=function(t,e){var n=at;try{return at=t,e()}finally{at=n}};Hu=function(t,e,n){switch(e){case"input":if(Uu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=nc(i);if(!r)throw Error(le(90));hg(i),Uu(i,r)}}}break;case"textarea":mg(t,n);break;case"select":e=n.value,e!=null&&Ms(t,!!n.multiple,e,!1)}};Mg=Yf;Eg=Fr;var gy={usingClientEntryPoint:!1,Events:[no,ps,nc,yg,Sg,Yf]},oa={findFiberByHostInstance:wr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},vy={bundleType:oa.bundleType,version:oa.version,rendererPackageName:oa.rendererPackageName,rendererConfig:oa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Pi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Ag(t),t===null?null:t.stateNode},findFiberByHostInstance:oa.findFiberByHostInstance||py,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var To=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!To.isDisabled&&To.supportsFiber)try{Ql=To.inject(vy),oi=To}catch{}}wn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=gy;wn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!nh(e))throw Error(le(200));return hy(t,e,null,n)};wn.createRoot=function(t,e){if(!nh(t))throw Error(le(299));var n=!1,i="",r=r0;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Jf(t,1,!1,null,null,n,!1,i,r),t[wi]=e.current,ja(t.nodeType===8?t.parentNode:t),new th(e)};wn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(le(188)):(t=Object.keys(t).join(","),Error(le(268,t)));return t=Ag(e),t=t===null?null:t.stateNode,t};wn.flushSync=function(t){return Fr(t)};wn.hydrate=function(t,e,n){if(!dc(e))throw Error(le(200));return fc(null,t,e,!0,n)};wn.hydrateRoot=function(t,e,n){if(!nh(t))throw Error(le(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=r0;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=i0(e,null,t,1,n??null,r,!1,s,a),t[wi]=e.current,ja(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new uc(e)};wn.render=function(t,e,n){if(!dc(e))throw Error(le(200));return fc(null,t,e,!1,n)};wn.unmountComponentAtNode=function(t){if(!dc(t))throw Error(le(40));return t._reactRootContainer?(Fr(function(){fc(null,null,t,!1,function(){t._reactRootContainer=null,t[wi]=null})}),!0):!1};wn.unstable_batchedUpdates=Yf;wn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!dc(n))throw Error(le(200));if(t==null||t._reactInternals===void 0)throw Error(le(38));return fc(t,e,n,!1,i)};wn.version="18.3.1-next-f1338f8080-20240426";function s0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s0)}catch(t){console.error(t)}}s0(),sg.exports=wn;var _y=sg.exports,a0,Np=_y;a0=Np.createRoot,Np.hydrateRoot;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ih="169",xy=0,Lp=1,yy=2,o0=1,Sy=2,mi=3,ar=0,rn=1,Yn=2,nr=0,Rs=1,Dp=2,Ip=3,Up=4,My=5,Er=100,Ey=101,Ty=102,wy=103,Ay=104,Cy=200,Ry=201,by=202,Py=203,Sd=204,Md=205,Ny=206,Ly=207,Dy=208,Iy=209,Uy=210,Fy=211,Oy=212,ky=213,By=214,Ed=0,Td=1,wd=2,Bs=3,Ad=4,Cd=5,Rd=6,bd=7,l0=0,zy=1,jy=2,ir=0,Hy=1,Vy=2,Gy=3,Wy=4,Xy=5,$y=6,qy=7,c0=300,zs=301,js=302,Pd=303,Nd=304,hc=306,Ld=1e3,Rr=1001,Dd=1002,fn=1003,Yy=1004,wo=1005,Kn=1006,Xc=1007,br=1008,Ri=1009,u0=1010,d0=1011,Ka=1012,rh=1013,Or=1014,ai=1015,ro=1016,sh=1017,ah=1018,Hs=1020,f0=35902,h0=1021,p0=1022,Zn=1023,m0=1024,g0=1025,bs=1026,Vs=1027,oh=1028,lh=1029,v0=1030,ch=1031,uh=1033,fl=33776,hl=33777,pl=33778,ml=33779,Id=35840,Ud=35841,Fd=35842,Od=35843,kd=36196,Bd=37492,zd=37496,jd=37808,Hd=37809,Vd=37810,Gd=37811,Wd=37812,Xd=37813,$d=37814,qd=37815,Yd=37816,Kd=37817,Zd=37818,Qd=37819,Jd=37820,ef=37821,gl=36492,tf=36494,nf=36495,_0=36283,rf=36284,sf=36285,af=36286,Ky=3200,Zy=3201,Qy=0,Jy=1,Gi="",ii="srgb",dr="srgb-linear",dh="display-p3",pc="display-p3-linear",Gl="linear",pt="srgb",Wl="rec709",Xl="p3",Xr=7680,Fp=519,eS=512,tS=513,nS=514,x0=515,iS=516,rS=517,sS=518,aS=519,Op=35044,kp="300 es",Si=2e3,$l=2001;class Ys{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Bp=1234567;const Ps=Math.PI/180,Za=180/Math.PI;function Ks(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(qt[t&255]+qt[t>>8&255]+qt[t>>16&255]+qt[t>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[n&63|128]+qt[n>>8&255]+"-"+qt[n>>16&255]+qt[n>>24&255]+qt[i&255]+qt[i>>8&255]+qt[i>>16&255]+qt[i>>24&255]).toLowerCase()}function Ht(t,e,n){return Math.max(e,Math.min(n,t))}function fh(t,e){return(t%e+e)%e}function oS(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function lS(t,e,n){return t!==e?(n-t)/(e-t):0}function La(t,e,n){return(1-n)*t+n*e}function cS(t,e,n,i){return La(t,e,1-Math.exp(-n*i))}function uS(t,e=1){return e-Math.abs(fh(t,e*2)-e)}function dS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function fS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function hS(t,e){return t+Math.floor(Math.random()*(e-t+1))}function pS(t,e){return t+Math.random()*(e-t)}function mS(t){return t*(.5-Math.random())}function gS(t){t!==void 0&&(Bp=t);let e=Bp+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function vS(t){return t*Ps}function _S(t){return t*Za}function xS(t){return(t&t-1)===0&&t!==0}function yS(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function SS(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function MS(t,e,n,i,r){const s=Math.cos,a=Math.sin,o=s(n/2),l=a(n/2),u=s((e+i)/2),f=a((e+i)/2),p=s((e-i)/2),h=a((e-i)/2),m=s((i-e)/2),v=a((i-e)/2);switch(r){case"XYX":t.set(o*f,l*p,l*h,o*u);break;case"YZY":t.set(l*h,o*f,l*p,o*u);break;case"ZXZ":t.set(l*p,l*h,o*f,o*u);break;case"XZX":t.set(o*f,l*v,l*m,o*u);break;case"YXY":t.set(l*m,o*f,l*v,o*u);break;case"ZYZ":t.set(l*v,l*m,o*f,o*u);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ls(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Jt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const Ao={DEG2RAD:Ps,RAD2DEG:Za,generateUUID:Ks,clamp:Ht,euclideanModulo:fh,mapLinear:oS,inverseLerp:lS,lerp:La,damp:cS,pingpong:uS,smoothstep:dS,smootherstep:fS,randInt:hS,randFloat:pS,randFloatSpread:mS,seededRandom:gS,degToRad:vS,radToDeg:_S,isPowerOfTwo:xS,ceilPowerOfTwo:yS,floorPowerOfTwo:SS,setQuaternionFromProperEuler:MS,normalize:Jt,denormalize:ls};class Je{constructor(e=0,n=0){Je.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class je{constructor(e,n,i,r,s,a,o,l,u){je.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,u)}set(e,n,i,r,s,a,o,l,u){const f=this.elements;return f[0]=e,f[1]=r,f[2]=o,f[3]=n,f[4]=s,f[5]=l,f[6]=i,f[7]=a,f[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],u=i[1],f=i[4],p=i[7],h=i[2],m=i[5],v=i[8],x=r[0],g=r[3],d=r[6],_=r[1],y=r[4],T=r[7],P=r[2],R=r[5],A=r[8];return s[0]=a*x+o*_+l*P,s[3]=a*g+o*y+l*R,s[6]=a*d+o*T+l*A,s[1]=u*x+f*_+p*P,s[4]=u*g+f*y+p*R,s[7]=u*d+f*T+p*A,s[2]=h*x+m*_+v*P,s[5]=h*g+m*y+v*R,s[8]=h*d+m*T+v*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],u=e[7],f=e[8];return n*a*f-n*o*u-i*s*f+i*o*l+r*s*u-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],u=e[7],f=e[8],p=f*a-o*u,h=o*l-f*s,m=u*s-a*l,v=n*p+i*h+r*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return e[0]=p*x,e[1]=(r*u-f*i)*x,e[2]=(o*i-r*a)*x,e[3]=h*x,e[4]=(f*n-r*l)*x,e[5]=(r*s-o*n)*x,e[6]=m*x,e[7]=(i*l-u*n)*x,e[8]=(a*n-i*s)*x,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),u=Math.sin(s);return this.set(i*l,i*u,-i*(l*a+u*o)+a+e,-r*u,r*l,-r*(-u*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply($c.makeScale(e,n)),this}rotate(e){return this.premultiply($c.makeRotation(-e)),this}translate(e,n){return this.premultiply($c.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const $c=new je;function y0(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function ql(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function ES(){const t=ql("canvas");return t.style.display="block",t}const zp={};function vl(t){t in zp||(zp[t]=!0,console.warn(t))}function TS(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function wS(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function AS(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const jp=new je().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Hp=new je().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),la={[dr]:{transfer:Gl,primaries:Wl,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t,fromReference:t=>t},[ii]:{transfer:pt,primaries:Wl,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[pc]:{transfer:Gl,primaries:Xl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.applyMatrix3(Hp),fromReference:t=>t.applyMatrix3(jp)},[dh]:{transfer:pt,primaries:Xl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.convertSRGBToLinear().applyMatrix3(Hp),fromReference:t=>t.applyMatrix3(jp).convertLinearToSRGB()}},CS=new Set([dr,pc]),nt={enabled:!0,_workingColorSpace:dr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!CS.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=la[e].toReference,r=la[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return la[t].primaries},getTransfer:function(t){return t===Gi?Gl:la[t].transfer},getLuminanceCoefficients:function(t,e=this._workingColorSpace){return t.fromArray(la[e].luminanceCoefficients)}};function Ns(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function qc(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let $r;class RS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{$r===void 0&&($r=ql("canvas")),$r.width=e.width,$r.height=e.height;const i=$r.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=$r}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=ql("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Ns(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ns(n[i]/255)*255):n[i]=Ns(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let bS=0;class S0{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bS++}),this.uuid=Ks(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Yc(r[a].image)):s.push(Yc(r[a]))}else s=Yc(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Yc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?RS.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let PS=0;class sn extends Ys{constructor(e=sn.DEFAULT_IMAGE,n=sn.DEFAULT_MAPPING,i=Rr,r=Rr,s=Kn,a=br,o=Zn,l=Ri,u=sn.DEFAULT_ANISOTROPY,f=Gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:PS++}),this.uuid=Ks(),this.name="",this.source=new S0(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=u,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Je(0,0),this.repeat=new Je(1,1),this.center=new Je(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==c0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ld:e.x=e.x-Math.floor(e.x);break;case Rr:e.x=e.x<0?0:1;break;case Dd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ld:e.y=e.y-Math.floor(e.y);break;case Rr:e.y=e.y<0?0:1;break;case Dd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=c0;sn.DEFAULT_ANISOTROPY=1;class Tt{constructor(e=0,n=0,i=0,r=1){Tt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,u=l[0],f=l[4],p=l[8],h=l[1],m=l[5],v=l[9],x=l[2],g=l[6],d=l[10];if(Math.abs(f-h)<.01&&Math.abs(p-x)<.01&&Math.abs(v-g)<.01){if(Math.abs(f+h)<.1&&Math.abs(p+x)<.1&&Math.abs(v+g)<.1&&Math.abs(u+m+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const y=(u+1)/2,T=(m+1)/2,P=(d+1)/2,R=(f+h)/4,A=(p+x)/4,N=(v+g)/4;return y>T&&y>P?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=R/i,s=A/i):T>P?T<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(T),i=R/r,s=N/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=A/s,r=N/s),this.set(i,r,s,n),this}let _=Math.sqrt((g-v)*(g-v)+(p-x)*(p-x)+(h-f)*(h-f));return Math.abs(_)<.001&&(_=1),this.x=(g-v)/_,this.y=(p-x)/_,this.z=(h-f)/_,this.w=Math.acos((u+m+d-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class NS extends Ys{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Tt(0,0,e,n),this.scissorTest=!1,this.viewport=new Tt(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new sn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new S0(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kr extends NS{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class M0 extends sn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=fn,this.minFilter=fn,this.wrapR=Rr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class LS extends sn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=fn,this.minFilter=fn,this.wrapR=Rr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Br{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],u=i[r+1],f=i[r+2],p=i[r+3];const h=s[a+0],m=s[a+1],v=s[a+2],x=s[a+3];if(o===0){e[n+0]=l,e[n+1]=u,e[n+2]=f,e[n+3]=p;return}if(o===1){e[n+0]=h,e[n+1]=m,e[n+2]=v,e[n+3]=x;return}if(p!==x||l!==h||u!==m||f!==v){let g=1-o;const d=l*h+u*m+f*v+p*x,_=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const P=Math.sqrt(y),R=Math.atan2(P,d*_);g=Math.sin(g*R)/P,o=Math.sin(o*R)/P}const T=o*_;if(l=l*g+h*T,u=u*g+m*T,f=f*g+v*T,p=p*g+x*T,g===1-o){const P=1/Math.sqrt(l*l+u*u+f*f+p*p);l*=P,u*=P,f*=P,p*=P}}e[n]=l,e[n+1]=u,e[n+2]=f,e[n+3]=p}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],u=i[r+2],f=i[r+3],p=s[a],h=s[a+1],m=s[a+2],v=s[a+3];return e[n]=o*v+f*p+l*m-u*h,e[n+1]=l*v+f*h+u*p-o*m,e[n+2]=u*v+f*m+o*h-l*p,e[n+3]=f*v-o*p-l*h-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,u=o(i/2),f=o(r/2),p=o(s/2),h=l(i/2),m=l(r/2),v=l(s/2);switch(a){case"XYZ":this._x=h*f*p+u*m*v,this._y=u*m*p-h*f*v,this._z=u*f*v+h*m*p,this._w=u*f*p-h*m*v;break;case"YXZ":this._x=h*f*p+u*m*v,this._y=u*m*p-h*f*v,this._z=u*f*v-h*m*p,this._w=u*f*p+h*m*v;break;case"ZXY":this._x=h*f*p-u*m*v,this._y=u*m*p+h*f*v,this._z=u*f*v+h*m*p,this._w=u*f*p-h*m*v;break;case"ZYX":this._x=h*f*p-u*m*v,this._y=u*m*p+h*f*v,this._z=u*f*v-h*m*p,this._w=u*f*p+h*m*v;break;case"YZX":this._x=h*f*p+u*m*v,this._y=u*m*p+h*f*v,this._z=u*f*v-h*m*p,this._w=u*f*p-h*m*v;break;case"XZY":this._x=h*f*p-u*m*v,this._y=u*m*p-h*f*v,this._z=u*f*v+h*m*p,this._w=u*f*p+h*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],u=n[2],f=n[6],p=n[10],h=i+o+p;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(f-l)*m,this._y=(s-u)*m,this._z=(a-r)*m}else if(i>o&&i>p){const m=2*Math.sqrt(1+i-o-p);this._w=(f-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+u)/m}else if(o>p){const m=2*Math.sqrt(1+o-i-p);this._w=(s-u)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+f)/m}else{const m=2*Math.sqrt(1+p-i-o);this._w=(a-r)/m,this._x=(s+u)/m,this._y=(l+f)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ht(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,u=n._z,f=n._w;return this._x=i*f+a*o+r*u-s*l,this._y=r*f+a*l+s*o-i*u,this._z=s*f+a*u+i*l-r*o,this._w=a*f-i*o-r*l-s*u,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-n;return this._w=m*a+n*this._w,this._x=m*i+n*this._x,this._y=m*r+n*this._y,this._z=m*s+n*this._z,this.normalize(),this}const u=Math.sqrt(l),f=Math.atan2(u,o),p=Math.sin((1-n)*f)/u,h=Math.sin(n*f)/u;return this._w=a*p+this._w*h,this._x=i*p+this._x*h,this._y=r*p+this._y*h,this._z=s*p+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,n=0,i=0){H.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Vp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Vp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,u=2*(a*r-o*i),f=2*(o*n-s*r),p=2*(s*i-a*n);return this.x=n+l*u+a*p-o*f,this.y=i+l*f+o*u-s*p,this.z=r+l*p+s*f-a*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Kc.copy(this).projectOnVector(e),this.sub(Kc)}reflect(e){return this.sub(Kc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Kc=new H,Vp=new Br;class Hr{constructor(e=new H(1/0,1/0,1/0),n=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Hn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Hn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Hn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Hn):Hn.fromBufferAttribute(s,a),Hn.applyMatrix4(e.matrixWorld),this.expandByPoint(Hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Co.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Co.copy(i.boundingBox)),Co.applyMatrix4(e.matrixWorld),this.union(Co)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Hn),Hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ca),Ro.subVectors(this.max,ca),qr.subVectors(e.a,ca),Yr.subVectors(e.b,ca),Kr.subVectors(e.c,ca),Ii.subVectors(Yr,qr),Ui.subVectors(Kr,Yr),fr.subVectors(qr,Kr);let n=[0,-Ii.z,Ii.y,0,-Ui.z,Ui.y,0,-fr.z,fr.y,Ii.z,0,-Ii.x,Ui.z,0,-Ui.x,fr.z,0,-fr.x,-Ii.y,Ii.x,0,-Ui.y,Ui.x,0,-fr.y,fr.x,0];return!Zc(n,qr,Yr,Kr,Ro)||(n=[1,0,0,0,1,0,0,0,1],!Zc(n,qr,Yr,Kr,Ro))?!1:(bo.crossVectors(Ii,Ui),n=[bo.x,bo.y,bo.z],Zc(n,qr,Yr,Kr,Ro))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Hn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ui),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ui=[new H,new H,new H,new H,new H,new H,new H,new H],Hn=new H,Co=new Hr,qr=new H,Yr=new H,Kr=new H,Ii=new H,Ui=new H,fr=new H,ca=new H,Ro=new H,bo=new H,hr=new H;function Zc(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){hr.fromArray(t,s);const o=r.x*Math.abs(hr.x)+r.y*Math.abs(hr.y)+r.z*Math.abs(hr.z),l=e.dot(hr),u=n.dot(hr),f=i.dot(hr);if(Math.max(-Math.max(l,u,f),Math.min(l,u,f))>o)return!1}return!0}const DS=new Hr,ua=new H,Qc=new H;class Zs{constructor(e=new H,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):DS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ua.subVectors(e,this.center);const n=ua.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ua,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ua.copy(e.center).add(Qc)),this.expandByPoint(ua.copy(e.center).sub(Qc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const di=new H,Jc=new H,Po=new H,Fi=new H,eu=new H,No=new H,tu=new H;class hh{constructor(e=new H,n=new H(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,di)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=di.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(di.copy(this.origin).addScaledVector(this.direction,n),di.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Jc.copy(e).add(n).multiplyScalar(.5),Po.copy(n).sub(e).normalize(),Fi.copy(this.origin).sub(Jc);const s=e.distanceTo(n)*.5,a=-this.direction.dot(Po),o=Fi.dot(this.direction),l=-Fi.dot(Po),u=Fi.lengthSq(),f=Math.abs(1-a*a);let p,h,m,v;if(f>0)if(p=a*l-o,h=a*o-l,v=s*f,p>=0)if(h>=-v)if(h<=v){const x=1/f;p*=x,h*=x,m=p*(p+a*h+2*o)+h*(a*p+h+2*l)+u}else h=s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+u;else h=-s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+u;else h<=-v?(p=Math.max(0,-(-a*s+o)),h=p>0?-s:Math.min(Math.max(-s,-l),s),m=-p*p+h*(h+2*l)+u):h<=v?(p=0,h=Math.min(Math.max(-s,-l),s),m=h*(h+2*l)+u):(p=Math.max(0,-(a*s+o)),h=p>0?s:Math.min(Math.max(-s,-l),s),m=-p*p+h*(h+2*l)+u);else h=a>0?-s:s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(Jc).addScaledVector(Po,h),m}intersectSphere(e,n){di.subVectors(e.center,this.origin);const i=di.dot(this.direction),r=di.dot(di)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const u=1/this.direction.x,f=1/this.direction.y,p=1/this.direction.z,h=this.origin;return u>=0?(i=(e.min.x-h.x)*u,r=(e.max.x-h.x)*u):(i=(e.max.x-h.x)*u,r=(e.min.x-h.x)*u),f>=0?(s=(e.min.y-h.y)*f,a=(e.max.y-h.y)*f):(s=(e.max.y-h.y)*f,a=(e.min.y-h.y)*f),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),p>=0?(o=(e.min.z-h.z)*p,l=(e.max.z-h.z)*p):(o=(e.max.z-h.z)*p,l=(e.min.z-h.z)*p),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,di)!==null}intersectTriangle(e,n,i,r,s){eu.subVectors(n,e),No.subVectors(i,e),tu.crossVectors(eu,No);let a=this.direction.dot(tu),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Fi.subVectors(this.origin,e);const l=o*this.direction.dot(No.crossVectors(Fi,No));if(l<0)return null;const u=o*this.direction.dot(eu.cross(Fi));if(u<0||l+u>a)return null;const f=-o*Fi.dot(tu);return f<0?null:this.at(f/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,n,i,r,s,a,o,l,u,f,p,h,m,v,x,g){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,u,f,p,h,m,v,x,g)}set(e,n,i,r,s,a,o,l,u,f,p,h,m,v,x,g){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=l,d[2]=u,d[6]=f,d[10]=p,d[14]=h,d[3]=m,d[7]=v,d[11]=x,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/Zr.setFromMatrixColumn(e,0).length(),s=1/Zr.setFromMatrixColumn(e,1).length(),a=1/Zr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),u=Math.sin(r),f=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const h=a*f,m=a*p,v=o*f,x=o*p;n[0]=l*f,n[4]=-l*p,n[8]=u,n[1]=m+v*u,n[5]=h-x*u,n[9]=-o*l,n[2]=x-h*u,n[6]=v+m*u,n[10]=a*l}else if(e.order==="YXZ"){const h=l*f,m=l*p,v=u*f,x=u*p;n[0]=h+x*o,n[4]=v*o-m,n[8]=a*u,n[1]=a*p,n[5]=a*f,n[9]=-o,n[2]=m*o-v,n[6]=x+h*o,n[10]=a*l}else if(e.order==="ZXY"){const h=l*f,m=l*p,v=u*f,x=u*p;n[0]=h-x*o,n[4]=-a*p,n[8]=v+m*o,n[1]=m+v*o,n[5]=a*f,n[9]=x-h*o,n[2]=-a*u,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const h=a*f,m=a*p,v=o*f,x=o*p;n[0]=l*f,n[4]=v*u-m,n[8]=h*u+x,n[1]=l*p,n[5]=x*u+h,n[9]=m*u-v,n[2]=-u,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const h=a*l,m=a*u,v=o*l,x=o*u;n[0]=l*f,n[4]=x-h*p,n[8]=v*p+m,n[1]=p,n[5]=a*f,n[9]=-o*f,n[2]=-u*f,n[6]=m*p+v,n[10]=h-x*p}else if(e.order==="XZY"){const h=a*l,m=a*u,v=o*l,x=o*u;n[0]=l*f,n[4]=-p,n[8]=u*f,n[1]=h*p+x,n[5]=a*f,n[9]=m*p-v,n[2]=v*p-m,n[6]=o*f,n[10]=x*p+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(IS,e,US)}lookAt(e,n,i){const r=this.elements;return _n.subVectors(e,n),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Oi.crossVectors(i,_n),Oi.lengthSq()===0&&(Math.abs(i.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Oi.crossVectors(i,_n)),Oi.normalize(),Lo.crossVectors(_n,Oi),r[0]=Oi.x,r[4]=Lo.x,r[8]=_n.x,r[1]=Oi.y,r[5]=Lo.y,r[9]=_n.y,r[2]=Oi.z,r[6]=Lo.z,r[10]=_n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],u=i[12],f=i[1],p=i[5],h=i[9],m=i[13],v=i[2],x=i[6],g=i[10],d=i[14],_=i[3],y=i[7],T=i[11],P=i[15],R=r[0],A=r[4],N=r[8],K=r[12],S=r[1],w=r[5],Y=r[9],F=r[13],k=r[2],q=r[6],V=r[10],Z=r[14],I=r[3],ee=r[7],ie=r[11],de=r[15];return s[0]=a*R+o*S+l*k+u*I,s[4]=a*A+o*w+l*q+u*ee,s[8]=a*N+o*Y+l*V+u*ie,s[12]=a*K+o*F+l*Z+u*de,s[1]=f*R+p*S+h*k+m*I,s[5]=f*A+p*w+h*q+m*ee,s[9]=f*N+p*Y+h*V+m*ie,s[13]=f*K+p*F+h*Z+m*de,s[2]=v*R+x*S+g*k+d*I,s[6]=v*A+x*w+g*q+d*ee,s[10]=v*N+x*Y+g*V+d*ie,s[14]=v*K+x*F+g*Z+d*de,s[3]=_*R+y*S+T*k+P*I,s[7]=_*A+y*w+T*q+P*ee,s[11]=_*N+y*Y+T*V+P*ie,s[15]=_*K+y*F+T*Z+P*de,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],u=e[13],f=e[2],p=e[6],h=e[10],m=e[14],v=e[3],x=e[7],g=e[11],d=e[15];return v*(+s*l*p-r*u*p-s*o*h+i*u*h+r*o*m-i*l*m)+x*(+n*l*m-n*u*h+s*a*h-r*a*m+r*u*f-s*l*f)+g*(+n*u*p-n*o*m-s*a*p+i*a*m+s*o*f-i*u*f)+d*(-r*o*f-n*l*p+n*o*h+r*a*p-i*a*h+i*l*f)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],u=e[7],f=e[8],p=e[9],h=e[10],m=e[11],v=e[12],x=e[13],g=e[14],d=e[15],_=p*g*u-x*h*u+x*l*m-o*g*m-p*l*d+o*h*d,y=v*h*u-f*g*u-v*l*m+a*g*m+f*l*d-a*h*d,T=f*x*u-v*p*u+v*o*m-a*x*m-f*o*d+a*p*d,P=v*p*l-f*x*l-v*o*h+a*x*h+f*o*g-a*p*g,R=n*_+i*y+r*T+s*P;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return e[0]=_*A,e[1]=(x*h*s-p*g*s-x*r*m+i*g*m+p*r*d-i*h*d)*A,e[2]=(o*g*s-x*l*s+x*r*u-i*g*u-o*r*d+i*l*d)*A,e[3]=(p*l*s-o*h*s-p*r*u+i*h*u+o*r*m-i*l*m)*A,e[4]=y*A,e[5]=(f*g*s-v*h*s+v*r*m-n*g*m-f*r*d+n*h*d)*A,e[6]=(v*l*s-a*g*s-v*r*u+n*g*u+a*r*d-n*l*d)*A,e[7]=(a*h*s-f*l*s+f*r*u-n*h*u-a*r*m+n*l*m)*A,e[8]=T*A,e[9]=(v*p*s-f*x*s-v*i*m+n*x*m+f*i*d-n*p*d)*A,e[10]=(a*x*s-v*o*s+v*i*u-n*x*u-a*i*d+n*o*d)*A,e[11]=(f*o*s-a*p*s-f*i*u+n*p*u+a*i*m-n*o*m)*A,e[12]=P*A,e[13]=(f*x*r-v*p*r+v*i*h-n*x*h-f*i*g+n*p*g)*A,e[14]=(v*o*r-a*x*r-v*i*l+n*x*l+a*i*g-n*o*g)*A,e[15]=(a*p*r-f*o*r+f*i*l-n*p*l-a*i*h+n*o*h)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,u=s*a,f=s*o;return this.set(u*a+i,u*o-r*l,u*l+r*o,0,u*o+r*l,f*o+i,f*l-r*a,0,u*l-r*o,f*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,u=s+s,f=a+a,p=o+o,h=s*u,m=s*f,v=s*p,x=a*f,g=a*p,d=o*p,_=l*u,y=l*f,T=l*p,P=i.x,R=i.y,A=i.z;return r[0]=(1-(x+d))*P,r[1]=(m+T)*P,r[2]=(v-y)*P,r[3]=0,r[4]=(m-T)*R,r[5]=(1-(h+d))*R,r[6]=(g+_)*R,r[7]=0,r[8]=(v+y)*A,r[9]=(g-_)*A,r[10]=(1-(h+x))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=Zr.set(r[0],r[1],r[2]).length();const a=Zr.set(r[4],r[5],r[6]).length(),o=Zr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Vn.copy(this);const u=1/s,f=1/a,p=1/o;return Vn.elements[0]*=u,Vn.elements[1]*=u,Vn.elements[2]*=u,Vn.elements[4]*=f,Vn.elements[5]*=f,Vn.elements[6]*=f,Vn.elements[8]*=p,Vn.elements[9]*=p,Vn.elements[10]*=p,n.setFromRotationMatrix(Vn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=Si){const l=this.elements,u=2*s/(n-e),f=2*s/(i-r),p=(n+e)/(n-e),h=(i+r)/(i-r);let m,v;if(o===Si)m=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===$l)m=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=p,l[12]=0,l[1]=0,l[5]=f,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=Si){const l=this.elements,u=1/(n-e),f=1/(i-r),p=1/(a-s),h=(n+e)*u,m=(i+r)*f;let v,x;if(o===Si)v=(a+s)*p,x=-2*p;else if(o===$l)v=s*p,x=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*u,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*f,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=x,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const Zr=new H,Vn=new it,IS=new H(0,0,0),US=new H(1,1,1),Oi=new H,Lo=new H,_n=new H,Gp=new it,Wp=new Br;class bi{constructor(e=0,n=0,i=0,r=bi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],u=r[5],f=r[9],p=r[2],h=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(Ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,u),this._z=0);break;case"YXZ":this._x=Math.asin(-Ht(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,u)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-a,u)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ht(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,u));break;case"YZX":this._z=Math.asin(Ht(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,u),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,u),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-f,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Gp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Wp.setFromEuler(this),this.setFromQuaternion(Wp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bi.DEFAULT_ORDER="XYZ";class ph{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let FS=0;const Xp=new H,Qr=new Br,fi=new it,Do=new H,da=new H,OS=new H,kS=new Br,$p=new H(1,0,0),qp=new H(0,1,0),Yp=new H(0,0,1),Kp={type:"added"},BS={type:"removed"},Jr={type:"childadded",child:null},nu={type:"childremoved",child:null};class kt extends Ys{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:FS++}),this.uuid=Ks(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=kt.DEFAULT_UP.clone();const e=new H,n=new bi,i=new Br,r=new H(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new it},normalMatrix:{value:new je}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=kt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ph,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Qr.setFromAxisAngle(e,n),this.quaternion.multiply(Qr),this}rotateOnWorldAxis(e,n){return Qr.setFromAxisAngle(e,n),this.quaternion.premultiply(Qr),this}rotateX(e){return this.rotateOnAxis($p,e)}rotateY(e){return this.rotateOnAxis(qp,e)}rotateZ(e){return this.rotateOnAxis(Yp,e)}translateOnAxis(e,n){return Xp.copy(e).applyQuaternion(this.quaternion),this.position.add(Xp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis($p,e)}translateY(e){return this.translateOnAxis(qp,e)}translateZ(e){return this.translateOnAxis(Yp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Do.copy(e):Do.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),da.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(da,Do,this.up):fi.lookAt(Do,da,this.up),this.quaternion.setFromRotationMatrix(fi),r&&(fi.extractRotation(r.matrixWorld),Qr.setFromRotationMatrix(fi),this.quaternion.premultiply(Qr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Kp),Jr.child=e,this.dispatchEvent(Jr),Jr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(BS),nu.child=e,this.dispatchEvent(nu),nu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Kp),Jr.child=e,this.dispatchEvent(Jr),Jr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(da,e,OS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(da,kS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let u=0,f=l.length;u<f;u++){const p=l[u];s(e.shapes,p)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,u=this.material.length;l<u;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),u=a(e.textures),f=a(e.images),p=a(e.shapes),h=a(e.skeletons),m=a(e.animations),v=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),u.length>0&&(i.textures=u),f.length>0&&(i.images=f),p.length>0&&(i.shapes=p),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),v.length>0&&(i.nodes=v)}return i.object=r,i;function a(o){const l=[];for(const u in o){const f=o[u];delete f.metadata,l.push(f)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}kt.DEFAULT_UP=new H(0,1,0);kt.DEFAULT_MATRIX_AUTO_UPDATE=!0;kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Gn=new H,hi=new H,iu=new H,pi=new H,es=new H,ts=new H,Zp=new H,ru=new H,su=new H,au=new H,ou=new Tt,lu=new Tt,cu=new Tt;class Ln{constructor(e=new H,n=new H,i=new H){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Gn.subVectors(e,n),r.cross(Gn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Gn.subVectors(r,n),hi.subVectors(i,n),iu.subVectors(e,n);const a=Gn.dot(Gn),o=Gn.dot(hi),l=Gn.dot(iu),u=hi.dot(hi),f=hi.dot(iu),p=a*u-o*o;if(p===0)return s.set(0,0,0),null;const h=1/p,m=(u*l-o*f)*h,v=(a*f-o*l)*h;return s.set(1-m-v,v,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,pi.x),l.addScaledVector(a,pi.y),l.addScaledVector(o,pi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return ou.setScalar(0),lu.setScalar(0),cu.setScalar(0),ou.fromBufferAttribute(e,n),lu.fromBufferAttribute(e,i),cu.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ou,s.x),a.addScaledVector(lu,s.y),a.addScaledVector(cu,s.z),a}static isFrontFacing(e,n,i,r){return Gn.subVectors(i,n),hi.subVectors(e,n),Gn.cross(hi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Gn.subVectors(this.c,this.b),hi.subVectors(this.a,this.b),Gn.cross(hi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ln.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Ln.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Ln.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Ln.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ln.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;es.subVectors(r,i),ts.subVectors(s,i),ru.subVectors(e,i);const l=es.dot(ru),u=ts.dot(ru);if(l<=0&&u<=0)return n.copy(i);su.subVectors(e,r);const f=es.dot(su),p=ts.dot(su);if(f>=0&&p<=f)return n.copy(r);const h=l*p-f*u;if(h<=0&&l>=0&&f<=0)return a=l/(l-f),n.copy(i).addScaledVector(es,a);au.subVectors(e,s);const m=es.dot(au),v=ts.dot(au);if(v>=0&&m<=v)return n.copy(s);const x=m*u-l*v;if(x<=0&&u>=0&&v<=0)return o=u/(u-v),n.copy(i).addScaledVector(ts,o);const g=f*v-m*p;if(g<=0&&p-f>=0&&m-v>=0)return Zp.subVectors(s,r),o=(p-f)/(p-f+(m-v)),n.copy(r).addScaledVector(Zp,o);const d=1/(g+x+h);return a=x*d,o=h*d,n.copy(i).addScaledVector(es,a).addScaledVector(ts,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const E0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ki={h:0,s:0,l:0},Io={h:0,s:0,l:0};function uu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Ke{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=ii){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=nt.workingColorSpace){return this.r=e,this.g=n,this.b=i,nt.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=nt.workingColorSpace){if(e=fh(e,1),n=Ht(n,0,1),i=Ht(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=uu(a,s,e+1/3),this.g=uu(a,s,e),this.b=uu(a,s,e-1/3)}return nt.toWorkingColorSpace(this,r),this}setStyle(e,n=ii){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=ii){const i=E0[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ns(e.r),this.g=Ns(e.g),this.b=Ns(e.b),this}copyLinearToSRGB(e){return this.r=qc(e.r),this.g=qc(e.g),this.b=qc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ii){return nt.fromWorkingColorSpace(Yt.copy(this),e),Math.round(Ht(Yt.r*255,0,255))*65536+Math.round(Ht(Yt.g*255,0,255))*256+Math.round(Ht(Yt.b*255,0,255))}getHexString(e=ii){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=nt.workingColorSpace){nt.fromWorkingColorSpace(Yt.copy(this),n);const i=Yt.r,r=Yt.g,s=Yt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,u;const f=(o+a)/2;if(o===a)l=0,u=0;else{const p=a-o;switch(u=f<=.5?p/(a+o):p/(2-a-o),a){case i:l=(r-s)/p+(r<s?6:0);break;case r:l=(s-i)/p+2;break;case s:l=(i-r)/p+4;break}l/=6}return e.h=l,e.s=u,e.l=f,e}getRGB(e,n=nt.workingColorSpace){return nt.fromWorkingColorSpace(Yt.copy(this),n),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=ii){nt.fromWorkingColorSpace(Yt.copy(this),e);const n=Yt.r,i=Yt.g,r=Yt.b;return e!==ii?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(ki),this.setHSL(ki.h+e,ki.s+n,ki.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(ki),e.getHSL(Io);const i=La(ki.h,Io.h,n),r=La(ki.s,Io.s,n),s=La(ki.l,Io.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new Ke;Ke.NAMES=E0;let zS=0;class so extends Ys{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zS++}),this.uuid=Ks(),this.name="",this.type="Material",this.blending=Rs,this.side=ar,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sd,this.blendDst=Md,this.blendEquation=Er,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xr,this.stencilZFail=Xr,this.stencilZPass=Xr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Rs&&(i.blending=this.blending),this.side!==ar&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Sd&&(i.blendSrc=this.blendSrc),this.blendDst!==Md&&(i.blendDst=this.blendDst),this.blendEquation!==Er&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Bs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Xr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Xr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class vi extends so{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=l0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new H,Uo=new Je;class En{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Op,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Uo.fromBufferAttribute(this,n),Uo.applyMatrix3(e),this.setXY(n,Uo.x,Uo.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyMatrix3(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyMatrix4(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyNormalMatrix(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.transformDirection(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ls(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Jt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ls(n,this.array)),n}setX(e,n){return this.normalized&&(n=Jt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ls(n,this.array)),n}setY(e,n){return this.normalized&&(n=Jt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ls(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Jt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ls(n,this.array)),n}setW(e,n){return this.normalized&&(n=Jt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Jt(n,this.array),i=Jt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Jt(n,this.array),i=Jt(i,this.array),r=Jt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Jt(n,this.array),i=Jt(i,this.array),r=Jt(r,this.array),s=Jt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Op&&(e.usage=this.usage),e}}class T0 extends En{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class w0 extends En{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class an extends En{constructor(e,n,i){super(new Float32Array(e),n,i)}}let jS=0;const bn=new it,du=new kt,ns=new H,xn=new Hr,fa=new Hr,Ut=new H;class On extends Ys{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jS++}),this.uuid=Ks(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(y0(e)?w0:T0)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new je().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return bn.makeRotationFromQuaternion(e),this.applyMatrix4(bn),this}rotateX(e){return bn.makeRotationX(e),this.applyMatrix4(bn),this}rotateY(e){return bn.makeRotationY(e),this.applyMatrix4(bn),this}rotateZ(e){return bn.makeRotationZ(e),this.applyMatrix4(bn),this}translate(e,n,i){return bn.makeTranslation(e,n,i),this.applyMatrix4(bn),this}scale(e,n,i){return bn.makeScale(e,n,i),this.applyMatrix4(bn),this}lookAt(e){return du.lookAt(e),du.updateMatrix(),this.applyMatrix4(du.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ns).negate(),this.translate(ns.x,ns.y,ns.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new an(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];xn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const i=this.boundingSphere.center;if(xn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];fa.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(xn.min,fa.min),xn.expandByPoint(Ut),Ut.addVectors(xn.max,fa.max),xn.expandByPoint(Ut)):(xn.expandByPoint(fa.min),xn.expandByPoint(fa.max))}xn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Ut.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ut));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let u=0,f=o.count;u<f;u++)Ut.fromBufferAttribute(o,u),l&&(ns.fromBufferAttribute(e,u),Ut.add(ns)),r=Math.max(r,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new En(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let N=0;N<i.count;N++)o[N]=new H,l[N]=new H;const u=new H,f=new H,p=new H,h=new Je,m=new Je,v=new Je,x=new H,g=new H;function d(N,K,S){u.fromBufferAttribute(i,N),f.fromBufferAttribute(i,K),p.fromBufferAttribute(i,S),h.fromBufferAttribute(s,N),m.fromBufferAttribute(s,K),v.fromBufferAttribute(s,S),f.sub(u),p.sub(u),m.sub(h),v.sub(h);const w=1/(m.x*v.y-v.x*m.y);isFinite(w)&&(x.copy(f).multiplyScalar(v.y).addScaledVector(p,-m.y).multiplyScalar(w),g.copy(p).multiplyScalar(m.x).addScaledVector(f,-v.x).multiplyScalar(w),o[N].add(x),o[K].add(x),o[S].add(x),l[N].add(g),l[K].add(g),l[S].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let N=0,K=_.length;N<K;++N){const S=_[N],w=S.start,Y=S.count;for(let F=w,k=w+Y;F<k;F+=3)d(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const y=new H,T=new H,P=new H,R=new H;function A(N){P.fromBufferAttribute(r,N),R.copy(P);const K=o[N];y.copy(K),y.sub(P.multiplyScalar(P.dot(K))).normalize(),T.crossVectors(R,K);const w=T.dot(l[N])<0?-1:1;a.setXYZW(N,y.x,y.y,y.z,w)}for(let N=0,K=_.length;N<K;++N){const S=_[N],w=S.start,Y=S.count;for(let F=w,k=w+Y;F<k;F+=3)A(e.getX(F+0)),A(e.getX(F+1)),A(e.getX(F+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new En(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const r=new H,s=new H,a=new H,o=new H,l=new H,u=new H,f=new H,p=new H;if(e)for(let h=0,m=e.count;h<m;h+=3){const v=e.getX(h+0),x=e.getX(h+1),g=e.getX(h+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,x),a.fromBufferAttribute(n,g),f.subVectors(a,s),p.subVectors(r,s),f.cross(p),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,x),u.fromBufferAttribute(i,g),o.add(f),l.add(f),u.add(f),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(g,u.x,u.y,u.z)}else for(let h=0,m=n.count;h<m;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),a.fromBufferAttribute(n,h+2),f.subVectors(a,s),p.subVectors(r,s),f.cross(p),i.setXYZ(h+0,f.x,f.y,f.z),i.setXYZ(h+1,f.x,f.y,f.z),i.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Ut.fromBufferAttribute(e,n),Ut.normalize(),e.setXYZ(n,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){const u=o.array,f=o.itemSize,p=o.normalized,h=new u.constructor(l.length*f);let m=0,v=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?m=l[x]*o.data.stride+o.offset:m=l[x]*f;for(let d=0;d<f;d++)h[v++]=u[m++]}return new En(h,f,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new On,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],u=e(l,i);n.setAttribute(o,u)}const s=this.morphAttributes;for(const o in s){const l=[],u=s[o];for(let f=0,p=u.length;f<p;f++){const h=u[f],m=e(h,i);l.push(m)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const u=a[o];n.addGroup(u.start,u.count,u.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const u in l)l[u]!==void 0&&(e[u]=l[u]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const u=i[l];e.data.attributes[l]=u.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const u=this.morphAttributes[l],f=[];for(let p=0,h=u.length;p<h;p++){const m=u[p];f.push(m.toJSON(e.data))}f.length>0&&(r[l]=f,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const u in r){const f=r[u];this.setAttribute(u,f.clone(n))}const s=e.morphAttributes;for(const u in s){const f=[],p=s[u];for(let h=0,m=p.length;h<m;h++)f.push(p[h].clone(n));this.morphAttributes[u]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let u=0,f=a.length;u<f;u++){const p=a[u];this.addGroup(p.start,p.count,p.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Qp=new it,pr=new hh,Fo=new Zs,Jp=new H,Oo=new H,ko=new H,Bo=new H,fu=new H,zo=new H,em=new H,jo=new H;class Zt extends kt{constructor(e=new On,n=new vi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){zo.set(0,0,0);for(let l=0,u=s.length;l<u;l++){const f=o[l],p=s[l];f!==0&&(fu.fromBufferAttribute(p,e),a?zo.addScaledVector(fu,f):zo.addScaledVector(fu.sub(n),f))}n.add(zo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Fo.copy(i.boundingSphere),Fo.applyMatrix4(s),pr.copy(e.ray).recast(e.near),!(Fo.containsPoint(pr.origin)===!1&&(pr.intersectSphere(Fo,Jp)===null||pr.origin.distanceToSquared(Jp)>(e.far-e.near)**2))&&(Qp.copy(s).invert(),pr.copy(e.ray).applyMatrix4(Qp),!(i.boundingBox!==null&&pr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,pr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,u=s.attributes.uv,f=s.attributes.uv1,p=s.attributes.normal,h=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,x=h.length;v<x;v++){const g=h[v],d=a[g.materialIndex],_=Math.max(g.start,m.start),y=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let T=_,P=y;T<P;T+=3){const R=o.getX(T),A=o.getX(T+1),N=o.getX(T+2);r=Ho(this,d,e,i,u,f,p,R,A,N),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const v=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let g=v,d=x;g<d;g+=3){const _=o.getX(g),y=o.getX(g+1),T=o.getX(g+2);r=Ho(this,a,e,i,u,f,p,_,y,T),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,x=h.length;v<x;v++){const g=h[v],d=a[g.materialIndex],_=Math.max(g.start,m.start),y=Math.min(l.count,Math.min(g.start+g.count,m.start+m.count));for(let T=_,P=y;T<P;T+=3){const R=T,A=T+1,N=T+2;r=Ho(this,d,e,i,u,f,p,R,A,N),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const v=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let g=v,d=x;g<d;g+=3){const _=g,y=g+1,T=g+2;r=Ho(this,a,e,i,u,f,p,_,y,T),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function HS(t,e,n,i,r,s,a,o){let l;if(e.side===rn?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===ar,o),l===null)return null;jo.copy(o),jo.applyMatrix4(t.matrixWorld);const u=n.ray.origin.distanceTo(jo);return u<n.near||u>n.far?null:{distance:u,point:jo.clone(),object:t}}function Ho(t,e,n,i,r,s,a,o,l,u){t.getVertexPosition(o,Oo),t.getVertexPosition(l,ko),t.getVertexPosition(u,Bo);const f=HS(t,e,n,i,Oo,ko,Bo,em);if(f){const p=new H;Ln.getBarycoord(em,Oo,ko,Bo,p),r&&(f.uv=Ln.getInterpolatedAttribute(r,o,l,u,p,new Je)),s&&(f.uv1=Ln.getInterpolatedAttribute(s,o,l,u,p,new Je)),a&&(f.normal=Ln.getInterpolatedAttribute(a,o,l,u,p,new H),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a:o,b:l,c:u,normal:new H,materialIndex:0};Ln.getNormal(Oo,ko,Bo,h.normal),f.face=h,f.barycoord=p}return f}class Mi extends On{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],u=[],f=[],p=[];let h=0,m=0;v("z","y","x",-1,-1,i,n,e,a,s,0),v("z","y","x",1,-1,i,n,-e,a,s,1),v("x","z","y",1,1,e,i,n,r,a,2),v("x","z","y",1,-1,e,i,-n,r,a,3),v("x","y","z",1,-1,e,n,i,r,s,4),v("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new an(u,3)),this.setAttribute("normal",new an(f,3)),this.setAttribute("uv",new an(p,2));function v(x,g,d,_,y,T,P,R,A,N,K){const S=T/A,w=P/N,Y=T/2,F=P/2,k=R/2,q=A+1,V=N+1;let Z=0,I=0;const ee=new H;for(let ie=0;ie<V;ie++){const de=ie*w-F;for(let Ne=0;Ne<q;Ne++){const qe=Ne*S-Y;ee[x]=qe*_,ee[g]=de*y,ee[d]=k,u.push(ee.x,ee.y,ee.z),ee[x]=0,ee[g]=0,ee[d]=R>0?1:-1,f.push(ee.x,ee.y,ee.z),p.push(Ne/A),p.push(1-ie/N),Z+=1}}for(let ie=0;ie<N;ie++)for(let de=0;de<A;de++){const Ne=h+de+q*ie,qe=h+de+q*(ie+1),J=h+(de+1)+q*(ie+1),se=h+(de+1)+q*ie;l.push(Ne,qe,se),l.push(qe,J,se),I+=6}o.addGroup(m,I,K),m+=I,h+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Gs(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function en(t){const e={};for(let n=0;n<t.length;n++){const i=Gs(t[n]);for(const r in i)e[r]=i[r]}return e}function VS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function A0(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const GS={clone:Gs,merge:en};var WS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,XS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class or extends so{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=WS,this.fragmentShader=XS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Gs(e.uniforms),this.uniformsGroups=VS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class C0 extends kt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=Si}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Bi=new H,tm=new Je,nm=new Je;class qn extends C0{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Za*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ps*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Za*2*Math.atan(Math.tan(Ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z)}getViewSize(e,n){return this.getViewBounds(e,tm,nm),n.subVectors(nm,tm)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Ps*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,u=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/u,r*=a.width/l,i*=a.height/u}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const is=-90,rs=1;class $S extends kt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new qn(is,rs,e,n);r.layers=this.layers,this.add(r);const s=new qn(is,rs,e,n);s.layers=this.layers,this.add(s);const a=new qn(is,rs,e,n);a.layers=this.layers,this.add(a);const o=new qn(is,rs,e,n);o.layers=this.layers,this.add(o);const l=new qn(is,rs,e,n);l.layers=this.layers,this.add(l);const u=new qn(is,rs,e,n);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const u of n)this.remove(u);if(e===Si)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===$l)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of n)this.add(u),u.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,u,f]=this.children,p=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,u),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(n,f),e.setRenderTarget(p,h,m),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class R0 extends sn{constructor(e,n,i,r,s,a,o,l,u,f){e=e!==void 0?e:[],n=n!==void 0?n:zs,super(e,n,i,r,s,a,o,l,u,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class qS extends kr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new R0(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Kn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Mi(5,5,5),s=new or({name:"CubemapFromEquirect",uniforms:Gs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:rn,blending:nr});s.uniforms.tEquirect.value=n;const a=new Zt(r,s),o=n.minFilter;return n.minFilter===br&&(n.minFilter=Kn),new $S(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const hu=new H,YS=new H,KS=new je;class Sr{constructor(e=new H(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=hu.subVectors(i,n).cross(YS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(hu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||KS.getNormalMatrix(e),r=this.coplanarPoint(hu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const mr=new Zs,Vo=new H;class mh{constructor(e=new Sr,n=new Sr,i=new Sr,r=new Sr,s=new Sr,a=new Sr){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Si){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],u=r[4],f=r[5],p=r[6],h=r[7],m=r[8],v=r[9],x=r[10],g=r[11],d=r[12],_=r[13],y=r[14],T=r[15];if(i[0].setComponents(l-s,h-u,g-m,T-d).normalize(),i[1].setComponents(l+s,h+u,g+m,T+d).normalize(),i[2].setComponents(l+a,h+f,g+v,T+_).normalize(),i[3].setComponents(l-a,h-f,g-v,T-_).normalize(),i[4].setComponents(l-o,h-p,g-x,T-y).normalize(),n===Si)i[5].setComponents(l+o,h+p,g+x,T+y).normalize();else if(n===$l)i[5].setComponents(o,p,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),mr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mr)}intersectsSprite(e){return mr.center.set(0,0,0),mr.radius=.7071067811865476,mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(mr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Vo.x=r.normal.x>0?e.max.x:e.min.x,Vo.y=r.normal.y>0?e.max.y:e.min.y,Vo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Vo)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function b0(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function ZS(t){const e=new WeakMap;function n(o,l){const u=o.array,f=o.usage,p=u.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,u,f),o.onUploadCallback();let m;if(u instanceof Float32Array)m=t.FLOAT;else if(u instanceof Uint16Array)o.isFloat16BufferAttribute?m=t.HALF_FLOAT:m=t.UNSIGNED_SHORT;else if(u instanceof Int16Array)m=t.SHORT;else if(u instanceof Uint32Array)m=t.UNSIGNED_INT;else if(u instanceof Int32Array)m=t.INT;else if(u instanceof Int8Array)m=t.BYTE;else if(u instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:h,type:m,bytesPerElement:u.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,l,u){const f=l.array,p=l.updateRanges;if(t.bindBuffer(u,o),p.length===0)t.bufferSubData(u,0,f);else{p.sort((m,v)=>m.start-v.start);let h=0;for(let m=1;m<p.length;m++){const v=p[h],x=p[m];x.start<=v.start+v.count+1?v.count=Math.max(v.count,x.start+x.count-v.start):(++h,p[h]=x)}p.length=h+1;for(let m=0,v=p.length;m<v;m++){const x=p[m];t.bufferSubData(u,x.start*f.BYTES_PER_ELEMENT,f,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=e.get(o);(!f||f.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const u=e.get(o);if(u===void 0)e.set(o,n(o,l));else if(u.version<o.version){if(u.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,o,l),u.version=o.version}}return{get:r,remove:s,update:a}}class ao extends On{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),u=o+1,f=l+1,p=e/o,h=n/l,m=[],v=[],x=[],g=[];for(let d=0;d<f;d++){const _=d*h-a;for(let y=0;y<u;y++){const T=y*p-s;v.push(T,-_,0),x.push(0,0,1),g.push(y/o),g.push(1-d/l)}}for(let d=0;d<l;d++)for(let _=0;_<o;_++){const y=_+u*d,T=_+u*(d+1),P=_+1+u*(d+1),R=_+1+u*d;m.push(y,T,R),m.push(T,P,R)}this.setIndex(m),this.setAttribute("position",new an(v,3)),this.setAttribute("normal",new an(x,3)),this.setAttribute("uv",new an(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ao(e.width,e.height,e.widthSegments,e.heightSegments)}}var QS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,JS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,eM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,iM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,rM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,sM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,aM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,oM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,uM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,dM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,fM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,pM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,vM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_M=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,SM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,MM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,EM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,TM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,AM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,CM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,RM="gl_FragColor = linearToOutputTexel( gl_FragColor );",bM=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,PM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,NM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,LM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,DM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,IM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,UM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,FM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,OM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,BM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,HM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,VM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,GM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,WM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,XM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$M=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,qM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,YM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,KM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ZM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,QM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,JM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,eE=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iE=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,aE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,oE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,uE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hE=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,pE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,gE=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,vE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_E=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,yE=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,SE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ME=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,EE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,TE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,AE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,CE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,RE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,PE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,NE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,LE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,DE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,IE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,UE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,FE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,OE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,BE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,jE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,HE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,VE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,GE=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,WE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,XE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,$E=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,YE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,KE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ZE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,QE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,JE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,n1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,i1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,r1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,s1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,a1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,o1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,l1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,u1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,d1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,f1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,g1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,_1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,x1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,M1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,A1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,C1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,b1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,P1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ze={alphahash_fragment:QS,alphahash_pars_fragment:JS,alphamap_fragment:eM,alphamap_pars_fragment:tM,alphatest_fragment:nM,alphatest_pars_fragment:iM,aomap_fragment:rM,aomap_pars_fragment:sM,batching_pars_vertex:aM,batching_vertex:oM,begin_vertex:lM,beginnormal_vertex:cM,bsdfs:uM,iridescence_fragment:dM,bumpmap_pars_fragment:fM,clipping_planes_fragment:hM,clipping_planes_pars_fragment:pM,clipping_planes_pars_vertex:mM,clipping_planes_vertex:gM,color_fragment:vM,color_pars_fragment:_M,color_pars_vertex:xM,color_vertex:yM,common:SM,cube_uv_reflection_fragment:MM,defaultnormal_vertex:EM,displacementmap_pars_vertex:TM,displacementmap_vertex:wM,emissivemap_fragment:AM,emissivemap_pars_fragment:CM,colorspace_fragment:RM,colorspace_pars_fragment:bM,envmap_fragment:PM,envmap_common_pars_fragment:NM,envmap_pars_fragment:LM,envmap_pars_vertex:DM,envmap_physical_pars_fragment:GM,envmap_vertex:IM,fog_vertex:UM,fog_pars_vertex:FM,fog_fragment:OM,fog_pars_fragment:kM,gradientmap_pars_fragment:BM,lightmap_pars_fragment:zM,lights_lambert_fragment:jM,lights_lambert_pars_fragment:HM,lights_pars_begin:VM,lights_toon_fragment:WM,lights_toon_pars_fragment:XM,lights_phong_fragment:$M,lights_phong_pars_fragment:qM,lights_physical_fragment:YM,lights_physical_pars_fragment:KM,lights_fragment_begin:ZM,lights_fragment_maps:QM,lights_fragment_end:JM,logdepthbuf_fragment:eE,logdepthbuf_pars_fragment:tE,logdepthbuf_pars_vertex:nE,logdepthbuf_vertex:iE,map_fragment:rE,map_pars_fragment:sE,map_particle_fragment:aE,map_particle_pars_fragment:oE,metalnessmap_fragment:lE,metalnessmap_pars_fragment:cE,morphinstance_vertex:uE,morphcolor_vertex:dE,morphnormal_vertex:fE,morphtarget_pars_vertex:hE,morphtarget_vertex:pE,normal_fragment_begin:mE,normal_fragment_maps:gE,normal_pars_fragment:vE,normal_pars_vertex:_E,normal_vertex:xE,normalmap_pars_fragment:yE,clearcoat_normal_fragment_begin:SE,clearcoat_normal_fragment_maps:ME,clearcoat_pars_fragment:EE,iridescence_pars_fragment:TE,opaque_fragment:wE,packing:AE,premultiplied_alpha_fragment:CE,project_vertex:RE,dithering_fragment:bE,dithering_pars_fragment:PE,roughnessmap_fragment:NE,roughnessmap_pars_fragment:LE,shadowmap_pars_fragment:DE,shadowmap_pars_vertex:IE,shadowmap_vertex:UE,shadowmask_pars_fragment:FE,skinbase_vertex:OE,skinning_pars_vertex:kE,skinning_vertex:BE,skinnormal_vertex:zE,specularmap_fragment:jE,specularmap_pars_fragment:HE,tonemapping_fragment:VE,tonemapping_pars_fragment:GE,transmission_fragment:WE,transmission_pars_fragment:XE,uv_pars_fragment:$E,uv_pars_vertex:qE,uv_vertex:YE,worldpos_vertex:KE,background_vert:ZE,background_frag:QE,backgroundCube_vert:JE,backgroundCube_frag:e1,cube_vert:t1,cube_frag:n1,depth_vert:i1,depth_frag:r1,distanceRGBA_vert:s1,distanceRGBA_frag:a1,equirect_vert:o1,equirect_frag:l1,linedashed_vert:c1,linedashed_frag:u1,meshbasic_vert:d1,meshbasic_frag:f1,meshlambert_vert:h1,meshlambert_frag:p1,meshmatcap_vert:m1,meshmatcap_frag:g1,meshnormal_vert:v1,meshnormal_frag:_1,meshphong_vert:x1,meshphong_frag:y1,meshphysical_vert:S1,meshphysical_frag:M1,meshtoon_vert:E1,meshtoon_frag:T1,points_vert:w1,points_frag:A1,shadow_vert:C1,shadow_frag:R1,sprite_vert:b1,sprite_frag:P1},he={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new Je(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new Je(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},ri={basic:{uniforms:en([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:en([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ke(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:en([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:en([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:en([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ke(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:en([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:en([he.points,he.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:en([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:en([he.common,he.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:en([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:en([he.sprite,he.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:en([he.common,he.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:en([he.lights,he.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};ri.physical={uniforms:en([ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new Je(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new Je},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new Je},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const Go={r:0,b:0,g:0},gr=new bi,N1=new it;function L1(t,e,n,i,r,s,a){const o=new Ke(0);let l=s===!0?0:1,u,f,p=null,h=0,m=null;function v(_){let y=_.isScene===!0?_.background:null;return y&&y.isTexture&&(y=(_.backgroundBlurriness>0?n:e).get(y)),y}function x(_){let y=!1;const T=v(_);T===null?d(o,l):T&&T.isColor&&(d(T,1),y=!0);const P=t.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function g(_,y){const T=v(y);T&&(T.isCubeTexture||T.mapping===hc)?(f===void 0&&(f=new Zt(new Mi(1,1,1),new or({name:"BackgroundCubeMaterial",uniforms:Gs(ri.backgroundCube.uniforms),vertexShader:ri.backgroundCube.vertexShader,fragmentShader:ri.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(P,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(f)),gr.copy(y.backgroundRotation),gr.x*=-1,gr.y*=-1,gr.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(gr.y*=-1,gr.z*=-1),f.material.uniforms.envMap.value=T,f.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(N1.makeRotationFromEuler(gr)),f.material.toneMapped=nt.getTransfer(T.colorSpace)!==pt,(p!==T||h!==T.version||m!==t.toneMapping)&&(f.material.needsUpdate=!0,p=T,h=T.version,m=t.toneMapping),f.layers.enableAll(),_.unshift(f,f.geometry,f.material,0,0,null)):T&&T.isTexture&&(u===void 0&&(u=new Zt(new ao(2,2),new or({name:"BackgroundMaterial",uniforms:Gs(ri.background.uniforms),vertexShader:ri.background.vertexShader,fragmentShader:ri.background.fragmentShader,side:ar,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(u)),u.material.uniforms.t2D.value=T,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.toneMapped=nt.getTransfer(T.colorSpace)!==pt,T.matrixAutoUpdate===!0&&T.updateMatrix(),u.material.uniforms.uvTransform.value.copy(T.matrix),(p!==T||h!==T.version||m!==t.toneMapping)&&(u.material.needsUpdate=!0,p=T,h=T.version,m=t.toneMapping),u.layers.enableAll(),_.unshift(u,u.geometry,u.material,0,0,null))}function d(_,y){_.getRGB(Go,A0(t)),i.buffers.color.setClear(Go.r,Go.g,Go.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(_,y=1){o.set(_),l=y,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,d(o,l)},render:x,addToRenderList:g}}function D1(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,a=!1;function o(S,w,Y,F,k){let q=!1;const V=p(F,Y,w);s!==V&&(s=V,u(s.object)),q=m(S,F,Y,k),q&&v(S,F,Y,k),k!==null&&e.update(k,t.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,T(S,w,Y,F),k!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return t.createVertexArray()}function u(S){return t.bindVertexArray(S)}function f(S){return t.deleteVertexArray(S)}function p(S,w,Y){const F=Y.wireframe===!0;let k=i[S.id];k===void 0&&(k={},i[S.id]=k);let q=k[w.id];q===void 0&&(q={},k[w.id]=q);let V=q[F];return V===void 0&&(V=h(l()),q[F]=V),V}function h(S){const w=[],Y=[],F=[];for(let k=0;k<n;k++)w[k]=0,Y[k]=0,F[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:Y,attributeDivisors:F,object:S,attributes:{},index:null}}function m(S,w,Y,F){const k=s.attributes,q=w.attributes;let V=0;const Z=Y.getAttributes();for(const I in Z)if(Z[I].location>=0){const ie=k[I];let de=q[I];if(de===void 0&&(I==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),I==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),ie===void 0||ie.attribute!==de||de&&ie.data!==de.data)return!0;V++}return s.attributesNum!==V||s.index!==F}function v(S,w,Y,F){const k={},q=w.attributes;let V=0;const Z=Y.getAttributes();for(const I in Z)if(Z[I].location>=0){let ie=q[I];ie===void 0&&(I==="instanceMatrix"&&S.instanceMatrix&&(ie=S.instanceMatrix),I==="instanceColor"&&S.instanceColor&&(ie=S.instanceColor));const de={};de.attribute=ie,ie&&ie.data&&(de.data=ie.data),k[I]=de,V++}s.attributes=k,s.attributesNum=V,s.index=F}function x(){const S=s.newAttributes;for(let w=0,Y=S.length;w<Y;w++)S[w]=0}function g(S){d(S,0)}function d(S,w){const Y=s.newAttributes,F=s.enabledAttributes,k=s.attributeDivisors;Y[S]=1,F[S]===0&&(t.enableVertexAttribArray(S),F[S]=1),k[S]!==w&&(t.vertexAttribDivisor(S,w),k[S]=w)}function _(){const S=s.newAttributes,w=s.enabledAttributes;for(let Y=0,F=w.length;Y<F;Y++)w[Y]!==S[Y]&&(t.disableVertexAttribArray(Y),w[Y]=0)}function y(S,w,Y,F,k,q,V){V===!0?t.vertexAttribIPointer(S,w,Y,k,q):t.vertexAttribPointer(S,w,Y,F,k,q)}function T(S,w,Y,F){x();const k=F.attributes,q=Y.getAttributes(),V=w.defaultAttributeValues;for(const Z in q){const I=q[Z];if(I.location>=0){let ee=k[Z];if(ee===void 0&&(Z==="instanceMatrix"&&S.instanceMatrix&&(ee=S.instanceMatrix),Z==="instanceColor"&&S.instanceColor&&(ee=S.instanceColor)),ee!==void 0){const ie=ee.normalized,de=ee.itemSize,Ne=e.get(ee);if(Ne===void 0)continue;const qe=Ne.buffer,J=Ne.type,se=Ne.bytesPerElement,me=J===t.INT||J===t.UNSIGNED_INT||ee.gpuType===rh;if(ee.isInterleavedBufferAttribute){const pe=ee.data,ke=pe.stride,De=ee.offset;if(pe.isInstancedInterleavedBuffer){for(let He=0;He<I.locationSize;He++)d(I.location+He,pe.meshPerAttribute);S.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let He=0;He<I.locationSize;He++)g(I.location+He);t.bindBuffer(t.ARRAY_BUFFER,qe);for(let He=0;He<I.locationSize;He++)y(I.location+He,de/I.locationSize,J,ie,ke*se,(De+de/I.locationSize*He)*se,me)}else{if(ee.isInstancedBufferAttribute){for(let pe=0;pe<I.locationSize;pe++)d(I.location+pe,ee.meshPerAttribute);S.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let pe=0;pe<I.locationSize;pe++)g(I.location+pe);t.bindBuffer(t.ARRAY_BUFFER,qe);for(let pe=0;pe<I.locationSize;pe++)y(I.location+pe,de/I.locationSize,J,ie,de*se,de/I.locationSize*pe*se,me)}}else if(V!==void 0){const ie=V[Z];if(ie!==void 0)switch(ie.length){case 2:t.vertexAttrib2fv(I.location,ie);break;case 3:t.vertexAttrib3fv(I.location,ie);break;case 4:t.vertexAttrib4fv(I.location,ie);break;default:t.vertexAttrib1fv(I.location,ie)}}}}_()}function P(){N();for(const S in i){const w=i[S];for(const Y in w){const F=w[Y];for(const k in F)f(F[k].object),delete F[k];delete w[Y]}delete i[S]}}function R(S){if(i[S.id]===void 0)return;const w=i[S.id];for(const Y in w){const F=w[Y];for(const k in F)f(F[k].object),delete F[k];delete w[Y]}delete i[S.id]}function A(S){for(const w in i){const Y=i[w];if(Y[S.id]===void 0)continue;const F=Y[S.id];for(const k in F)f(F[k].object),delete F[k];delete Y[S.id]}}function N(){K(),a=!0,s!==r&&(s=r,u(s.object))}function K(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:N,resetDefaultState:K,dispose:P,releaseStatesOfGeometry:R,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:_}}function I1(t,e,n){let i;function r(u){i=u}function s(u,f){t.drawArrays(i,u,f),n.update(f,i,1)}function a(u,f,p){p!==0&&(t.drawArraysInstanced(i,u,f,p),n.update(f,i,p))}function o(u,f,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,u,0,f,0,p);let m=0;for(let v=0;v<p;v++)m+=f[v];n.update(m,i,1)}function l(u,f,p,h){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<u.length;v++)a(u[v],f[v],h[v]);else{m.multiDrawArraysInstancedWEBGL(i,u,0,f,0,h,0,p);let v=0;for(let x=0;x<p;x++)v+=f[x];for(let x=0;x<h.length;x++)n.update(v,i,h[x])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function U1(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==Zn&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const N=A===ro&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Ri&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ai&&!N)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=n.precision!==void 0?n.precision:"highp";const f=l(u);f!==u&&(console.warn("THREE.WebGLRenderer:",u,"not supported, using",f,"instead."),u=f);const p=n.logarithmicDepthBuffer===!0,h=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(h===!0){const A=e.get("EXT_clip_control");A.clipControlEXT(A.LOWER_LEFT_EXT,A.ZERO_TO_ONE_EXT)}const m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),d=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),y=t.getParameter(t.MAX_VARYING_VECTORS),T=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),P=v>0,R=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:u,logarithmicDepthBuffer:p,reverseDepthBuffer:h,maxTextures:m,maxVertexTextures:v,maxTextureSize:x,maxCubemapSize:g,maxAttributes:d,maxVertexUniforms:_,maxVaryings:y,maxFragmentUniforms:T,vertexTextures:P,maxSamples:R}}function F1(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new Sr,o=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){const m=p.length!==0||h||i!==0||r;return r=h,i=p.length,m},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,h){n=f(p,h,0)},this.setState=function(p,h,m){const v=p.clippingPlanes,x=p.clipIntersection,g=p.clipShadows,d=t.get(p);if(!r||v===null||v.length===0||s&&!g)s?f(null):u();else{const _=s?0:i,y=_*4;let T=d.clippingState||null;l.value=T,T=f(v,h,y,m);for(let P=0;P!==y;++P)T[P]=n[P];d.clippingState=T,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function u(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(p,h,m,v){const x=p!==null?p.length:0;let g=null;if(x!==0){if(g=l.value,v!==!0||g===null){const d=m+x*4,_=h.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<d)&&(g=new Float32Array(d));for(let y=0,T=m;y!==x;++y,T+=4)a.copy(p[y]).applyMatrix4(_,o),a.normal.toArray(g,T),g[T+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function O1(t){let e=new WeakMap;function n(a,o){return o===Pd?a.mapping=zs:o===Nd&&(a.mapping=js),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Pd||o===Nd)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const u=new qS(l.height);return u.fromEquirectangularTexture(t,a),e.set(a,u),a.addEventListener("dispose",r),n(u.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class gh extends C0{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,a=s+u*this.view.width,o-=f*this.view.offsetY,l=o-f*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Ss=4,im=[.125,.215,.35,.446,.526,.582],Tr=20,pu=new gh,rm=new Ke;let mu=null,gu=0,vu=0,_u=!1;const Mr=(1+Math.sqrt(5))/2,ss=1/Mr,sm=[new H(-Mr,ss,0),new H(Mr,ss,0),new H(-ss,0,Mr),new H(ss,0,Mr),new H(0,Mr,-ss),new H(0,Mr,ss),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class am{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){mu=this._renderer.getRenderTarget(),gu=this._renderer.getActiveCubeFace(),vu=this._renderer.getActiveMipmapLevel(),_u=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(mu,gu,vu),this._renderer.xr.enabled=_u,e.scissorTest=!1,Wo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===zs||e.mapping===js?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),mu=this._renderer.getRenderTarget(),gu=this._renderer.getActiveCubeFace(),vu=this._renderer.getActiveMipmapLevel(),_u=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Kn,minFilter:Kn,generateMipmaps:!1,type:ro,format:Zn,colorSpace:dr,depthBuffer:!1},r=om(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=om(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=k1(s)),this._blurMaterial=B1(s,e,n)}return r}_compileMaterial(e){const n=new Zt(this._lodPlanes[0],e);this._renderer.compile(n,pu)}_sceneToCubeUV(e,n,i,r){const o=new qn(90,1,n,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,h=f.toneMapping;f.getClearColor(rm),f.toneMapping=ir,f.autoClear=!1;const m=new vi({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),v=new Zt(new Mi,m);let x=!1;const g=e.background;g?g.isColor&&(m.color.copy(g),e.background=null,x=!0):(m.color.copy(rm),x=!0);for(let d=0;d<6;d++){const _=d%3;_===0?(o.up.set(0,l[d],0),o.lookAt(u[d],0,0)):_===1?(o.up.set(0,0,l[d]),o.lookAt(0,u[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,u[d]));const y=this._cubeSize;Wo(r,_*y,d>2?y:0,y,y),f.setRenderTarget(r),x&&f.render(v,o),f.render(e,o)}v.geometry.dispose(),v.material.dispose(),f.toneMapping=h,f.autoClear=p,e.background=g}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===zs||e.mapping===js;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=cm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=lm());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Zt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Wo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,pu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=sm[(r-s-1)%sm.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,u=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const f=3,p=new Zt(this._lodPlanes[r],u),h=u.uniforms,m=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Tr-1),x=s/v,g=isFinite(s)?1+Math.floor(f*x):Tr;g>Tr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Tr}`);const d=[];let _=0;for(let A=0;A<Tr;++A){const N=A/x,K=Math.exp(-N*N/2);d.push(K),A===0?_+=K:A<g&&(_+=2*K)}for(let A=0;A<d.length;A++)d[A]=d[A]/_;h.envMap.value=e.texture,h.samples.value=g,h.weights.value=d,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:y}=this;h.dTheta.value=v,h.mipInt.value=y-i;const T=this._sizeLods[r],P=3*T*(r>y-Ss?r-y+Ss:0),R=4*(this._cubeSize-T);Wo(n,P,R,3*T,2*T),l.setRenderTarget(n),l.render(p,pu)}}function k1(t){const e=[],n=[],i=[];let r=t;const s=t-Ss+1+im.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-Ss?l=im[a-t+Ss-1]:a===0&&(l=0),i.push(l);const u=1/(o-2),f=-u,p=1+u,h=[f,f,p,f,p,p,f,f,p,p,f,p],m=6,v=6,x=3,g=2,d=1,_=new Float32Array(x*v*m),y=new Float32Array(g*v*m),T=new Float32Array(d*v*m);for(let R=0;R<m;R++){const A=R%3*2/3-1,N=R>2?0:-1,K=[A,N,0,A+2/3,N,0,A+2/3,N+1,0,A,N,0,A+2/3,N+1,0,A,N+1,0];_.set(K,x*v*R),y.set(h,g*v*R);const S=[R,R,R,R,R,R];T.set(S,d*v*R)}const P=new On;P.setAttribute("position",new En(_,x)),P.setAttribute("uv",new En(y,g)),P.setAttribute("faceIndex",new En(T,d)),e.push(P),r>Ss&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function om(t,e,n){const i=new kr(t,e,n);return i.texture.mapping=hc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Wo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function B1(t,e,n){const i=new Float32Array(Tr),r=new H(0,1,0);return new or({name:"SphericalGaussianBlur",defines:{n:Tr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:vh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function lm(){return new or({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function cm(){return new or({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function vh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function z1(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,u=l===Pd||l===Nd,f=l===zs||l===js;if(u||f){let p=e.get(o);const h=p!==void 0?p.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return n===null&&(n=new am(t)),p=u?n.fromEquirectangular(o,p):n.fromCubemap(o,p),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),p.texture;if(p!==void 0)return p.texture;{const m=o.image;return u&&m&&m.height>0||f&&m&&r(m)?(n===null&&(n=new am(t)),p=u?n.fromEquirectangular(o):n.fromCubemap(o),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),o.addEventListener("dispose",s),p.texture):null}}}return o}function r(o){let l=0;const u=6;for(let f=0;f<u;f++)o[f]!==void 0&&l++;return l===u}function s(o){const l=o.target;l.removeEventListener("dispose",s);const u=e.get(l);u!==void 0&&(e.delete(l),u.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function j1(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&vl("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function H1(t,e,n,i){const r={},s=new WeakMap;function a(p){const h=p.target;h.index!==null&&e.remove(h.index);for(const v in h.attributes)e.remove(h.attributes[v]);for(const v in h.morphAttributes){const x=h.morphAttributes[v];for(let g=0,d=x.length;g<d;g++)e.remove(x[g])}h.removeEventListener("dispose",a),delete r[h.id];const m=s.get(h);m&&(e.remove(m),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(p,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,n.memory.geometries++),h}function l(p){const h=p.attributes;for(const v in h)e.update(h[v],t.ARRAY_BUFFER);const m=p.morphAttributes;for(const v in m){const x=m[v];for(let g=0,d=x.length;g<d;g++)e.update(x[g],t.ARRAY_BUFFER)}}function u(p){const h=[],m=p.index,v=p.attributes.position;let x=0;if(m!==null){const _=m.array;x=m.version;for(let y=0,T=_.length;y<T;y+=3){const P=_[y+0],R=_[y+1],A=_[y+2];h.push(P,R,R,A,A,P)}}else if(v!==void 0){const _=v.array;x=v.version;for(let y=0,T=_.length/3-1;y<T;y+=3){const P=y+0,R=y+1,A=y+2;h.push(P,R,R,A,A,P)}}else return;const g=new(y0(h)?w0:T0)(h,1);g.version=x;const d=s.get(p);d&&e.remove(d),s.set(p,g)}function f(p){const h=s.get(p);if(h){const m=p.index;m!==null&&h.version<m.version&&u(p)}else u(p);return s.get(p)}return{get:o,update:l,getWireframeAttribute:f}}function V1(t,e,n){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,m){t.drawElements(i,m,s,h*a),n.update(m,i,1)}function u(h,m,v){v!==0&&(t.drawElementsInstanced(i,m,s,h*a,v),n.update(m,i,v))}function f(h,m,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,s,h,0,v);let g=0;for(let d=0;d<v;d++)g+=m[d];n.update(g,i,1)}function p(h,m,v,x){if(v===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<h.length;d++)u(h[d]/a,m[d],x[d]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,s,h,0,x,0,v);let d=0;for(let _=0;_<v;_++)d+=m[_];for(let _=0;_<x.length;_++)n.update(d,i,x[_])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=u,this.renderMultiDraw=f,this.renderMultiDrawInstances=p}function G1(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function W1(t,e,n){const i=new WeakMap,r=new Tt;function s(a,o,l){const u=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=f!==void 0?f.length:0;let h=i.get(o);if(h===void 0||h.count!==p){let S=function(){N.dispose(),i.delete(o),o.removeEventListener("dispose",S)};var m=S;h!==void 0&&h.texture.dispose();const v=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let T=0;v===!0&&(T=1),x===!0&&(T=2),g===!0&&(T=3);let P=o.attributes.position.count*T,R=1;P>e.maxTextureSize&&(R=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const A=new Float32Array(P*R*4*p),N=new M0(A,P,R,p);N.type=ai,N.needsUpdate=!0;const K=T*4;for(let w=0;w<p;w++){const Y=d[w],F=_[w],k=y[w],q=P*R*4*w;for(let V=0;V<Y.count;V++){const Z=V*K;v===!0&&(r.fromBufferAttribute(Y,V),A[q+Z+0]=r.x,A[q+Z+1]=r.y,A[q+Z+2]=r.z,A[q+Z+3]=0),x===!0&&(r.fromBufferAttribute(F,V),A[q+Z+4]=r.x,A[q+Z+5]=r.y,A[q+Z+6]=r.z,A[q+Z+7]=0),g===!0&&(r.fromBufferAttribute(k,V),A[q+Z+8]=r.x,A[q+Z+9]=r.y,A[q+Z+10]=r.z,A[q+Z+11]=k.itemSize===4?r.w:1)}}h={count:p,texture:N,size:new Je(P,R)},i.set(o,h),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let v=0;for(let g=0;g<u.length;g++)v+=u[g];const x=o.morphTargetsRelative?1:1-v;l.getUniforms().setValue(t,"morphTargetBaseInfluence",x),l.getUniforms().setValue(t,"morphTargetInfluences",u)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function X1(t,e,n,i){let r=new WeakMap;function s(l){const u=i.render.frame,f=l.geometry,p=e.get(l,f);if(r.get(p)!==u&&(e.update(p),r.set(p,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==u&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==u&&(h.update(),r.set(h,u))}return p}function a(){r=new WeakMap}function o(l){const u=l.target;u.removeEventListener("dispose",o),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:s,dispose:a}}class P0 extends sn{constructor(e,n,i,r,s,a,o,l,u,f=bs){if(f!==bs&&f!==Vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&f===bs&&(i=Or),i===void 0&&f===Vs&&(i=Hs),super(null,r,s,a,o,l,f,i,u),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:fn,this.minFilter=l!==void 0?l:fn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const N0=new sn,um=new P0(1,1),L0=new M0,D0=new LS,I0=new R0,dm=[],fm=[],hm=new Float32Array(16),pm=new Float32Array(9),mm=new Float32Array(4);function Qs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=dm[r];if(s===void 0&&(s=new Float32Array(r),dm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Lt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Dt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function mc(t,e){let n=fm[e];n===void 0&&(n=new Int32Array(e),fm[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function $1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function q1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2fv(this.addr,e),Dt(n,e)}}function Y1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Lt(n,e))return;t.uniform3fv(this.addr,e),Dt(n,e)}}function K1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4fv(this.addr,e),Dt(n,e)}}function Z1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Dt(n,e)}else{if(Lt(n,i))return;mm.set(i),t.uniformMatrix2fv(this.addr,!1,mm),Dt(n,i)}}function Q1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Dt(n,e)}else{if(Lt(n,i))return;pm.set(i),t.uniformMatrix3fv(this.addr,!1,pm),Dt(n,i)}}function J1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Dt(n,e)}else{if(Lt(n,i))return;hm.set(i),t.uniformMatrix4fv(this.addr,!1,hm),Dt(n,i)}}function eT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function tT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2iv(this.addr,e),Dt(n,e)}}function nT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Lt(n,e))return;t.uniform3iv(this.addr,e),Dt(n,e)}}function iT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4iv(this.addr,e),Dt(n,e)}}function rT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function sT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2uiv(this.addr,e),Dt(n,e)}}function aT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Lt(n,e))return;t.uniform3uiv(this.addr,e),Dt(n,e)}}function oT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4uiv(this.addr,e),Dt(n,e)}}function lT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(um.compareFunction=x0,s=um):s=N0,n.setTexture2D(e||s,r)}function cT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||D0,r)}function uT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||I0,r)}function dT(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||L0,r)}function fT(t){switch(t){case 5126:return $1;case 35664:return q1;case 35665:return Y1;case 35666:return K1;case 35674:return Z1;case 35675:return Q1;case 35676:return J1;case 5124:case 35670:return eT;case 35667:case 35671:return tT;case 35668:case 35672:return nT;case 35669:case 35673:return iT;case 5125:return rT;case 36294:return sT;case 36295:return aT;case 36296:return oT;case 35678:case 36198:case 36298:case 36306:case 35682:return lT;case 35679:case 36299:case 36307:return cT;case 35680:case 36300:case 36308:case 36293:return uT;case 36289:case 36303:case 36311:case 36292:return dT}}function hT(t,e){t.uniform1fv(this.addr,e)}function pT(t,e){const n=Qs(e,this.size,2);t.uniform2fv(this.addr,n)}function mT(t,e){const n=Qs(e,this.size,3);t.uniform3fv(this.addr,n)}function gT(t,e){const n=Qs(e,this.size,4);t.uniform4fv(this.addr,n)}function vT(t,e){const n=Qs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function _T(t,e){const n=Qs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function xT(t,e){const n=Qs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function yT(t,e){t.uniform1iv(this.addr,e)}function ST(t,e){t.uniform2iv(this.addr,e)}function MT(t,e){t.uniform3iv(this.addr,e)}function ET(t,e){t.uniform4iv(this.addr,e)}function TT(t,e){t.uniform1uiv(this.addr,e)}function wT(t,e){t.uniform2uiv(this.addr,e)}function AT(t,e){t.uniform3uiv(this.addr,e)}function CT(t,e){t.uniform4uiv(this.addr,e)}function RT(t,e,n){const i=this.cache,r=e.length,s=mc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||N0,s[a])}function bT(t,e,n){const i=this.cache,r=e.length,s=mc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||D0,s[a])}function PT(t,e,n){const i=this.cache,r=e.length,s=mc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||I0,s[a])}function NT(t,e,n){const i=this.cache,r=e.length,s=mc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||L0,s[a])}function LT(t){switch(t){case 5126:return hT;case 35664:return pT;case 35665:return mT;case 35666:return gT;case 35674:return vT;case 35675:return _T;case 35676:return xT;case 5124:case 35670:return yT;case 35667:case 35671:return ST;case 35668:case 35672:return MT;case 35669:case 35673:return ET;case 5125:return TT;case 36294:return wT;case 36295:return AT;case 36296:return CT;case 35678:case 36198:case 36298:case 36306:case 35682:return RT;case 35679:case 36299:case 36307:return bT;case 35680:case 36300:case 36308:case 36293:return PT;case 36289:case 36303:case 36311:case 36292:return NT}}class DT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=fT(n.type)}}class IT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=LT(n.type)}}class UT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const xu=/(\w+)(\])?(\[|\.)?/g;function gm(t,e){t.seq.push(e),t.map[e.id]=e}function FT(t,e,n){const i=t.name,r=i.length;for(xu.lastIndex=0;;){const s=xu.exec(i),a=xu.lastIndex;let o=s[1];const l=s[2]==="]",u=s[3];if(l&&(o=o|0),u===void 0||u==="["&&a+2===r){gm(n,u===void 0?new DT(o,t,e):new IT(o,t,e));break}else{let p=n.map[o];p===void 0&&(p=new UT(o),gm(n,p)),n=p}}}class _l{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);FT(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function vm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const OT=37297;let kT=0;function BT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}function zT(t){const e=nt.getPrimaries(nt.workingColorSpace),n=nt.getPrimaries(t);let i;switch(e===n?i="":e===Xl&&n===Wl?i="LinearDisplayP3ToLinearSRGB":e===Wl&&n===Xl&&(i="LinearSRGBToLinearDisplayP3"),t){case dr:case pc:return[i,"LinearTransferOETF"];case ii:case dh:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function _m(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+BT(t.getShaderSource(e),a)}else return r}function jT(t,e){const n=zT(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function HT(t,e){let n;switch(e){case Hy:n="Linear";break;case Vy:n="Reinhard";break;case Gy:n="Cineon";break;case Wy:n="ACESFilmic";break;case $y:n="AgX";break;case qy:n="Neutral";break;case Xy:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Xo=new H;function VT(){nt.getLuminanceCoefficients(Xo);const t=Xo.x.toFixed(4),e=Xo.y.toFixed(4),n=Xo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function GT(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Sa).join(`
`)}function WT(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function XT(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function Sa(t){return t!==""}function xm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ym(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const $T=/^[ \t]*#include +<([\w\d./]+)>/gm;function of(t){return t.replace($T,YT)}const qT=new Map;function YT(t,e){let n=ze[e];if(n===void 0){const i=qT.get(e);if(i!==void 0)n=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return of(n)}const KT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sm(t){return t.replace(KT,ZT)}function ZT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Mm(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function QT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===o0?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Sy?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===mi&&(e="SHADOWMAP_TYPE_VSM"),e}function JT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case zs:case js:e="ENVMAP_TYPE_CUBE";break;case hc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ew(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case js:e="ENVMAP_MODE_REFRACTION";break}return e}function tw(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case l0:e="ENVMAP_BLENDING_MULTIPLY";break;case zy:e="ENVMAP_BLENDING_MIX";break;case jy:e="ENVMAP_BLENDING_ADD";break}return e}function nw(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function iw(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=QT(n),u=JT(n),f=ew(n),p=tw(n),h=nw(n),m=GT(n),v=WT(s),x=r.createProgram();let g,d,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Sa).join(`
`),g.length>0&&(g+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Sa).join(`
`),d.length>0&&(d+=`
`)):(g=[Mm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+f:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sa).join(`
`),d=[Mm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",n.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==ir?"#define TONE_MAPPING":"",n.toneMapping!==ir?ze.tonemapping_pars_fragment:"",n.toneMapping!==ir?HT("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,jT("linearToOutputTexel",n.outputColorSpace),VT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Sa).join(`
`)),a=of(a),a=xm(a,n),a=ym(a,n),o=of(o),o=xm(o,n),o=ym(o,n),a=Sm(a),o=Sm(o),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,d=["#define varying in",n.glslVersion===kp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===kp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=_+g+a,T=_+d+o,P=vm(r,r.VERTEX_SHADER,y),R=vm(r,r.FRAGMENT_SHADER,T);r.attachShader(x,P),r.attachShader(x,R),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function A(w){if(t.debug.checkShaderErrors){const Y=r.getProgramInfoLog(x).trim(),F=r.getShaderInfoLog(P).trim(),k=r.getShaderInfoLog(R).trim();let q=!0,V=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(q=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,x,P,R);else{const Z=_m(r,P,"vertex"),I=_m(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+Y+`
`+Z+`
`+I)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(F===""||k==="")&&(V=!1);V&&(w.diagnostics={runnable:q,programLog:Y,vertexShader:{log:F,prefix:g},fragmentShader:{log:k,prefix:d}})}r.deleteShader(P),r.deleteShader(R),N=new _l(r,x),K=XT(r,x)}let N;this.getUniforms=function(){return N===void 0&&A(this),N};let K;this.getAttributes=function(){return K===void 0&&A(this),K};let S=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(x,OT)),S},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=kT++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=P,this.fragmentShader=R,this}let rw=0;class sw{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new aw(e),n.set(e,i)),i}}class aw{constructor(e){this.id=rw++,this.code=e,this.usedTimes=0}}function ow(t,e,n,i,r,s,a){const o=new ph,l=new sw,u=new Set,f=[],p=r.logarithmicDepthBuffer,h=r.reverseDepthBuffer,m=r.vertexTextures;let v=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return u.add(S),S===0?"uv":`uv${S}`}function d(S,w,Y,F,k){const q=F.fog,V=k.geometry,Z=S.isMeshStandardMaterial?F.environment:null,I=(S.isMeshStandardMaterial?n:e).get(S.envMap||Z),ee=I&&I.mapping===hc?I.image.height:null,ie=x[S.type];S.precision!==null&&(v=r.getMaxPrecision(S.precision),v!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",v,"instead."));const de=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ne=de!==void 0?de.length:0;let qe=0;V.morphAttributes.position!==void 0&&(qe=1),V.morphAttributes.normal!==void 0&&(qe=2),V.morphAttributes.color!==void 0&&(qe=3);let J,se,me,pe;if(ie){const ce=ri[ie];J=ce.vertexShader,se=ce.fragmentShader}else J=S.vertexShader,se=S.fragmentShader,l.update(S),me=l.getVertexShaderID(S),pe=l.getFragmentShaderID(S);const ke=t.getRenderTarget(),De=k.isInstancedMesh===!0,He=k.isBatchedMesh===!0,Qe=!!S.map,Ge=!!S.matcap,U=!!I,Wt=!!S.aoMap,Ye=!!S.lightMap,Ve=!!S.bumpMap,Ie=!!S.normalMap,rt=!!S.displacementMap,Le=!!S.emissiveMap,b=!!S.metalnessMap,M=!!S.roughnessMap,G=S.anisotropy>0,ne=S.clearcoat>0,ae=S.dispersion>0,te=S.iridescence>0,Ae=S.sheen>0,fe=S.transmission>0,ge=G&&!!S.anisotropyMap,We=ne&&!!S.clearcoatMap,oe=ne&&!!S.clearcoatNormalMap,ve=ne&&!!S.clearcoatRoughnessMap,Ue=te&&!!S.iridescenceMap,be=te&&!!S.iridescenceThicknessMap,Me=Ae&&!!S.sheenColorMap,Xe=Ae&&!!S.sheenRoughnessMap,L=!!S.specularMap,X=!!S.specularColorMap,C=!!S.specularIntensityMap,B=fe&&!!S.transmissionMap,D=fe&&!!S.thicknessMap,O=!!S.gradientMap,Q=!!S.alphaMap,re=S.alphaTest>0,xe=!!S.alphaHash,Ee=!!S.extensions;let Be=ir;S.toneMapped&&(ke===null||ke.isXRRenderTarget===!0)&&(Be=t.toneMapping);const Te={shaderID:ie,shaderType:S.type,shaderName:S.name,vertexShader:J,fragmentShader:se,defines:S.defines,customVertexShaderID:me,customFragmentShaderID:pe,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:v,batching:He,batchingColor:He&&k._colorsTexture!==null,instancing:De,instancingColor:De&&k.instanceColor!==null,instancingMorph:De&&k.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:ke===null?t.outputColorSpace:ke.isXRRenderTarget===!0?ke.texture.colorSpace:dr,alphaToCoverage:!!S.alphaToCoverage,map:Qe,matcap:Ge,envMap:U,envMapMode:U&&I.mapping,envMapCubeUVHeight:ee,aoMap:Wt,lightMap:Ye,bumpMap:Ve,normalMap:Ie,displacementMap:m&&rt,emissiveMap:Le,normalMapObjectSpace:Ie&&S.normalMapType===Jy,normalMapTangentSpace:Ie&&S.normalMapType===Qy,metalnessMap:b,roughnessMap:M,anisotropy:G,anisotropyMap:ge,clearcoat:ne,clearcoatMap:We,clearcoatNormalMap:oe,clearcoatRoughnessMap:ve,dispersion:ae,iridescence:te,iridescenceMap:Ue,iridescenceThicknessMap:be,sheen:Ae,sheenColorMap:Me,sheenRoughnessMap:Xe,specularMap:L,specularColorMap:X,specularIntensityMap:C,transmission:fe,transmissionMap:B,thicknessMap:D,gradientMap:O,opaque:S.transparent===!1&&S.blending===Rs&&S.alphaToCoverage===!1,alphaMap:Q,alphaTest:re,alphaHash:xe,combine:S.combine,mapUv:Qe&&g(S.map.channel),aoMapUv:Wt&&g(S.aoMap.channel),lightMapUv:Ye&&g(S.lightMap.channel),bumpMapUv:Ve&&g(S.bumpMap.channel),normalMapUv:Ie&&g(S.normalMap.channel),displacementMapUv:rt&&g(S.displacementMap.channel),emissiveMapUv:Le&&g(S.emissiveMap.channel),metalnessMapUv:b&&g(S.metalnessMap.channel),roughnessMapUv:M&&g(S.roughnessMap.channel),anisotropyMapUv:ge&&g(S.anisotropyMap.channel),clearcoatMapUv:We&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:oe&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Ue&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:be&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Xe&&g(S.sheenRoughnessMap.channel),specularMapUv:L&&g(S.specularMap.channel),specularColorMapUv:X&&g(S.specularColorMap.channel),specularIntensityMapUv:C&&g(S.specularIntensityMap.channel),transmissionMapUv:B&&g(S.transmissionMap.channel),thicknessMapUv:D&&g(S.thicknessMap.channel),alphaMapUv:Q&&g(S.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Ie||G),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!V.attributes.uv&&(Qe||Q),fog:!!q,useFog:S.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:h,skinning:k.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Ne,morphTextureStride:qe,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:t.shadowMap.enabled&&Y.length>0,shadowMapType:t.shadowMap.type,toneMapping:Be,decodeVideoTexture:Qe&&S.map.isVideoTexture===!0&&nt.getTransfer(S.map.colorSpace)===pt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Yn,flipSided:S.side===rn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Ee&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ee&&S.extensions.multiDraw===!0||He)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Te.vertexUv1s=u.has(1),Te.vertexUv2s=u.has(2),Te.vertexUv3s=u.has(3),u.clear(),Te}function _(S){const w=[];if(S.shaderID?w.push(S.shaderID):(w.push(S.customVertexShaderID),w.push(S.customFragmentShaderID)),S.defines!==void 0)for(const Y in S.defines)w.push(Y),w.push(S.defines[Y]);return S.isRawShaderMaterial===!1&&(y(w,S),T(w,S),w.push(t.outputColorSpace)),w.push(S.customProgramCacheKey),w.join()}function y(S,w){S.push(w.precision),S.push(w.outputColorSpace),S.push(w.envMapMode),S.push(w.envMapCubeUVHeight),S.push(w.mapUv),S.push(w.alphaMapUv),S.push(w.lightMapUv),S.push(w.aoMapUv),S.push(w.bumpMapUv),S.push(w.normalMapUv),S.push(w.displacementMapUv),S.push(w.emissiveMapUv),S.push(w.metalnessMapUv),S.push(w.roughnessMapUv),S.push(w.anisotropyMapUv),S.push(w.clearcoatMapUv),S.push(w.clearcoatNormalMapUv),S.push(w.clearcoatRoughnessMapUv),S.push(w.iridescenceMapUv),S.push(w.iridescenceThicknessMapUv),S.push(w.sheenColorMapUv),S.push(w.sheenRoughnessMapUv),S.push(w.specularMapUv),S.push(w.specularColorMapUv),S.push(w.specularIntensityMapUv),S.push(w.transmissionMapUv),S.push(w.thicknessMapUv),S.push(w.combine),S.push(w.fogExp2),S.push(w.sizeAttenuation),S.push(w.morphTargetsCount),S.push(w.morphAttributeCount),S.push(w.numDirLights),S.push(w.numPointLights),S.push(w.numSpotLights),S.push(w.numSpotLightMaps),S.push(w.numHemiLights),S.push(w.numRectAreaLights),S.push(w.numDirLightShadows),S.push(w.numPointLightShadows),S.push(w.numSpotLightShadows),S.push(w.numSpotLightShadowsWithMaps),S.push(w.numLightProbes),S.push(w.shadowMapType),S.push(w.toneMapping),S.push(w.numClippingPlanes),S.push(w.numClipIntersection),S.push(w.depthPacking)}function T(S,w){o.disableAll(),w.supportsVertexTextures&&o.enable(0),w.instancing&&o.enable(1),w.instancingColor&&o.enable(2),w.instancingMorph&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),w.dispersion&&o.enable(20),w.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reverseDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.alphaToCoverage&&o.enable(20),S.push(o.mask)}function P(S){const w=x[S.type];let Y;if(w){const F=ri[w];Y=GS.clone(F.uniforms)}else Y=S.uniforms;return Y}function R(S,w){let Y;for(let F=0,k=f.length;F<k;F++){const q=f[F];if(q.cacheKey===w){Y=q,++Y.usedTimes;break}}return Y===void 0&&(Y=new iw(t,w,S,s),f.push(Y)),Y}function A(S){if(--S.usedTimes===0){const w=f.indexOf(S);f[w]=f[f.length-1],f.pop(),S.destroy()}}function N(S){l.remove(S)}function K(){l.dispose()}return{getParameters:d,getProgramCacheKey:_,getUniforms:P,acquireProgram:R,releaseProgram:A,releaseShaderCache:N,programs:f,dispose:K}}function lw(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function cw(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Em(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Tm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(p,h,m,v,x,g){let d=t[e];return d===void 0?(d={id:p.id,object:p,geometry:h,material:m,groupOrder:v,renderOrder:p.renderOrder,z:x,group:g},t[e]=d):(d.id=p.id,d.object=p,d.geometry=h,d.material=m,d.groupOrder=v,d.renderOrder=p.renderOrder,d.z=x,d.group=g),e++,d}function o(p,h,m,v,x,g){const d=a(p,h,m,v,x,g);m.transmission>0?i.push(d):m.transparent===!0?r.push(d):n.push(d)}function l(p,h,m,v,x,g){const d=a(p,h,m,v,x,g);m.transmission>0?i.unshift(d):m.transparent===!0?r.unshift(d):n.unshift(d)}function u(p,h){n.length>1&&n.sort(p||cw),i.length>1&&i.sort(h||Em),r.length>1&&r.sort(h||Em)}function f(){for(let p=e,h=t.length;p<h;p++){const m=t[p];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:f,sort:u}}function uw(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new Tm,t.set(i,[a])):r>=s.length?(a=new Tm,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function dw(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new H,color:new Ke};break;case"SpotLight":n={position:new H,direction:new H,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new H,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":n={direction:new H,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":n={color:new Ke,position:new H,halfWidth:new H,halfHeight:new H};break}return t[e.id]=n,n}}}function fw(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let hw=0;function pw(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function mw(t){const e=new dw,n=fw(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new H);const r=new H,s=new it,a=new it;function o(u){let f=0,p=0,h=0;for(let K=0;K<9;K++)i.probe[K].set(0,0,0);let m=0,v=0,x=0,g=0,d=0,_=0,y=0,T=0,P=0,R=0,A=0;u.sort(pw);for(let K=0,S=u.length;K<S;K++){const w=u[K],Y=w.color,F=w.intensity,k=w.distance,q=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)f+=Y.r*F,p+=Y.g*F,h+=Y.b*F;else if(w.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(w.sh.coefficients[V],F);A++}else if(w.isDirectionalLight){const V=e.get(w);if(V.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const Z=w.shadow,I=n.get(w);I.shadowIntensity=Z.intensity,I.shadowBias=Z.bias,I.shadowNormalBias=Z.normalBias,I.shadowRadius=Z.radius,I.shadowMapSize=Z.mapSize,i.directionalShadow[m]=I,i.directionalShadowMap[m]=q,i.directionalShadowMatrix[m]=w.shadow.matrix,_++}i.directional[m]=V,m++}else if(w.isSpotLight){const V=e.get(w);V.position.setFromMatrixPosition(w.matrixWorld),V.color.copy(Y).multiplyScalar(F),V.distance=k,V.coneCos=Math.cos(w.angle),V.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),V.decay=w.decay,i.spot[x]=V;const Z=w.shadow;if(w.map&&(i.spotLightMap[P]=w.map,P++,Z.updateMatrices(w),w.castShadow&&R++),i.spotLightMatrix[x]=Z.matrix,w.castShadow){const I=n.get(w);I.shadowIntensity=Z.intensity,I.shadowBias=Z.bias,I.shadowNormalBias=Z.normalBias,I.shadowRadius=Z.radius,I.shadowMapSize=Z.mapSize,i.spotShadow[x]=I,i.spotShadowMap[x]=q,T++}x++}else if(w.isRectAreaLight){const V=e.get(w);V.color.copy(Y).multiplyScalar(F),V.halfWidth.set(w.width*.5,0,0),V.halfHeight.set(0,w.height*.5,0),i.rectArea[g]=V,g++}else if(w.isPointLight){const V=e.get(w);if(V.color.copy(w.color).multiplyScalar(w.intensity),V.distance=w.distance,V.decay=w.decay,w.castShadow){const Z=w.shadow,I=n.get(w);I.shadowIntensity=Z.intensity,I.shadowBias=Z.bias,I.shadowNormalBias=Z.normalBias,I.shadowRadius=Z.radius,I.shadowMapSize=Z.mapSize,I.shadowCameraNear=Z.camera.near,I.shadowCameraFar=Z.camera.far,i.pointShadow[v]=I,i.pointShadowMap[v]=q,i.pointShadowMatrix[v]=w.shadow.matrix,y++}i.point[v]=V,v++}else if(w.isHemisphereLight){const V=e.get(w);V.skyColor.copy(w.color).multiplyScalar(F),V.groundColor.copy(w.groundColor).multiplyScalar(F),i.hemi[d]=V,d++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=p,i.ambient[2]=h;const N=i.hash;(N.directionalLength!==m||N.pointLength!==v||N.spotLength!==x||N.rectAreaLength!==g||N.hemiLength!==d||N.numDirectionalShadows!==_||N.numPointShadows!==y||N.numSpotShadows!==T||N.numSpotMaps!==P||N.numLightProbes!==A)&&(i.directional.length=m,i.spot.length=x,i.rectArea.length=g,i.point.length=v,i.hemi.length=d,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=T,i.spotShadowMap.length=T,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=T+P-R,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=A,N.directionalLength=m,N.pointLength=v,N.spotLength=x,N.rectAreaLength=g,N.hemiLength=d,N.numDirectionalShadows=_,N.numPointShadows=y,N.numSpotShadows=T,N.numSpotMaps=P,N.numLightProbes=A,i.version=hw++)}function l(u,f){let p=0,h=0,m=0,v=0,x=0;const g=f.matrixWorldInverse;for(let d=0,_=u.length;d<_;d++){const y=u[d];if(y.isDirectionalLight){const T=i.directional[p];T.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(g),p++}else if(y.isSpotLight){const T=i.spot[m];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(g),T.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(g),m++}else if(y.isRectAreaLight){const T=i.rectArea[v];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(g),a.identity(),s.copy(y.matrixWorld),s.premultiply(g),a.extractRotation(s),T.halfWidth.set(y.width*.5,0,0),T.halfHeight.set(0,y.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),v++}else if(y.isPointLight){const T=i.point[h];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(g),h++}else if(y.isHemisphereLight){const T=i.hemi[x];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(g),x++}}}return{setup:o,setupView:l,state:i}}function wm(t){const e=new mw(t),n=[],i=[];function r(f){u.camera=f,n.length=0,i.length=0}function s(f){n.push(f)}function a(f){i.push(f)}function o(){e.setup(n)}function l(f){e.setupView(n,f)}const u={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:u,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function gw(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new wm(t),e.set(r,[o])):s>=a.length?(o=new wm(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class vw extends so{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ky,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class _w extends so{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const xw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yw=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Sw(t,e,n){let i=new mh;const r=new Je,s=new Je,a=new Tt,o=new vw({depthPacking:Zy}),l=new _w,u={},f=n.maxTextureSize,p={[ar]:rn,[rn]:ar,[Yn]:Yn},h=new or({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Je},radius:{value:4}},vertexShader:xw,fragmentShader:yw}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const v=new On;v.setAttribute("position",new En(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Zt(v,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=o0;let d=this.type;this.render=function(R,A,N){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||R.length===0)return;const K=t.getRenderTarget(),S=t.getActiveCubeFace(),w=t.getActiveMipmapLevel(),Y=t.state;Y.setBlending(nr),Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);const F=d!==mi&&this.type===mi,k=d===mi&&this.type!==mi;for(let q=0,V=R.length;q<V;q++){const Z=R[q],I=Z.shadow;if(I===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;r.copy(I.mapSize);const ee=I.getFrameExtents();if(r.multiply(ee),s.copy(I.mapSize),(r.x>f||r.y>f)&&(r.x>f&&(s.x=Math.floor(f/ee.x),r.x=s.x*ee.x,I.mapSize.x=s.x),r.y>f&&(s.y=Math.floor(f/ee.y),r.y=s.y*ee.y,I.mapSize.y=s.y)),I.map===null||F===!0||k===!0){const de=this.type!==mi?{minFilter:fn,magFilter:fn}:{};I.map!==null&&I.map.dispose(),I.map=new kr(r.x,r.y,de),I.map.texture.name=Z.name+".shadowMap",I.camera.updateProjectionMatrix()}t.setRenderTarget(I.map),t.clear();const ie=I.getViewportCount();for(let de=0;de<ie;de++){const Ne=I.getViewport(de);a.set(s.x*Ne.x,s.y*Ne.y,s.x*Ne.z,s.y*Ne.w),Y.viewport(a),I.updateMatrices(Z,de),i=I.getFrustum(),T(A,N,I.camera,Z,this.type)}I.isPointLightShadow!==!0&&this.type===mi&&_(I,N),I.needsUpdate=!1}d=this.type,g.needsUpdate=!1,t.setRenderTarget(K,S,w)};function _(R,A){const N=e.update(x);h.defines.VSM_SAMPLES!==R.blurSamples&&(h.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new kr(r.x,r.y)),h.uniforms.shadow_pass.value=R.map.texture,h.uniforms.resolution.value=R.mapSize,h.uniforms.radius.value=R.radius,t.setRenderTarget(R.mapPass),t.clear(),t.renderBufferDirect(A,null,N,h,x,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,t.setRenderTarget(R.map),t.clear(),t.renderBufferDirect(A,null,N,m,x,null)}function y(R,A,N,K){let S=null;const w=N.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(w!==void 0)S=w;else if(S=N.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const Y=S.uuid,F=A.uuid;let k=u[Y];k===void 0&&(k={},u[Y]=k);let q=k[F];q===void 0&&(q=S.clone(),k[F]=q,A.addEventListener("dispose",P)),S=q}if(S.visible=A.visible,S.wireframe=A.wireframe,K===mi?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:p[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,N.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const Y=t.properties.get(S);Y.light=N}return S}function T(R,A,N,K,S){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&S===mi)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,R.matrixWorld);const F=e.update(R),k=R.material;if(Array.isArray(k)){const q=F.groups;for(let V=0,Z=q.length;V<Z;V++){const I=q[V],ee=k[I.materialIndex];if(ee&&ee.visible){const ie=y(R,ee,K,S);R.onBeforeShadow(t,R,A,N,F,ie,I),t.renderBufferDirect(N,null,F,ie,R,I),R.onAfterShadow(t,R,A,N,F,ie,I)}}}else if(k.visible){const q=y(R,k,K,S);R.onBeforeShadow(t,R,A,N,F,q,null),t.renderBufferDirect(N,null,F,q,R,null),R.onAfterShadow(t,R,A,N,F,q,null)}}const Y=R.children;for(let F=0,k=Y.length;F<k;F++)T(Y[F],A,N,K,S)}function P(R){R.target.removeEventListener("dispose",P);for(const N in u){const K=u[N],S=R.target.uuid;S in K&&(K[S].dispose(),delete K[S])}}}const Mw={[Ed]:Td,[wd]:Rd,[Ad]:bd,[Bs]:Cd,[Td]:Ed,[Rd]:wd,[bd]:Ad,[Cd]:Bs};function Ew(t){function e(){let C=!1;const B=new Tt;let D=null;const O=new Tt(0,0,0,0);return{setMask:function(Q){D!==Q&&!C&&(t.colorMask(Q,Q,Q,Q),D=Q)},setLocked:function(Q){C=Q},setClear:function(Q,re,xe,Ee,Be){Be===!0&&(Q*=Ee,re*=Ee,xe*=Ee),B.set(Q,re,xe,Ee),O.equals(B)===!1&&(t.clearColor(Q,re,xe,Ee),O.copy(B))},reset:function(){C=!1,D=null,O.set(-1,0,0,0)}}}function n(){let C=!1,B=!1,D=null,O=null,Q=null;return{setReversed:function(re){B=re},setTest:function(re){re?me(t.DEPTH_TEST):pe(t.DEPTH_TEST)},setMask:function(re){D!==re&&!C&&(t.depthMask(re),D=re)},setFunc:function(re){if(B&&(re=Mw[re]),O!==re){switch(re){case Ed:t.depthFunc(t.NEVER);break;case Td:t.depthFunc(t.ALWAYS);break;case wd:t.depthFunc(t.LESS);break;case Bs:t.depthFunc(t.LEQUAL);break;case Ad:t.depthFunc(t.EQUAL);break;case Cd:t.depthFunc(t.GEQUAL);break;case Rd:t.depthFunc(t.GREATER);break;case bd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}O=re}},setLocked:function(re){C=re},setClear:function(re){Q!==re&&(t.clearDepth(re),Q=re)},reset:function(){C=!1,D=null,O=null,Q=null}}}function i(){let C=!1,B=null,D=null,O=null,Q=null,re=null,xe=null,Ee=null,Be=null;return{setTest:function(Te){C||(Te?me(t.STENCIL_TEST):pe(t.STENCIL_TEST))},setMask:function(Te){B!==Te&&!C&&(t.stencilMask(Te),B=Te)},setFunc:function(Te,ce,ot){(D!==Te||O!==ce||Q!==ot)&&(t.stencilFunc(Te,ce,ot),D=Te,O=ce,Q=ot)},setOp:function(Te,ce,ot){(re!==Te||xe!==ce||Ee!==ot)&&(t.stencilOp(Te,ce,ot),re=Te,xe=ce,Ee=ot)},setLocked:function(Te){C=Te},setClear:function(Te){Be!==Te&&(t.clearStencil(Te),Be=Te)},reset:function(){C=!1,B=null,D=null,O=null,Q=null,re=null,xe=null,Ee=null,Be=null}}}const r=new e,s=new n,a=new i,o=new WeakMap,l=new WeakMap;let u={},f={},p=new WeakMap,h=[],m=null,v=!1,x=null,g=null,d=null,_=null,y=null,T=null,P=null,R=new Ke(0,0,0),A=0,N=!1,K=null,S=null,w=null,Y=null,F=null;const k=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,V=0;const Z=t.getParameter(t.VERSION);Z.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(Z)[1]),q=V>=1):Z.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),q=V>=2);let I=null,ee={};const ie=t.getParameter(t.SCISSOR_BOX),de=t.getParameter(t.VIEWPORT),Ne=new Tt().fromArray(ie),qe=new Tt().fromArray(de);function J(C,B,D,O){const Q=new Uint8Array(4),re=t.createTexture();t.bindTexture(C,re),t.texParameteri(C,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(C,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let xe=0;xe<D;xe++)C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY?t.texImage3D(B,0,t.RGBA,1,1,O,0,t.RGBA,t.UNSIGNED_BYTE,Q):t.texImage2D(B+xe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Q);return re}const se={};se[t.TEXTURE_2D]=J(t.TEXTURE_2D,t.TEXTURE_2D,1),se[t.TEXTURE_CUBE_MAP]=J(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[t.TEXTURE_2D_ARRAY]=J(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),se[t.TEXTURE_3D]=J(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),me(t.DEPTH_TEST),s.setFunc(Bs),Ye(!1),Ve(Lp),me(t.CULL_FACE),U(nr);function me(C){u[C]!==!0&&(t.enable(C),u[C]=!0)}function pe(C){u[C]!==!1&&(t.disable(C),u[C]=!1)}function ke(C,B){return f[C]!==B?(t.bindFramebuffer(C,B),f[C]=B,C===t.DRAW_FRAMEBUFFER&&(f[t.FRAMEBUFFER]=B),C===t.FRAMEBUFFER&&(f[t.DRAW_FRAMEBUFFER]=B),!0):!1}function De(C,B){let D=h,O=!1;if(C){D=p.get(B),D===void 0&&(D=[],p.set(B,D));const Q=C.textures;if(D.length!==Q.length||D[0]!==t.COLOR_ATTACHMENT0){for(let re=0,xe=Q.length;re<xe;re++)D[re]=t.COLOR_ATTACHMENT0+re;D.length=Q.length,O=!0}}else D[0]!==t.BACK&&(D[0]=t.BACK,O=!0);O&&t.drawBuffers(D)}function He(C){return m!==C?(t.useProgram(C),m=C,!0):!1}const Qe={[Er]:t.FUNC_ADD,[Ey]:t.FUNC_SUBTRACT,[Ty]:t.FUNC_REVERSE_SUBTRACT};Qe[wy]=t.MIN,Qe[Ay]=t.MAX;const Ge={[Cy]:t.ZERO,[Ry]:t.ONE,[by]:t.SRC_COLOR,[Sd]:t.SRC_ALPHA,[Uy]:t.SRC_ALPHA_SATURATE,[Dy]:t.DST_COLOR,[Ny]:t.DST_ALPHA,[Py]:t.ONE_MINUS_SRC_COLOR,[Md]:t.ONE_MINUS_SRC_ALPHA,[Iy]:t.ONE_MINUS_DST_COLOR,[Ly]:t.ONE_MINUS_DST_ALPHA,[Fy]:t.CONSTANT_COLOR,[Oy]:t.ONE_MINUS_CONSTANT_COLOR,[ky]:t.CONSTANT_ALPHA,[By]:t.ONE_MINUS_CONSTANT_ALPHA};function U(C,B,D,O,Q,re,xe,Ee,Be,Te){if(C===nr){v===!0&&(pe(t.BLEND),v=!1);return}if(v===!1&&(me(t.BLEND),v=!0),C!==My){if(C!==x||Te!==N){if((g!==Er||y!==Er)&&(t.blendEquation(t.FUNC_ADD),g=Er,y=Er),Te)switch(C){case Rs:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Dp:t.blendFunc(t.ONE,t.ONE);break;case Ip:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Up:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case Rs:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Dp:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Ip:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Up:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}d=null,_=null,T=null,P=null,R.set(0,0,0),A=0,x=C,N=Te}return}Q=Q||B,re=re||D,xe=xe||O,(B!==g||Q!==y)&&(t.blendEquationSeparate(Qe[B],Qe[Q]),g=B,y=Q),(D!==d||O!==_||re!==T||xe!==P)&&(t.blendFuncSeparate(Ge[D],Ge[O],Ge[re],Ge[xe]),d=D,_=O,T=re,P=xe),(Ee.equals(R)===!1||Be!==A)&&(t.blendColor(Ee.r,Ee.g,Ee.b,Be),R.copy(Ee),A=Be),x=C,N=!1}function Wt(C,B){C.side===Yn?pe(t.CULL_FACE):me(t.CULL_FACE);let D=C.side===rn;B&&(D=!D),Ye(D),C.blending===Rs&&C.transparent===!1?U(nr):U(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),s.setFunc(C.depthFunc),s.setTest(C.depthTest),s.setMask(C.depthWrite),r.setMask(C.colorWrite);const O=C.stencilWrite;a.setTest(O),O&&(a.setMask(C.stencilWriteMask),a.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),a.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),rt(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?me(t.SAMPLE_ALPHA_TO_COVERAGE):pe(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ye(C){K!==C&&(C?t.frontFace(t.CW):t.frontFace(t.CCW),K=C)}function Ve(C){C!==xy?(me(t.CULL_FACE),C!==S&&(C===Lp?t.cullFace(t.BACK):C===yy?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):pe(t.CULL_FACE),S=C}function Ie(C){C!==w&&(q&&t.lineWidth(C),w=C)}function rt(C,B,D){C?(me(t.POLYGON_OFFSET_FILL),(Y!==B||F!==D)&&(t.polygonOffset(B,D),Y=B,F=D)):pe(t.POLYGON_OFFSET_FILL)}function Le(C){C?me(t.SCISSOR_TEST):pe(t.SCISSOR_TEST)}function b(C){C===void 0&&(C=t.TEXTURE0+k-1),I!==C&&(t.activeTexture(C),I=C)}function M(C,B,D){D===void 0&&(I===null?D=t.TEXTURE0+k-1:D=I);let O=ee[D];O===void 0&&(O={type:void 0,texture:void 0},ee[D]=O),(O.type!==C||O.texture!==B)&&(I!==D&&(t.activeTexture(D),I=D),t.bindTexture(C,B||se[C]),O.type=C,O.texture=B)}function G(){const C=ee[I];C!==void 0&&C.type!==void 0&&(t.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function ne(){try{t.compressedTexImage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ae(){try{t.compressedTexImage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function te(){try{t.texSubImage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ae(){try{t.texSubImage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function fe(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ge(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function We(){try{t.texStorage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function oe(){try{t.texStorage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ve(){try{t.texImage2D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ue(){try{t.texImage3D.apply(t,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function be(C){Ne.equals(C)===!1&&(t.scissor(C.x,C.y,C.z,C.w),Ne.copy(C))}function Me(C){qe.equals(C)===!1&&(t.viewport(C.x,C.y,C.z,C.w),qe.copy(C))}function Xe(C,B){let D=l.get(B);D===void 0&&(D=new WeakMap,l.set(B,D));let O=D.get(C);O===void 0&&(O=t.getUniformBlockIndex(B,C.name),D.set(C,O))}function L(C,B){const O=l.get(B).get(C);o.get(B)!==O&&(t.uniformBlockBinding(B,O,C.__bindingPointIndex),o.set(B,O))}function X(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),u={},I=null,ee={},f={},p=new WeakMap,h=[],m=null,v=!1,x=null,g=null,d=null,_=null,y=null,T=null,P=null,R=new Ke(0,0,0),A=0,N=!1,K=null,S=null,w=null,Y=null,F=null,Ne.set(0,0,t.canvas.width,t.canvas.height),qe.set(0,0,t.canvas.width,t.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:me,disable:pe,bindFramebuffer:ke,drawBuffers:De,useProgram:He,setBlending:U,setMaterial:Wt,setFlipSided:Ye,setCullFace:Ve,setLineWidth:Ie,setPolygonOffset:rt,setScissorTest:Le,activeTexture:b,bindTexture:M,unbindTexture:G,compressedTexImage2D:ne,compressedTexImage3D:ae,texImage2D:ve,texImage3D:Ue,updateUBOMapping:Xe,uniformBlockBinding:L,texStorage2D:We,texStorage3D:oe,texSubImage2D:te,texSubImage3D:Ae,compressedTexSubImage2D:fe,compressedTexSubImage3D:ge,scissor:be,viewport:Me,reset:X}}function Am(t,e,n,i){const r=Tw(i);switch(n){case h0:return t*e;case m0:return t*e;case g0:return t*e*2;case oh:return t*e/r.components*r.byteLength;case lh:return t*e/r.components*r.byteLength;case v0:return t*e*2/r.components*r.byteLength;case ch:return t*e*2/r.components*r.byteLength;case p0:return t*e*3/r.components*r.byteLength;case Zn:return t*e*4/r.components*r.byteLength;case uh:return t*e*4/r.components*r.byteLength;case fl:case hl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case pl:case ml:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ud:case Od:return Math.max(t,16)*Math.max(e,8)/4;case Id:case Fd:return Math.max(t,8)*Math.max(e,8)/2;case kd:case Bd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case zd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case jd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Hd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Vd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Gd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Wd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Xd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case $d:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case qd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Yd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Kd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Zd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Qd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Jd:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case ef:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case gl:case tf:case nf:return Math.ceil(t/4)*Math.ceil(e/4)*16;case _0:case rf:return Math.ceil(t/4)*Math.ceil(e/4)*8;case sf:case af:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function Tw(t){switch(t){case Ri:case u0:return{byteLength:1,components:1};case Ka:case d0:case ro:return{byteLength:2,components:1};case sh:case ah:return{byteLength:2,components:4};case Or:case rh:case ai:return{byteLength:4,components:1};case f0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function ww(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new Je,f=new WeakMap;let p;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(b,M){return m?new OffscreenCanvas(b,M):ql("canvas")}function x(b,M,G){let ne=1;const ae=Le(b);if((ae.width>G||ae.height>G)&&(ne=G/Math.max(ae.width,ae.height)),ne<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const te=Math.floor(ne*ae.width),Ae=Math.floor(ne*ae.height);p===void 0&&(p=v(te,Ae));const fe=M?v(te,Ae):p;return fe.width=te,fe.height=Ae,fe.getContext("2d").drawImage(b,0,0,te,Ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+te+"x"+Ae+")."),fe}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),b;return b}function g(b){return b.generateMipmaps&&b.minFilter!==fn&&b.minFilter!==Kn}function d(b){t.generateMipmap(b)}function _(b,M,G,ne,ae=!1){if(b!==null){if(t[b]!==void 0)return t[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let te=M;if(M===t.RED&&(G===t.FLOAT&&(te=t.R32F),G===t.HALF_FLOAT&&(te=t.R16F),G===t.UNSIGNED_BYTE&&(te=t.R8)),M===t.RED_INTEGER&&(G===t.UNSIGNED_BYTE&&(te=t.R8UI),G===t.UNSIGNED_SHORT&&(te=t.R16UI),G===t.UNSIGNED_INT&&(te=t.R32UI),G===t.BYTE&&(te=t.R8I),G===t.SHORT&&(te=t.R16I),G===t.INT&&(te=t.R32I)),M===t.RG&&(G===t.FLOAT&&(te=t.RG32F),G===t.HALF_FLOAT&&(te=t.RG16F),G===t.UNSIGNED_BYTE&&(te=t.RG8)),M===t.RG_INTEGER&&(G===t.UNSIGNED_BYTE&&(te=t.RG8UI),G===t.UNSIGNED_SHORT&&(te=t.RG16UI),G===t.UNSIGNED_INT&&(te=t.RG32UI),G===t.BYTE&&(te=t.RG8I),G===t.SHORT&&(te=t.RG16I),G===t.INT&&(te=t.RG32I)),M===t.RGB_INTEGER&&(G===t.UNSIGNED_BYTE&&(te=t.RGB8UI),G===t.UNSIGNED_SHORT&&(te=t.RGB16UI),G===t.UNSIGNED_INT&&(te=t.RGB32UI),G===t.BYTE&&(te=t.RGB8I),G===t.SHORT&&(te=t.RGB16I),G===t.INT&&(te=t.RGB32I)),M===t.RGBA_INTEGER&&(G===t.UNSIGNED_BYTE&&(te=t.RGBA8UI),G===t.UNSIGNED_SHORT&&(te=t.RGBA16UI),G===t.UNSIGNED_INT&&(te=t.RGBA32UI),G===t.BYTE&&(te=t.RGBA8I),G===t.SHORT&&(te=t.RGBA16I),G===t.INT&&(te=t.RGBA32I)),M===t.RGB&&G===t.UNSIGNED_INT_5_9_9_9_REV&&(te=t.RGB9_E5),M===t.RGBA){const Ae=ae?Gl:nt.getTransfer(ne);G===t.FLOAT&&(te=t.RGBA32F),G===t.HALF_FLOAT&&(te=t.RGBA16F),G===t.UNSIGNED_BYTE&&(te=Ae===pt?t.SRGB8_ALPHA8:t.RGBA8),G===t.UNSIGNED_SHORT_4_4_4_4&&(te=t.RGBA4),G===t.UNSIGNED_SHORT_5_5_5_1&&(te=t.RGB5_A1)}return(te===t.R16F||te===t.R32F||te===t.RG16F||te===t.RG32F||te===t.RGBA16F||te===t.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function y(b,M){let G;return b?M===null||M===Or||M===Hs?G=t.DEPTH24_STENCIL8:M===ai?G=t.DEPTH32F_STENCIL8:M===Ka&&(G=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Or||M===Hs?G=t.DEPTH_COMPONENT24:M===ai?G=t.DEPTH_COMPONENT32F:M===Ka&&(G=t.DEPTH_COMPONENT16),G}function T(b,M){return g(b)===!0||b.isFramebufferTexture&&b.minFilter!==fn&&b.minFilter!==Kn?Math.log2(Math.max(M.width,M.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?M.mipmaps.length:1}function P(b){const M=b.target;M.removeEventListener("dispose",P),A(M),M.isVideoTexture&&f.delete(M)}function R(b){const M=b.target;M.removeEventListener("dispose",R),K(M)}function A(b){const M=i.get(b);if(M.__webglInit===void 0)return;const G=b.source,ne=h.get(G);if(ne){const ae=ne[M.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&N(b),Object.keys(ne).length===0&&h.delete(G)}i.remove(b)}function N(b){const M=i.get(b);t.deleteTexture(M.__webglTexture);const G=b.source,ne=h.get(G);delete ne[M.__cacheKey],a.memory.textures--}function K(b){const M=i.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(M.__webglFramebuffer[ne]))for(let ae=0;ae<M.__webglFramebuffer[ne].length;ae++)t.deleteFramebuffer(M.__webglFramebuffer[ne][ae]);else t.deleteFramebuffer(M.__webglFramebuffer[ne]);M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer[ne])}else{if(Array.isArray(M.__webglFramebuffer))for(let ne=0;ne<M.__webglFramebuffer.length;ne++)t.deleteFramebuffer(M.__webglFramebuffer[ne]);else t.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&t.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let ne=0;ne<M.__webglColorRenderbuffer.length;ne++)M.__webglColorRenderbuffer[ne]&&t.deleteRenderbuffer(M.__webglColorRenderbuffer[ne]);M.__webglDepthRenderbuffer&&t.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const G=b.textures;for(let ne=0,ae=G.length;ne<ae;ne++){const te=i.get(G[ne]);te.__webglTexture&&(t.deleteTexture(te.__webglTexture),a.memory.textures--),i.remove(G[ne])}i.remove(b)}let S=0;function w(){S=0}function Y(){const b=S;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),S+=1,b}function F(b){const M=[];return M.push(b.wrapS),M.push(b.wrapT),M.push(b.wrapR||0),M.push(b.magFilter),M.push(b.minFilter),M.push(b.anisotropy),M.push(b.internalFormat),M.push(b.format),M.push(b.type),M.push(b.generateMipmaps),M.push(b.premultiplyAlpha),M.push(b.flipY),M.push(b.unpackAlignment),M.push(b.colorSpace),M.join()}function k(b,M){const G=i.get(b);if(b.isVideoTexture&&Ie(b),b.isRenderTargetTexture===!1&&b.version>0&&G.__version!==b.version){const ne=b.image;if(ne===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{qe(G,b,M);return}}n.bindTexture(t.TEXTURE_2D,G.__webglTexture,t.TEXTURE0+M)}function q(b,M){const G=i.get(b);if(b.version>0&&G.__version!==b.version){qe(G,b,M);return}n.bindTexture(t.TEXTURE_2D_ARRAY,G.__webglTexture,t.TEXTURE0+M)}function V(b,M){const G=i.get(b);if(b.version>0&&G.__version!==b.version){qe(G,b,M);return}n.bindTexture(t.TEXTURE_3D,G.__webglTexture,t.TEXTURE0+M)}function Z(b,M){const G=i.get(b);if(b.version>0&&G.__version!==b.version){J(G,b,M);return}n.bindTexture(t.TEXTURE_CUBE_MAP,G.__webglTexture,t.TEXTURE0+M)}const I={[Ld]:t.REPEAT,[Rr]:t.CLAMP_TO_EDGE,[Dd]:t.MIRRORED_REPEAT},ee={[fn]:t.NEAREST,[Yy]:t.NEAREST_MIPMAP_NEAREST,[wo]:t.NEAREST_MIPMAP_LINEAR,[Kn]:t.LINEAR,[Xc]:t.LINEAR_MIPMAP_NEAREST,[br]:t.LINEAR_MIPMAP_LINEAR},ie={[eS]:t.NEVER,[aS]:t.ALWAYS,[tS]:t.LESS,[x0]:t.LEQUAL,[nS]:t.EQUAL,[sS]:t.GEQUAL,[iS]:t.GREATER,[rS]:t.NOTEQUAL};function de(b,M){if(M.type===ai&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Kn||M.magFilter===Xc||M.magFilter===wo||M.magFilter===br||M.minFilter===Kn||M.minFilter===Xc||M.minFilter===wo||M.minFilter===br)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(b,t.TEXTURE_WRAP_S,I[M.wrapS]),t.texParameteri(b,t.TEXTURE_WRAP_T,I[M.wrapT]),(b===t.TEXTURE_3D||b===t.TEXTURE_2D_ARRAY)&&t.texParameteri(b,t.TEXTURE_WRAP_R,I[M.wrapR]),t.texParameteri(b,t.TEXTURE_MAG_FILTER,ee[M.magFilter]),t.texParameteri(b,t.TEXTURE_MIN_FILTER,ee[M.minFilter]),M.compareFunction&&(t.texParameteri(b,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(b,t.TEXTURE_COMPARE_FUNC,ie[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===fn||M.minFilter!==wo&&M.minFilter!==br||M.type===ai&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");t.texParameterf(b,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Ne(b,M){let G=!1;b.__webglInit===void 0&&(b.__webglInit=!0,M.addEventListener("dispose",P));const ne=M.source;let ae=h.get(ne);ae===void 0&&(ae={},h.set(ne,ae));const te=F(M);if(te!==b.__cacheKey){ae[te]===void 0&&(ae[te]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,G=!0),ae[te].usedTimes++;const Ae=ae[b.__cacheKey];Ae!==void 0&&(ae[b.__cacheKey].usedTimes--,Ae.usedTimes===0&&N(M)),b.__cacheKey=te,b.__webglTexture=ae[te].texture}return G}function qe(b,M,G){let ne=t.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(ne=t.TEXTURE_2D_ARRAY),M.isData3DTexture&&(ne=t.TEXTURE_3D);const ae=Ne(b,M),te=M.source;n.bindTexture(ne,b.__webglTexture,t.TEXTURE0+G);const Ae=i.get(te);if(te.version!==Ae.__version||ae===!0){n.activeTexture(t.TEXTURE0+G);const fe=nt.getPrimaries(nt.workingColorSpace),ge=M.colorSpace===Gi?null:nt.getPrimaries(M.colorSpace),We=M.colorSpace===Gi||fe===ge?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,We);let oe=x(M.image,!1,r.maxTextureSize);oe=rt(M,oe);const ve=s.convert(M.format,M.colorSpace),Ue=s.convert(M.type);let be=_(M.internalFormat,ve,Ue,M.colorSpace,M.isVideoTexture);de(ne,M);let Me;const Xe=M.mipmaps,L=M.isVideoTexture!==!0,X=Ae.__version===void 0||ae===!0,C=te.dataReady,B=T(M,oe);if(M.isDepthTexture)be=y(M.format===Vs,M.type),X&&(L?n.texStorage2D(t.TEXTURE_2D,1,be,oe.width,oe.height):n.texImage2D(t.TEXTURE_2D,0,be,oe.width,oe.height,0,ve,Ue,null));else if(M.isDataTexture)if(Xe.length>0){L&&X&&n.texStorage2D(t.TEXTURE_2D,B,be,Xe[0].width,Xe[0].height);for(let D=0,O=Xe.length;D<O;D++)Me=Xe[D],L?C&&n.texSubImage2D(t.TEXTURE_2D,D,0,0,Me.width,Me.height,ve,Ue,Me.data):n.texImage2D(t.TEXTURE_2D,D,be,Me.width,Me.height,0,ve,Ue,Me.data);M.generateMipmaps=!1}else L?(X&&n.texStorage2D(t.TEXTURE_2D,B,be,oe.width,oe.height),C&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,oe.width,oe.height,ve,Ue,oe.data)):n.texImage2D(t.TEXTURE_2D,0,be,oe.width,oe.height,0,ve,Ue,oe.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){L&&X&&n.texStorage3D(t.TEXTURE_2D_ARRAY,B,be,Xe[0].width,Xe[0].height,oe.depth);for(let D=0,O=Xe.length;D<O;D++)if(Me=Xe[D],M.format!==Zn)if(ve!==null)if(L){if(C)if(M.layerUpdates.size>0){const Q=Am(Me.width,Me.height,M.format,M.type);for(const re of M.layerUpdates){const xe=Me.data.subarray(re*Q/Me.data.BYTES_PER_ELEMENT,(re+1)*Q/Me.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,D,0,0,re,Me.width,Me.height,1,ve,xe,0,0)}M.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,D,0,0,0,Me.width,Me.height,oe.depth,ve,Me.data,0,0)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,D,be,Me.width,Me.height,oe.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?C&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,D,0,0,0,Me.width,Me.height,oe.depth,ve,Ue,Me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,D,be,Me.width,Me.height,oe.depth,0,ve,Ue,Me.data)}else{L&&X&&n.texStorage2D(t.TEXTURE_2D,B,be,Xe[0].width,Xe[0].height);for(let D=0,O=Xe.length;D<O;D++)Me=Xe[D],M.format!==Zn?ve!==null?L?C&&n.compressedTexSubImage2D(t.TEXTURE_2D,D,0,0,Me.width,Me.height,ve,Me.data):n.compressedTexImage2D(t.TEXTURE_2D,D,be,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?C&&n.texSubImage2D(t.TEXTURE_2D,D,0,0,Me.width,Me.height,ve,Ue,Me.data):n.texImage2D(t.TEXTURE_2D,D,be,Me.width,Me.height,0,ve,Ue,Me.data)}else if(M.isDataArrayTexture)if(L){if(X&&n.texStorage3D(t.TEXTURE_2D_ARRAY,B,be,oe.width,oe.height,oe.depth),C)if(M.layerUpdates.size>0){const D=Am(oe.width,oe.height,M.format,M.type);for(const O of M.layerUpdates){const Q=oe.data.subarray(O*D/oe.data.BYTES_PER_ELEMENT,(O+1)*D/oe.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,O,oe.width,oe.height,1,ve,Ue,Q)}M.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,ve,Ue,oe.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,be,oe.width,oe.height,oe.depth,0,ve,Ue,oe.data);else if(M.isData3DTexture)L?(X&&n.texStorage3D(t.TEXTURE_3D,B,be,oe.width,oe.height,oe.depth),C&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,ve,Ue,oe.data)):n.texImage3D(t.TEXTURE_3D,0,be,oe.width,oe.height,oe.depth,0,ve,Ue,oe.data);else if(M.isFramebufferTexture){if(X)if(L)n.texStorage2D(t.TEXTURE_2D,B,be,oe.width,oe.height);else{let D=oe.width,O=oe.height;for(let Q=0;Q<B;Q++)n.texImage2D(t.TEXTURE_2D,Q,be,D,O,0,ve,Ue,null),D>>=1,O>>=1}}else if(Xe.length>0){if(L&&X){const D=Le(Xe[0]);n.texStorage2D(t.TEXTURE_2D,B,be,D.width,D.height)}for(let D=0,O=Xe.length;D<O;D++)Me=Xe[D],L?C&&n.texSubImage2D(t.TEXTURE_2D,D,0,0,ve,Ue,Me):n.texImage2D(t.TEXTURE_2D,D,be,ve,Ue,Me);M.generateMipmaps=!1}else if(L){if(X){const D=Le(oe);n.texStorage2D(t.TEXTURE_2D,B,be,D.width,D.height)}C&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ve,Ue,oe)}else n.texImage2D(t.TEXTURE_2D,0,be,ve,Ue,oe);g(M)&&d(ne),Ae.__version=te.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function J(b,M,G){if(M.image.length!==6)return;const ne=Ne(b,M),ae=M.source;n.bindTexture(t.TEXTURE_CUBE_MAP,b.__webglTexture,t.TEXTURE0+G);const te=i.get(ae);if(ae.version!==te.__version||ne===!0){n.activeTexture(t.TEXTURE0+G);const Ae=nt.getPrimaries(nt.workingColorSpace),fe=M.colorSpace===Gi?null:nt.getPrimaries(M.colorSpace),ge=M.colorSpace===Gi||Ae===fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const We=M.isCompressedTexture||M.image[0].isCompressedTexture,oe=M.image[0]&&M.image[0].isDataTexture,ve=[];for(let O=0;O<6;O++)!We&&!oe?ve[O]=x(M.image[O],!0,r.maxCubemapSize):ve[O]=oe?M.image[O].image:M.image[O],ve[O]=rt(M,ve[O]);const Ue=ve[0],be=s.convert(M.format,M.colorSpace),Me=s.convert(M.type),Xe=_(M.internalFormat,be,Me,M.colorSpace),L=M.isVideoTexture!==!0,X=te.__version===void 0||ne===!0,C=ae.dataReady;let B=T(M,Ue);de(t.TEXTURE_CUBE_MAP,M);let D;if(We){L&&X&&n.texStorage2D(t.TEXTURE_CUBE_MAP,B,Xe,Ue.width,Ue.height);for(let O=0;O<6;O++){D=ve[O].mipmaps;for(let Q=0;Q<D.length;Q++){const re=D[Q];M.format!==Zn?be!==null?L?C&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q,0,0,re.width,re.height,be,re.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q,Xe,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q,0,0,re.width,re.height,be,Me,re.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q,Xe,re.width,re.height,0,be,Me,re.data)}}}else{if(D=M.mipmaps,L&&X){D.length>0&&B++;const O=Le(ve[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,B,Xe,O.width,O.height)}for(let O=0;O<6;O++)if(oe){L?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,0,0,0,ve[O].width,ve[O].height,be,Me,ve[O].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,0,Xe,ve[O].width,ve[O].height,0,be,Me,ve[O].data);for(let Q=0;Q<D.length;Q++){const xe=D[Q].image[O].image;L?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q+1,0,0,xe.width,xe.height,be,Me,xe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q+1,Xe,xe.width,xe.height,0,be,Me,xe.data)}}else{L?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,0,0,0,be,Me,ve[O]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,0,Xe,be,Me,ve[O]);for(let Q=0;Q<D.length;Q++){const re=D[Q];L?C&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q+1,0,0,be,Me,re.image[O]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q+1,Xe,be,Me,re.image[O])}}}g(M)&&d(t.TEXTURE_CUBE_MAP),te.__version=ae.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function se(b,M,G,ne,ae,te){const Ae=s.convert(G.format,G.colorSpace),fe=s.convert(G.type),ge=_(G.internalFormat,Ae,fe,G.colorSpace);if(!i.get(M).__hasExternalTextures){const oe=Math.max(1,M.width>>te),ve=Math.max(1,M.height>>te);ae===t.TEXTURE_3D||ae===t.TEXTURE_2D_ARRAY?n.texImage3D(ae,te,ge,oe,ve,M.depth,0,Ae,fe,null):n.texImage2D(ae,te,ge,oe,ve,0,Ae,fe,null)}n.bindFramebuffer(t.FRAMEBUFFER,b),Ve(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,ne,ae,i.get(G).__webglTexture,0,Ye(M)):(ae===t.TEXTURE_2D||ae>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,ne,ae,i.get(G).__webglTexture,te),n.bindFramebuffer(t.FRAMEBUFFER,null)}function me(b,M,G){if(t.bindRenderbuffer(t.RENDERBUFFER,b),M.depthBuffer){const ne=M.depthTexture,ae=ne&&ne.isDepthTexture?ne.type:null,te=y(M.stencilBuffer,ae),Ae=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,fe=Ye(M);Ve(M)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,fe,te,M.width,M.height):G?t.renderbufferStorageMultisample(t.RENDERBUFFER,fe,te,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,te,M.width,M.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ae,t.RENDERBUFFER,b)}else{const ne=M.textures;for(let ae=0;ae<ne.length;ae++){const te=ne[ae],Ae=s.convert(te.format,te.colorSpace),fe=s.convert(te.type),ge=_(te.internalFormat,Ae,fe,te.colorSpace),We=Ye(M);G&&Ve(M)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,We,ge,M.width,M.height):Ve(M)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,We,ge,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,ge,M.width,M.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function pe(b,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,b),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),k(M.depthTexture,0);const ne=i.get(M.depthTexture).__webglTexture,ae=Ye(M);if(M.depthTexture.format===bs)Ve(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,ne,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,ne,0);else if(M.depthTexture.format===Vs)Ve(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,ne,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function ke(b){const M=i.get(b),G=b.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==b.depthTexture){const ne=b.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),ne){const ae=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,ne.removeEventListener("dispose",ae)};ne.addEventListener("dispose",ae),M.__depthDisposeCallback=ae}M.__boundDepthTexture=ne}if(b.depthTexture&&!M.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");pe(M.__webglFramebuffer,b)}else if(G){M.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer[ne]),M.__webglDepthbuffer[ne]===void 0)M.__webglDepthbuffer[ne]=t.createRenderbuffer(),me(M.__webglDepthbuffer[ne],b,!1);else{const ae=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,te=M.__webglDepthbuffer[ne];t.bindRenderbuffer(t.RENDERBUFFER,te),t.framebufferRenderbuffer(t.FRAMEBUFFER,ae,t.RENDERBUFFER,te)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=t.createRenderbuffer(),me(M.__webglDepthbuffer,b,!1);else{const ne=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=M.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,ne,t.RENDERBUFFER,ae)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function De(b,M,G){const ne=i.get(b);M!==void 0&&se(ne.__webglFramebuffer,b,b.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),G!==void 0&&ke(b)}function He(b){const M=b.texture,G=i.get(b),ne=i.get(M);b.addEventListener("dispose",R);const ae=b.textures,te=b.isWebGLCubeRenderTarget===!0,Ae=ae.length>1;if(Ae||(ne.__webglTexture===void 0&&(ne.__webglTexture=t.createTexture()),ne.__version=M.version,a.memory.textures++),te){G.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer[fe]=[];for(let ge=0;ge<M.mipmaps.length;ge++)G.__webglFramebuffer[fe][ge]=t.createFramebuffer()}else G.__webglFramebuffer[fe]=t.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer=[];for(let fe=0;fe<M.mipmaps.length;fe++)G.__webglFramebuffer[fe]=t.createFramebuffer()}else G.__webglFramebuffer=t.createFramebuffer();if(Ae)for(let fe=0,ge=ae.length;fe<ge;fe++){const We=i.get(ae[fe]);We.__webglTexture===void 0&&(We.__webglTexture=t.createTexture(),a.memory.textures++)}if(b.samples>0&&Ve(b)===!1){G.__webglMultisampledFramebuffer=t.createFramebuffer(),G.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let fe=0;fe<ae.length;fe++){const ge=ae[fe];G.__webglColorRenderbuffer[fe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,G.__webglColorRenderbuffer[fe]);const We=s.convert(ge.format,ge.colorSpace),oe=s.convert(ge.type),ve=_(ge.internalFormat,We,oe,ge.colorSpace,b.isXRRenderTarget===!0),Ue=Ye(b);t.renderbufferStorageMultisample(t.RENDERBUFFER,Ue,ve,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,G.__webglColorRenderbuffer[fe])}t.bindRenderbuffer(t.RENDERBUFFER,null),b.depthBuffer&&(G.__webglDepthRenderbuffer=t.createRenderbuffer(),me(G.__webglDepthRenderbuffer,b,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(te){n.bindTexture(t.TEXTURE_CUBE_MAP,ne.__webglTexture),de(t.TEXTURE_CUBE_MAP,M);for(let fe=0;fe<6;fe++)if(M.mipmaps&&M.mipmaps.length>0)for(let ge=0;ge<M.mipmaps.length;ge++)se(G.__webglFramebuffer[fe][ge],b,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,ge);else se(G.__webglFramebuffer[fe],b,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);g(M)&&d(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ae){for(let fe=0,ge=ae.length;fe<ge;fe++){const We=ae[fe],oe=i.get(We);n.bindTexture(t.TEXTURE_2D,oe.__webglTexture),de(t.TEXTURE_2D,We),se(G.__webglFramebuffer,b,We,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,0),g(We)&&d(t.TEXTURE_2D)}n.unbindTexture()}else{let fe=t.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(fe=b.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(fe,ne.__webglTexture),de(fe,M),M.mipmaps&&M.mipmaps.length>0)for(let ge=0;ge<M.mipmaps.length;ge++)se(G.__webglFramebuffer[ge],b,M,t.COLOR_ATTACHMENT0,fe,ge);else se(G.__webglFramebuffer,b,M,t.COLOR_ATTACHMENT0,fe,0);g(M)&&d(fe),n.unbindTexture()}b.depthBuffer&&ke(b)}function Qe(b){const M=b.textures;for(let G=0,ne=M.length;G<ne;G++){const ae=M[G];if(g(ae)){const te=b.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Ae=i.get(ae).__webglTexture;n.bindTexture(te,Ae),d(te),n.unbindTexture()}}}const Ge=[],U=[];function Wt(b){if(b.samples>0){if(Ve(b)===!1){const M=b.textures,G=b.width,ne=b.height;let ae=t.COLOR_BUFFER_BIT;const te=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ae=i.get(b),fe=M.length>1;if(fe)for(let ge=0;ge<M.length;ge++)n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let ge=0;ge<M.length;ge++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(ae|=t.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(ae|=t.STENCIL_BUFFER_BIT)),fe){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ae.__webglColorRenderbuffer[ge]);const We=i.get(M[ge]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,We,0)}t.blitFramebuffer(0,0,G,ne,0,0,G,ne,ae,t.NEAREST),l===!0&&(Ge.length=0,U.length=0,Ge.push(t.COLOR_ATTACHMENT0+ge),b.depthBuffer&&b.resolveDepthBuffer===!1&&(Ge.push(te),U.push(te),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,U)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Ge))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),fe)for(let ge=0;ge<M.length;ge++){n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.RENDERBUFFER,Ae.__webglColorRenderbuffer[ge]);const We=i.get(M[ge]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.TEXTURE_2D,We,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const M=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[M])}}}function Ye(b){return Math.min(r.maxSamples,b.samples)}function Ve(b){const M=i.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Ie(b){const M=a.render.frame;f.get(b)!==M&&(f.set(b,M),b.update())}function rt(b,M){const G=b.colorSpace,ne=b.format,ae=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||G!==dr&&G!==Gi&&(nt.getTransfer(G)===pt?(ne!==Zn||ae!==Ri)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),M}function Le(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(u.width=b.naturalWidth||b.width,u.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(u.width=b.displayWidth,u.height=b.displayHeight):(u.width=b.width,u.height=b.height),u}this.allocateTextureUnit=Y,this.resetTextureUnits=w,this.setTexture2D=k,this.setTexture2DArray=q,this.setTexture3D=V,this.setTextureCube=Z,this.rebindTextures=De,this.setupRenderTarget=He,this.updateRenderTargetMipmap=Qe,this.updateMultisampleRenderTarget=Wt,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=se,this.useMultisampledRTT=Ve}function Aw(t,e){function n(i,r=Gi){let s;const a=nt.getTransfer(r);if(i===Ri)return t.UNSIGNED_BYTE;if(i===sh)return t.UNSIGNED_SHORT_4_4_4_4;if(i===ah)return t.UNSIGNED_SHORT_5_5_5_1;if(i===f0)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===u0)return t.BYTE;if(i===d0)return t.SHORT;if(i===Ka)return t.UNSIGNED_SHORT;if(i===rh)return t.INT;if(i===Or)return t.UNSIGNED_INT;if(i===ai)return t.FLOAT;if(i===ro)return t.HALF_FLOAT;if(i===h0)return t.ALPHA;if(i===p0)return t.RGB;if(i===Zn)return t.RGBA;if(i===m0)return t.LUMINANCE;if(i===g0)return t.LUMINANCE_ALPHA;if(i===bs)return t.DEPTH_COMPONENT;if(i===Vs)return t.DEPTH_STENCIL;if(i===oh)return t.RED;if(i===lh)return t.RED_INTEGER;if(i===v0)return t.RG;if(i===ch)return t.RG_INTEGER;if(i===uh)return t.RGBA_INTEGER;if(i===fl||i===hl||i===pl||i===ml)if(a===pt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===fl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===hl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===pl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ml)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===fl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===hl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===pl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ml)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Id||i===Ud||i===Fd||i===Od)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Id)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ud)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Fd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Od)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===kd||i===Bd||i===zd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===kd||i===Bd)return a===pt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===zd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===jd||i===Hd||i===Vd||i===Gd||i===Wd||i===Xd||i===$d||i===qd||i===Yd||i===Kd||i===Zd||i===Qd||i===Jd||i===ef)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===jd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Hd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Vd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Gd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Wd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Xd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===$d)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===qd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Yd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Kd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Zd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Qd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Jd)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ef)return a===pt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===gl||i===tf||i===nf)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===gl)return a===pt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===tf)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===nf)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===_0||i===rf||i===sf||i===af)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===gl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===rf)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===sf)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===af)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Hs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class Cw extends qn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ma extends kt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Rw={type:"move"};class yu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ma,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ma,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ma,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,u=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(u&&e.hand){a=!0;for(const x of e.hand.values()){const g=n.getJointPose(x,i),d=this._getHandJoint(u,x);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}const f=u.joints["index-finger-tip"],p=u.joints["thumb-tip"],h=f.position.distanceTo(p.position),m=.02,v=.005;u.inputState.pinching&&h>m+v?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&h<=m-v&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Rw)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),u!==null&&(u.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Ma;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const bw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Pw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Nw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new sn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new or({vertexShader:bw,fragmentShader:Pw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Zt(new ao(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Lw extends Ys{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,u=null,f=null,p=null,h=null,m=null,v=null;const x=new Nw,g=n.getContextAttributes();let d=null,_=null;const y=[],T=[],P=new Je;let R=null;const A=new qn;A.layers.enable(1),A.viewport=new Tt;const N=new qn;N.layers.enable(2),N.viewport=new Tt;const K=[A,N],S=new Cw;S.layers.enable(1),S.layers.enable(2);let w=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let se=y[J];return se===void 0&&(se=new yu,y[J]=se),se.getTargetRaySpace()},this.getControllerGrip=function(J){let se=y[J];return se===void 0&&(se=new yu,y[J]=se),se.getGripSpace()},this.getHand=function(J){let se=y[J];return se===void 0&&(se=new yu,y[J]=se),se.getHandSpace()};function F(J){const se=T.indexOf(J.inputSource);if(se===-1)return;const me=y[se];me!==void 0&&(me.update(J.inputSource,J.frame,u||a),me.dispatchEvent({type:J.type,data:J.inputSource}))}function k(){r.removeEventListener("select",F),r.removeEventListener("selectstart",F),r.removeEventListener("selectend",F),r.removeEventListener("squeeze",F),r.removeEventListener("squeezestart",F),r.removeEventListener("squeezeend",F),r.removeEventListener("end",k),r.removeEventListener("inputsourceschange",q);for(let J=0;J<y.length;J++){const se=T[J];se!==null&&(T[J]=null,y[J].disconnect(se))}w=null,Y=null,x.reset(),e.setRenderTarget(d),m=null,h=null,p=null,r=null,_=null,qe.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||a},this.setReferenceSpace=function(J){u=J},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return p},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(J){if(r=J,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",F),r.addEventListener("selectstart",F),r.addEventListener("selectend",F),r.addEventListener("squeeze",F),r.addEventListener("squeezestart",F),r.addEventListener("squeezeend",F),r.addEventListener("end",k),r.addEventListener("inputsourceschange",q),g.xrCompatible!==!0&&await n.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const se={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,se),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new kr(m.framebufferWidth,m.framebufferHeight,{format:Zn,type:Ri,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let se=null,me=null,pe=null;g.depth&&(pe=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,se=g.stencil?Vs:bs,me=g.stencil?Hs:Or);const ke={colorFormat:n.RGBA8,depthFormat:pe,scaleFactor:s};p=new XRWebGLBinding(r,n),h=p.createProjectionLayer(ke),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),_=new kr(h.textureWidth,h.textureHeight,{format:Zn,type:Ri,depthTexture:new P0(h.textureWidth,h.textureHeight,me,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),u=null,a=await r.requestReferenceSpace(o),qe.setContext(r),qe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function q(J){for(let se=0;se<J.removed.length;se++){const me=J.removed[se],pe=T.indexOf(me);pe>=0&&(T[pe]=null,y[pe].disconnect(me))}for(let se=0;se<J.added.length;se++){const me=J.added[se];let pe=T.indexOf(me);if(pe===-1){for(let De=0;De<y.length;De++)if(De>=T.length){T.push(me),pe=De;break}else if(T[De]===null){T[De]=me,pe=De;break}if(pe===-1)break}const ke=y[pe];ke&&ke.connect(me)}}const V=new H,Z=new H;function I(J,se,me){V.setFromMatrixPosition(se.matrixWorld),Z.setFromMatrixPosition(me.matrixWorld);const pe=V.distanceTo(Z),ke=se.projectionMatrix.elements,De=me.projectionMatrix.elements,He=ke[14]/(ke[10]-1),Qe=ke[14]/(ke[10]+1),Ge=(ke[9]+1)/ke[5],U=(ke[9]-1)/ke[5],Wt=(ke[8]-1)/ke[0],Ye=(De[8]+1)/De[0],Ve=He*Wt,Ie=He*Ye,rt=pe/(-Wt+Ye),Le=rt*-Wt;if(se.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Le),J.translateZ(rt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),ke[10]===-1)J.projectionMatrix.copy(se.projectionMatrix),J.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const b=He+rt,M=Qe+rt,G=Ve-Le,ne=Ie+(pe-Le),ae=Ge*Qe/M*b,te=U*Qe/M*b;J.projectionMatrix.makePerspective(G,ne,ae,te,b,M),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ee(J,se){se===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(se.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(r===null)return;let se=J.near,me=J.far;x.texture!==null&&(x.depthNear>0&&(se=x.depthNear),x.depthFar>0&&(me=x.depthFar)),S.near=N.near=A.near=se,S.far=N.far=A.far=me,(w!==S.near||Y!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),w=S.near,Y=S.far);const pe=J.parent,ke=S.cameras;ee(S,pe);for(let De=0;De<ke.length;De++)ee(ke[De],pe);ke.length===2?I(S,A,N):S.projectionMatrix.copy(A.projectionMatrix),ie(J,S,pe)};function ie(J,se,me){me===null?J.matrix.copy(se.matrixWorld):(J.matrix.copy(me.matrixWorld),J.matrix.invert(),J.matrix.multiply(se.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(se.projectionMatrix),J.projectionMatrixInverse.copy(se.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Za*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(J){l=J,h!==null&&(h.fixedFoveation=J),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=J)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(S)};let de=null;function Ne(J,se){if(f=se.getViewerPose(u||a),v=se,f!==null){const me=f.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let pe=!1;me.length!==S.cameras.length&&(S.cameras.length=0,pe=!0);for(let De=0;De<me.length;De++){const He=me[De];let Qe=null;if(m!==null)Qe=m.getViewport(He);else{const U=p.getViewSubImage(h,He);Qe=U.viewport,De===0&&(e.setRenderTargetTextures(_,U.colorTexture,h.ignoreDepthValues?void 0:U.depthStencilTexture),e.setRenderTarget(_))}let Ge=K[De];Ge===void 0&&(Ge=new qn,Ge.layers.enable(De),Ge.viewport=new Tt,K[De]=Ge),Ge.matrix.fromArray(He.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(He.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(Qe.x,Qe.y,Qe.width,Qe.height),De===0&&(S.matrix.copy(Ge.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),pe===!0&&S.cameras.push(Ge)}const ke=r.enabledFeatures;if(ke&&ke.includes("depth-sensing")){const De=p.getDepthInformation(me[0]);De&&De.isValid&&De.texture&&x.init(e,De,r.renderState)}}for(let me=0;me<y.length;me++){const pe=T[me],ke=y[me];pe!==null&&ke!==void 0&&ke.update(pe,se,u||a)}de&&de(J,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),v=null}const qe=new b0;qe.setAnimationLoop(Ne),this.setAnimationLoop=function(J){de=J},this.dispose=function(){}}}const vr=new bi,Dw=new it;function Iw(t,e){function n(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function i(g,d){d.color.getRGB(g.fogColor.value,A0(t)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function r(g,d,_,y,T){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(g,d):d.isMeshToonMaterial?(s(g,d),p(g,d)):d.isMeshPhongMaterial?(s(g,d),f(g,d)):d.isMeshStandardMaterial?(s(g,d),h(g,d),d.isMeshPhysicalMaterial&&m(g,d,T)):d.isMeshMatcapMaterial?(s(g,d),v(g,d)):d.isMeshDepthMaterial?s(g,d):d.isMeshDistanceMaterial?(s(g,d),x(g,d)):d.isMeshNormalMaterial?s(g,d):d.isLineBasicMaterial?(a(g,d),d.isLineDashedMaterial&&o(g,d)):d.isPointsMaterial?l(g,d,_,y):d.isSpriteMaterial?u(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,n(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,n(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===rn&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,n(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===rn&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,n(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,n(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);const _=e.get(d),y=_.envMap,T=_.envMapRotation;y&&(g.envMap.value=y,vr.copy(T),vr.x*=-1,vr.y*=-1,vr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(vr.y*=-1,vr.z*=-1),g.envMapRotation.value.setFromMatrix4(Dw.makeRotationFromEuler(vr)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap&&(g.lightMap.value=d.lightMap,g.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,g.lightMapTransform)),d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,g.aoMapTransform))}function a(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,n(d.map,g.mapTransform))}function o(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function l(g,d,_,y){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*_,g.scale.value=y*.5,d.map&&(g.map.value=d.map,n(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function u(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,n(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function f(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function p(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function h(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,g.roughnessMapTransform)),d.envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function m(g,d,_){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===rn&&g.clearcoatNormalScale.value.negate())),d.dispersion>0&&(g.dispersion.value=d.dispersion),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,g.specularIntensityMapTransform))}function v(g,d){d.matcap&&(g.matcap.value=d.matcap)}function x(g,d){const _=e.get(d).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Uw(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,y){const T=y.program;i.uniformBlockBinding(_,T)}function u(_,y){let T=r[_.id];T===void 0&&(v(_),T=f(_),r[_.id]=T,_.addEventListener("dispose",g));const P=y.program;i.updateUBOMapping(_,P);const R=e.render.frame;s[_.id]!==R&&(h(_),s[_.id]=R)}function f(_){const y=p();_.__bindingPointIndex=y;const T=t.createBuffer(),P=_.__size,R=_.usage;return t.bindBuffer(t.UNIFORM_BUFFER,T),t.bufferData(t.UNIFORM_BUFFER,P,R),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,y,T),T}function p(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(_){const y=r[_.id],T=_.uniforms,P=_.__cache;t.bindBuffer(t.UNIFORM_BUFFER,y);for(let R=0,A=T.length;R<A;R++){const N=Array.isArray(T[R])?T[R]:[T[R]];for(let K=0,S=N.length;K<S;K++){const w=N[K];if(m(w,R,K,P)===!0){const Y=w.__offset,F=Array.isArray(w.value)?w.value:[w.value];let k=0;for(let q=0;q<F.length;q++){const V=F[q],Z=x(V);typeof V=="number"||typeof V=="boolean"?(w.__data[0]=V,t.bufferSubData(t.UNIFORM_BUFFER,Y+k,w.__data)):V.isMatrix3?(w.__data[0]=V.elements[0],w.__data[1]=V.elements[1],w.__data[2]=V.elements[2],w.__data[3]=0,w.__data[4]=V.elements[3],w.__data[5]=V.elements[4],w.__data[6]=V.elements[5],w.__data[7]=0,w.__data[8]=V.elements[6],w.__data[9]=V.elements[7],w.__data[10]=V.elements[8],w.__data[11]=0):(V.toArray(w.__data,k),k+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,Y,w.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(_,y,T,P){const R=_.value,A=y+"_"+T;if(P[A]===void 0)return typeof R=="number"||typeof R=="boolean"?P[A]=R:P[A]=R.clone(),!0;{const N=P[A];if(typeof R=="number"||typeof R=="boolean"){if(N!==R)return P[A]=R,!0}else if(N.equals(R)===!1)return N.copy(R),!0}return!1}function v(_){const y=_.uniforms;let T=0;const P=16;for(let A=0,N=y.length;A<N;A++){const K=Array.isArray(y[A])?y[A]:[y[A]];for(let S=0,w=K.length;S<w;S++){const Y=K[S],F=Array.isArray(Y.value)?Y.value:[Y.value];for(let k=0,q=F.length;k<q;k++){const V=F[k],Z=x(V),I=T%P,ee=I%Z.boundary,ie=I+ee;T+=ee,ie!==0&&P-ie<Z.storage&&(T+=P-ie),Y.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=T,T+=Z.storage}}}const R=T%P;return R>0&&(T+=P-R),_.__size=T,_.__cache={},this}function x(_){const y={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(y.boundary=4,y.storage=4):_.isVector2?(y.boundary=8,y.storage=8):_.isVector3||_.isColor?(y.boundary=16,y.storage=12):_.isVector4?(y.boundary=16,y.storage=16):_.isMatrix3?(y.boundary=48,y.storage=48):_.isMatrix4?(y.boundary=64,y.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),y}function g(_){const y=_.target;y.removeEventListener("dispose",g);const T=a.indexOf(y.__bindingPointIndex);a.splice(T,1),t.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function d(){for(const _ in r)t.deleteBuffer(r[_]);a=[],r={},s={}}return{bind:l,update:u,dispose:d}}class Fw{constructor(e={}){const{canvas:n=ES(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:p=!1}=e;this.isWebGLRenderer=!0;let h;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=i.getContextAttributes().alpha}else h=a;const m=new Uint32Array(4),v=new Int32Array(4);let x=null,g=null;const d=[],_=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ii,this.toneMapping=ir,this.toneMappingExposure=1;const y=this;let T=!1,P=0,R=0,A=null,N=-1,K=null;const S=new Tt,w=new Tt;let Y=null;const F=new Ke(0);let k=0,q=n.width,V=n.height,Z=1,I=null,ee=null;const ie=new Tt(0,0,q,V),de=new Tt(0,0,q,V);let Ne=!1;const qe=new mh;let J=!1,se=!1;const me=new it,pe=new it,ke=new H,De=new Tt,He={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Qe=!1;function Ge(){return A===null?Z:1}let U=i;function Wt(E,z){return n.getContext(E,z)}try{const E={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:f,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${ih}`),n.addEventListener("webglcontextlost",O,!1),n.addEventListener("webglcontextrestored",Q,!1),n.addEventListener("webglcontextcreationerror",re,!1),U===null){const z="webgl2";if(U=Wt(z,E),U===null)throw Wt(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ye,Ve,Ie,rt,Le,b,M,G,ne,ae,te,Ae,fe,ge,We,oe,ve,Ue,be,Me,Xe,L,X,C;function B(){Ye=new j1(U),Ye.init(),L=new Aw(U,Ye),Ve=new U1(U,Ye,e,L),Ie=new Ew(U),Ve.reverseDepthBuffer&&Ie.buffers.depth.setReversed(!0),rt=new G1(U),Le=new lw,b=new ww(U,Ye,Ie,Le,Ve,L,rt),M=new O1(y),G=new z1(y),ne=new ZS(U),X=new D1(U,ne),ae=new H1(U,ne,rt,X),te=new X1(U,ae,ne,rt),be=new W1(U,Ve,b),oe=new F1(Le),Ae=new ow(y,M,G,Ye,Ve,X,oe),fe=new Iw(y,Le),ge=new uw,We=new gw(Ye),Ue=new L1(y,M,G,Ie,te,h,l),ve=new Sw(y,te,Ve),C=new Uw(U,rt,Ve,Ie),Me=new I1(U,Ye,rt),Xe=new V1(U,Ye,rt),rt.programs=Ae.programs,y.capabilities=Ve,y.extensions=Ye,y.properties=Le,y.renderLists=ge,y.shadowMap=ve,y.state=Ie,y.info=rt}B();const D=new Lw(y,U);this.xr=D,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const E=Ye.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ye.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(E){E!==void 0&&(Z=E,this.setSize(q,V,!1))},this.getSize=function(E){return E.set(q,V)},this.setSize=function(E,z,W=!0){if(D.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=E,V=z,n.width=Math.floor(E*Z),n.height=Math.floor(z*Z),W===!0&&(n.style.width=E+"px",n.style.height=z+"px"),this.setViewport(0,0,E,z)},this.getDrawingBufferSize=function(E){return E.set(q*Z,V*Z).floor()},this.setDrawingBufferSize=function(E,z,W){q=E,V=z,Z=W,n.width=Math.floor(E*W),n.height=Math.floor(z*W),this.setViewport(0,0,E,z)},this.getCurrentViewport=function(E){return E.copy(S)},this.getViewport=function(E){return E.copy(ie)},this.setViewport=function(E,z,W,$){E.isVector4?ie.set(E.x,E.y,E.z,E.w):ie.set(E,z,W,$),Ie.viewport(S.copy(ie).multiplyScalar(Z).round())},this.getScissor=function(E){return E.copy(de)},this.setScissor=function(E,z,W,$){E.isVector4?de.set(E.x,E.y,E.z,E.w):de.set(E,z,W,$),Ie.scissor(w.copy(de).multiplyScalar(Z).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(E){Ie.setScissorTest(Ne=E)},this.setOpaqueSort=function(E){I=E},this.setTransparentSort=function(E){ee=E},this.getClearColor=function(E){return E.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor.apply(Ue,arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha.apply(Ue,arguments)},this.clear=function(E=!0,z=!0,W=!0){let $=0;if(E){let j=!1;if(A!==null){const ue=A.texture.format;j=ue===uh||ue===ch||ue===lh}if(j){const ue=A.texture.type,_e=ue===Ri||ue===Or||ue===Ka||ue===Hs||ue===sh||ue===ah,we=Ue.getClearColor(),Ce=Ue.getClearAlpha(),Fe=we.r,Oe=we.g,Re=we.b;_e?(m[0]=Fe,m[1]=Oe,m[2]=Re,m[3]=Ce,U.clearBufferuiv(U.COLOR,0,m)):(v[0]=Fe,v[1]=Oe,v[2]=Re,v[3]=Ce,U.clearBufferiv(U.COLOR,0,v))}else $|=U.COLOR_BUFFER_BIT}z&&($|=U.DEPTH_BUFFER_BIT,U.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),W&&($|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",O,!1),n.removeEventListener("webglcontextrestored",Q,!1),n.removeEventListener("webglcontextcreationerror",re,!1),ge.dispose(),We.dispose(),Le.dispose(),M.dispose(),G.dispose(),te.dispose(),X.dispose(),C.dispose(),Ae.dispose(),D.dispose(),D.removeEventListener("sessionstart",gt),D.removeEventListener("sessionend",cn),Bt.stop()};function O(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Q(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const E=rt.autoReset,z=ve.enabled,W=ve.autoUpdate,$=ve.needsUpdate,j=ve.type;B(),rt.autoReset=E,ve.enabled=z,ve.autoUpdate=W,ve.needsUpdate=$,ve.type=j}function re(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function xe(E){const z=E.target;z.removeEventListener("dispose",xe),Ee(z)}function Ee(E){Be(E),Le.remove(E)}function Be(E){const z=Le.get(E).programs;z!==void 0&&(z.forEach(function(W){Ae.releaseProgram(W)}),E.isShaderMaterial&&Ae.releaseShaderCache(E))}this.renderBufferDirect=function(E,z,W,$,j,ue){z===null&&(z=He);const _e=j.isMesh&&j.matrixWorld.determinant()<0,we=ut(E,z,W,$,j);Ie.setMaterial($,_e);let Ce=W.index,Fe=1;if($.wireframe===!0){if(Ce=ae.getWireframeAttribute(W),Ce===void 0)return;Fe=2}const Oe=W.drawRange,Re=W.attributes.position;let st=Oe.start*Fe,ft=(Oe.start+Oe.count)*Fe;ue!==null&&(st=Math.max(st,ue.start*Fe),ft=Math.min(ft,(ue.start+ue.count)*Fe)),Ce!==null?(st=Math.max(st,0),ft=Math.min(ft,Ce.count)):Re!=null&&(st=Math.max(st,0),ft=Math.min(ft,Re.count));const Mt=ft-st;if(Mt<0||Mt===1/0)return;X.setup(j,$,we,W,Ce);let gn,et=Me;if(Ce!==null&&(gn=ne.get(Ce),et=Xe,et.setIndex(gn)),j.isMesh)$.wireframe===!0?(Ie.setLineWidth($.wireframeLinewidth*Ge()),et.setMode(U.LINES)):et.setMode(U.TRIANGLES);else if(j.isLine){let Pe=$.linewidth;Pe===void 0&&(Pe=1),Ie.setLineWidth(Pe*Ge()),j.isLineSegments?et.setMode(U.LINES):j.isLineLoop?et.setMode(U.LINE_LOOP):et.setMode(U.LINE_STRIP)}else j.isPoints?et.setMode(U.POINTS):j.isSprite&&et.setMode(U.TRIANGLES);if(j.isBatchedMesh)if(j._multiDrawInstances!==null)et.renderMultiDrawInstances(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount,j._multiDrawInstances);else if(Ye.get("WEBGL_multi_draw"))et.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else{const Pe=j._multiDrawStarts,zt=j._multiDrawCounts,tt=j._multiDrawCount,zn=Ce?ne.get(Ce).bytesPerElement:1,Gr=Le.get($).currentProgram.getUniforms();for(let vn=0;vn<tt;vn++)Gr.setValue(U,"_gl_DrawID",vn),et.render(Pe[vn]/zn,zt[vn])}else if(j.isInstancedMesh)et.renderInstances(st,Mt,j.count);else if(W.isInstancedBufferGeometry){const Pe=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,zt=Math.min(W.instanceCount,Pe);et.renderInstances(st,Mt,zt)}else et.render(st,Mt)};function Te(E,z,W){E.transparent===!0&&E.side===Yn&&E.forceSinglePass===!1?(E.side=rn,E.needsUpdate=!0,Bn(E,z,W),E.side=ar,E.needsUpdate=!0,Bn(E,z,W),E.side=Yn):Bn(E,z,W)}this.compile=function(E,z,W=null){W===null&&(W=E),g=We.get(W),g.init(z),_.push(g),W.traverseVisible(function(j){j.isLight&&j.layers.test(z.layers)&&(g.pushLight(j),j.castShadow&&g.pushShadow(j))}),E!==W&&E.traverseVisible(function(j){j.isLight&&j.layers.test(z.layers)&&(g.pushLight(j),j.castShadow&&g.pushShadow(j))}),g.setupLights();const $=new Set;return E.traverse(function(j){if(!(j.isMesh||j.isPoints||j.isLine||j.isSprite))return;const ue=j.material;if(ue)if(Array.isArray(ue))for(let _e=0;_e<ue.length;_e++){const we=ue[_e];Te(we,W,j),$.add(we)}else Te(ue,W,j),$.add(ue)}),_.pop(),g=null,$},this.compileAsync=function(E,z,W=null){const $=this.compile(E,z,W);return new Promise(j=>{function ue(){if($.forEach(function(_e){Le.get(_e).currentProgram.isReady()&&$.delete(_e)}),$.size===0){j(E);return}setTimeout(ue,10)}Ye.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let ce=null;function ot(E){ce&&ce(E)}function gt(){Bt.stop()}function cn(){Bt.start()}const Bt=new b0;Bt.setAnimationLoop(ot),typeof self<"u"&&Bt.setContext(self),this.setAnimationLoop=function(E){ce=E,D.setAnimationLoop(E),E===null?Bt.stop():Bt.start()},D.addEventListener("sessionstart",gt),D.addEventListener("sessionend",cn),this.render=function(E,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),D.enabled===!0&&D.isPresenting===!0&&(D.cameraAutoUpdate===!0&&D.updateCamera(z),z=D.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,z,A),g=We.get(E,_.length),g.init(z),_.push(g),pe.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),qe.setFromProjectionMatrix(pe),se=this.localClippingEnabled,J=oe.init(this.clippingPlanes,se),x=ge.get(E,d.length),x.init(),d.push(x),D.enabled===!0&&D.isPresenting===!0){const ue=y.xr.getDepthSensingMesh();ue!==null&&Cn(ue,z,-1/0,y.sortObjects)}Cn(E,z,0,y.sortObjects),x.finish(),y.sortObjects===!0&&x.sort(I,ee),Qe=D.enabled===!1||D.isPresenting===!1||D.hasDepthSensing()===!1,Qe&&Ue.addToRenderList(x,E),this.info.render.frame++,J===!0&&oe.beginShadows();const W=g.state.shadowsArray;ve.render(W,E,z),J===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const $=x.opaque,j=x.transmissive;if(g.setupLights(),z.isArrayCamera){const ue=z.cameras;if(j.length>0)for(let _e=0,we=ue.length;_e<we;_e++){const Ce=ue[_e];wt($,j,E,Ce)}Qe&&Ue.render(E);for(let _e=0,we=ue.length;_e<we;_e++){const Ce=ue[_e];ci(x,E,Ce,Ce.viewport)}}else j.length>0&&wt($,j,E,z),Qe&&Ue.render(E),ci(x,E,z);A!==null&&(b.updateMultisampleRenderTarget(A),b.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(y,E,z),X.resetDefaultState(),N=-1,K=null,_.pop(),_.length>0?(g=_[_.length-1],J===!0&&oe.setGlobalState(y.clippingPlanes,g.state.camera)):g=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function Cn(E,z,W,$){if(E.visible===!1)return;if(E.layers.test(z.layers)){if(E.isGroup)W=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(z);else if(E.isLight)g.pushLight(E),E.castShadow&&g.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||qe.intersectsSprite(E)){$&&De.setFromMatrixPosition(E.matrixWorld).applyMatrix4(pe);const _e=te.update(E),we=E.material;we.visible&&x.push(E,_e,we,W,De.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||qe.intersectsObject(E))){const _e=te.update(E),we=E.material;if($&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),De.copy(E.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),De.copy(_e.boundingSphere.center)),De.applyMatrix4(E.matrixWorld).applyMatrix4(pe)),Array.isArray(we)){const Ce=_e.groups;for(let Fe=0,Oe=Ce.length;Fe<Oe;Fe++){const Re=Ce[Fe],st=we[Re.materialIndex];st&&st.visible&&x.push(E,_e,st,W,De.z,Re)}}else we.visible&&x.push(E,_e,we,W,De.z,null)}}const ue=E.children;for(let _e=0,we=ue.length;_e<we;_e++)Cn(ue[_e],z,W,$)}function ci(E,z,W,$){const j=E.opaque,ue=E.transmissive,_e=E.transparent;g.setupLightsView(W),J===!0&&oe.setGlobalState(y.clippingPlanes,W),$&&Ie.viewport(S.copy($)),j.length>0&&St(j,z,W),ue.length>0&&St(ue,z,W),_e.length>0&&St(_e,z,W),Ie.buffers.depth.setTest(!0),Ie.buffers.depth.setMask(!0),Ie.buffers.color.setMask(!0),Ie.setPolygonOffset(!1)}function wt(E,z,W,$){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[$.id]===void 0&&(g.state.transmissionRenderTarget[$.id]=new kr(1,1,{generateMipmaps:!0,type:Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float")?ro:Ri,minFilter:br,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const ue=g.state.transmissionRenderTarget[$.id],_e=$.viewport||S;ue.setSize(_e.z,_e.w);const we=y.getRenderTarget();y.setRenderTarget(ue),y.getClearColor(F),k=y.getClearAlpha(),k<1&&y.setClearColor(16777215,.5),y.clear(),Qe&&Ue.render(W);const Ce=y.toneMapping;y.toneMapping=ir;const Fe=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),g.setupLightsView($),J===!0&&oe.setGlobalState(y.clippingPlanes,$),St(E,W,$),b.updateMultisampleRenderTarget(ue),b.updateRenderTargetMipmap(ue),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let Re=0,st=z.length;Re<st;Re++){const ft=z[Re],Mt=ft.object,gn=ft.geometry,et=ft.material,Pe=ft.group;if(et.side===Yn&&Mt.layers.test($.layers)){const zt=et.side;et.side=rn,et.needsUpdate=!0,kn(Mt,W,$,gn,et,Pe),et.side=zt,et.needsUpdate=!0,Oe=!0}}Oe===!0&&(b.updateMultisampleRenderTarget(ue),b.updateRenderTargetMipmap(ue))}y.setRenderTarget(we),y.setClearColor(F,k),Fe!==void 0&&($.viewport=Fe),y.toneMapping=Ce}function St(E,z,W){const $=z.isScene===!0?z.overrideMaterial:null;for(let j=0,ue=E.length;j<ue;j++){const _e=E[j],we=_e.object,Ce=_e.geometry,Fe=$===null?_e.material:$,Oe=_e.group;we.layers.test(W.layers)&&kn(we,z,W,Ce,Fe,Oe)}}function kn(E,z,W,$,j,ue){E.onBeforeRender(y,z,W,$,j,ue),E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),j.onBeforeRender(y,z,W,$,E,ue),j.transparent===!0&&j.side===Yn&&j.forceSinglePass===!1?(j.side=rn,j.needsUpdate=!0,y.renderBufferDirect(W,z,$,j,E,ue),j.side=ar,j.needsUpdate=!0,y.renderBufferDirect(W,z,$,j,E,ue),j.side=Yn):y.renderBufferDirect(W,z,$,j,E,ue),E.onAfterRender(y,z,W,$,j,ue)}function Bn(E,z,W){z.isScene!==!0&&(z=He);const $=Le.get(E),j=g.state.lights,ue=g.state.shadowsArray,_e=j.state.version,we=Ae.getParameters(E,j.state,ue,z,W),Ce=Ae.getProgramCacheKey(we);let Fe=$.programs;$.environment=E.isMeshStandardMaterial?z.environment:null,$.fog=z.fog,$.envMap=(E.isMeshStandardMaterial?G:M).get(E.envMap||$.environment),$.envMapRotation=$.environment!==null&&E.envMap===null?z.environmentRotation:E.envMapRotation,Fe===void 0&&(E.addEventListener("dispose",xe),Fe=new Map,$.programs=Fe);let Oe=Fe.get(Ce);if(Oe!==void 0){if($.currentProgram===Oe&&$.lightsStateVersion===_e)return Js(E,we),Oe}else we.uniforms=Ae.getUniforms(E),E.onBeforeCompile(we,y),Oe=Ae.acquireProgram(we,Ce),Fe.set(Ce,Oe),$.uniforms=we.uniforms;const Re=$.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Re.clippingPlanes=oe.uniform),Js(E,we),$.needsLights=dt(E),$.lightsStateVersion=_e,$.needsLights&&(Re.ambientLightColor.value=j.state.ambient,Re.lightProbe.value=j.state.probe,Re.directionalLights.value=j.state.directional,Re.directionalLightShadows.value=j.state.directionalShadow,Re.spotLights.value=j.state.spot,Re.spotLightShadows.value=j.state.spotShadow,Re.rectAreaLights.value=j.state.rectArea,Re.ltc_1.value=j.state.rectAreaLTC1,Re.ltc_2.value=j.state.rectAreaLTC2,Re.pointLights.value=j.state.point,Re.pointLightShadows.value=j.state.pointShadow,Re.hemisphereLights.value=j.state.hemi,Re.directionalShadowMap.value=j.state.directionalShadowMap,Re.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Re.spotShadowMap.value=j.state.spotShadowMap,Re.spotLightMatrix.value=j.state.spotLightMatrix,Re.spotLightMap.value=j.state.spotLightMap,Re.pointShadowMap.value=j.state.pointShadowMap,Re.pointShadowMatrix.value=j.state.pointShadowMatrix),$.currentProgram=Oe,$.uniformsList=null,Oe}function Vr(E){if(E.uniformsList===null){const z=E.currentProgram.getUniforms();E.uniformsList=_l.seqWithValue(z.seq,E.uniforms)}return E.uniformsList}function Js(E,z){const W=Le.get(E);W.outputColorSpace=z.outputColorSpace,W.batching=z.batching,W.batchingColor=z.batchingColor,W.instancing=z.instancing,W.instancingColor=z.instancingColor,W.instancingMorph=z.instancingMorph,W.skinning=z.skinning,W.morphTargets=z.morphTargets,W.morphNormals=z.morphNormals,W.morphColors=z.morphColors,W.morphTargetsCount=z.morphTargetsCount,W.numClippingPlanes=z.numClippingPlanes,W.numIntersection=z.numClipIntersection,W.vertexAlphas=z.vertexAlphas,W.vertexTangents=z.vertexTangents,W.toneMapping=z.toneMapping}function ut(E,z,W,$,j){z.isScene!==!0&&(z=He),b.resetTextureUnits();const ue=z.fog,_e=$.isMeshStandardMaterial?z.environment:null,we=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:dr,Ce=($.isMeshStandardMaterial?G:M).get($.envMap||_e),Fe=$.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Oe=!!W.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Re=!!W.morphAttributes.position,st=!!W.morphAttributes.normal,ft=!!W.morphAttributes.color;let Mt=ir;$.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Mt=y.toneMapping);const gn=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,et=gn!==void 0?gn.length:0,Pe=Le.get($),zt=g.state.lights;if(J===!0&&(se===!0||E!==K)){const Rn=E===K&&$.id===N;oe.setState($,E,Rn)}let tt=!1;$.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==zt.state.version||Pe.outputColorSpace!==we||j.isBatchedMesh&&Pe.batching===!1||!j.isBatchedMesh&&Pe.batching===!0||j.isBatchedMesh&&Pe.batchingColor===!0&&j.colorTexture===null||j.isBatchedMesh&&Pe.batchingColor===!1&&j.colorTexture!==null||j.isInstancedMesh&&Pe.instancing===!1||!j.isInstancedMesh&&Pe.instancing===!0||j.isSkinnedMesh&&Pe.skinning===!1||!j.isSkinnedMesh&&Pe.skinning===!0||j.isInstancedMesh&&Pe.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Pe.instancingColor===!1&&j.instanceColor!==null||j.isInstancedMesh&&Pe.instancingMorph===!0&&j.morphTexture===null||j.isInstancedMesh&&Pe.instancingMorph===!1&&j.morphTexture!==null||Pe.envMap!==Ce||$.fog===!0&&Pe.fog!==ue||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==oe.numPlanes||Pe.numIntersection!==oe.numIntersection)||Pe.vertexAlphas!==Fe||Pe.vertexTangents!==Oe||Pe.morphTargets!==Re||Pe.morphNormals!==st||Pe.morphColors!==ft||Pe.toneMapping!==Mt||Pe.morphTargetsCount!==et)&&(tt=!0):(tt=!0,Pe.__version=$.version);let zn=Pe.currentProgram;tt===!0&&(zn=Bn($,z,j));let Gr=!1,vn=!1,vc=!1;const At=zn.getUniforms(),Li=Pe.uniforms;if(Ie.useProgram(zn.program)&&(Gr=!0,vn=!0,vc=!0),$.id!==N&&(N=$.id,vn=!0),Gr||K!==E){Ve.reverseDepthBuffer?(me.copy(E.projectionMatrix),wS(me),AS(me),At.setValue(U,"projectionMatrix",me)):At.setValue(U,"projectionMatrix",E.projectionMatrix),At.setValue(U,"viewMatrix",E.matrixWorldInverse);const Rn=At.map.cameraPosition;Rn!==void 0&&Rn.setValue(U,ke.setFromMatrixPosition(E.matrixWorld)),Ve.logarithmicDepthBuffer&&At.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&At.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),K!==E&&(K=E,vn=!0,vc=!0)}if(j.isSkinnedMesh){At.setOptional(U,j,"bindMatrix"),At.setOptional(U,j,"bindMatrixInverse");const Rn=j.skeleton;Rn&&(Rn.boneTexture===null&&Rn.computeBoneTexture(),At.setValue(U,"boneTexture",Rn.boneTexture,b))}j.isBatchedMesh&&(At.setOptional(U,j,"batchingTexture"),At.setValue(U,"batchingTexture",j._matricesTexture,b),At.setOptional(U,j,"batchingIdTexture"),At.setValue(U,"batchingIdTexture",j._indirectTexture,b),At.setOptional(U,j,"batchingColorTexture"),j._colorsTexture!==null&&At.setValue(U,"batchingColorTexture",j._colorsTexture,b));const _c=W.morphAttributes;if((_c.position!==void 0||_c.normal!==void 0||_c.color!==void 0)&&be.update(j,W,zn),(vn||Pe.receiveShadow!==j.receiveShadow)&&(Pe.receiveShadow=j.receiveShadow,At.setValue(U,"receiveShadow",j.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(Li.envMap.value=Ce,Li.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&z.environment!==null&&(Li.envMapIntensity.value=z.environmentIntensity),vn&&(At.setValue(U,"toneMappingExposure",y.toneMappingExposure),Pe.needsLights&&lt(Li,vc),ue&&$.fog===!0&&fe.refreshFogUniforms(Li,ue),fe.refreshMaterialUniforms(Li,$,Z,V,g.state.transmissionRenderTarget[E.id]),_l.upload(U,Vr(Pe),Li,b)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(_l.upload(U,Vr(Pe),Li,b),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&At.setValue(U,"center",j.center),At.setValue(U,"modelViewMatrix",j.modelViewMatrix),At.setValue(U,"normalMatrix",j.normalMatrix),At.setValue(U,"modelMatrix",j.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const Rn=$.uniformsGroups;for(let xc=0,G0=Rn.length;xc<G0;xc++){const Mh=Rn[xc];C.update(Mh,zn),C.bind(Mh,zn)}}return zn}function lt(E,z){E.ambientLightColor.needsUpdate=z,E.lightProbe.needsUpdate=z,E.directionalLights.needsUpdate=z,E.directionalLightShadows.needsUpdate=z,E.pointLights.needsUpdate=z,E.pointLightShadows.needsUpdate=z,E.spotLights.needsUpdate=z,E.spotLightShadows.needsUpdate=z,E.rectAreaLights.needsUpdate=z,E.hemisphereLights.needsUpdate=z}function dt(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,z,W){Le.get(E.texture).__webglTexture=z,Le.get(E.depthTexture).__webglTexture=W;const $=Le.get(E);$.__hasExternalTextures=!0,$.__autoAllocateDepthBuffer=W===void 0,$.__autoAllocateDepthBuffer||Ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,z){const W=Le.get(E);W.__webglFramebuffer=z,W.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(E,z=0,W=0){A=E,P=z,R=W;let $=!0,j=null,ue=!1,_e=!1;if(E){const Ce=Le.get(E);if(Ce.__useDefaultFramebuffer!==void 0)Ie.bindFramebuffer(U.FRAMEBUFFER,null),$=!1;else if(Ce.__webglFramebuffer===void 0)b.setupRenderTarget(E);else if(Ce.__hasExternalTextures)b.rebindTextures(E,Le.get(E.texture).__webglTexture,Le.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Re=E.depthTexture;if(Ce.__boundDepthTexture!==Re){if(Re!==null&&Le.has(Re)&&(E.width!==Re.image.width||E.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(E)}}const Fe=E.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(_e=!0);const Oe=Le.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Oe[z])?j=Oe[z][W]:j=Oe[z],ue=!0):E.samples>0&&b.useMultisampledRTT(E)===!1?j=Le.get(E).__webglMultisampledFramebuffer:Array.isArray(Oe)?j=Oe[W]:j=Oe,S.copy(E.viewport),w.copy(E.scissor),Y=E.scissorTest}else S.copy(ie).multiplyScalar(Z).floor(),w.copy(de).multiplyScalar(Z).floor(),Y=Ne;if(Ie.bindFramebuffer(U.FRAMEBUFFER,j)&&$&&Ie.drawBuffers(E,j),Ie.viewport(S),Ie.scissor(w),Ie.setScissorTest(Y),ue){const Ce=Le.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+z,Ce.__webglTexture,W)}else if(_e){const Ce=Le.get(E.texture),Fe=z||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ce.__webglTexture,W||0,Fe)}N=-1},this.readRenderTargetPixels=function(E,z,W,$,j,ue,_e){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=Le.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&_e!==void 0&&(we=we[_e]),we){Ie.bindFramebuffer(U.FRAMEBUFFER,we);try{const Ce=E.texture,Fe=Ce.format,Oe=Ce.type;if(!Ve.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ve.textureTypeReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=E.width-$&&W>=0&&W<=E.height-j&&U.readPixels(z,W,$,j,L.convert(Fe),L.convert(Oe),ue)}finally{const Ce=A!==null?Le.get(A).__webglFramebuffer:null;Ie.bindFramebuffer(U.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(E,z,W,$,j,ue,_e){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=Le.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&_e!==void 0&&(we=we[_e]),we){const Ce=E.texture,Fe=Ce.format,Oe=Ce.type;if(!Ve.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ve.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=E.width-$&&W>=0&&W<=E.height-j){Ie.bindFramebuffer(U.FRAMEBUFFER,we);const Re=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Re),U.bufferData(U.PIXEL_PACK_BUFFER,ue.byteLength,U.STREAM_READ),U.readPixels(z,W,$,j,L.convert(Fe),L.convert(Oe),0);const st=A!==null?Le.get(A).__webglFramebuffer:null;Ie.bindFramebuffer(U.FRAMEBUFFER,st);const ft=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await TS(U,ft,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Re),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ue),U.deleteBuffer(Re),U.deleteSync(ft),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,z=null,W=0){E.isTexture!==!0&&(vl("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,E=arguments[1]);const $=Math.pow(2,-W),j=Math.floor(E.image.width*$),ue=Math.floor(E.image.height*$),_e=z!==null?z.x:0,we=z!==null?z.y:0;b.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,W,0,0,_e,we,j,ue),Ie.unbindTexture()},this.copyTextureToTexture=function(E,z,W=null,$=null,j=0){E.isTexture!==!0&&(vl("WebGLRenderer: copyTextureToTexture function signature has changed."),$=arguments[0]||null,E=arguments[1],z=arguments[2],j=arguments[3]||0,W=null);let ue,_e,we,Ce,Fe,Oe;W!==null?(ue=W.max.x-W.min.x,_e=W.max.y-W.min.y,we=W.min.x,Ce=W.min.y):(ue=E.image.width,_e=E.image.height,we=0,Ce=0),$!==null?(Fe=$.x,Oe=$.y):(Fe=0,Oe=0);const Re=L.convert(z.format),st=L.convert(z.type);b.setTexture2D(z,0),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,z.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,z.unpackAlignment);const ft=U.getParameter(U.UNPACK_ROW_LENGTH),Mt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),gn=U.getParameter(U.UNPACK_SKIP_PIXELS),et=U.getParameter(U.UNPACK_SKIP_ROWS),Pe=U.getParameter(U.UNPACK_SKIP_IMAGES),zt=E.isCompressedTexture?E.mipmaps[j]:E.image;U.pixelStorei(U.UNPACK_ROW_LENGTH,zt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,zt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,we),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ce),E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,j,Fe,Oe,ue,_e,Re,st,zt.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,j,Fe,Oe,zt.width,zt.height,Re,zt.data):U.texSubImage2D(U.TEXTURE_2D,j,Fe,Oe,ue,_e,Re,st,zt),U.pixelStorei(U.UNPACK_ROW_LENGTH,ft),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Mt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,gn),U.pixelStorei(U.UNPACK_SKIP_ROWS,et),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Pe),j===0&&z.generateMipmaps&&U.generateMipmap(U.TEXTURE_2D),Ie.unbindTexture()},this.copyTextureToTexture3D=function(E,z,W=null,$=null,j=0){E.isTexture!==!0&&(vl("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,$=arguments[1]||null,E=arguments[2],z=arguments[3],j=arguments[4]||0);let ue,_e,we,Ce,Fe,Oe,Re,st,ft;const Mt=E.isCompressedTexture?E.mipmaps[j]:E.image;W!==null?(ue=W.max.x-W.min.x,_e=W.max.y-W.min.y,we=W.max.z-W.min.z,Ce=W.min.x,Fe=W.min.y,Oe=W.min.z):(ue=Mt.width,_e=Mt.height,we=Mt.depth,Ce=0,Fe=0,Oe=0),$!==null?(Re=$.x,st=$.y,ft=$.z):(Re=0,st=0,ft=0);const gn=L.convert(z.format),et=L.convert(z.type);let Pe;if(z.isData3DTexture)b.setTexture3D(z,0),Pe=U.TEXTURE_3D;else if(z.isDataArrayTexture||z.isCompressedArrayTexture)b.setTexture2DArray(z,0),Pe=U.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,z.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,z.unpackAlignment);const zt=U.getParameter(U.UNPACK_ROW_LENGTH),tt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),zn=U.getParameter(U.UNPACK_SKIP_PIXELS),Gr=U.getParameter(U.UNPACK_SKIP_ROWS),vn=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,Mt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Mt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ce),U.pixelStorei(U.UNPACK_SKIP_ROWS,Fe),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Oe),E.isDataTexture||E.isData3DTexture?U.texSubImage3D(Pe,j,Re,st,ft,ue,_e,we,gn,et,Mt.data):z.isCompressedArrayTexture?U.compressedTexSubImage3D(Pe,j,Re,st,ft,ue,_e,we,gn,Mt.data):U.texSubImage3D(Pe,j,Re,st,ft,ue,_e,we,gn,et,Mt),U.pixelStorei(U.UNPACK_ROW_LENGTH,zt),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,tt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,zn),U.pixelStorei(U.UNPACK_SKIP_ROWS,Gr),U.pixelStorei(U.UNPACK_SKIP_IMAGES,vn),j===0&&z.generateMipmaps&&U.generateMipmap(Pe),Ie.unbindTexture()},this.initRenderTarget=function(E){Le.get(E).__webglFramebuffer===void 0&&b.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?b.setTextureCube(E,0):E.isData3DTexture?b.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?b.setTexture2DArray(E,0):b.setTexture2D(E,0),Ie.unbindTexture()},this.resetState=function(){P=0,R=0,A=null,Ie.reset(),X.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===dh?"display-p3":"srgb",n.unpackColorSpace=nt.workingColorSpace===pc?"display-p3":"srgb"}}class _h{constructor(e,n=1,i=1e3){this.isFog=!0,this.name="",this.color=new Ke(e),this.near=n,this.far=i}clone(){return new _h(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Ow extends kt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class kw extends sn{constructor(e=null,n=1,i=1,r,s,a,o,l,u=fn,f=fn,p,h){super(null,a,o,l,u,f,r,s,p,h),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Cm extends En{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const as=new it,Rm=new it,$o=[],bm=new Hr,Bw=new it,ha=new Zt,pa=new Zs;class Pm extends Zt{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new Cm(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,Bw)}computeBoundingBox(){const e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Hr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,as),bm.copy(e.boundingBox).applyMatrix4(as),this.boundingBox.union(bm)}computeBoundingSphere(){const e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zs),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,as),pa.copy(e.boundingSphere).applyMatrix4(as),this.boundingSphere.union(pa)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){const i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,a=e*s+1;for(let o=0;o<i.length;o++)i[o]=r[a+o]}raycast(e,n){const i=this.matrixWorld,r=this.count;if(ha.geometry=this.geometry,ha.material=this.material,ha.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),pa.copy(this.boundingSphere),pa.applyMatrix4(i),e.ray.intersectsSphere(pa)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,as),Rm.multiplyMatrices(i,as),ha.matrixWorld=Rm,ha.raycast(e,$o);for(let a=0,o=$o.length;a<o;a++){const l=$o[a];l.instanceId=s,l.object=this,n.push(l)}$o.length=0}}setColorAt(e,n){this.instanceColor===null&&(this.instanceColor=new Cm(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,n){n.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,n){const i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new kw(new Float32Array(r*this.count),r,this.count,oh,ai));const s=this.morphTexture.source.data.data;let a=0;for(let u=0;u<i.length;u++)a+=i[u];const o=this.geometry.morphTargetsRelative?1:1-a,l=r*e;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class xh extends so{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Yl=new H,Kl=new H,Nm=new it,ma=new hh,qo=new Zs,Su=new H,Lm=new H;class zw extends kt{constructor(e=new On,n=new xh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Yl.fromBufferAttribute(n,r-1),Kl.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Yl.distanceTo(Kl);e.setAttribute("lineDistance",new an(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qo.copy(i.boundingSphere),qo.applyMatrix4(r),qo.radius+=s,e.ray.intersectsSphere(qo)===!1)return;Nm.copy(r).invert(),ma.copy(e.ray).applyMatrix4(Nm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,u=this.isLineSegments?2:1,f=i.index,h=i.attributes.position;if(f!==null){const m=Math.max(0,a.start),v=Math.min(f.count,a.start+a.count);for(let x=m,g=v-1;x<g;x+=u){const d=f.getX(x),_=f.getX(x+1),y=Yo(this,e,ma,l,d,_);y&&n.push(y)}if(this.isLineLoop){const x=f.getX(v-1),g=f.getX(m),d=Yo(this,e,ma,l,x,g);d&&n.push(d)}}else{const m=Math.max(0,a.start),v=Math.min(h.count,a.start+a.count);for(let x=m,g=v-1;x<g;x+=u){const d=Yo(this,e,ma,l,x,x+1);d&&n.push(d)}if(this.isLineLoop){const x=Yo(this,e,ma,l,v-1,m);x&&n.push(x)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Yo(t,e,n,i,r,s){const a=t.geometry.attributes.position;if(Yl.fromBufferAttribute(a,r),Kl.fromBufferAttribute(a,s),n.distanceSqToSegment(Yl,Kl,Su,Lm)>i)return;Su.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Su);if(!(l<e.near||l>e.far))return{distance:l,point:Lm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const Dm=new H,Im=new H;class U0 extends zw{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Dm.fromBufferAttribute(n,r),Im.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Dm.distanceTo(Im);e.setAttribute("lineDistance",new an(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class jw{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,n){const i=this.getUtoTmapping(e);return this.getPoint(i,n)}getPoints(e=5){const n=[];for(let i=0;i<=e;i++)n.push(this.getPoint(i/e));return n}getSpacedPoints(e=5){const n=[];for(let i=0;i<=e;i++)n.push(this.getPointAt(i/e));return n}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const n=[];let i,r=this.getPoint(0),s=0;n.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(r),n.push(s),r=i;return this.cacheArcLengths=n,n}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,n){const i=this.getLengths();let r=0;const s=i.length;let a;n?a=n:a=e*i[s-1];let o=0,l=s-1,u;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),u=i[r]-a,u<0)o=r+1;else if(u>0)l=r-1;else{l=r;break}if(r=l,i[r]===a)return r/(s-1);const f=i[r],h=i[r+1]-f,m=(a-f)/h;return(r+m)/(s-1)}getTangent(e,n){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),l=n||(a.isVector2?new Je:new H);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,n){const i=this.getUtoTmapping(e);return this.getTangent(i,n)}computeFrenetFrames(e,n){const i=new H,r=[],s=[],a=[],o=new H,l=new it;for(let m=0;m<=e;m++){const v=m/e;r[m]=this.getTangentAt(v,new H)}s[0]=new H,a[0]=new H;let u=Number.MAX_VALUE;const f=Math.abs(r[0].x),p=Math.abs(r[0].y),h=Math.abs(r[0].z);f<=u&&(u=f,i.set(1,0,0)),p<=u&&(u=p,i.set(0,1,0)),h<=u&&i.set(0,0,1),o.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let m=1;m<=e;m++){if(s[m]=s[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(r[m-1],r[m]),o.length()>Number.EPSILON){o.normalize();const v=Math.acos(Ht(r[m-1].dot(r[m]),-1,1));s[m].applyMatrix4(l.makeRotationAxis(o,v))}a[m].crossVectors(r[m],s[m])}if(n===!0){let m=Math.acos(Ht(s[0].dot(s[e]),-1,1));m/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(m=-m);for(let v=1;v<=e;v++)s[v].applyMatrix4(l.makeRotationAxis(r[v],m*v)),a[v].crossVectors(r[v],s[v])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function yh(){let t=0,e=0,n=0,i=0;function r(s,a,o,l){t=s,e=o,n=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,u){r(a,o,u*(o-s),u*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,u,f,p){let h=(a-s)/u-(o-s)/(u+f)+(o-a)/f,m=(o-a)/f-(l-a)/(f+p)+(l-o)/p;h*=f,m*=f,r(a,o,h,m)},calc:function(s){const a=s*s,o=a*s;return t+e*s+n*a+i*o}}}const Ko=new H,Mu=new yh,Eu=new yh,Tu=new yh;class Um extends jw{constructor(e=[],n=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=n,this.curveType=i,this.tension=r}getPoint(e,n=new H){const i=n,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let u,f;this.closed||o>0?u=r[(o-1)%s]:(Ko.subVectors(r[0],r[1]).add(r[0]),u=Ko);const p=r[o%s],h=r[(o+1)%s];if(this.closed||o+2<s?f=r[(o+2)%s]:(Ko.subVectors(r[s-1],r[s-2]).add(r[s-1]),f=Ko),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let v=Math.pow(u.distanceToSquared(p),m),x=Math.pow(p.distanceToSquared(h),m),g=Math.pow(h.distanceToSquared(f),m);x<1e-4&&(x=1),v<1e-4&&(v=x),g<1e-4&&(g=x),Mu.initNonuniformCatmullRom(u.x,p.x,h.x,f.x,v,x,g),Eu.initNonuniformCatmullRom(u.y,p.y,h.y,f.y,v,x,g),Tu.initNonuniformCatmullRom(u.z,p.z,h.z,f.z,v,x,g)}else this.curveType==="catmullrom"&&(Mu.initCatmullRom(u.x,p.x,h.x,f.x,this.tension),Eu.initCatmullRom(u.y,p.y,h.y,f.y,this.tension),Tu.initCatmullRom(u.z,p.z,h.z,f.z,this.tension));return i.set(Mu.calc(l),Eu.calc(l),Tu.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const r=e.points[n];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let n=0,i=this.points.length;n<i;n++){const r=this.points[n];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const r=e.points[n];this.points.push(new H().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}const Zo=new H,Qo=new H,wu=new H,Jo=new Ln;class Hw extends On{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const r=Math.pow(10,4),s=Math.cos(Ps*n),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,u=[0,0,0],f=["a","b","c"],p=new Array(3),h={},m=[];for(let v=0;v<l;v+=3){a?(u[0]=a.getX(v),u[1]=a.getX(v+1),u[2]=a.getX(v+2)):(u[0]=v,u[1]=v+1,u[2]=v+2);const{a:x,b:g,c:d}=Jo;if(x.fromBufferAttribute(o,u[0]),g.fromBufferAttribute(o,u[1]),d.fromBufferAttribute(o,u[2]),Jo.getNormal(wu),p[0]=`${Math.round(x.x*r)},${Math.round(x.y*r)},${Math.round(x.z*r)}`,p[1]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,p[2]=`${Math.round(d.x*r)},${Math.round(d.y*r)},${Math.round(d.z*r)}`,!(p[0]===p[1]||p[1]===p[2]||p[2]===p[0]))for(let _=0;_<3;_++){const y=(_+1)%3,T=p[_],P=p[y],R=Jo[f[_]],A=Jo[f[y]],N=`${T}_${P}`,K=`${P}_${T}`;K in h&&h[K]?(wu.dot(h[K].normal)<=s&&(m.push(R.x,R.y,R.z),m.push(A.x,A.y,A.z)),h[K]=null):N in h||(h[N]={index0:u[_],index1:u[y],normal:wu.clone()})}}for(const v in h)if(h[v]){const{index0:x,index1:g}=h[v];Zo.fromBufferAttribute(o,x),Qo.fromBufferAttribute(o,g),m.push(Zo.x,Zo.y,Zo.z),m.push(Qo.x,Qo.y,Qo.z)}this.setAttribute("position",new an(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class F0 extends kt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}class Vw extends F0{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const Au=new it,Fm=new H,Om=new H;class Gw{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Je(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new mh,this._frameExtents=new Je(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Fm.setFromMatrixPosition(e.matrixWorld),n.position.copy(Fm),Om.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Om),n.updateMatrixWorld(),Au.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Au),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Au)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Ww extends Gw{constructor(){super(new gh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Xw extends F0{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.target=new kt,this.shadow=new Ww}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const km=new it;class $w{constructor(e,n,i=0,r=1/0){this.ray=new hh(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new ph,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return km.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(km),this}intersectObject(e,n=!0,i=[]){return lf(e,this,i,n),i.sort(Bm),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)lf(e[r],this,i,n);return i.sort(Bm),i}}function Bm(t,e){return t.distance-e.distance}function lf(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){const s=t.children;for(let a=0,o=s.length;a<o;a++)lf(s[a],e,n,!0)}}class qw extends U0{constructor(e=10,n=10,i=4473924,r=8947848){i=new Ke(i),r=new Ke(r);const s=n/2,a=e/n,o=e/2,l=[],u=[];for(let h=0,m=0,v=-o;h<=n;h++,v+=a){l.push(-o,0,v,o,0,v),l.push(v,0,-o,v,0,o);const x=h===s?i:r;x.toArray(u,m),m+=3,x.toArray(u,m),m+=3,x.toArray(u,m),m+=3,x.toArray(u,m),m+=3}const f=new On;f.setAttribute("position",new an(l,3)),f.setAttribute("color",new an(u,3));const p=new xh({vertexColors:!0,toneMapped:!1});super(f,p),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ih}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ih);const Cu={tarde:{bg:"#eceef2",topA:"#ffffff",topB:"#fcfcfd",litA:"#f4f5f8",litB:"#e7e3e8",shdA:"#d9dde5",shdB:"#d0c9d1",pink:"#f3cfd0",ground:"#e3e5ea",grid:"#d6d9e0",road:"#ee8a82",roadSide:"#cf6f68",pillar:"#c7a0a4",cel:"#a9d4f6",frame:"#1c2232",car:"#ffffff",fog:"#eceef2"},noche:{bg:"#2b3040",topA:"#56627a",topB:"#4d5f79",litA:"#4f5f79",litB:"#5f5266",shdA:"#363e51",shdB:"#4a3a48",pink:"#7a5566",ground:"#242936",grid:"#2f3545",road:"#e29699",roadSide:"#b47e85",pillar:"#9c6d77",cel:"#bfe2fb",frame:"#121622",car:"#ffe9b8",fog:"#3a3546"}},zm=t=>new Ke(t);function Yw(t,e,n){return zm(t).lerp(zm(e),n)}function jm(t){const e={};for(const n of Object.keys(Cu.noche))e[n]=Yw(Cu.tarde[n],Cu.noche[n],t);return e}function Kw(t){let e=t>>>0;return()=>(e=e*1664525+1013904223>>>0)/4294967296}const O0={columna:{nombre:"HEB 300",kgm:117},viga:{nombre:"IPE 360",kgm:57.1},riostra:{nombre:"SHS 150×8",kgm:34.4},cercha:{nombre:"CHS 219×10",kgm:51.6}};function Zw(t,e,n={}){const i=Object.assign({hora:1,semilla:7,deriva:!0,vista:150,azimut:45,elevacion:41,centro:[0,0,0]},n),r=new Fw({canvas:t,antialias:!0,preserveDrawingBuffer:!0});r.setPixelRatio(Math.min(devicePixelRatio||1,2));const s=new Ow,a=new gh(-1,1,1,-1,1,1200),o=new H(...i.centro);let l=i.azimut,u=i.elevacion,f=i.vista;const p=new Vw(16777215,8949936,1.55),h=new Xw(16777215,1.35);h.position.set(-60,140,30),s.add(p,h),s.fog=new _h(0,420,900);const m=Kw(i.semilla),v=(L,X)=>new H((L+X)/Math.SQRT2,0,(X-L)/Math.SQRT2),x=[new Um([v(-230,80),v(-150,66),v(-80,52),v(-38,34),v(-22,4),v(-30,-36),v(-8,-68),v(50,-84),v(130,-92),v(240,-104)],!1,"centripetal"),new Um([v(-24,8),v(14,26),v(46,58),v(78,96),v(120,140)],!1,"centripetal")],g=7,d=1.5,_=x.map(L=>L.getSpacedPoints(Math.round(L.getLength()/1.5)));function y(L,X){let C=1e9;for(const B of _)for(const D of B){const O=(D.x-L)**2+(D.z-X)**2;O<C&&(C=O)}return Math.sqrt(C)}const T=[{id:"A",nombre:"complejo A",uso:"vivienda + comercio",pos:(()=>{const L=v(-6,64);return[L.x,0,L.z]})(),cajas:[{x:0,z:0,w:11,d:11,y:0,h:50},{x:14,z:-2,w:28,d:9,y:34,h:9},{x:26,z:-2,w:8,d:9,y:0,h:34}]},{id:"B",nombre:"complejo B",uso:"oficinas + mirador",pos:(()=>{const L=v(-64,-50);return[L.x,0,L.z]})(),cajas:[{x:0,z:0,w:30,d:13,y:0,h:16},{x:-4,z:0,w:20,d:11,y:16,h:14},{x:-7,z:0,w:11,d:10,y:30,h:16}]}],P=T.map(L=>{let X=1e9,C=-1e9,B=1e9,D=-1e9;for(const O of L.cajas)X=Math.min(X,L.pos[0]+O.x-O.w/2),C=Math.max(C,L.pos[0]+O.x+O.w/2),B=Math.min(B,L.pos[2]+O.z-O.d/2),D=Math.max(D,L.pos[2]+O.z+O.d/2);return{x0:X-5,x1:C+5,z0:B-5,z1:D+5}}),R=(L,X,C)=>P.some(B=>L+C>B.x0&&L-C<B.x1&&X+C>B.z0&&X-C<B.z1),A=[],N=[],K=[];let S=0;function w(L,X,C,B,D,O,Q,re,xe){const Ee=re?0:D[2]>.5?1:D[0]>.5?2:3;for(const[Be,Te]of[[L,O],[X,O],[C,Q],[L,O],[C,Q],[B,Q]])A.push(...Be),N.push(...D),K.push(Te,Ee,xe,S)}function Y(L,X,C,B,D,O,Q=0){const xe=Math.min(1,X/50),Ee=Math.min(1,D/50);Q===0&&(S=Math.exp(-Math.max(0,y((L+B)/2,(C+O)/2)-8)/22)),w([L,D,O],[B,D,O],[B,D,C],[L,D,C],[0,1,0],Ee,Ee,1,Q),w([L,X,O],[B,X,O],[B,D,O],[L,D,O],[0,0,1],xe,Ee,0,Q),w([B,X,C],[L,X,C],[L,D,C],[B,D,C],[0,0,-1],xe,Ee,0,Q),w([B,X,O],[B,X,C],[B,D,C],[B,D,O],[1,0,0],xe,Ee,0,Q),w([L,X,C],[L,X,O],[L,D,O],[L,D,C],[-1,0,0],xe,Ee,0,Q)}const F=16,k=13,q=new Set;for(let L=-k;L<=k;L++)for(let X=-k;X<=k;X++){if(q.has(L+","+X)){m(),m(),m();continue}const C=m()<.14&&!q.has(L+1+","+X),B=L*F+(C?F/2:0)+(m()-.5)*1.2,D=X*F+(m()-.5)*1.2,O=(C?F:0)+11+m()*2.8,Q=11+m()*2.8,re=Math.max(O,Q)/2;if(y(B,D)<re+9||R(B,D,re)){m();continue}C&&q.add(L+1+","+X);const xe=Math.hypot(B,D)/200;let Ee=C?8+m()*10:12+Math.pow(m(),1.25)*(36-xe*12);R(B,D,re+16)&&(Ee*=.55),Y(B-O/2,0,D-Q/2,B+O/2,Ee,D+Q/2),!C&&m()<.07&&Ee>24&&Y(B-O*.6/2,Ee,D-Q*.6/2,B+O*.6/2,Ee+5+m()*6,D+Q*.6/2)}for(const L of _)for(const X of[-1,1]){const C=X*2,B=X*7.6,D=L.map((O,Q)=>{const re=new H().subVectors(L[Math.min(Q+1,L.length-1)],L[Math.max(Q-1,0)]).normalize();return[-re.z,0,re.x]});for(let O=0;O<L.length-1;O++){const Q=L[O],re=L[O+1],xe=D[O],Ee=(Te,ce,ot)=>{const gt=Te===re?D[O+1]:D[O];return[Te.x+gt[0]*ce,ot,Te.z+gt[2]*ce]},Be=g/40;{const Te=Math.min(C,B),ce=Math.max(C,B);w(Ee(Q,ce,g),Ee(re,ce,g),Ee(re,Te,g),Ee(Q,Te,g),[0,1,0],Be,Be,1,1)}if(w(Ee(Q,B,g-d),Ee(re,B,g-d),Ee(re,B,g),Ee(Q,B,g),[xe[0]*X,0,xe[2]*X],Be,Be,0,2),w(Ee(re,C,g-d),Ee(Q,C,g-d),Ee(Q,C,g),Ee(re,C,g),[-xe[0]*X,0,-xe[2]*X],Be,Be,0,2),O%9===4){const Te=Ee(Q,(C+B)/2,0);Y(Te[0]-.45,0,Te[2]-.45,Te[0]+.45,g-d,Te[2]+.45,3)}}}const V=new On;V.setAttribute("position",new an(A,3)),V.setAttribute("normal",new an(N,3));const Z=new Float32Array(A.length);V.setAttribute("color",new En(Z,3));const I=new Zt(V,new vi({vertexColors:!0,side:Yn}));s.add(I);const ee=new Zt(new ao(900,900),new vi({color:2369846}));ee.rotation.x=-Math.PI/2,ee.position.y=-.02;const ie=new qw(900,180,4409956,4409956);ie.material.transparent=!0,ie.material.opacity=.55,s.add(ee,ie);const de=[];for(const[L,X]of[[13,.22],[19,.12],[26,.07]])for(const C of _){const B=[];for(let Q=0;Q<C.length-1;Q++){const re=C[Q],xe=C[Q+1],Ee=new H().subVectors(xe,re).normalize(),Be=new H(-Ee.z,0,Ee.x),Te=re.clone().addScaledVector(Be,-L),ce=re.clone().addScaledVector(Be,L),ot=xe.clone().addScaledVector(Be,L),gt=xe.clone().addScaledVector(Be,-L);for(const cn of[Te,ce,ot,Te,ot,gt])B.push(cn.x,.03,cn.z)}const D=new On;D.setAttribute("position",new an(B,3));const O=new Zt(D,new vi({color:14849689,transparent:!0,opacity:X,depthWrite:!1,side:Yn}));O.renderOrder=1,O.userData.op=X,de.push(O),s.add(O)}const Ne=new H(0,1,0),qe=new vi({color:724244,side:rn}),J=new xh({color:724244}),se=[];for(const L of T){const X=new Ma;X.position.set(...L.pos);const C=new vi({color:11983864,vertexColors:!0,transparent:!0,opacity:1,fog:!1}),B=[];let D=0,O=0;for(const ce of L.cajas){const ot=new Mi(ce.w,ce.h,ce.d);ot.translate(ce.x,ce.y+ce.h/2,ce.z);{const ut=ot.attributes.normal,lt=new Float32Array(ut.count*3);for(let dt=0;dt<ut.count;dt++){const E=ut.getY(dt)>.5?1:ut.getZ(dt)>.5?.93:ut.getX(dt)>.5?.8:.86;lt.set([E,E,E],dt*3)}ot.setAttribute("color",new En(lt,3))}const gt=new Zt(ot,C);gt.userData.complejo=L.id,X.add(gt);const cn=new Zt(new Mi(ce.w+.7,ce.h+.7,ce.d+.7),qe);cn.position.set(ce.x,ce.y+ce.h/2,ce.z),cn.userData.hull=!0,X.add(cn),X.add(new U0(new Hw(ot),J));const Bt=Math.max(1,Math.round(ce.w/6)),Cn=Math.max(1,Math.round(ce.d/6)),ci=Math.max(1,Math.round(ce.h/3.6)),wt=ce.x-ce.w/2,St=ce.z-ce.d/2,kn=ce.w/Bt,Bn=ce.d/Cn,Vr=ce.h/ci,Js=ce.y>0&&ce.w>18;for(let ut=0;ut<=Bt;ut++)for(let lt=0;lt<=Cn;lt++)Js||B.push(["columna",[wt+ut*kn,ce.y,St+lt*Bn],[wt+ut*kn,ce.y+ce.h,St+lt*Bn]]);for(let ut=0;ut<=ci;ut++){const lt=ce.y+ut*Vr;for(let dt=0;dt<=Bt;dt++)B.push(["viga",[wt+dt*kn,lt,St],[wt+dt*kn,lt,St+ce.d]]);for(let dt=0;dt<=Cn;dt++)B.push(["viga",[wt,lt,St+dt*Bn],[wt+ce.w,lt,St+dt*Bn]]);ut>0&&(O+=ce.w*ce.d)}if(Js)for(const ut of[St,St+ce.d])for(let lt=0;lt<Bt*2;lt++){const dt=wt+lt*kn/2,E=wt+(lt+1)*kn/2;B.push(["cercha",[dt,lt%2?ce.y+ce.h:ce.y,ut],[E,lt%2?ce.y:ce.y+ce.h,ut]])}else for(let ut=0;ut<ci;ut++){const lt=ce.y+ut*Vr,dt=lt+Vr;if(ut%2!==0){for(const E of[St,St+ce.d])B.push(["riostra",[wt,lt,E],[wt+kn,dt,E]]),B.push(["riostra",[wt+kn,lt,E],[wt,dt,E]]);for(const E of[wt,wt+ce.w])B.push(["riostra",[E,lt,St],[E,dt,St+Bn]]),B.push(["riostra",[E,lt,St+Bn],[E,dt,St]])}}}const Q=new Pm(new Mi(1,1,1),new vi({color:1185314}),B.length),re=new it,xe=new Br,Ee=new H,Be={},Te={};B.forEach(([ce,ot,gt],cn)=>{const Bt=new H(...ot),Cn=new H(...gt),ci=Cn.clone().sub(Bt),wt=ci.length();xe.setFromUnitVectors(Ne,ci.normalize());const St=ce==="columna"?.42:ce==="viga"?.26:.22;Ee.set(St,wt,St),re.compose(Bt.clone().add(Cn).multiplyScalar(.5),xe,Ee),Q.setMatrixAt(cn,re),D+=wt*O0[ce].kgm,Be[ce]=(Be[ce]||0)+1,Te[ce]=(Te[ce]||0)+wt}),Q.visible=!1,X.add(Q),s.add(X),L.ton=D/1e3,L.area=O,L.kgm2=D/O,L.pisos=Math.max(...L.cajas.map(ce=>Math.round((ce.y+ce.h)/3.6))),L.miembros=Be,L.metros=Te,L.altura=Math.max(...L.cajas.map(ce=>ce.y+ce.h));{const ce=L.cajas.reduce((ot,gt)=>gt.y+gt.h>ot.y+ot.h?gt:ot);L.ancla=[L.pos[0]+ce.x,ce.y+ce.h,L.pos[2]+ce.z]}se.push({c:L,g:X,mat:C,inst:Q})}const me=x.reduce((L,X)=>L+X.getLength(),0),pe=[],ke=new Mi(1.4,.5,.8),De=new vi({color:16771512}),He=new Pm(ke,De,70);for(let L=0;L<70;L++)pe.push({via:L%5===0?1:0,u:m(),lado:m()<.5?-1:1,vel:.008+m()*.01});s.add(He);function Qe(L){const X=new it,C=new Br;pe.forEach((B,D)=>{const O=x[B.via];B.u=(B.u+B.vel*L*(B.lado>0?1:-1)*(120/O.getLength())+1)%1;const Q=O.getPointAt(B.u),re=O.getTangentAt(B.u),xe=new H(-re.z,0,re.x);Q.addScaledVector(xe,B.lado*4.8),Q.y=g+.3,C.setFromAxisAngle(Ne,Math.atan2(-re.z,re.x)),X.compose(Q,C,new H(1,1,1)),He.setMatrixAt(D,X)}),He.instanceMatrix.needsUpdate=!0}Qe(0);let Ge=i.hora;function U(L){Ge=L;const X=jm(L),C=new Ke;for(let B=0,D=0;B<K.length;B+=4,D+=3){const O=K[B],Q=K[B+1],re=K[B+2],xe=K[B+3];if(re===1)C.copy(X.road);else if(re===2)C.copy(X.roadSide);else if(re===3)C.copy(X.pillar);else if(Q===0)C.copy(X.topB).lerp(X.topA,O);else{const Ee=Q===2?X.shdA:Q===1?X.litA:X.shdA,Be=Q===2?X.shdB:Q===1?X.litB:X.shdB,Te=Math.pow(1-O,1.6);C.copy(Ee).lerp(Be,Te*.85),C.lerp(X.pink,xe*Math.pow(1-O,2.2)*.6),O<.06&&C.multiplyScalar(.78+O*3.6)}Z[D]=C.r,Z[D+1]=C.g,Z[D+2]=C.b}V.attributes.color.needsUpdate=!0,s.background=X.bg,s.fog.color.copy(X.fog),ee.material.color.copy(X.ground),ie.material.color.copy(X.grid),De.color.copy(X.car),de.forEach(B=>{B.material.color.copy(X.road),B.material.opacity=B.userData.op*(.35+.65*L)}),He.visible=L>.45,p.intensity=1.25+(1-L)*.5,h.intensity=1.1+(1-L)*.6;for(const B of se)B.mat.color.copy(X.cel),B.inst.material.color.copy(X.frame);be()}let Wt=!1;function Ye(L){Wt=L;for(const X of se)X.inst.visible=L,X.mat.opacity=L?.22:1,X.mat.depthWrite=!L,X.g.children.forEach(C=>{C.userData.hull&&(C.visible=!L)});be()}function Ve(){const L=t.clientWidth||1,X=t.clientHeight||1,C=L/X,B=C<1?f*1.25:f/Math.max(1,C/1.6);a.left=-B*C/2,a.right=B*C/2,a.top=B/2,a.bottom=-B/2;const D=Ao.degToRad(l),O=Ao.degToRad(u);a.position.set(o.x+Math.cos(O)*Math.sin(D)*400,o.y+Math.sin(O)*400,o.z+Math.cos(O)*Math.cos(D)*400),a.lookAt(o),a.updateProjectionMatrix()}function Ie(){const L=t.clientWidth,X=t.clientHeight;r.setSize(L,X,!1),Ve(),be()}new ResizeObserver(Ie).observe(t);const rt="http://www.w3.org/2000/svg",Le=document.createElementNS(rt,"svg");Le.setAttribute("class","iso-lineas"),e.appendChild(Le),Le.innerHTML='<defs><marker id="flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" stroke-width="1.4"/></marker></defs>';let b=[];function M(L){var X,C,B;for(const D of b)(X=D.el)==null||X.remove(),(C=D.path)==null||C.remove(),(B=D.dot)==null||B.remove();b=L.map(D=>{const O={...D};return O.el=document.createElement("div"),O.el.className="iso-nota iso-"+(D.tipo||"callout"),O.el.innerHTML=D.html,e.appendChild(O.el),D.tipo!=="zona"&&(O.path=document.createElementNS(rt,"path"),O.path.setAttribute("class","iso-guia"),O.path.setAttribute("marker-end","url(#flecha)"),Le.appendChild(O.path),O.dot=document.createElementNS(rt,"circle"),O.dot.setAttribute("r","3.2"),O.dot.setAttribute("class","iso-punto"),Le.appendChild(O.dot)),D.complejo&&O.el.addEventListener("click",()=>fe(D.complejo)),O}),be()}function G(L){const X=new H(...L).project(a);return[(X.x+1)/2*t.clientWidth,(1-X.y)/2*t.clientHeight]}function ne(){for(const L of b){let X=L.at;if(L.via!=null){const Te=x[L.via].getPointAt(L.u);X=[Te.x,g,Te.z]}const[C,B]=G(X);if(L.tipo==="zona"){const Be=x[L.via];Be.getPointAt(L.u);const Te=Be.getPointAt(Math.min(1,L.u+.01)),[ce,ot]=G([Te.x,g,Te.z]);let gt=Math.atan2(ot-B,ce-C)*180/Math.PI;gt>90&&(gt-=180),gt<-90&&(gt+=180);const cn=L.off||18,Bt=-Math.sin(gt*Math.PI/180)*cn,Cn=Math.cos(gt*Math.PI/180)*cn;ae(L.el,C+Bt,B-Cn,`translate(-50%,-50%) rotate(${gt}deg)`);continue}const D=L.dx??60,O=L.dy??-50;if(t.clientWidth<560){const Be=L.el.offsetWidth/2+8,Te=B-Math.max(Math.abs(O),44),ce=Math.min(Math.max(C,Be),t.clientWidth-Be);L.path.setAttribute("d",`M${C} ${B} L${C} ${Te}`),L.dot.setAttribute("cx",C),L.dot.setAttribute("cy",B),ae(L.el,ce,Te-6,"translate(-50%,-100%)"),L.el.style.textAlign="center",L.el.classList.toggle("activa",L.complejo&&L.complejo===te);continue}L.el.style.textAlign="";const Q=C+D,re=B+O,xe=L.recto?`M${C} ${B} L${Q} ${B}`:`M${C} ${B} L${C} ${re} L${Q-Math.sign(D)*4} ${re}`;L.path.setAttribute("d",xe),L.dot.setAttribute("cx",C),L.dot.setAttribute("cy",B);const Ee=L.recto?B:re;ae(L.el,Q+Math.sign(D)*6,Ee,D>=0?"translate(0,-50%)":"translate(-100%,-50%)"),L.el.classList.toggle("activa",L.complejo&&L.complejo===te)}}function ae(L,X,C,B){L.style.left=X+"px",L.style.top=C+"px",L.style.transform=B}let te=null;const Ae=[];function fe(L){te=L;for(const X of se)X.mat.color.copy(jm(Ge).cel).multiplyScalar(!L||X.c.id===L?1:.7);Ae.forEach(X=>X(L?T.find(C=>C.id===L):null)),be()}const ge=new $w,We=new Je;let oe=null;t.addEventListener("pointerdown",L=>{oe={x:L.clientX,y:L.clientY,az:l,el:u,movio:!1},t.setPointerCapture(L.pointerId)}),t.addEventListener("pointermove",L=>{if(oe){const B=L.clientX-oe.x,D=L.clientY-oe.y;Math.abs(B)+Math.abs(D)>4&&(oe.movio=!0),oe.movio&&i.orbitar!==!1&&(l=oe.az-B*.25,u=Ao.clamp(oe.el+D*.15,18,70),Ve(),be());return}const X=t.getBoundingClientRect();We.set((L.clientX-X.left)/X.width*2-1,-(L.clientY-X.top)/X.height*2+1),ge.setFromCamera(We,a);const C=ge.intersectObjects(se.map(B=>B.g),!0).find(B=>B.object.userData.complejo);t.style.cursor=C?"pointer":"grab"}),t.addEventListener("pointerup",L=>{const X=oe;if(oe=null,!X||X.movio)return;const C=t.getBoundingClientRect();We.set((L.clientX-C.left)/C.width*2-1,-(L.clientY-C.top)/C.height*2+1),ge.setFromCamera(We,a);const B=ge.intersectObjects(se.map(D=>D.g),!0).find(D=>D.object.userData.complejo);i.seleccionar!==!1&&fe(B?B.object.userData.complejo:null)}),t.addEventListener("wheel",L=>{i.zoom!==!1&&(L.preventDefault(),f=Ao.clamp(f*(1+L.deltaY*.001),60,260),Ve(),be())},{passive:!1});let ve=!0,Ue=performance.now();function be(){ve=!0}const Me=new URLSearchParams(location.search).has("quieto");function Xe(L){const X=Math.min(50,L-Ue)/16.7;Ue=L,Me||(i.deriva&&!oe&&(l+=.006*X*Math.sin(L/9e3),Ve(),ve=!0),He.visible&&(Qe(X),ve=!0)),ve&&(r.render(s,a),ne(),ve=!1),requestAnimationFrame(Xe)}return U(Ge),Ie(),requestAnimationFrame(Xe),{complejos:T,largoVia:me,v,aplicarHora:U,mostrarAcero:Ye,anotar:M,elegir:fe,alElegir:L=>Ae.push(L),get acero(){return Wt},enfocar(L,X){o.set(...L),X&&(f=X),Ve(),be()},camara(L={},X=0){const C={az:l,el:u,vista:f,c:o.clone()},B={az:L.az??l,el:L.el??u,vista:L.vista??f,c:L.centro?new H(...L.centro):o.clone()};return new Promise(D=>{const O=performance.now();(function Q(re){const xe=X?Math.min(1,(re-O)/X):1,Ee=xe<.5?2*xe*xe:1-Math.pow(-2*xe+2,2)/2;l=C.az+(B.az-C.az)*Ee,u=C.el+(B.el-C.el)*Ee,f=C.vista+(B.vista-C.vista)*Ee,o.lerpVectors(C.c,B.c,Ee),Ve(),be(),xe<1?requestAnimationFrame(Q):D()})(O)})},get vistaActual(){return{az:l,el:u,vista:f,centro:o.toArray()}},set deriva(L){i.deriva=L},foto(L=.85){return r.render(s,a),t.toDataURL("image/jpeg",L)},render(){r.render(s,a),ne()}}}function ga(t,e=0){return t.toLocaleString("es-CO",{maximumFractionDigits:e,minimumFractionDigits:e})}const Qw=2400,Ru="/images/app/render-ia-corredor.jpg",Jw=[{n:"Corredor de acero",l:"Av. 26 · Bogotá",e:["coral","con cliente"],t:382,k:64,a:"hace 12 min",s:7,d:[{i:1,j:2,h:7},{i:-2,j:-2,h:5}],href:"#editor"},{n:"Torre escalonada",l:"Chapinero · Bogotá",e:["coral","con cliente"],t:163,k:57,a:"hoy",s:21,d:[{i:0,j:0,h:8.5}],href:"#acero"},{n:"Bodega Fontibón",l:"nave 42 m de luz",e:["amar","en diseño"],t:96,k:38,a:"hoy",s:4,d:[{i:0,j:1,h:2.4},{i:1,j:1,h:2.4}],via:!1,href:"#nuevo"},{n:"Casa Celosía",l:"La Calera",e:["ok","aprobado"],t:21,k:44,a:"ayer",s:11,d:[{i:0,j:0,h:2.8}],via:!1,href:"#render"},{n:"Parque bajo el viaducto",l:"Calle 80",e:["amar","en diseño"],t:58,k:31,a:"lun",s:33,d:[{i:2,j:2,h:1.6},{i:3,j:2,h:1.6}],href:"#lamina"},{n:"Faro Usaquén",l:"torre de oficinas",e:["","borrador"],t:240,k:69,a:"sep",s:9,d:[{i:-1,j:1,h:9}],href:"#editor"}],Hm={columna:"#ee7f74",viga:"#b6dbf8",riostra:"#8fa0c4",cercha:"#ffd27a"},k0={columna:"Columnas",viga:"Vigas",riostra:"Riostras",cercha:"Cercha Warren"},eA={A:["Puente habitable","vivienda + comercio"],B:["Torre escalonada","oficinas + mirador"]},Qa=t=>Math.max(4,Math.round(t.ton/12)),tA=[["IFC","Revit · ArchiCAD","IFC 4 con perfiles, niveles y propiedades de acero.","6,2 MB","#b6dbf8"],["DXF","AutoCAD","Plantas y cortes en capas: ejes, columnas, vigas, cotas.","1,8 MB","#ee7f74"],["SKP","SketchUp","Conector Ruby: volúmenes y estructura agrupados.","9,4 MB","#ffd27a"],["BL","Blender","Escena de Cycles con luz de hora dorada y cámaras.","22 MB","#f3a35c"],["3DS","3ds Max","Script MAXScript con materiales de acero.","7,1 MB","#8fa0c4"],["HTML","Visor web","Un solo archivo: ciudad, ficha y recorrido.","2,3 MB","#8fd6a8"],["MP4","Reel 15 s","Animación automática 9:16 y 16:9.","18 MB","#e29699"],["XLSX","Despiece","Perfiles, metros, kg y costo por elemento.","84 KB","#d0d6e4"]],nA=[["HEB 200","HEB","Columnas de casas y naves",200,61.3],["HEB 300","HEB","Columnas de torres",300,117],["HEB 400","HEB","Columnas de planta baja",400,155],["IPE 270","IPE","Vigas de piso, luces de 6 m",270,36.1],["IPE 360","IPE","Vigas principales, luces de 8 m",360,57.1],["IPE 450","IPE","Vigas de transferencia",450,77.6],["SHS 150×8","Tubo cuadrado","Riostras y diagonales",150,34.4],["CHS 219×10","Tubo redondo","Cerchas y puentes",219,51.6],["UPN 200","UPN","Correas y bordes de losa",200,25.3]],iA={columna:'<path d="M20 10h60M20 82h60M50 10v72" stroke="var(--coral)" stroke-width="7" fill="none"/>',viga:'<path d="M30 8h40M30 84h40M50 8v76" stroke="var(--celeste)" stroke-width="5" fill="none"/>',riostra:'<rect x="22" y="12" width="56" height="68" fill="none" stroke="#8fa0c4" stroke-width="7"/>',cercha:'<circle cx="50" cy="46" r="34" fill="none" stroke="#ffd27a" stroke-width="7"/>'},rA=[["Pizarra","#363d56","fondo de noche"],["Bloque","#4d5f79","techos de ciudad"],["Malva","#5f5266","base de fachadas"],["Coral","#ee7f74","acción · viaducto"],["Celeste","#b6dbf8","lo que es tuyo"],["Negro","#0b0d14","contorno de acero"],["Maqueta","#ffffff","día · volumen"],["Niebla","#eceef2","día · fondo"],["Grafito","#1a1e2c","día · texto"],["Ámbar","#ffd27a","cerchas"],["Hierro","#8fa0c4","riostras"],["Verde","#8fd6a8","aprobado"]],sA=["inicio","nuevo","editor","acero","render","lamina","exportar","perfiles","sistema"],Ws={az:45,el:41,vista:165,centro:[-16,0,-4]},xl=()=>matchMedia("(max-width: 900px)").matches,B0=Se.createContext(null),It=()=>Se.useContext(B0),aA=c.jsxs("svg",{viewBox:"0 0 32 32",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:[c.jsx("circle",{cx:"16",cy:"16",r:"6",fill:"currentColor"}),c.jsx("path",{d:"M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M7 25l3-3M22 10l3-3"})]}),oA=c.jsx("svg",{viewBox:"0 0 32 32",fill:"currentColor",children:c.jsx("path",{d:"M19.5 4.5a11.5 11.5 0 1 0 8 19.9A10 10 0 0 1 19.5 4.5z"})});function lA(t){const e=720+Math.round(t*450);return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}function cA({children:t}){const[e,n]=Se.useState(()=>new URLSearchParams(location.search).has("dia")?0:1),[i,r]=Se.useState(!1),[s,a]=Se.useState(!0),[o,l]=Se.useState("A"),[u,f]=Se.useState(!1),[p,h]=Se.useState(""),m=Se.useRef(null),v=Se.useRef(e),x=Se.useMemo(()=>{const k=document.createElement("div");return k.id="escena",k.innerHTML='<canvas id="ciudad"></canvas><div class="iso-capa" id="capa"></div>',k},[]),g=Se.useMemo(()=>{const k=document.createElement("div");return k.style.cssText="position:absolute;left:0;top:0;width:1400px;height:900px;visibility:hidden;pointer-events:none;overflow:hidden",k},[]);Se.useLayoutEffect(()=>(document.body.appendChild(g),x.parentNode||g.appendChild(x),()=>g.remove()),[g,x]);const d=Se.useCallback(k=>{var q;v.current=k,n(k),document.body.classList.toggle("dia",k<.5),(q=m.current)==null||q.aplicarHora(k)},[]);Se.useEffect(()=>{document.body.classList.toggle("dia",e<.5)},[]);const _=Se.useCallback(k=>{const q=v.current,V=performance.now();(function Z(I){const ee=Math.min(1,(I-V)/700);d(q+(k-q)*ee),ee<1&&requestAnimationFrame(Z)})(V)},[d]),y=Se.useCallback(k=>{const q=m.current;if(!q)return;if(a(k),!k){q.anotar([]);return}const[V,Z]=q.complejos,I=xl();q.anotar([{complejo:"A",at:V.ancla,dx:I?-40:90,dy:-50,html:`complejo A/.<small>${ga(V.ton)} t · ${ga(V.kgm2)} kg/m²</small>`},{complejo:"B",at:Z.ancla,dx:I?40:90,dy:-40,html:`complejo B/.<small>${ga(Z.ton)} t · ${ga(Z.kgm2)} kg/m²</small>`},{tipo:"zona",via:0,u:.3,off:24,html:"zona “A”"},{tipo:"zona",via:0,u:.44,off:-24,html:"zona “B”"},{tipo:"zona",via:1,u:.55,off:-24,html:"zona “C”"}])},[]),T=Se.useCallback(()=>{if(m.current)return m.current;const k=Zw(x.querySelector("#ciudad"),x.querySelector("#capa"),{vista:165,centro:[-16,0,-4],deriva:!1});return m.current=k,k.alElegir(q=>l((q||k.complejos[0]).id)),k.mostrarAcero(!1),k.aplicarHora(v.current),k.elegir("A"),window.ciudad=k,f(!0),k},[x]),P=Se.useCallback(k=>{var q;(q=m.current)==null||q.mostrarAcero(k),r(k)},[]),R=Se.useCallback((k,q=700)=>{const V=m.current;if(!V)return Promise.resolve();const Z=V.complejos[k==="B"?1:0];return V.camara({az:k==="B"?58:32,el:34,vista:xl()?110:92,centro:[Z.pos[0]+(k==="A"?10:-4),14,Z.pos[2]]},q)},[]),A=Se.useCallback(k=>{var q;(q=m.current)==null||q.elegir(k),R(k)},[R]),N=Se.useRef({}),K=Se.useRef(),S=Se.useCallback(k=>{h(k),clearTimeout(K.current),K.current=setTimeout(()=>h(""),2600)},[]),w=u?m.current.complejos:null,Y=w?w.find(k=>k.id===o)||w[0]:null,F={hora:e,aplicarHora:d,irA:_,noche:e>=.5,iconoLuz:e>=.5?aA:oA,horaTxt:lA(e),acero:i,mostrarAcero:P,notasOn:s,notas:y,actual:Y,actualId:o,elegirComplejo:A,enfocarComplejo:R,ciudad:m,listo:u,asegurarCiudad:T,escenaEl:x,parking:g,BASE:Ws,movil:xl,fmt:ga,PERFILES:O0,toast:p,avisar:S,mem:N.current};return c.jsxs(B0.Provider,{value:F,children:[t,c.jsx("div",{className:"toast"+(p?" on":""),role:"status","aria-live":"polite",children:p})]})}function gc({nombre:t,children:e}){const{escenaEl:n,parking:i}=It(),r=Se.useRef(null);return Se.useLayoutEffect(()=>(r.current.prepend(n),()=>{i.appendChild(n)}),[n,i]),c.jsx("div",{className:"slot","data-slot":t,ref:r,children:e})}function uA(){const{irA:t,noche:e,iconoLuz:n}=It();return c.jsx("button",{className:"luz","aria-label":"Cambiar día o noche",onClick:()=>t(e?0:1),children:n})}function z0(){const{irA:t,noche:e}=It();return c.jsxs("div",{className:"panelito seg",role:"group","aria-label":"Modo de luz",children:[c.jsx("button",{className:e?"":"on",onClick:()=>t(0),children:"día"}),c.jsx("button",{className:e?"on":"",onClick:()=>t(1),children:"noche"})]})}function j0({style:t}){const{hora:e,aplicarHora:n,horaTxt:i}=It();return c.jsxs("div",{className:"panelito hora",style:t,children:[c.jsx("span",{className:"tag",children:"hora/."}),c.jsx("input",{type:"range",min:"0",max:"100",value:Math.round(e*100),"aria-label":"Hora del día",onChange:r=>n(r.target.value/100)}),c.jsx("output",{className:"horaOut",children:i})]})}function H0({texto:t="ver estructura",className:e="panelito conm"}){const{acero:n,mostrarAcero:i}=It();return c.jsxs("button",{className:e,"aria-pressed":n,onClick:()=>i(!n),children:[c.jsx("i",{}),t]})}function Vm({texto:t,on:e,onChange:n}){return c.jsxs("button",{className:"conm","aria-pressed":e,onClick:()=>n(!e),children:[c.jsx("i",{}),t]})}const Gm={inicio:c.jsx("path",{d:"M3 11 12 4l9 7v9h-6v-6H9v6H3z"}),editor:c.jsx("path",{d:"M12 3 21 8v8l-9 5-9-5V8z M12 13 21 8 M12 13 3 8 M12 13v8"}),nuevo:c.jsx("path",{d:"M12 5v14M5 12h14"}),acero:c.jsx("path",{d:"M5 4h14M5 20h14M12 4v16M8 4v2M16 4v2M8 18v2M16 18v2"}),render:c.jsxs(c.Fragment,{children:[c.jsx("rect",{x:"3",y:"6",width:"18",height:"13",rx:"2"}),c.jsx("circle",{cx:"12",cy:"12.5",r:"3.5"}),c.jsx("path",{d:"M8 6l1.5-2h5L16 6"})]}),lamina:c.jsxs(c.Fragment,{children:[c.jsx("rect",{x:"3",y:"5",width:"18",height:"14"}),c.jsx("path",{d:"M13 5v14M15.5 9h3M15.5 12h3"})]}),exportar:c.jsx("path",{d:"M12 3v12M7 10l5 5 5-5M4 19h16"}),fabrica:c.jsx("path",{d:"M3 20V10l6 3V10l6 3V6h6v14z M7 17h2M12 17h2M17 17h2"}),perfiles:c.jsxs(c.Fragment,{children:[c.jsx("path",{d:"M4 5h16M4 19h16M12 5v14"}),c.jsx("path",{d:"M15 9h4v6h-4z"})]}),sistema:c.jsxs(c.Fragment,{children:[c.jsx("circle",{cx:"7",cy:"7",r:"3"}),c.jsx("circle",{cx:"17",cy:"7",r:"3"}),c.jsx("rect",{x:"4",y:"14",width:"6",height:"6"}),c.jsx("path",{d:"M17 14l3.5 6h-7z"})]})},dA=[["inicio","Inicio"],["editor","Diseñar"],["nuevo","Crear","crear"],["acero","Acero"],["render","Render"],["lamina","Lámina","solo-escritorio"],["exportar","Exportar","solo-escritorio"]];function fA({ruta:t}){const e=([n,i,r])=>c.jsxs("a",{href:"#"+n,className:[r,t===n?"on":""].filter(Boolean).join(" "),children:[c.jsx("svg",{viewBox:"0 0 24 24",children:Gm[n]}),c.jsx("span",{children:i})]},n);return c.jsxs("nav",{className:"riel","aria-label":"Navegación principal",children:[c.jsx("a",{className:"logo-mini",href:"#inicio","aria-label":"AceroStudio, inicio"}),dA.map(e),c.jsxs("a",{href:"/fabrica/",className:"solo-escritorio",title:"Fábrica: despiece, CNC y montaje",children:[c.jsx("svg",{viewBox:"0 0 24 24",children:Gm.fabrica}),c.jsx("span",{children:"Fábrica"})]}),c.jsx("div",{className:"esp"}),e(["perfiles","Perfiles","solo-escritorio"]),e(["sistema","Sistema"]),c.jsx("div",{className:"avatar",title:"Tu cuenta",children:"SA"})]})}const hA=[["editor","Volumetría"],["acero","Acero"],["render","Render"],["lamina","Lámina"]];function Ni({ruta:t,modo:e,children:n}){return c.jsxs("div",{className:"top",children:[c.jsx("div",{className:"ruta",children:t}),e&&c.jsx("nav",{className:"segmento","aria-label":"Modo",children:hA.map(([i,r])=>c.jsx("a",{href:"#"+i,className:e===i?"on":"",children:r},i))}),c.jsxs("div",{className:"der",children:[n,c.jsx(uA,{}),e&&e!=="lamina"&&c.jsx("a",{className:"boton coral chico",href:"#exportar",children:"Exportar"})]})]})}const Sh=({hoja:t})=>c.jsxs(c.Fragment,{children:[c.jsx("a",{href:"#inicio",children:"Proyectos"})," / ",c.jsx("a",{href:"#editor",children:"Corredor de acero"})," / ",c.jsx("b",{children:t})]});function pA(t){let e=t>>>0;return()=>(e=e*1664525+1013904223>>>0)/4294967296}function mA({semilla:t=1,destacados:e=[],via:n=!0,w:i=320,h:r=200,escala:s=7}={}){const a=pA(t),o=i/2,l=r*.42,u=.866,f=.5,p=(x,g,d)=>[o+(x-d)*u*s,l+(x+d)*f*s-g*s],h=[];for(let x=-4;x<=4;x++)for(let g=-4;g<=4;g++){if(n&&Math.abs(x-g*.6-.5)<.9||a()<.12)continue;const d=e.find(y=>y.i===x&&y.j===g),_=d?d.h:1.2+Math.pow(a(),1.6)*6.5;h.push({x:x*2.2,z:g*2.2,w:1.6+a()*.3,d:1.6+a()*.3,h:_,dest:!!d})}h.sort((x,g)=>x.x+x.z-(g.x+g.z));const m=x=>x.map(g=>g.map(d=>d.toFixed(1)).join(",")).join(" ");let v=`<rect width="${i}" height="${r}" fill="var(--iso-suelo)"/>`;if(n){const x=p(-12,0,-20),g=p(.5*2.2,0,0),d=p(14,0,22);v+=`<path d="M${x} Q${g} ${d}" fill="none" stroke="var(--iso-via)" stroke-width="${s*1.6}" opacity=".95"/>`,v+=`<path d="M${x} Q${g} ${d}" fill="none" stroke="var(--iso-via-luz)" stroke-width="${s*.18}" stroke-dasharray="3 6"/>`}for(const x of h){const g=x.x-x.w/2,d=x.x+x.w/2,_=x.z-x.d/2,y=x.z+x.d/2,T=[p(g,x.h,_),p(d,x.h,_),p(d,x.h,y),p(g,x.h,y)],P=[p(g,0,y),p(d,0,y),p(d,x.h,y),p(g,x.h,y)],R=[p(d,0,_),p(d,0,y),p(d,x.h,y),p(d,x.h,_)];if(x.dest){const A='stroke="var(--negro)" stroke-width="1.3" stroke-linejoin="round"';v+=`<polygon points="${m(P)}" fill="var(--iso-cel-2)" ${A}/><polygon points="${m(R)}" fill="var(--iso-cel-3)" ${A}/><polygon points="${m(T)}" fill="var(--iso-cel)" ${A}/>`;for(let N=1.2;N<x.h;N+=1.2){const K=p(g,N,y),S=p(d,N,y),w=p(d,N,_);v+=`<polyline points="${m([K,S,w])}" fill="none" stroke="var(--negro)" stroke-width=".6" opacity=".55"/>`}}else v+=`<polygon points="${m(P)}" fill="var(--iso-lit)"/><polygon points="${m(R)}" fill="var(--iso-shd)"/><polygon points="${m(T)}" fill="var(--iso-top)"/>`}return{w:i,h:r,out:v}}function Wm(t){const{w:e,h:n,out:i}=Se.useMemo(()=>mA(t),[t.semilla,t.via,t.w,t.h,t.escala]);return c.jsx("svg",{viewBox:`0 0 ${e} ${n}`,preserveAspectRatio:"xMidYMid slice","aria-hidden":"true",dangerouslySetInnerHTML:{__html:i}})}const gA=["Todos","En diseño","Con cliente","Aprobados"],vA=[["Nave industrial","luces de 20 a 60 m",c.jsxs(c.Fragment,{children:[c.jsx("path",{d:"M20 46V22l22-10 22 10v24z",fill:"none",stroke:"currentColor",strokeWidth:"1.4"}),c.jsx("path",{d:"M20 22l44 0M42 12v34",stroke:"currentColor",strokeDasharray:"3 3",fill:"none"})]})],["Torre en pórticos","6 a 30 pisos",c.jsx("path",{d:"M44 50V8h32v42M44 18h32M44 28h32M44 38h32M60 8v42",fill:"none",stroke:"currentColor",strokeWidth:"1.4"})],["Puente peatonal","cercha Warren",c.jsx("path",{d:"M14 40h92M14 30h92M14 40l10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10 10-10 10 10",fill:"none",stroke:"currentColor",strokeWidth:"1.4"})],["Casa en acero","1 a 3 pisos, steel deck",c.jsxs(c.Fragment,{children:[c.jsx("path",{d:"M30 48V26l30-14 30 14v22zM30 26h60",fill:"none",stroke:"currentColor",strokeWidth:"1.4"}),c.jsx("path",{d:"M48 48V34h24v14",fill:"none",stroke:"currentColor",strokeWidth:"1.4"})]})]],_A=[["Describir",c.jsx("path",{d:"M2 4h12M2 8h9M2 12h6"})],["Plano",c.jsx("path",{d:"M2 2h12v12H2zM2 8h6V2M8 8v6"})],["Foto",c.jsxs(c.Fragment,{children:[c.jsx("rect",{x:"1.5",y:"3.5",width:"13",height:"10",rx:"1"}),c.jsx("circle",{cx:"8",cy:"8.5",r:"2.5"})]})],["Lote en mapa",c.jsxs(c.Fragment,{children:[c.jsx("path",{d:"M8 15s5-4.5 5-8.5a5 5 0 0 0-10 0C3 10.5 8 15 8 15z"}),c.jsx("circle",{cx:"8",cy:"6.5",r:"1.8"})]})]];function xA(){const{noche:t,listo:e,ciudad:n,fmt:i,mem:r}=It(),[s,a]=Se.useState("Todos"),[o,l]=Se.useState(0),[u,f]=Se.useState(r.pedido??"Edificio de vivienda de 8 pisos en un lote de 24 × 36 m en Chapinero, con local comercial en primer piso y terraza."),p=e?n.current.complejos.reduce((v,x)=>v+x.ton,0):382,h=Jw.filter(v=>s==="Todos"||v.e[1].startsWith(s.toLowerCase().replace(/s$/,""))),m=v=>{v.preventDefault(),r.programa=u,WA("nuevo")};return c.jsxs("section",{className:"pantalla on","data-p":"inicio","aria-label":"Inicio",children:[c.jsx(Ni,{ruta:c.jsxs(c.Fragment,{children:[c.jsx("b",{children:"Inicio"})," · Estudio Acero"]}),children:c.jsx("span",{className:"chip solo-escritorio",children:"plan estudio · 3 asientos"})}),c.jsx("div",{className:"scroll",children:c.jsxs("div",{className:"inicio",children:[c.jsxs("div",{className:"hola",children:[c.jsxs("div",{children:[c.jsx("span",{className:"tag",children:t?"buenas noches/.":"buenas tardes/."}),c.jsxs("h1",{className:"titulo-disp",children:["¿Qué levantamos ",c.jsx("em",{children:"en acero"})," hoy?"]}),c.jsxs("form",{className:"pedido",onSubmit:m,children:[c.jsx("label",{className:"seccion-tag",htmlFor:"txtInicio",style:{display:"block",marginBottom:6},children:"describe el proyecto/."}),c.jsx("textarea",{id:"txtInicio",rows:"2",value:u,onChange:v=>{f(v.target.value),r.pedido=v.target.value}}),c.jsxs("div",{className:"fila",children:[_A.map(([v,x],g)=>c.jsxs("button",{type:"button",className:"entrada-chip"+(o===g?" on":""),onClick:()=>l(g),children:[c.jsx("svg",{viewBox:"0 0 16 16",children:x}),v]},v)),c.jsxs("button",{type:"submit",className:"boton coral chico",children:["Crear en acero ",c.jsx("span",{className:"flecha-punteada"})]})]})]})]}),c.jsxs("a",{className:"mini-ciudad",href:"#editor","aria-label":"Abrir Corredor de acero",children:[c.jsx(Wm,{semilla:7,destacados:[{i:1,j:2,h:8},{i:-2,j:-2,h:6}],w:480,h:300,escala:9}),c.jsxs("dl",{className:"meta",children:[c.jsx("dt",{children:"último"}),c.jsx("dd",{children:"Corredor de acero"}),c.jsx("dt",{children:"editado"}),c.jsx("dd",{children:"hace 12 min"})]}),c.jsxs("div",{className:"nota",children:[c.jsxs("b",{className:"num",children:[i(p)," t"]}),"de acero en 2 complejos"]})]})]}),c.jsxs("div",{className:"cifras",children:[c.jsxs("div",{className:"cifra coral",children:[c.jsxs("b",{className:"num",children:["1.240",c.jsx("small",{children:"t"})]}),c.jsx("span",{children:"acero diseñado este año"})]}),c.jsxs("div",{className:"cifra",children:[c.jsxs("b",{className:"num",children:["6",c.jsx("small",{children:"activos"})]}),c.jsx("span",{children:"proyectos en diseño"})]}),c.jsxs("div",{className:"cifra",children:[c.jsxs("b",{className:"num",children:["14",c.jsx("small",{children:"láminas"})]}),c.jsx("span",{children:"enviadas a clientes"})]}),c.jsxs("div",{className:"cifra",children:[c.jsxs("b",{className:"num",children:["62",c.jsx("small",{children:"kg/m²"})]}),c.jsx("span",{children:"cuantía media del estudio"})]})]}),c.jsxs("div",{className:"dos-col",children:[c.jsxs("div",{children:[c.jsxs("div",{className:"cabecera",children:[c.jsx("h2",{className:"cursiva",children:"proyectos/."}),c.jsx("div",{className:"filtros",role:"group","aria-label":"Filtrar proyectos",children:gA.map(v=>c.jsx("button",{className:s===v?"on":"",onClick:()=>a(v),children:v},v))})]}),c.jsx("div",{className:"proyectos",children:h.map(v=>c.jsxs("a",{className:"proy",href:v.href,children:[c.jsxs("div",{className:"img",children:[c.jsx(Wm,{semilla:v.s,destacados:v.d,via:v.via!==!1}),c.jsx("span",{className:"chip "+v.e[0],children:v.e[1]})]}),c.jsxs("div",{className:"txt",children:[c.jsx("b",{children:v.n}),c.jsx("span",{children:v.l}),c.jsxs("div",{className:"datos",children:[c.jsxs("span",{children:[c.jsx("i",{className:"num",children:i(v.t)})," t"]}),c.jsxs("span",{children:[c.jsx("i",{className:"num",children:v.k})," kg/m²"]}),c.jsx("span",{children:v.a})]})]})]},v.n))})]}),c.jsxs("div",{style:{display:"grid",gap:26,alignContent:"start"},children:[c.jsxs("div",{children:[c.jsxs("div",{className:"cabecera",children:[c.jsx("h2",{className:"cursiva",children:"actividad/."}),c.jsx("span",{className:"tag der",children:"hoy"})]}),c.jsxs("ul",{className:"actividad",children:[c.jsxs("li",{children:[c.jsx("i",{className:"c"}),c.jsxs("div",{children:["Cliente ",c.jsx("b",{children:"Constructora Andina"})," abrió la lámina de ",c.jsx("b",{children:"Torre escalonada"}),c.jsx("br",{}),c.jsx("span",{children:"3 veces · 4 min en la ficha de acero"})]}),c.jsx("small",{children:"10:42"})]}),c.jsxs("li",{children:[c.jsx("i",{}),c.jsxs("div",{children:["La IA terminó ",c.jsx("b",{children:"3 propuestas"})," para ",c.jsx("b",{children:"Bodega Fontibón"}),c.jsx("br",{}),c.jsx("span",{children:"nave de 42 m de luz con cercha Pratt"})]}),c.jsx("small",{children:"09:15"})]}),c.jsxs("li",{children:[c.jsx("i",{className:"o"}),c.jsxs("div",{children:[c.jsx("b",{children:"Casa Celosía"})," aprobada por el cliente",c.jsx("br",{}),c.jsx("span",{children:"IFC enviado al ingeniero estructural"})]}),c.jsx("small",{children:"ayer"})]}),c.jsxs("li",{children:[c.jsx("i",{}),c.jsxs("div",{children:["Render 4K de noche listo en ",c.jsx("b",{children:"Corredor de acero"}),c.jsx("br",{}),c.jsx("span",{children:"toma aérea · 16:9"})]}),c.jsx("small",{children:"ayer"})]})]})]}),c.jsxs("div",{children:[c.jsx("div",{className:"cabecera",children:c.jsx("h2",{className:"cursiva",children:"empezar desde/."})}),c.jsx("div",{className:"plantillas",children:vA.map(([v,x,g])=>c.jsxs("a",{className:"plantilla",href:"#nuevo",children:[c.jsx("svg",{viewBox:"0 0 120 54",children:g}),c.jsx("b",{children:v}),c.jsx("span",{children:x})]},v))})]})]})]})]})})]})}const yA=[["Describir","Texto o voz: uso, pisos, lote.",c.jsx("path",{d:"M4 6h16M4 11h12M4 16h8"})],["Plano o boceto","PDF, DWG o foto de una servilleta.",c.jsx("path",{d:"M3 3h18v18H3zM3 12h9V3M12 12v9"})],["Foto de un edificio","La IA saca volúmenes y medidas.",c.jsxs(c.Fragment,{children:[c.jsx("rect",{x:"2.5",y:"5.5",width:"19",height:"14",rx:"2"}),c.jsx("circle",{cx:"12",cy:"12.5",r:"3.5"})]})],["Lote en el mapa","Normativa y vecinos del sector.",c.jsxs(c.Fragment,{children:[c.jsx("path",{d:"M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"}),c.jsx("circle",{cx:"12",cy:"9",r:"2.5"})]})]],os=["Leyendo el lote y la normativa del sector","Volumetría: 3 opciones de masa","Estructura de acero por cada opción","Predimensionado y toneladas"],SA=[["1 · torre","298 t",c.jsx("path",{d:"M32 40V14l8-5 8 5v26l-8 4z",fill:"var(--pizarra-3)"})],["2 · puente","382 t",c.jsxs(c.Fragment,{children:[c.jsx("path",{d:"M18 40V10l8-4 8 4v30z",fill:"var(--celeste)",stroke:"var(--negro)",strokeWidth:"2"}),c.jsx("path",{d:"M34 18h28v8H34zM54 26v16h8V26",fill:"var(--celeste)",stroke:"var(--negro)",strokeWidth:"2"})]})],["3 · escalones","341 t",c.jsx("path",{d:"M16 42V30h48v12zM24 30V20h32v10M32 20V10h16v10",fill:"var(--pizarra-3)"})]],MA=t=>new Promise(e=>setTimeout(e,t));function EA(){const{asegurarCiudad:t,mostrarAcero:e,notas:n,mem:i}=It(),[r,s]=Se.useState(0),[a,o]=Se.useState(i.programa??"Une la zona A con la B con un viaducto y pon vivienda encima. Quiero que se vea el acero."),[l,u]=Se.useState({Vivienda:!0,Comercio:!0}),[f,p]=Se.useState(14),[h,m]=Se.useState(-1),[v,x]=Se.useState(1),g=Se.useRef(!1);Se.useEffect(()=>{const P=t();n(!0),e(!0),P.camara(Ws,700)},[]);const d=async P=>{if(P.preventDefault(),g.current)return;g.current=!0;const R=t();e(!1),R.anotar([]),R.camara({az:20,el:55,vista:230,centro:[-16,0,-4]},0);for(let A=0;A<os.length;A++)m(A),A===1&&R.camara({az:40,el:44,vista:180,centro:[-16,0,-4]},1100),A===2&&(e(!0),R.camara(Ws,1100)),await MA(1100);n(!0),m(os.length),g.current=!1},_=h>=os.length,y=h>=0&&!_,T=_?100:h<0?0:(h+.5)/os.length*100;return c.jsxs("section",{className:"pantalla on","data-p":"nuevo","aria-label":"Nuevo proyecto",children:[c.jsx(Ni,{ruta:c.jsxs(c.Fragment,{children:[c.jsx("a",{href:"#inicio",children:"Proyectos"})," / ",c.jsx("b",{children:"Nuevo proyecto"})]}),children:c.jsx("span",{className:"chip cel solo-escritorio",children:"sistema: acero"})}),c.jsxs("form",{className:"form-nuevo scroll",onSubmit:d,children:[c.jsxs("ol",{className:"pasos",children:[c.jsx("li",{className:"ok",children:"Entrada"}),c.jsx("li",{className:_?"ok":"on",children:"Programa"}),c.jsx("li",{className:_?"on":"",children:"Propuestas"})]}),c.jsxs("div",{className:"campo",children:[c.jsx("span",{className:"lbl",children:"¿desde qué partes?/."}),c.jsx("div",{className:"entradas",role:"radiogroup",children:yA.map(([P,R,A],N)=>c.jsxs("button",{type:"button",className:"entrada-op"+(r===N?" on":""),role:"radio","aria-checked":r===N,onClick:()=>s(N),children:[c.jsx("svg",{viewBox:"0 0 24 24",children:A}),c.jsx("b",{children:P}),c.jsx("span",{children:R})]},P))})]}),c.jsxs("div",{className:"campo",children:[c.jsx("label",{htmlFor:"txtNuevo",children:"programa/."}),c.jsx("textarea",{id:"txtNuevo",rows:"3",value:a,onChange:P=>{o(P.target.value),i.programa=P.target.value}})]}),c.jsxs("div",{className:"fila2",children:[c.jsxs("div",{className:"campo",children:[c.jsx("label",{htmlFor:"lote",children:"lote/."}),c.jsx("input",{type:"text",id:"lote",defaultValue:"Corredor Av. 26 · Bogotá"})]}),c.jsxs("div",{className:"campo",children:[c.jsx("label",{htmlFor:"area",children:"área de lote/."}),c.jsx("input",{type:"text",id:"area",defaultValue:"2.400 m²"})]})]}),c.jsxs("div",{className:"campo",children:[c.jsx("span",{className:"lbl",children:"usos/."}),c.jsx("div",{className:"usos",role:"group","aria-label":"Usos",children:["Vivienda","Comercio","Oficinas","Mirador","Bodega"].map(P=>c.jsx("button",{type:"button",className:l[P]?"on":"",onClick:()=>u({...l,[P]:!l[P]}),children:P},P))})]}),c.jsxs("div",{className:"campo",children:[c.jsxs("label",{htmlFor:"pisos",children:["pisos máximos/. ",c.jsx("output",{children:f})]}),c.jsx("input",{type:"range",id:"pisos",min:"2",max:"30",value:f,onChange:P=>p(+P.target.value)})]}),c.jsxs("div",{className:"sistema-fijo",children:[c.jsx("i",{}),c.jsxs("div",{children:[c.jsx("b",{children:"Estructura en acero estructural"}),c.jsx("span",{children:"Pórticos HEB + IPE, steel deck y cerchas donde haya luces grandes."})]})]}),c.jsxs("button",{type:"submit",className:"boton coral",disabled:y,children:["Generar 3 propuestas ",c.jsx("span",{className:"flecha-punteada"})]})]}),c.jsx(gc,{nombre:"nuevo",children:c.jsxs("div",{className:"generando sobre",children:[c.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline"},children:[c.jsx("span",{className:"cursiva",children:"generando/."}),c.jsx("span",{className:"tag",children:_?"3 propuestas listas":y?`paso ${h+1} de ${os.length}`:"listo para empezar"})]}),c.jsx("div",{className:"barra-prog",children:c.jsx("i",{style:{width:T+"%"}})}),c.jsx("ol",{children:os.map((P,R)=>c.jsx("li",{className:R<h||_?"ok":R===h?"va":"",children:P},P))}),_&&c.jsx("div",{className:"propuestas",children:SA.map(([P,R,A],N)=>c.jsxs("button",{type:"button",className:"propuesta"+(v===N?" on":""),onClick:()=>x(N),children:[c.jsx("svg",{viewBox:"0 0 80 44",children:A}),c.jsx("b",{children:P}),R]},P))}),_&&c.jsxs("a",{className:"boton linea chico",href:"#editor",children:["Abrir propuesta ",v+1," en el editor ",c.jsx("span",{className:"flecha-punteada"})]})]})})]})}function V0({conUso:t}){const{actual:e}=It(),n=(e==null?void 0:e.id)||"A",[i,r]=eA[n];return c.jsxs(c.Fragment,{children:[c.jsxs("h2",{className:"cursiva",children:["complejo ",n,"/."]}),c.jsx("div",{className:"nombre",children:i}),t&&c.jsxs("div",{className:"uso",children:[r," · acero estructural"]})]})}const $i=({v:t,u:e,t:n,coral:i})=>c.jsxs("div",{className:"kpi"+(i?" coral":""),children:[c.jsxs("b",{children:[t,c.jsx("small",{children:e})]}),c.jsx("span",{children:n})]});function TA(){const{actual:t,fmt:e}=It();return c.jsxs("div",{className:"kpis",children:[c.jsx($i,{coral:!0,v:t?e(t.ton):"–",u:"t",t:"acero estructural"}),c.jsx($i,{v:t?e(t.kgm2):"–",u:"kg/m²",t:"cuantía"}),c.jsx($i,{v:t?e(t.area):"–",u:"m²",t:"área construida"}),c.jsx($i,{v:t?e(t.pisos):"–",u:"pisos",t:t?`${e(t.altura,1)} m de altura`:"altura"})]})}function wA(){const{actual:t,fmt:e}=It();return c.jsxs("div",{className:"kpis4",children:[c.jsx($i,{coral:!0,v:t?e(t.ton):"–",u:"t",t:"acero"}),c.jsx($i,{v:t?e(t.kgm2):"–",u:"kg/m²",t:"cuantía"}),c.jsx($i,{v:t?e(t.ton*Qw/1e3):"–",u:"mil",t:"USD montado"}),c.jsx($i,{v:t?Qa(t):"–",u:"sem",t:"de montaje"})]})}function AA(){const{actual:t,fmt:e,PERFILES:n}=It();if(!t)return null;const i=Object.entries(t.miembros),r=i.map(([s])=>{var a;return(((a=t.metros)==null?void 0:a[s])||0)*n[s].kgm/1e3});return c.jsxs(c.Fragment,{children:[c.jsx("div",{className:"barra-acero barra",children:i.map(([s],a)=>c.jsx("span",{style:{flex:r[a],background:Hm[s]}},s))}),c.jsx("div",{className:"tabla-wrap",children:c.jsxs("table",{children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Elemento · perfil"}),c.jsx("th",{className:"n",children:"piezas"}),c.jsx("th",{className:"n",children:"metros"}),c.jsx("th",{className:"n",children:"kg/m"}),c.jsx("th",{className:"n",children:"toneladas"})]})}),c.jsxs("tbody",{children:[i.map(([s,a],o)=>{var l;return c.jsxs("tr",{children:[c.jsxs("td",{children:[c.jsx("i",{className:"rombo",style:{background:Hm[s]}}),k0[s]," · ",n[s].nombre]}),c.jsx("td",{className:"n",children:a}),c.jsx("td",{className:"n",children:e(((l=t.metros)==null?void 0:l[s])||0)}),c.jsx("td",{className:"n",children:e(n[s].kgm,1)}),c.jsx("td",{className:"n",children:e(r[o],1)})]},s)}),c.jsxs("tr",{children:[c.jsx("td",{children:c.jsx("b",{style:{fontWeight:500},children:"Total"})}),c.jsx("td",{className:"n",children:i.reduce((s,[,a])=>s+a,0)}),c.jsx("td",{className:"n",children:e(Object.values(t.metros||{}).reduce((s,a)=>s+a,0))}),c.jsx("td",{className:"n"}),c.jsx("td",{className:"n",style:{color:"var(--coral)"},children:e(t.ton,1)})]})]})]})})]})}function CA(){const{actual:t}=It();if(!t)return null;const e=Qa(t),n=e+2,i=[["Anclajes y placas base",0,2,"#8fa0c4"],["Columnas HEB",1,Math.round(e*.45),"#ee7f74"],["Vigas IPE + steel deck",2,Math.round(e*.55),"#b6dbf8"],...t.miembros.cercha?[["Cercha Warren (izaje)",Math.round(e*.45),3,"#ffd27a"]]:[],["Riostras y nudos",Math.round(e*.5),Math.round(e*.35),"#8fa0c4"],["Fachada y cierre",Math.round(e*.7),n-Math.round(e*.7),"var(--suave)"]];return c.jsxs("div",{className:"gantt",children:[i.map(([r,s,a,o])=>c.jsxs("div",{className:"g",children:[c.jsx("span",{children:r}),c.jsx("div",{className:"pista",children:c.jsx("i",{style:{left:s/n*100+"%",width:a/n*100+"%",background:o}})})]},r)),c.jsxs("div",{className:"eje",children:[c.jsx("span",{}),c.jsxs("div",{children:[c.jsx("span",{children:"sem 0"}),c.jsx("span",{children:Math.round(n/2)}),c.jsx("span",{children:n})]})]})]})}function RA(){const{actual:t,fmt:e}=It();if(!t)return null;const n=[["Peso propio",1,1.55,i=>`${e(i*t.area*.42)} t`],["Plazo",Qa(t),Math.round(Qa(t)*1.6),i=>`${i} sem`],["CO₂ estructura",1,1.25,i=>`${e(i*t.ton*1.4)} t`]];return c.jsx("div",{className:"comparar",children:n.map(([i,r,s,a])=>{const o=Math.max(r,s);return c.jsxs("div",{className:"comp",children:[c.jsx("span",{className:"seccion-tag",style:{fontSize:10},children:i}),c.jsxs("div",{className:"lin",children:[c.jsx("span",{children:"acero"}),c.jsx("i",{style:{width:r/o*100+"%",background:"var(--coral)"}}),c.jsx("em",{children:a(r)})]}),c.jsxs("div",{className:"lin",children:[c.jsx("span",{children:"concreto"}),c.jsx("i",{style:{width:s/o*100+"%",background:"rgba(var(--tinta-rgb),.3)"}}),c.jsx("em",{children:a(s)})]})]},i)})})}const bA=[["Seleccionar",c.jsx("path",{d:"M4 3 L15 10 L10 11 L8 16 Z"})],["Orbitar",c.jsxs(c.Fragment,{children:[c.jsx("ellipse",{cx:"10",cy:"10",rx:"8",ry:"4"}),c.jsx("circle",{cx:"10",cy:"10",r:"2"})]})],["Empujar o tirar",c.jsx("path",{d:"M4 13l6-3 6 3-6 3zM10 3v7M7 6l3-3 3 3"})],["Corte",c.jsx("path",{d:"M3 13 L10 9 L17 13 L10 17Z M10 3 V9"})],["Medir",c.jsx("path",{d:"M3 15 L15 3 M5 13 l2 2 M8 10 l2 2 M11 7 l2 2"})]];function PA(){const{asegurarCiudad:t,mostrarAcero:e,notas:n,listo:i,ciudad:r,fmt:s,horaTxt:a,irA:o,mem:l}=It(),[u,f]=Se.useState(0),[p,h]=Se.useState("chat"),[m,v]=Se.useState("Haz el puente 6 m más largo"),[x,g]=Se.useState(l.chat||[]),d=Se.useRef(null);Se.useEffect(()=>{const R=t();e(!1),n(!0),R.camara(xl()?{...Ws,centro:[-24,0,12]}:Ws,700)},[]),Se.useEffect(()=>{d.current&&(d.current.scrollTop=d.current.scrollHeight)},[x]);const[_,y]=i?r.current.complejos:[null,null],T=R=>{const A={yo:R,ia:null},N=[...x,A];g(N),l.chat=N,setTimeout(()=>{let K=`Hecho: alargué el puente 6 m. La cercha Warren pasa de 28 a 34 m de luz y el complejo A sube a ${s(_.ton*1.06)} t (+${s(_.ton*.06,1)} t).`;/noche/i.test(R)&&(K="Cambié a la luz de las 19:30. Abre Render para sacar la toma en 4K.",o(1)),/pisos/i.test(R)&&(K=`Bajé 2 pisos al complejo A: quedan ${_.pisos-2} pisos y ${s(_.ton*.87)} t de acero (−13%).`),/l[aá]mina/i.test(R)&&(K="Preparé la lámina de venta del complejo A. Está en la pestaña Lámina.");const S=N.map(w=>w===A?{...w,ia:K}:w);g(S),l.chat=S},900)},P=R=>{R.preventDefault();const A=m.trim();A&&(T(A),v(""))};return c.jsxs("section",{className:"pantalla on","data-p":"editor","data-panel":p,"aria-label":"Editor",children:[c.jsx(Ni,{ruta:c.jsxs(c.Fragment,{children:[c.jsx("a",{href:"#inicio",children:"Proyectos"})," / ",c.jsx("b",{children:"Corredor de acero"})," / propuesta 2"]}),modo:"editor",children:c.jsx("span",{className:"chip solo-escritorio",children:"guardado"})}),c.jsxs("aside",{className:"chat",children:[c.jsxs("header",{children:[c.jsx("h2",{className:"cursiva",children:"chat de diseño/."}),c.jsx("span",{className:"tag",children:"propuesta 2"})]}),c.jsxs("div",{className:"hilo",ref:d,children:[c.jsxs("div",{className:"msg yo",children:["Une la zona A con la B con un viaducto y pon vivienda encima. Quiero que se vea el acero.",c.jsxs("div",{className:"adjunto",children:[c.jsxs("svg",{viewBox:"0 0 54 38",children:[c.jsx("rect",{x:".5",y:".5",width:"53",height:"37",fill:"none",stroke:"currentColor",opacity:".4"}),c.jsx("path",{d:"M4 30C14 26 18 18 26 16S44 8 50 6",fill:"none",stroke:"var(--coral)",strokeWidth:"3"})]}),c.jsxs("div",{children:["plano_lote_av26.pdf",c.jsx("small",{children:"2 páginas · escala 1:500"})]})]})]}),c.jsxs("div",{className:"msg ia",children:[c.jsx("div",{className:"quien",children:"AceroStudio"}),"Listo. Tracé un viaducto elevado a 7 m y dos complejos en acero sobre los bordes del recorrido.",c.jsxs("ul",{className:"pasos-ia",children:[c.jsxs("li",{children:[c.jsx("b",{children:"Viaducto"})," de ",c.jsx("span",{className:"num",children:i?s(r.current.largoVia):"–"})," m con pilas cada 13 m"]}),c.jsxs("li",{children:[c.jsx("b",{children:"Complejo A"}),": torre + puente habitable con cercha Warren"]}),c.jsxs("li",{children:[c.jsx("b",{children:"Complejo B"}),": torre escalonada con pórticos arriostrados"]}),c.jsxs("li",{children:[c.jsx("b",{children:"Acero"})," predimensionado: ",c.jsx("span",{className:"num",children:_?s(_.ton+y.ton):"–"})," t"]})]})]}),c.jsx("div",{className:"msg yo",children:"Muéstrame cuánto pesa el complejo A."}),c.jsxs("div",{className:"msg ia",children:[c.jsx("div",{className:"quien",children:"AceroStudio"}),_?`El complejo A pesa ${s(_.ton)} t de acero (${s(_.kgm2)} kg/m² sobre ${s(_.area)} m²). La cercha Warren del puente concentra buena parte: la resalté en la ficha.`:"–"]}),x.map((R,A)=>c.jsxs("div",{style:{display:"contents"},children:[c.jsx("div",{className:"msg yo",children:R.yo}),c.jsxs("div",{className:"msg ia",children:[c.jsx("div",{className:"quien",children:"AceroStudio"}),R.ia??c.jsx("span",{className:"tag",children:"pensando…"})]})]},A))]}),c.jsx("div",{className:"sugerencias",children:["Render de noche","Baja 2 pisos","Lámina de venta"].map(R=>c.jsx("button",{onClick:()=>T(R),children:R},R))}),c.jsxs("form",{className:"entrada",onSubmit:P,children:[c.jsx("label",{htmlFor:"txtChat",className:"tag",hidden:!0,children:"mensaje"}),c.jsx("textarea",{id:"txtChat",placeholder:"Pide un cambio, sube un plano o una foto…",value:m,onChange:R=>v(R.target.value)}),c.jsxs("div",{className:"fila",children:[c.jsx("span",{children:"PLANO · FOTO · PDF · VOZ"}),c.jsx("button",{className:"enviar","aria-label":"Enviar",children:"↑"})]})]})]}),c.jsxs(gc,{nombre:"editor",children:[c.jsxs("dl",{className:"meta meta-lienzo sobre",children:[c.jsx("dt",{children:"hora"}),c.jsxs("dd",{children:[a," hr"]}),c.jsx("dt",{children:"volumetría"}),c.jsx("dd",{children:"2da propuesta"}),c.jsx("dt",{children:"sistema"}),c.jsx("dd",{children:"acero estructural"})]}),c.jsx("div",{className:"herr sobre",role:"toolbar","aria-label":"Herramientas",children:bA.map(([R,A],N)=>c.jsx("button",{className:u===N?"on":"",title:R,"aria-label":R,onClick:()=>f(N),children:c.jsx("svg",{viewBox:"0 0 20 20",children:A})},R))}),c.jsxs("div",{className:"barra-baja sobre",children:[c.jsx(z0,{}),c.jsx(j0,{}),c.jsx(H0,{}),c.jsxs("div",{className:"escala",children:[c.jsx("b",{}),"20 m"]})]})]}),c.jsxs("div",{className:"pest-movil segmento",role:"tablist",children:[c.jsx("button",{className:p==="chat"?"on":"",onClick:()=>h("chat"),children:"Chat"}),c.jsx("button",{className:p==="ficha"?"on":"",onClick:()=>h("ficha"),children:"Ficha"})]}),c.jsxs("aside",{className:"ficha",children:[c.jsx(V0,{conUso:!0}),c.jsx(TA,{}),c.jsxs("div",{className:"acciones",children:[c.jsxs("a",{className:"boton linea",href:"#acero",children:["Ver ficha de acero completa ",c.jsx("span",{className:"flecha-punteada"})]}),c.jsxs("a",{className:"boton coral",href:"#lamina",children:["Generar lámina de venta ",c.jsx("span",{className:"flecha-punteada"})]})]}),c.jsx("p",{className:"aviso",children:"Toca un complejo en la ciudad para ver su ficha. Arrastra para orbitar y usa la rueda para acercar."})]})]})}const NA=[["Columnas","#ee7f74"],["Vigas","#b6dbf8"],["Riostras","#8fa0c4"],["Cercha Warren","#ffd27a"]],LA=[["Placa base","4 pernos M24",c.jsxs(c.Fragment,{children:[c.jsx("rect",{x:"30",y:"44",width:"30",height:"6",fill:"none",stroke:"currentColor"}),c.jsx("path",{d:"M38 44V6h14v38",fill:"none",stroke:"var(--coral)",strokeWidth:"1.6"}),c.jsx("circle",{cx:"34",cy:"47",r:"1.6",fill:"currentColor"}),c.jsx("circle",{cx:"56",cy:"47",r:"1.6",fill:"currentColor"}),c.jsx("path",{d:"M20 54h50",stroke:"currentColor",strokeDasharray:"3 3"})]})],["Viga–columna","apernada, placa extendida",c.jsxs(c.Fragment,{children:[c.jsx("path",{d:"M24 4v50M36 4v50",stroke:"var(--coral)",strokeWidth:"1.6"}),c.jsx("path",{d:"M36 22h46M36 34h46",stroke:"var(--celeste)",strokeWidth:"1.6"}),c.jsx("rect",{x:"36",y:"20",width:"8",height:"16",fill:"none",stroke:"currentColor"}),c.jsx("circle",{cx:"40",cy:"25",r:"1.4",fill:"currentColor"}),c.jsx("circle",{cx:"40",cy:"31",r:"1.4",fill:"currentColor"})]})],["Nudo de cercha","soldado en taller",c.jsxs(c.Fragment,{children:[c.jsx("path",{d:"M6 46h78M6 12h78",stroke:"var(--celeste)",strokeWidth:"1.6"}),c.jsx("path",{d:"M14 46l18-34 18 34 18-34",fill:"none",stroke:"#ffd27a",strokeWidth:"1.6"}),c.jsx("circle",{cx:"32",cy:"12",r:"4",fill:"none",stroke:"currentColor"})]})]];function DA(){const{asegurarCiudad:t,mostrarAcero:e,notas:n,enfocarComplejo:i,actualId:r,elegirComplejo:s}=It();return Se.useEffect(()=>{t(),e(!0),n(!0),i(r)},[]),c.jsxs("section",{className:"pantalla on","data-p":"acero","aria-label":"Ficha de acero",children:[c.jsx(Ni,{ruta:c.jsx(Sh,{hoja:"Acero"}),modo:"acero"}),c.jsxs(gc,{nombre:"acero",children:[c.jsxs("div",{className:"panelito capas sobre","aria-label":"Capas de estructura",children:[c.jsx("span",{className:"tag",style:{marginBottom:4},children:"capas/."}),NA.map(([a,o])=>c.jsxs("label",{children:[c.jsx("input",{type:"checkbox",defaultChecked:!0,disabled:!0}),c.jsx("i",{style:{background:o}}),a]},a))]}),c.jsxs("div",{className:"barra-baja sobre",children:[c.jsx("div",{className:"panelito seg",role:"group","aria-label":"Complejo",children:["A","B"].map(a=>c.jsxs("button",{className:r===a?"on":"",onClick:()=>s(a),children:["complejo ",a]},a))}),c.jsx(z0,{}),c.jsxs("div",{className:"escala",children:[c.jsx("b",{}),"20 m"]})]})]}),c.jsxs("div",{className:"panel-acero",children:[c.jsx(V0,{}),c.jsx(wA,{}),c.jsxs("div",{className:"bloque",children:[c.jsx("h3",{className:"seccion-tag",children:"perfiles/."}),c.jsx(AA,{})]}),c.jsxs("div",{className:"bloque",children:[c.jsx("h3",{className:"seccion-tag",children:"montaje por semanas/."}),c.jsx(CA,{})]}),c.jsxs("div",{className:"bloque",children:[c.jsx("h3",{className:"seccion-tag",children:"acero frente a concreto/."}),c.jsx(RA,{})]}),c.jsxs("div",{className:"bloque",children:[c.jsx("h3",{className:"seccion-tag",children:"uniones tipo/."}),c.jsx("div",{className:"uniones",children:LA.map(([a,o,l])=>c.jsxs("div",{className:"union",children:[c.jsx("svg",{viewBox:"0 0 90 58",children:l}),c.jsx("b",{children:a}),c.jsx("span",{children:o})]},a))})]}),c.jsx("p",{className:"aviso",children:"Predimensionado indicativo con perfiles reales (kg/m de catálogo). Costo supuesto: USD 2.400 por tonelada montada. Comparación con concreto según cuantías típicas; el diseño final lo firma un ingeniero estructural."})]})]})}const _r=[{id:"aerea",n:"aérea",info:"isométrica · 41°",cam:()=>Ws},{id:"puente",n:"puente habitable",info:"complejo A · 30°",cam:t=>({az:24,el:28,vista:88,centro:[t.pos[0]+10,16,t.pos[2]]})},{id:"viaducto",n:"sobre el viaducto",info:"rasante · 20°",cam:()=>({az:78,el:20,vista:120,centro:[-20,6,10]})},{id:"torre",n:"torre escalonada",info:"complejo B · 36°",cam:(t,e)=>({az:60,el:36,vista:84,centro:[e.pos[0]-4,14,e.pos[2]]})},{id:"cenital",n:"cenital",info:"planta · 70°",cam:()=>({az:45,el:70,vista:210,centro:[-16,0,-4]})}],IA={"16:9":"3840 × 2160","4:5":"2160 × 2700","9:16":"2160 × 3840","1:1":"2880 × 2880"},Xm=[["maqueta","Maqueta blanca","Volumen limpio para revisar masa"],["noche","Ciudad de noche","Viaducto coral, estructura a la vista"],["foto","Fotorrealista IA","Para vender: luz real, gente, vida"]];function UA(){const{asegurarCiudad:t,notas:e,hora:n,irA:i,noche:r,avisar:s,mem:a}=It(),[o,l]=Se.useState(a.tomas||null),[u,f]=Se.useState(a.toma??0),[p,h]=Se.useState(a.formato||"16:9"),[m,v]=Se.useState(a.foto||!1),[x,g]=Se.useState(!0),[d,_]=Se.useState(!0),[y,T]=Se.useState(a.cola||[]),[P,R]=Se.useState({w:0,h:0}),A=Se.useRef(null),N=m?"foto":r?"noche":"maqueta";Se.useEffect(()=>{const F=t();e(!0),(async()=>{let k=a.tomas;if(!k){const[q,V]=F.complejos,Z=F.vistaActual,I=[];for(const ie of _r)await F.camara(ie.cam(q,V),0),I.push(F.foto(.7));F.aplicarHora(0),await F.camara(_r[0].cam(),0);const ee=F.foto(.7);F.aplicarHora(n),await F.camara(Z,0),k=a.tomas={imgs:I,maqueta:ee,noche:I[0]}}l(k),K(a.toma??0,600)})()},[]),Se.useEffect(()=>{const F=()=>{var I;const k=((I=A.current)==null?void 0:I.querySelector(".slot"))||document.querySelector('[data-slot="render"]');if(!k)return;const[q,V]=p.split(":").map(Number),Z=Math.min(k.clientWidth*.92/q,k.clientHeight*.82/V);R({w:q*Z,h:V*Z})};return F(),addEventListener("resize",F),()=>removeEventListener("resize",F)},[p]);const K=(F,k=800)=>{const q=t(),[V,Z]=q.complejos;return f(F),a.toma=F,q.camara(_r[F].cam(V,Z),k)},S=F=>{const k=F==="foto";v(k),a.foto=k,k||i(F==="noche"?1:0)},w=()=>{const F=t(),k={id:Date.now(),n:_r[u].n,f:p,estilo:Xm.find(Z=>Z[0]===N)[1],img:m?Ru:F.foto(.6),pct:0,listo:!1};let q=[k,...y];T(q),a.cola=q;const V=setInterval(()=>{k.pct=Math.min(100,k.pct+9+Math.round(Math.random()*12)),k.pct>=100&&(k.listo=!0,clearInterval(V),s(`Render 4K listo: ${k.n}`)),q=q.map(Z=>Z.id===k.id?{...k}:Z),a.cola=q,T(q)},380)},Y=F=>F==="maqueta"?o==null?void 0:o.maqueta:F==="noche"?o==null?void 0:o.noche:Ru;return c.jsxs("section",{className:"pantalla on","data-p":"render","aria-label":"Render",ref:A,children:[c.jsx(Ni,{ruta:c.jsx(Sh,{hoja:"Render"}),modo:"render"}),c.jsxs("div",{className:"tomas",role:"listbox","aria-label":"Tomas",children:[o&&_r.map((F,k)=>c.jsxs("button",{className:"toma"+(u===k?" on":""),role:"option","aria-selected":u===k,onClick:()=>K(k),children:[c.jsx("span",{className:"img",style:{backgroundImage:`url(${o.imgs[k]})`},children:c.jsx("small",{children:String(k+1).padStart(2,"0")})}),F.n]},F.id)),o&&c.jsxs("button",{className:"toma nueva",onClick:()=>s("Toma guardada desde la vista actual"),children:[c.jsx("span",{className:"img",children:"+"}),"guardar vista actual"]})]}),c.jsxs(gc,{nombre:"render",children:[c.jsx("div",{className:"foto-ia sobre"+(m?" on":""),style:{backgroundImage:`url(${Ru})`},children:c.jsx("span",{className:"chip cel sello",style:{background:"rgba(var(--vidrio-rgb),.8)"},children:"fotorrealista · IA"})}),c.jsx("div",{className:"marco sobre",children:c.jsx("div",{style:{width:P.w,height:P.h},children:c.jsxs("span",{children:[p," · ",IA[p]]})})})]}),c.jsxs("div",{className:"ctrl",children:[c.jsxs("div",{children:[c.jsxs("h2",{className:"cursiva",children:[_r[u].n,"/."]}),c.jsxs("span",{className:"tag",children:["cámara ",_r[u].info]})]}),c.jsx("div",{className:"estilos",role:"radiogroup","aria-label":"Estilo",children:Xm.map(([F,k,q])=>c.jsxs("button",{className:"estilo"+(N===F?" on":""),role:"radio","aria-checked":N===F,onClick:()=>S(F),children:[c.jsx("i",{style:{backgroundImage:Y(F)?`url(${Y(F)})`:void 0}}),c.jsxs("div",{children:[c.jsx("b",{children:k}),q]})]},F))}),c.jsxs("div",{className:"campo",children:[c.jsx("span",{className:"lbl",children:"formato/."}),c.jsx("div",{className:"formatos",role:"group","aria-label":"Formato",children:[["16:9",16,9],["4:5",10,12],["9:16",8,14],["1:1",11,11]].map(([F,k,q])=>c.jsxs("button",{className:p===F?"on":"",onClick:()=>{h(F),a.formato=F},children:[c.jsx("i",{style:{width:k,height:q}}),F]},F))})]}),c.jsx(j0,{style:{maxWidth:"none"}}),c.jsxs("div",{className:"toggles",children:[c.jsx(H0,{texto:"estructura a la vista",className:"conm"}),c.jsx(Vm,{texto:"autos en el viaducto",on:x,onChange:g}),c.jsx(Vm,{texto:"anotaciones tipo plano",on:d,onChange:F=>{_(F),e(F)}})]}),c.jsxs("button",{className:"boton coral",style:{justifyContent:"space-between"},onClick:w,children:["Generar render 4K ",c.jsx("span",{className:"flecha-punteada"})]}),c.jsxs("div",{className:"cola",children:[c.jsx("span",{className:"seccion-tag",children:"cola de render/."}),c.jsx("div",{children:y.length?y.map(F=>c.jsxs("div",{className:"trabajo",children:[c.jsx("i",{style:{backgroundImage:`url(${F.img})`}}),c.jsxs("div",{children:[F.n,c.jsxs("small",{children:[F.f," · ",F.estilo]})]}),c.jsx("span",{className:"chip "+(F.listo?"ok":"amar"),children:F.listo?"listo":F.pct+"%"})]},F.id)):c.jsx("span",{className:"aviso",style:{margin:0},children:"Nada en cola. Elige una toma y genera."})})]})]})]})}const FA="/app/assets/logo-web-o3T5u7ZR.png";function OA(){const{asegurarCiudad:t,notas:e,acero:n,hora:i,actual:r,fmt:s,avisar:a,mem:o}=It(),[l,u]=Se.useState(o.hojaDia||!1),[f,p]=Se.useState(o.hojaFoto||""),h="acerostudio.com/v/corredor-acero-a";Se.useEffect(()=>{const x=t(),[g]=x.complejos;(async()=>{const d=x.vistaActual;x.aplicarHora(l?0:1),x.mostrarAcero(!0),x.anotar([]),await x.camara({az:28,el:30,vista:100,centro:[g.pos[0]+8,16,g.pos[2]-4]},0);const _=x.foto(.85);p(_),o.hojaFoto=_,x.aplicarHora(i),x.mostrarAcero(n),e(!0),await x.camara(d,0)})()},[l]);const m=async()=>{try{await navigator.clipboard.writeText("https://"+h),a("Enlace copiado")}catch{a("Selecciona y copia el enlace")}},v=r;return c.jsxs("section",{className:"pantalla on","data-p":"lamina","aria-label":"Lámina de venta",children:[c.jsx(Ni,{ruta:c.jsx(Sh,{hoja:"Lámina de venta"}),modo:"lamina",children:c.jsx("button",{className:"boton coral chico",onClick:()=>a("Lámina enviada a Constructora Andina"),children:"Enviar al cliente"})}),c.jsx("div",{className:"mesa",children:c.jsxs("article",{className:"hoja"+(l?" dia":""),children:[c.jsx("div",{className:"foto",style:{backgroundImage:f?`url(${f})`:void 0},children:c.jsxs("dl",{className:"meta",children:[c.jsx("dt",{children:"hora"}),c.jsxs("dd",{children:[l?"12:00":"19:30"," hr"]}),c.jsx("dt",{children:"sistema"}),c.jsx("dd",{children:"acero estructural"})]})}),c.jsxs("div",{className:"txt",children:[c.jsx("span",{className:"eyebrow",children:"corredor de acero · complejo A/."}),c.jsxs("h2",{children:["Puente",c.jsx("br",{}),"habitable"]}),c.jsxs("p",{children:["Vivienda y comercio sobre el viaducto de la Av. 26. Una cercha Warren de acero cruza la vía y deja la planta libre: luz en los cuatro lados y montaje en ",c.jsx("span",{children:v?Qa(v):18})," semanas."]}),c.jsxs("div",{className:"hk",children:[c.jsxs("div",{children:[c.jsx("b",{className:"c",children:v?s(v.ton):"219"}),"toneladas de acero"]}),c.jsxs("div",{children:[c.jsx("b",{children:v?s(v.area):"3.098"}),"m² construidos"]}),c.jsxs("div",{children:[c.jsx("b",{children:v?s(v.pisos):"14"}),"pisos"]}),c.jsxs("div",{children:[c.jsx("b",{children:"–35%"}),"peso frente a concreto"]})]}),c.jsxs("div",{className:"cta",children:[c.jsx("span",{children:"Agenda una visita al modelo 3D"}),c.jsx("span",{children:"→"})]}),c.jsxs("div",{className:"pie",children:[c.jsx("img",{src:FA,alt:"ACERO"}),c.jsx("span",{children:"acerostudio.com"})]})]})]})}),c.jsxs("div",{className:"ctrl",children:[c.jsxs("div",{children:[c.jsx("h2",{className:"cursiva",children:"lámina/."}),c.jsx("span",{className:"tag",children:"plantilla y envío"})]}),c.jsxs("div",{className:"estilos",role:"radiogroup","aria-label":"Plantilla",children:[c.jsxs("button",{className:"estilo"+(l?"":" on"),role:"radio","aria-checked":!l,onClick:()=>{u(!1),o.hojaDia=!1},children:[c.jsx("i",{style:{background:"#2b3040"}}),c.jsxs("div",{children:[c.jsx("b",{children:"Venta · noche"}),"A3 horizontal, ciudad iluminada"]})]}),c.jsxs("button",{className:"estilo"+(l?" on":""),role:"radio","aria-checked":l,onClick:()=>{u(!0),o.hojaDia=!0},children:[c.jsx("i",{style:{background:"#f4f5f8",border:"1px solid #ccd"}}),c.jsxs("div",{children:[c.jsx("b",{children:"Venta · maqueta"}),"A3 horizontal, fondo claro"]})]})]}),c.jsxs("div",{className:"campo",children:[c.jsx("span",{className:"lbl",children:"también como/."}),c.jsx("div",{className:"formatos",children:["Post 4:5","Historia 9:16","Ficha técnica PDF","Reel 15 s"].map(x=>c.jsx("button",{onClick:()=>a(`${x}: se genera desde la misma escena`),children:x},x))})]}),c.jsxs("div",{className:"envio",children:[c.jsx("span",{className:"seccion-tag",children:"enlace para el cliente/."}),c.jsxs("div",{className:"link-copia",children:[c.jsx("span",{children:h}),c.jsx("button",{className:"boton linea chico",type:"button",onClick:m,children:"Copiar"})]}),c.jsx("span",{className:"aviso",style:{margin:0},children:"Abre el visor 3D con la lámina y la ficha de acero, sin instalar nada."})]}),c.jsxs("div",{className:"vistas",children:[c.jsx("span",{className:"seccion-tag",children:"lo que vio el cliente/."}),c.jsxs("div",{children:["Constructora Andina",c.jsx("span",{children:"3 visitas · hoy"})]}),c.jsxs("div",{children:["Tiempo en la ficha de acero",c.jsx("span",{children:"4 min 12 s"})]}),c.jsxs("div",{children:["Pidió el render de noche",c.jsx("span",{children:"sí"})]})]})]})]})}function kA(){const{avisar:t,mem:e}=It(),[n,i]=Se.useState(e.exportado||{}),r=s=>{if(n[s]==="listo"){t("Este prototipo no descarga archivos; en el Studio real sí.");return}i(a=>({...a,[s]:"prep"})),setTimeout(()=>i(a=>{const o={...a,[s]:"listo"};return e.exportado=o,o}),1200)};return c.jsxs("section",{className:"pantalla on","data-p":"exportar","aria-label":"Exportar",children:[c.jsx(Ni,{ruta:c.jsxs(c.Fragment,{children:[c.jsx("a",{href:"#inicio",children:"Proyectos"})," / ",c.jsx("a",{href:"#editor",children:"Corredor de acero"})," / ",c.jsx("b",{children:"Exportar"})]})}),c.jsx("div",{className:"scroll",children:c.jsxs("div",{className:"exportar",children:[c.jsxs("div",{children:[c.jsx("span",{className:"tag",children:"corredor de acero · propuesta 2/."}),c.jsx("h1",{className:"titulo-disp",style:{marginTop:8},children:"Llévalo a tu software"})]}),c.jsx("div",{className:"formatos-exp",children:tA.map(([s,a,o,l,u],f)=>c.jsxs("div",{className:"fx"+(n[f]==="listo"?" listo":""),children:[c.jsx("span",{className:"ico",style:{background:u},children:s}),c.jsx("b",{children:a}),c.jsx("p",{children:o}),c.jsxs("div",{className:"pie",children:[c.jsx("span",{children:l}),c.jsx("button",{className:"bajar",disabled:n[f]==="prep",onClick:()=>r(f),children:n[f]==="prep"?"Preparando…":n[f]==="listo"?"Listo ✓":"Preparar"})]})]},s))}),c.jsxs("div",{className:"siguiente",children:[c.jsxs("a",{className:"panel",href:"/studio/?tipo=edificio",children:[c.jsx("span",{className:"tag",children:"editar/."}),c.jsx("b",{children:"Abrir en Studio 3D"}),c.jsx("span",{children:"Ajusta perfiles, luces y pisos en el editor y saca el render comercial."}),c.jsxs("em",{children:["Abrir el Studio ",c.jsx("span",{className:"flecha-punteada"})]})]}),c.jsxs("a",{className:"panel",href:"/fabrica/",children:[c.jsx("span",{className:"tag",children:"producir/."}),c.jsx("b",{children:"Enviar a Fábrica"}),c.jsx("span",{children:"Despiece con conexiones, nesting, DSTV/NC1 para las máquinas y etiquetas QR de montaje."}),c.jsxs("em",{children:["Entrar a la planta ",c.jsx("span",{className:"flecha-punteada"})]})]})]}),c.jsxs("div",{className:"paquete",children:[c.jsxs("div",{children:[c.jsxs("div",{className:"cabecera",children:[c.jsx("h2",{className:"cursiva",children:"paquete para obra/."}),c.jsx("span",{className:"tag der",children:"zip · 48 MB"})]}),c.jsxs("div",{className:"arbol panel",children:[c.jsx("b",{children:"corredor-acero_p2/"}),`
`,"├── ",c.jsx("b",{children:"modelo"}),"/corredor.ifc           IFC 4 · Revit, ArchiCAD",`
`,"├── ",c.jsx("b",{children:"planos"}),"/plantas_1-100.dxf      AutoCAD",`
`,"├── ",c.jsx("b",{children:"planos"}),"/cortes.pdf             A1 · 6 láminas",`
`,"├── ",c.jsx("b",{children:"acero"}),"/despiece.xlsx           perfiles, metros, kg",`
`,"├── ",c.jsx("b",{children:"acero"}),"/uniones.pdf             placa base, viga–columna",`
`,"├── ",c.jsx("b",{children:"render"}),"/aerea_noche_4k.png",`
`,"├── ",c.jsx("b",{children:"render"}),"/reel_15s.mp4",`
`,"└── ",c.jsx("b",{children:"visor"}),"/corredor.html           abre en cualquier navegador"]})]}),c.jsxs("div",{children:[c.jsxs("div",{className:"cabecera",children:[c.jsx("h2",{className:"cursiva",children:"conectar por MCP/."}),c.jsx("span",{className:"tag der",children:"16 herramientas"})]}),c.jsxs("div",{className:"mcp panel",children:[c.jsx("p",{children:"Tu asistente de IA puede crear y editar este proyecto directamente: pedir toneladas, cambiar pisos o exportar a Blender."}),c.jsx("code",{children:"npx acerostudio-mcp --proyecto corredor-acero"}),c.jsx("div",{className:"fila",style:{display:"flex",gap:6,flexWrap:"wrap"},children:["crear_estructura","predimensionar","exportar_ifc","render"].map(s=>c.jsx("span",{className:"chip",children:s},s))})]})]})]})]})})]})}function BA(){const{fmt:t,PERFILES:e,listo:n,ciudad:i}=It(),r=s=>{if(!n)return"en uso";const a=i.current.complejos.reduce((o,l)=>{var u;return o+(((u=l.metros)==null?void 0:u[s])||0)*e[s].kgm},0);return`${t(a/1e3,1)} t en Corredor`};return c.jsxs("section",{className:"pantalla on","data-p":"perfiles","aria-label":"Biblioteca de perfiles",children:[c.jsx(Ni,{ruta:c.jsxs(c.Fragment,{children:[c.jsx("b",{children:"Biblioteca de perfiles"})," · catálogo de acero"]})}),c.jsx("div",{className:"scroll",children:c.jsxs("div",{className:"perfiles-pag",children:[c.jsxs("div",{children:[c.jsx("span",{className:"tag",children:"perfiles en uso/."}),c.jsx("h1",{className:"titulo-disp",style:{fontSize:"clamp(40px,4.6vw,64px)",marginTop:8},children:"El acero de tus proyectos"})]}),c.jsx("div",{className:"cat",children:Object.entries(e).map(([s,a])=>c.jsxs("div",{className:"perfil panel",children:[c.jsx("svg",{viewBox:"0 0 100 92",dangerouslySetInnerHTML:{__html:iA[s]}}),c.jsx("b",{children:a.nombre}),c.jsx("span",{children:k0[s]}),c.jsxs("div",{className:"k",children:[c.jsxs("span",{children:[t(a.kgm,1)," kg/m"]}),c.jsx("span",{children:r(s)})]})]},s))}),c.jsxs("div",{children:[c.jsxs("div",{className:"cabecera",children:[c.jsx("h2",{className:"cursiva",children:"catálogo/."}),c.jsx("span",{className:"tag der",children:"kg/m de catálogo europeo"})]}),c.jsx("div",{className:"tabla-wrap panel",style:{padding:"4px 18px"},children:c.jsxs("table",{children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Perfil"}),c.jsx("th",{children:"Familia"}),c.jsx("th",{children:"Uso típico"}),c.jsx("th",{className:"n",children:"altura mm"}),c.jsx("th",{className:"n",children:"kg/m"})]})}),c.jsx("tbody",{children:nA.map(([s,a,o,l,u])=>c.jsxs("tr",{children:[c.jsx("td",{children:c.jsx("b",{style:{fontWeight:500},children:s})}),c.jsx("td",{children:a}),c.jsx("td",{style:{color:"var(--suave)"},children:o}),c.jsx("td",{className:"n",children:l}),c.jsx("td",{className:"n",children:t(u,1)})]},s))})]})})]})]})})]})}const zA=[["inicio","Inicio","Pide un proyecto o retoma uno."],["nuevo","Crear","Texto, plano, foto o lote. 3 propuestas."],["editor","Diseñar","Chat + ciudad 3D. Toca un complejo."],["acero","Acero","Perfiles, toneladas, montaje, costo."],["render","Render","Tomas, hora, estilo, 4K."],["lamina","Vender","Lámina, enlace al cliente, exportar."]],jA=[["La ciudad siempre a la vista","Cada pantalla de proyecto muestra el modelo. Los paneles flotan en vidrio sobre la escena."],["El acero es el protagonista","Todo se diseña en acero por defecto. Celeste con contorno negro marca lo que es tuyo."],["Coral es la acción","Un solo botón coral por pantalla: el siguiente paso del flujo."],["Anotar como en plano",'Flechas punteadas, "/." al final y datos en mono. Nada de íconos de relleno.'],["Cifras reales, siempre","Toneladas, kg/m², metros y semanas salen del modelo, con su supuesto escrito."],["Día revisa, noche vende","Maqueta blanca para pensar la masa; ciudad nocturna para presentar."]];function HA(){return c.jsxs("section",{className:"pantalla on","data-p":"sistema","aria-label":"Sistema de diseño",children:[c.jsx(Ni,{ruta:c.jsxs(c.Fragment,{children:[c.jsx("b",{children:"Sistema de diseño"})," · Ciudad de acero"]})}),c.jsx("div",{className:"scroll",children:c.jsxs("div",{className:"sistema",children:[c.jsxs("div",{children:[c.jsx("span",{className:"tag",children:"ux/ui de la app/."}),c.jsx("h1",{className:"titulo-disp",style:{margin:"8px 0 14px"},children:"Ciudad de acero"}),c.jsx("p",{className:"intro",children:"La app es una maqueta viva: la ciudad isométrica siempre está detrás, el acero se resalta en celeste con contorno negro y el viaducto coral marca la acción. De noche se trabaja y se vende; de día se revisa la masa como en maqueta blanca."})]}),c.jsxs("div",{children:[c.jsxs("div",{className:"cabecera",children:[c.jsx("h2",{className:"cursiva",children:"flujo/."}),c.jsx("span",{className:"tag der",children:"de la idea a la obra"})]}),c.jsx("div",{className:"flujo",children:zA.map(([t,e,n],i)=>c.jsxs("a",{href:"#"+t,children:[c.jsx("small",{children:String(i+1).padStart(2,"0")}),c.jsx("b",{children:e}),c.jsx("span",{children:n})]},t))})]}),c.jsxs("div",{children:[c.jsxs("div",{className:"cabecera",children:[c.jsx("h2",{className:"cursiva",children:"color/."}),c.jsx("span",{className:"tag der",children:"medido de la referencia"})]}),c.jsx("div",{className:"muestras",children:rA.map(([t,e,n])=>c.jsxs("div",{className:"muestra",children:[c.jsx("i",{style:{background:e}}),c.jsx("b",{style:{fontWeight:500},children:t}),c.jsxs("small",{children:[e," · ",n]})]},t))})]}),c.jsxs("div",{children:[c.jsx("div",{className:"cabecera",children:c.jsx("h2",{className:"cursiva",children:"tipografía/."})}),c.jsxs("div",{className:"tipos",children:[c.jsxs("div",{className:"tipo",children:[c.jsx("small",{children:"Antonio 500 · títulos"}),c.jsx("span",{className:"titulo-disp",style:{fontSize:56},children:"Puente habitable"})]}),c.jsxs("div",{className:"tipo",children:[c.jsx("small",{children:"Outfit itálica · secciones"}),c.jsx("span",{className:"cursiva",style:{fontSize:22},children:"complejo A/."})]}),c.jsxs("div",{className:"tipo",children:[c.jsx("small",{children:"Outfit 300 · texto"}),c.jsx("span",{style:{fontSize:15,lineHeight:1.55},children:"Tracé un viaducto elevado a 7 m y dos complejos en acero sobre los bordes del recorrido."})]}),c.jsxs("div",{className:"tipo",children:[c.jsx("small",{children:"DM Mono · datos y rótulos"}),c.jsx("span",{className:"tag",style:{fontSize:12},children:"219 T · 71 KG/M² · HEB 300"})]})]})]}),c.jsxs("div",{children:[c.jsx("div",{className:"cabecera",children:c.jsx("h2",{className:"cursiva",children:"componentes/."})}),c.jsxs("div",{className:"componentes",children:[c.jsxs("div",{className:"comp-box panel",children:[c.jsx("span",{className:"seccion-tag",children:"botones/."}),c.jsxs("div",{className:"fila",children:[c.jsxs("span",{className:"boton coral chico",children:["Generar lámina ",c.jsx("span",{className:"flecha-punteada"})]}),c.jsx("span",{className:"boton linea chico",children:"Render 4K"})]}),c.jsxs("div",{className:"fila",children:[c.jsx("span",{className:"chip",children:"IFC 4"}),c.jsx("span",{className:"chip ok",children:"aprobado"}),c.jsx("span",{className:"chip coral",children:"con cliente"}),c.jsx("span",{className:"chip amar",children:"en diseño"})]})]}),c.jsxs("div",{className:"comp-box panel",children:[c.jsx("span",{className:"seccion-tag",children:"controles/."}),c.jsxs("div",{className:"fila",children:[c.jsxs("div",{className:"panelito seg",children:[c.jsx("button",{className:"on",children:"día"}),c.jsx("button",{children:"noche"})]}),c.jsxs("button",{className:"panelito conm","aria-pressed":"true",children:[c.jsx("i",{}),"ver estructura"]})]}),c.jsxs("div",{className:"segmento",style:{width:"max-content",maxWidth:"100%"},children:[c.jsx("a",{className:"on",children:"Acero"}),c.jsx("a",{children:"Render"}),c.jsx("a",{children:"Lámina"})]})]}),c.jsxs("div",{className:"comp-box panel",children:[c.jsx("span",{className:"seccion-tag",children:"anotación tipo plano/."}),c.jsx("div",{className:"callout-demo",children:c.jsxs("svg",{viewBox:"0 0 300 120",style:{width:"100%",height:"100%",color:"var(--tinta)"},children:[c.jsx("circle",{cx:"40",cy:"96",r:"3.2",fill:"currentColor"}),c.jsx("path",{d:"M40 96V40h120",fill:"none",stroke:"currentColor",strokeDasharray:"4 4",strokeWidth:"1.3"}),c.jsx("path",{d:"M152 35l8 5-8 5",fill:"none",stroke:"currentColor",strokeWidth:"1.4"}),c.jsx("text",{x:"168",y:"40",fontFamily:"Outfit",fontStyle:"italic",fontSize:"16",fill:"currentColor",children:"complejo A/."}),c.jsx("text",{x:"168",y:"58",fontFamily:"DM Mono",fontSize:"10",letterSpacing:"1",fill:"var(--celeste-txt)",children:"219 T · 71 KG/M²"})]})})]}),c.jsxs("div",{className:"comp-box panel",children:[c.jsx("span",{className:"seccion-tag",children:"cifra/."}),c.jsxs("div",{className:"kpis",style:{border:0},children:[c.jsxs("div",{className:"kpi coral",style:{borderBottom:0},children:[c.jsxs("b",{children:["219",c.jsx("small",{children:"t"})]}),c.jsx("span",{children:"acero estructural"})]}),c.jsxs("div",{className:"kpi",style:{borderBottom:0},children:[c.jsxs("b",{children:["71",c.jsx("small",{children:"kg/m²"})]}),c.jsx("span",{children:"cuantía"})]})]})]}),c.jsxs("div",{className:"comp-box panel",children:[c.jsx("span",{className:"seccion-tag",children:"mensaje de la IA/."}),c.jsxs("div",{className:"msg ia",children:[c.jsx("div",{className:"quien",children:"AceroStudio"}),"El complejo A pesa 219 t. La cercha concentra buena parte."]}),c.jsx("div",{className:"msg yo",children:"Baja 2 pisos"})]}),c.jsxs("div",{className:"comp-box panel",children:[c.jsx("span",{className:"seccion-tag",children:"estado de proceso/."}),c.jsx("div",{className:"generando",style:{position:"static",width:"auto",background:"none",border:0,padding:0,backdropFilter:"none"},children:c.jsxs("ol",{children:[c.jsx("li",{className:"ok",children:"Volumetría"}),c.jsx("li",{className:"va",children:"Estructura de acero"}),c.jsx("li",{children:"Predimensionado"})]})})]})]})]}),c.jsxs("div",{children:[c.jsx("div",{className:"cabecera",children:c.jsx("h2",{className:"cursiva",children:"principios/."})}),c.jsx("div",{className:"principios",children:jA.map(([t,e])=>c.jsxs("div",{className:"principio",children:[c.jsx("b",{children:t}),c.jsx("span",{children:e})]},t))})]})]})})]})}const VA={inicio:xA,nuevo:EA,editor:PA,acero:DA,render:UA,lamina:OA,exportar:kA,perfiles:BA,sistema:HA};function $m(){const t=location.hash.slice(1);return sA.includes(t)?t:"inicio"}function GA(){const[t,e]=Se.useState($m);return Se.useEffect(()=>{const n=()=>e($m());return addEventListener("hashchange",n),()=>removeEventListener("hashchange",n)},[]),t}const WA=t=>{location.hash=t};function XA(){const t=GA(),e=VA[t];return c.jsx(cA,{children:c.jsxs("div",{className:"shell",children:[c.jsx(fA,{ruta:t}),c.jsx("div",{className:"vista",children:c.jsx(e,{},t)})]})})}a0(document.getElementById("raiz")).render(c.jsx(o_.StrictMode,{children:c.jsx(XA,{})}));
