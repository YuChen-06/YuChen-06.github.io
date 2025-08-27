import{A as x,y as H}from"./hooks.module.D6on2bVO.js";import{u as M}from"./jsxRuntime.module.C6ou3Z_F.js";import"./preact.module.DE--1VBR.js";const F=({username:f="yuchen-06"})=>{const s=x(null);H(()=>{(async()=>{const b=`github_data_${f}`,d=`github_data_time_${f}`,l=1440*60*1e3;try{const o=localStorage.getItem(b),c=localStorage.getItem(d);if(o&&c&&!(Date.now()-parseInt(c)>l)){console.log("Using cached GitHub data");const t=JSON.parse(o);if(s.current){y(t,s.current);return}}console.log("Fetching fresh GitHub data...");const u=`https://github-contributions-api.jogruber.de/v4/${f}?y=last`,g=await fetch(u);if(!g.ok)throw new Error(`HTTP ${g.status}: Failed to fetch GitHub data`);const p=await g.json();localStorage.setItem(b,JSON.stringify(p)),localStorage.setItem(d,Date.now().toString()),console.log("GitHub data cached successfully"),s.current&&y(p,s.current)}catch(o){console.error("Failed to load GitHub data:",o);const c=localStorage.getItem(b);if(c&&s.current){console.log("Using expired cached data as fallback");const u=JSON.parse(c);y(u,s.current)}else s.current&&(console.log("Using simulated data as fallback"),S(s.current))}})()},[f]);const y=(m,b)=>{const d=m.contributions,l=m.total.lastYear,o=Math.max(...d.map(a=>a.count)),c=a=>a===0?0:o<=4?a:Math.min(Math.ceil(a/o*4),4),u=()=>{const a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],t=new Date,e=new Date(t);e.setFullYear(e.getFullYear()-1),e.setDate(e.getDate()+1);const n=new Date(e);n.setDate(e.getDate()-e.getDay());const i=[];let D=-1;for(let v=0;v<53;v++){const r=new Date(n);if(r.setDate(n.getDate()+v*7),r<=t){const h=r.getMonth();if(h!==D){D=h;const w=a[h],$=v+2;i.push(`<span class="month-label" style="grid-column: ${$}">${w}</span>`)}}}return i.join("")},g=()=>["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((t,e)=>e%2===1?`<span class="week-label">${t}</span>`:'<span class="week-label"></span>').join(""),p=`
      <div class="github-calendar-custom">
        <div class="github-calendar-header">
          <span>${l} contributions in the last year</span>
        </div>
        <div class="github-calendar-wrapper">
          <div class="github-calendar-months">
            ${u()}
          </div>
          <div class="github-calendar-content">
            <div class="github-calendar-weeks">
              ${g()}
            </div>
            <div class="github-calendar-grid">
              ${d.map(a=>{const t=c(a.count),e=new Date(a.date).toLocaleDateString("en-US"),n=a.count===0?"No contributions":a.count===1?"1 contribution":`${a.count} contributions`;return`
                  <div
                    class="github-day level-${t}"
                    title="${n} on ${e}"
                    data-count="${a.count}"
                    data-date="${a.date}"
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
    `;b.innerHTML=p},S=m=>{const d=new Date,l=[];for(let t=364;t>=0;t--){const e=new Date(d);e.setDate(e.getDate()-t);const n=Math.floor(Math.random()*8);l.push({date:e.toISOString().split("T")[0],count:n})}const o=l.reduce((t,e)=>t+e.count,0),c=Math.max(...l.map(t=>t.count)),u=t=>t===0?0:Math.min(Math.ceil(t/c*4),4),g=()=>{const t=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],e=new Date,n=new Date(e);n.setFullYear(n.getFullYear()-1),n.setDate(n.getDate()+1);const i=new Date(n);i.setDate(n.getDate()-n.getDay());const D=[];let v=-1;for(let r=0;r<53;r++){const h=new Date(i);if(h.setDate(i.getDate()+r*7),h<=e){const w=h.getMonth();if(w!==v){v=w;const $=t[w],k=r+2;D.push(`<span class="month-label" style="grid-column: ${k}">${$}</span>`)}}}return D.join("")},p=()=>["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((e,n)=>n%2===1?`<span class="week-label">${e}</span>`:'<span class="week-label"></span>').join(""),a=`
      <div class="github-calendar-custom">
        <div class="github-calendar-header">
          <span>${o} contributions in the last year (demo data)</span>
        </div>
        <div class="github-calendar-wrapper">
          <div class="github-calendar-months">
            ${g()}
          </div>
          <div class="github-calendar-content">
            <div class="github-calendar-weeks">
              ${p()}
            </div>
            <div class="github-calendar-grid">
              ${l.map(t=>{const e=u(t.count),n=new Date(t.date).toLocaleDateString("en-US"),i=t.count===0?"No contributions":t.count===1?"1 contribution":`${t.count} contributions`;return`
                  <div
                    class="github-day level-${e}"
                    title="${i} on ${n}"
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
    `;m.innerHTML=a};return M("div",{ref:s,style:{width:"100%",minHeight:"150px",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255, 255, 255, 0.9)"},children:M("div",{style:{color:"rgba(255, 255, 255, 0.7)"},children:"正在加载 GitHub 贡献数据..."})})};export{F as default};
