/*! (c) Andrea Giammarchi - ISC */
var saferCrypto=function(e){"use strict";var t=Function.call,r=t.bind(t.bind),o=r(t,t.apply);t=r(t,t);const{freeze:c,setPrototypeOf:n}=Object,{prototype:s,reject:u,resolve:a}=Promise,{catch:p,then:l}=s;class i extends Promise{static reject(e){return t(u,i,h(e))}static resolve(e){return t(a,i,h(e))}constructor(e){c(super(e))}catch(){return o(p,this,arguments)}then(){return o(l,this,arguments)}}const{prototype:y,reject:f,resolve:b}=i,h=e=>"object"==typeof e&&null!==e&&"then"in e&&!(e instanceof i)?n(e,y):e;c(i),c(y);const{freeze:v,defineProperty:j,getOwnPropertyNames:m,getPrototypeOf:P}=Object,O=(e,t)=>"function"==typeof e[t]&&"constructor"!==t,{subtle:d}=crypto,g={},z={};m(P(crypto)).forEach(e=>{O(crypto,e)&&j(g,e,{enumerable:!0,value:r(crypto[e],crypto)})}),m(P(d)).forEach(e=>{if(O(d,e)){const t=d[e];j(z,e,{enumerable:!0,value(){return b(o(t,d,arguments))}})}});v(j(g,"subtle",{enumerable:!0,value:v(z)}));return i}();
