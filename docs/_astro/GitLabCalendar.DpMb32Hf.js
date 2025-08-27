import{A as F,y as E}from"./hooks.module.D6on2bVO.js";import{u as G}from"./jsxRuntime.module.C6ou3Z_F.js";import"./preact.module.DE--1VBR.js";const O=({username:m="Chen",gitlabUrl:L="https://git.henau.edu.cn",accessToken:S=""})=>{const g=F(null),A=async()=>{const n=`gitlab_data_${m}`,s=`gitlab_data_time_${m}`,i=360*60*1e3;try{const d=localStorage.getItem(n),c=localStorage.getItem(s);if(d&&c&&!(Date.now()-parseInt(c)>i)){console.log("Using cached GitLab data");const h=JSON.parse(d);if(g.current){y(h,g.current);return}}const e={Accept:"application/json","Content-Type":"application/json"};S?(e["PRIVATE-TOKEN"]=S,console.log("Using Personal Access Token for GitLab API")):console.log("No access token provided, trying public API");const o={headers:e,mode:"cors",credentials:"omit"};console.log("Fetching GitLab user info...");const a=`${L}/api/v4/users?username=${m}`,l=await fetch(a,o);if(!l.ok)throw new Error(`Failed to fetch user info: ${l.status} ${l.statusText}`);const t=await l.json();if(!t||t.length===0)throw new Error("User not found");const p=t[0].id;console.log(`Found GitLab user ID: ${p}`),console.log("Fetching GitLab events...");const w=`${L}/api/v4/users/${p}/events`,v=new Date;v.setFullYear(v.getFullYear()-1);const b=Date.now();let u=[],r=1;const D=100;for(;r<=10;){const T=`${w}?after=${v.toISOString()}&per_page=${D}&page=${r}&_t=${b}`;console.log(`Fetching page ${r}...`);const h=await fetch(T,o);if(!h.ok){if(r===1)throw new Error(`Failed to fetch events: ${h.status} ${h.statusText}`);console.log(`Page ${r} failed, stopping pagination`);break}const f=await h.json();if(!f||f.length===0){console.log(`Page ${r} returned no events, stopping pagination`);break}if(u=u.concat(f),console.log(`Page ${r}: ${f.length} events`),r++,f.length<D){console.log("Reached last page");break}await new Promise(M=>setTimeout(M,100))}console.log(`Total events fetched: ${u.length}`);const $=C(u);localStorage.setItem(n,JSON.stringify($)),localStorage.setItem(s,Date.now().toString()),console.log("GitLab data cached successfully"),g.current&&y($,g.current)}catch(d){console.error("GitLab API access failed:",d.message);const c=localStorage.getItem(n);if(c&&g.current){console.log("Using cached GitLab data as fallback");const e=JSON.parse(c);y(e,g.current)}else g.current&&k(g.current)}};E(()=>{A()},[m,L,S]);const C=n=>{const s=new Map,i=new Date;i.setFullYear(i.getFullYear()-1);for(let e=0;e<365;e++){const o=new Date(i);o.setDate(o.getDate()+e);const a=o.toISOString().split("T")[0];s.set(a,0)}n.forEach(e=>{const a=new Date(e.created_at).toISOString().split("T")[0],l=["pushed","opened","closed","merged","commented","created","updated","approved"];if(e.action_name&&l.some(t=>e.action_name.toLowerCase().includes(t.toLowerCase()))){const t=s.get(a)||0;s.set(a,t+1)}});const d=[],c=Array.from(s.values()).reduce((e,o)=>e+o,0);return s.forEach((e,o)=>{d.push({date:o,count:e,level:I(e,s)})}),{contributions:d.sort((e,o)=>new Date(e.date)-new Date(o.date)),total:{lastYear:c}}},I=(n,s)=>{if(n===0)return 0;const i=Array.from(s.values()).filter(e=>e>0);if(i.length===0)return 0;const c=Math.max(...i)/4;return n<=c?1:n<=c*2?2:n<=c*3?3:4},y=(n,s)=>{const i=n.contributions,d=n.total.lastYear,c=()=>{const a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],l=new Date,t=new Date(l);t.setFullYear(t.getFullYear()-1),t.setDate(t.getDate()+1);const p=new Date(t);p.setDate(t.getDate()-t.getDay());const w=[];let v=-1;for(let b=0;b<53;b++){const u=new Date(p);if(u.setDate(p.getDate()+b*7),u<=l){const r=u.getMonth();if(r!==v){v=r;const D=a[r],$=b+2;w.push(`<span class="month-label" style="grid-column: ${$}">${D}</span>`)}}}return w.join("")},e=()=>["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((l,t)=>t%2===1?`<span class="week-label">${l}</span>`:'<span class="week-label"></span>').join(""),o=`
      <div class="gitlab-calendar-custom">
        <div class="gitlab-calendar-header">
          <span>${d} contributions in the last year</span>
        </div>
        <div class="gitlab-calendar-wrapper">
          <div class="gitlab-calendar-months">
            ${c()}
          </div>
          <div class="gitlab-calendar-content">
            <div class="gitlab-calendar-weeks">
              ${e()}
            </div>
            <div class="gitlab-calendar-grid">
              ${i.map(a=>{const l=new Date(a.date).toLocaleDateString("en-US"),t=a.count===0?"No contributions":a.count===1?"1 contribution":`${a.count} contributions`;return`
                  <div
                    class="gitlab-day level-${a.level}"
                    title="${t} on ${l}"
                    data-count="${a.count}"
                    data-date="${a.date}"
                  ></div>
                `}).join("")}
            </div>
          </div>
        </div>
        <div class="gitlab-calendar-legend">
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
    `;s.innerHTML=o},k=n=>{const s=`
      <div class="gitlab-calendar-custom">
        <div class="gitlab-calendar-header">
          <span>GitLab data unavailable (local deployment)</span>
        </div>
        <div class="gitlab-unavailable-message">
          <p>🔒 School GitLab requires campus network access</p>
        </div>
      </div>
    `;n.innerHTML=s};return G("div",{ref:g,className:"gitlab-calendar-container"})};export{O as default};
