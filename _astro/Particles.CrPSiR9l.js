import{A,y as D}from"./hooks.module.D6on2bVO.js";/* empty css                       */import{u as J}from"./jsxRuntime.module.C6ou3Z_F.js";import{T as K,M as P,V as h,R as Q,G as Z,P as H,a as tt}from"./Mesh.BQZ91osC.js";import"./preact.module.DE--1VBR.js";const et=new P,rt=new h,ot=new h;class st extends K{constructor(t,{near:e=.1,far:s=100,fov:o=45,aspect:i=1,left:m,right:a,bottom:g,top:w,zoom:x=1}={}){super(),Object.assign(this,{near:e,far:s,fov:o,aspect:i,left:m,right:a,bottom:g,top:w,zoom:x}),this.projectionMatrix=new P,this.viewMatrix=new P,this.projectionViewMatrix=new P,this.worldPosition=new h,this.type=m||a?"orthographic":"perspective",this.type==="orthographic"?this.orthographic():this.perspective()}perspective({near:t=this.near,far:e=this.far,fov:s=this.fov,aspect:o=this.aspect}={}){return Object.assign(this,{near:t,far:e,fov:s,aspect:o}),this.projectionMatrix.fromPerspective({fov:s*(Math.PI/180),aspect:o,near:t,far:e}),this.type="perspective",this}orthographic({near:t=this.near,far:e=this.far,left:s=this.left||-1,right:o=this.right||1,bottom:i=this.bottom||-1,top:m=this.top||1,zoom:a=this.zoom}={}){return Object.assign(this,{near:t,far:e,left:s,right:o,bottom:i,top:m,zoom:a}),s/=a,o/=a,i/=a,m/=a,this.projectionMatrix.fromOrthogonal({left:s,right:o,bottom:i,top:m,near:t,far:e}),this.type="orthographic",this}updateMatrixWorld(){return super.updateMatrixWorld(),this.viewMatrix.inverse(this.worldMatrix),this.worldMatrix.getTranslation(this.worldPosition),this.projectionViewMatrix.multiply(this.projectionMatrix,this.viewMatrix),this}updateProjectionMatrix(){return this.type==="perspective"?this.perspective():this.orthographic()}lookAt(t){return super.lookAt(t,!0),this}project(t){return t.applyMatrix4(this.viewMatrix),t.applyMatrix4(this.projectionMatrix),this}unproject(t){return t.applyMatrix4(et.inverse(this.projectionMatrix)),t.applyMatrix4(this.worldMatrix),this}updateFrustum(){this.frustum||(this.frustum=[new h,new h,new h,new h,new h,new h]);const t=this.projectionViewMatrix;this.frustum[0].set(t[3]-t[0],t[7]-t[4],t[11]-t[8]).constant=t[15]-t[12],this.frustum[1].set(t[3]+t[0],t[7]+t[4],t[11]+t[8]).constant=t[15]+t[12],this.frustum[2].set(t[3]+t[1],t[7]+t[5],t[11]+t[9]).constant=t[15]+t[13],this.frustum[3].set(t[3]-t[1],t[7]-t[5],t[11]-t[9]).constant=t[15]-t[13],this.frustum[4].set(t[3]-t[2],t[7]-t[6],t[11]-t[10]).constant=t[15]-t[14],this.frustum[5].set(t[3]+t[2],t[7]+t[6],t[11]+t[10]).constant=t[15]+t[14];for(let e=0;e<6;e++){const s=1/this.frustum[e].distance();this.frustum[e].multiply(s),this.frustum[e].constant*=s}}frustumIntersectsMesh(t,e=t.worldMatrix){if(!t.geometry.attributes.position||((!t.geometry.bounds||t.geometry.bounds.radius===1/0)&&t.geometry.computeBoundingSphere(),!t.geometry.bounds))return!0;const s=rt;s.copy(t.geometry.bounds.center),s.applyMatrix4(e);const o=t.geometry.bounds.radius*e.getMaxScaleOnAxis();return this.frustumIntersectsSphere(s,o)}frustumIntersectsSphere(t,e){const s=ot;for(let o=0;o<6;o++){const i=this.frustum[o];if(s.copy(i).dot(t)+i.constant<-e)return!1}return!0}}const G=u=>{u=u.replace(/^#/,""),u.length===3&&(u=u.split("").map(i=>i+i).join(""));const t=parseInt(u,16),e=(t>>16&255)/255,s=(t>>8&255)/255,o=(t&255)/255;return[e,s,o]},nt=`
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`,it=`
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`,ht=({particleCount:u=200,particleSpread:t=10,speed:e=.1,particleColors:s,moveParticlesOnHover:o=!1,particleHoverFactor:i=1,alphaParticles:m=!1,particleBaseSize:a=100,sizeRandomness:g=1,cameraDistance:w=20,disableRotation:x=!1,className:U})=>{const R=A(null),j=A({x:0,y:0}),F=A("dark");return D(()=>{const f=R.current;if(!f)return;const T=new Q({depth:!1,alpha:!0}),c=T.gl;f.appendChild(c.canvas),c.clearColor(0,0,0,0);const z=new st(c,{fov:15});z.position.set(0,0,w);const C=()=>{const r=f.clientWidth,n=f.clientHeight;T.setSize(r,n),z.perspective({aspect:c.canvas.width/c.canvas.height})};window.addEventListener("resize",C,!1),C();const k=r=>{const n=r.clientX/window.innerWidth*2-1,l=-(r.clientY/window.innerHeight*2-1);j.current={x:n,y:l}};o&&document.addEventListener("mousemove",k);const E=()=>{const r=document.documentElement.classList.contains("dark");return F.current=r?"dark":"light",r?["#ffffff","#f0f0f0","#e0e0e0"]:["#333333","#444444","#555555"]},X=(r,n)=>{const l=r.attributes.color.data,v=l.length/3;for(let p=0;p<v;p++){const M=G(n[Math.floor(Math.random()*n.length)]);l.set(M,p*3)}r.attributes.color.needsUpdate=!0},y=u,I=new Float32Array(y*3),L=new Float32Array(y*4),V=new Float32Array(y*3),_=E();for(let r=0;r<y;r++){let n,l,v,p;do n=Math.random()*2-1,l=Math.random()*2-1,v=Math.random()*2-1,p=n*n+l*l+v*v;while(p>1||p===0);const M=Math.cbrt(Math.random());I.set([n*M,l*M,v*M],r*3),L.set([Math.random(),Math.random(),Math.random(),Math.random()],r*4);const $=G(_[Math.floor(Math.random()*_.length)]);V.set($,r*3)}const O=new Z(c,{position:{size:3,data:I},random:{size:4,data:L},color:{size:3,data:V}}),W=new H(c,{vertex:nt,fragment:it,uniforms:{uTime:{value:0},uSpread:{value:t},uBaseSize:{value:a},uSizeRandomness:{value:g},uAlphaParticles:{value:m?1:0}},transparent:!0,depthTest:!1}),d=new tt(c,{mode:c.POINTS,geometry:O,program:W}),Y=()=>{const r=E();X(O,r)},B=new MutationObserver(r=>{r.forEach(n=>{n.type==="attributes"&&n.attributeName==="class"&&(document.documentElement.classList.contains("dark")?"dark":"light")!==F.current&&Y()})});B.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]});let S,N=performance.now(),b=0;const q=r=>{S=requestAnimationFrame(q);const n=r-N;N=r,b+=n*e,W.uniforms.uTime.value=b*.001,o?(d.position.x=-j.current.x*i,d.position.y=-j.current.y*i):(d.position.x=0,d.position.y=0),x||(d.rotation.x=Math.sin(b*2e-4)*.1,d.rotation.y=Math.cos(b*5e-4)*.15,d.rotation.z+=.01*e),T.render({scene:d,camera:z})};return S=requestAnimationFrame(q),()=>{window.removeEventListener("resize",C),o&&document.removeEventListener("mousemove",k),B.disconnect(),cancelAnimationFrame(S),f.contains(c.canvas)&&f.removeChild(c.canvas)}},[u,t,e,o,i,m,a,g,w,x]),J("div",{ref:R,className:`particles-container ${U}`})};export{ht as default};
