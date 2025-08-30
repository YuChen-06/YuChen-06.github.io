import{A as L,y as x}from"./hooks.module.D6on2bVO.js";import{u as M}from"./jsxRuntime.module.C6ou3Z_F.js";import"./preact.module.DE--1VBR.js";const F=({username:w="yuchen-06"})=>{const i=L(null);x(()=>{(async()=>{const h=`github_data_${w}`,r=`github_data_time_${w}`;try{console.log("Fetching fresh GitHub data..."),localStorage.removeItem(h),localStorage.removeItem(r);const s=Date.now(),o=Math.random().toString(36).substring(7),d=`https://github-contributions-api.jogruber.de/v4/${w}?y=last&_t=${s}&_r=${o}&_cache_bust=${Date.now()}`,u=await fetch(d,{cache:"no-cache",headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(!u.ok)throw new Error(`HTTP ${u.status}: Failed to fetch GitHub data`);const b=await u.json();localStorage.setItem(h,JSON.stringify(b)),localStorage.setItem(r,Date.now().toString()),console.log("GitHub data cached successfully"),i.current&&f(b,i.current)}catch(s){console.error("Failed to load GitHub data:",s);const o=localStorage.getItem(h);if(o&&i.current){console.log("Using expired cached data as fallback");const d=JSON.parse(o);f(d,i.current)}else i.current&&(console.log("Using simulated data as fallback"),S(i.current))}})()},[w]);const f=(p,h)=>{const r=p.contributions,s=p.total.lastYear,o=Math.max(...r.map(n=>n.count)),d=n=>n===0?0:o<=4?n:Math.min(Math.ceil(n/o*4),4),u=()=>{const n=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],t=new Date,e=new Date(t);e.setFullYear(e.getFullYear()-1),e.setDate(e.getDate()+1);const a=new Date(e);a.setDate(e.getDate()-e.getDay());const c=[];let m=-1;for(let g=0;g<53;g++){const l=new Date(a);if(l.setDate(a.getDate()+g*7),l<=t){const v=l.getMonth();if(v!==m){m=v;const D=n[v],y=g+2;c.push(`<span class="month-label" style="grid-column: ${y}">${D}</span>`)}}}return c.join("")},b=()=>["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((t,e)=>e%2===1?`<span class="week-label">${t}</span>`:'<span class="week-label"></span>').join(""),$=`
      <div class="github-calendar-custom">
        <div class="github-calendar-header">
          <span>${s} contributions in the last year</span>
        </div>
        <div class="github-calendar-wrapper">
          <div class="github-calendar-months">
            ${u()}
          </div>
          <div class="github-calendar-content">
            <div class="github-calendar-weeks">
              ${b()}
            </div>
            <div class="github-calendar-grid">
              ${r.map(n=>{const t=d(n.count),e=new Date(n.date).toLocaleDateString("en-US"),a=n.count===0?"No contributions":n.count===1?"1 contribution":`${n.count} contributions`;return`
                  <div
                    class="github-day level-${t}"
                    title="${a} on ${e}"
                    data-count="${n.count}"
                    data-date="${n.date}"
                  ></div>
                `}).join("")}
            </div>
          </div>
        </div>
        <div class="github-calendar-legend">
          <span class="legend-text">Less</span>
          <div class="legend-colors">
            <div class="legend-day level-0"></div>
            <div class="legend-day level-1"></div>
            <div class="legend-day level-2"></div>
            <div class="legend-day level-3"></div>
            <div class="legend-day level-4"></div>
          </div>
          <span class="legend-text">More</span>
        </div>
      </div>
    `;h.innerHTML=$},S=p=>{const r=new Date,s=[];for(let t=364;t>=0;t--){const e=new Date(r);e.setDate(e.getDate()-t);const a=Math.floor(Math.random()*8);s.push({date:e.toISOString().split("T")[0],count:a})}const o=s.reduce((t,e)=>t+e.count,0),d=Math.max(...s.map(t=>t.count)),u=t=>t===0?0:Math.min(Math.ceil(t/d*4),4),b=()=>{const t=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],e=new Date,a=new Date(e);a.setFullYear(a.getFullYear()-1),a.setDate(a.getDate()+1);const c=new Date(a);c.setDate(a.getDate()-a.getDay());const m=[];let g=-1;for(let l=0;l<53;l++){const v=new Date(c);if(v.setDate(c.getDate()+l*7),v<=e){const D=v.getMonth();if(D!==g){g=D;const y=t[D],k=l+2;m.push(`<span class="month-label" style="grid-column: ${k}">${y}</span>`)}}}return m.join("")},$=()=>["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((e,a)=>a%2===1?`<span class="week-label">${e}</span>`:'<span class="week-label"></span>').join(""),n=`
      <div class="github-calendar-custom">
        <div class="github-calendar-header">
          <span>${o} contributions in the last year (demo data)</span>
        </div>
        <div class="github-calendar-wrapper">
          <div class="github-calendar-months">
            ${b()}
          </div>
          <div class="github-calendar-content">
            <div class="github-calendar-weeks">
              ${$()}
            </div>
            <div class="github-calendar-grid">
              ${s.map(t=>{const e=u(t.count),a=new Date(t.date).toLocaleDateString("en-US"),c=t.count===0?"No contributions":t.count===1?"1 contribution":`${t.count} contributions`;return`
                  <div
                    class="github-day level-${e}"
                    title="${c} on ${a}"
                    data-count="${t.count}"
                    data-date="${t.date}"
                  ></div>
                `}).join("")}
            </div>
          </div>
        </div>
        <div class="github-calendar-legend">
          <span class="legend-text">Less</span>
          <div class="legend-colors">
            <div class="legend-day level-0"></div>
            <div class="legend-day level-1"></div>
            <div class="legend-day level-2"></div>
            <div class="legend-day level-3"></div>
            <div class="legend-day level-4"></div>
          </div>
          <span class="legend-text">More</span>
        </div>
      </div>
    `;p.innerHTML=n};return M("div",{ref:i,style:{width:"100%",minHeight:"150px",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255, 255, 255, 0.9)"},children:M("div",{style:{color:"rgba(255, 255, 255, 0.7)"},children:"正在加载 GitHub 贡献数据..."})})};export{F as default};
