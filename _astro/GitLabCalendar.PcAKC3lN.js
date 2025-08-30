import{A as M,y as _}from"./hooks.module.D6on2bVO.js";import{u as E}from"./jsxRuntime.module.C6ou3Z_F.js";import"./preact.module.DE--1VBR.js";const N=({username:f="Chen",gitlabUrl:$="https://git.henau.edu.cn",accessToken:D=""})=>{console.log("Environment variables:",{GITLAB_ACCESS_TOKEN:"NOT SET",GITLAB_URL:"https://git.henau.edu.cn",GITLAB_USERNAME:"Chen"});const g=M(null),T=async()=>{const o=`gitlab_data_${f}`,s=`gitlab_data_time_${f}`;try{console.log("Fetching fresh GitLab data..."),localStorage.removeItem(o),localStorage.removeItem(s);const l={Accept:"application/json","Content-Type":"application/json"};D?(l["PRIVATE-TOKEN"]=D,console.log("Using Personal Access Token for GitLab API")):console.log("No access token provided, trying public API");const r={headers:l,mode:"cors",credentials:"omit"};console.log("Fetching GitLab user info...");const i=`${$}/api/v4/users?username=${f}`,e=await fetch(i,r);if(!e.ok)throw new Error(`Failed to fetch user info: ${e.status} ${e.statusText}`);const n=await e.json();if(!n||n.length===0)throw new Error("User not found");const a=n[0].id;console.log(`Found GitLab user ID: ${a}`),console.log("Fetching GitLab events...");const d=`${$}/api/v4/users/${a}/events`,t=new Date;t.setFullYear(t.getFullYear()-1);const b=Date.now(),w=Math.random().toString(36).substring(7);let u=[],c=1;const p=100;for(;c<=10;){const L=`${d}?after=${t.toISOString()}&per_page=${p}&page=${c}&_t=${b}&_r=${w}&_cache_bust=${Date.now()}`;console.log(`Fetching fresh page ${c}...`);const h=await fetch(L,r);if(!h.ok){if(c===1)throw new Error(`Failed to fetch events: ${h.status} ${h.statusText}`);console.log(`Page ${c} failed, stopping pagination`);break}const m=await h.json();if(!m||m.length===0){console.log(`Page ${c} returned no events, stopping pagination`);break}if(u=u.concat(m),console.log(`Page ${c}: ${m.length} events`),c++,m.length<p){console.log("Reached last page");break}await new Promise(I=>setTimeout(I,100))}console.log(`Total events fetched: ${u.length}`);const v=A(u);localStorage.setItem(o,JSON.stringify(v)),localStorage.setItem(s,Date.now().toString()),console.log("GitLab data cached successfully"),g.current&&S(v,g.current)}catch(l){console.error("GitLab API access failed:",l.message);const r=localStorage.getItem(o);if(r&&g.current){console.log("Using cached GitLab data as fallback");const i=JSON.parse(r);S(i,g.current)}else g.current&&C(g.current)}};_(()=>{T()},[f,$,D]);const A=o=>{const s=new Map,l=new Date;l.setFullYear(l.getFullYear()-1);for(let e=0;e<365;e++){const n=new Date(l);n.setDate(n.getDate()+e);const a=n.toISOString().split("T")[0];s.set(a,0)}o.forEach(e=>{const a=new Date(e.created_at).toISOString().split("T")[0],d=["pushed","opened","closed","merged","commented","created","updated","approved"];if(e.action_name&&d.some(t=>e.action_name.toLowerCase().includes(t.toLowerCase()))){const t=s.get(a)||0;s.set(a,t+1)}});const r=[],i=Array.from(s.values()).reduce((e,n)=>e+n,0);return s.forEach((e,n)=>{r.push({date:n,count:e,level:y(e,s)})}),{contributions:r.sort((e,n)=>new Date(e.date)-new Date(n.date)),total:{lastYear:i}}},y=(o,s)=>{if(o===0)return 0;const l=Array.from(s.values()).filter(e=>e>0);if(l.length===0)return 0;const i=Math.max(...l)/4;return o<=i?1:o<=i*2?2:o<=i*3?3:4},S=(o,s)=>{const l=o.contributions,r=o.total.lastYear,i=()=>{const a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],d=new Date,t=new Date(d);t.setFullYear(t.getFullYear()-1),t.setDate(t.getDate()+1);const b=new Date(t);b.setDate(t.getDate()-t.getDay());const w=[];let u=-1;for(let c=0;c<53;c++){const p=new Date(b);if(p.setDate(b.getDate()+c*7),p<=d){const v=p.getMonth();if(v!==u){u=v;const L=a[v],h=c+2;w.push(`<span class="month-label" style="grid-column: ${h}">${L}</span>`)}}}return w.join("")},e=()=>["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,t)=>t%2===1?`<span class="week-label">${d}</span>`:'<span class="week-label"></span>').join(""),n=`
      <div class="gitlab-calendar-custom">
        <div class="gitlab-calendar-header">
          <span>${r} contributions in the last year</span>
        </div>
        <div class="gitlab-calendar-wrapper">
          <div class="gitlab-calendar-months">
            ${i()}
          </div>
          <div class="gitlab-calendar-content">
            <div class="gitlab-calendar-weeks">
              ${e()}
            </div>
            <div class="gitlab-calendar-grid">
              ${l.map(a=>{const d=new Date(a.date).toLocaleDateString("en-US"),t=a.count===0?"No contributions":a.count===1?"1 contribution":`${a.count} contributions`;return`
                  <div
                    class="gitlab-day level-${a.level}"
                    title="${t} on ${d}"
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
    `;s.innerHTML=n},C=o=>{const s=`
      <div class="gitlab-calendar-custom">
        <div class="gitlab-calendar-header">
          <span>GitLab data unavailable (local deployment)</span>
        </div>
        <div class="gitlab-unavailable-message">
          <p>🔒 School GitLab requires campus network access</p>
        </div>
      </div>
    `;o.innerHTML=s};return E("div",{ref:g,className:"gitlab-calendar-container"})};export{N as default};
