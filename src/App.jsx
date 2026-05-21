import { useState, useEffect, useRef } from "react";

/* ── Theme Tokens ───────────────────────────────────────────── */
const DARK = {
  bg:"#020810", bgAlt:"#071525", bgCard:"#081830",
  border:"#0E2540", borderHi:"#1A3D60",
  text:"#C8DCFF", textDim:"#1E3550", textMid:"#4A7090",
  violet:"#8B7CF8", green:"#2DD4BF", blue:"#38BDF8", gold:"#F0B040",
  navBg:"rgba(2,8,16,0.90)",
};
const LIGHT = {
  bg:"#EDF2FF", bgAlt:"#F4F7FF", bgCard:"#FFFFFF",
  border:"#CBD5FE", borderHi:"#93A8F0",
  text:"#0D1440", textDim:"#BCC8EC", textMid:"#6070A0",
  violet:"#4F46E5", green:"#0B9E85", blue:"#0369A1", gold:"#B45309",
  navBg:"rgba(237,242,255,0.92)",
};

/* ── Global CSS ─────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{overflow-x:hidden}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:#020810}
::-webkit-scrollbar-thumb{background:#8B7CF8;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(38px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.75)}}
@keyframes orbit{from{transform:rotate(0deg) translateX(54px) rotate(0deg)}to{transform:rotate(360deg) translateX(54px) rotate(-360deg)}}
@keyframes orbit2{from{transform:rotate(200deg) translateX(76px) rotate(-200deg)}to{transform:rotate(560deg) translateX(76px) rotate(-560deg)}}
@keyframes orbit3{from{transform:rotate(90deg) translateX(98px) rotate(-90deg)}to{transform:rotate(450deg) translateX(98px) rotate(-450deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes scan{0%{top:-4px}100%{top:102%}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 14px #8B7CF840}50%{box-shadow:0 0 32px #8B7CF870,0 0 70px #8B7CF820}}
@keyframes glowPulseG{0%,100%{box-shadow:0 0 14px #2DD4BF30}50%{box-shadow:0 0 28px #2DD4BF55}}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)}
.reveal.vis{opacity:1;transform:translateY(0)}
.reveal-l{opacity:0;transform:translateX(-28px);transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)}
.reveal-l.vis{opacity:1;transform:translateX(0)}
.nav-btn{background:none;border:none;cursor:pointer;padding:0;font-family:'Exo 2',sans-serif;font-size:10.5px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;transition:color .25s;position:relative}
.nav-btn::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;transform:scaleX(0);transform-origin:left;transition:transform .3s}
.nav-btn:hover::after,.nav-btn.active::after{transform:scaleX(1)}
.pcard{transition:transform .35s,border-color .35s}
.pcard:hover{transform:translateY(-5px)}
.chip{transition:all .22s;cursor:default}
@media(max-width:900px){
  .two-col{grid-template-columns:1fr!important}
  .three-col{grid-template-columns:1fr!important}
  .hm{display:none!important}
  .hn{font-size:46px!important}
  .sp{padding:80px 22px!important}
}
`;

/* ── Animated Starfield Canvas ───────────────────────────────── */
function SpaceCanvas({ isDark }) {
  const cvRef  = useRef(null);
  const rafRef = useRef(null);
  const dkRef  = useRef(isDark);
  useEffect(() => { dkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const cv = cvRef.current;
    const ctx = cv.getContext("2d");
    let stars=[], particles=[], conLines=[], shooting=null, nextShoot=280, t=0;

    function buildScene() {
      cv.width = window.innerWidth; cv.height = window.innerHeight;
      stars = Array.from({length:280}, ()=>({
        x:Math.random()*cv.width, y:Math.random()*cv.height,
        r:Math.random()*1.6+0.2,
        base:Math.random()*.8+.15,
        tw:Math.random()*.028+.005,
        ph:Math.random()*Math.PI*2,
      }));
      // constellation subset
      const sub = stars.filter(()=>Math.random()<.11);
      conLines=[];
      sub.forEach((a,i)=>sub.forEach((b,j)=>{
        if(j<=i) return;
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<125&&d>22) conLines.push({x1:a.x,y1:a.y,x2:b.x,y2:b.y,op:.025+Math.random()*.055});
      }));
      conLines.splice(28);
      const chars=["0","1","01","10","</>","{}","::","fn","if","=>","0x","AI","##","//"];
      particles = Array.from({length:44}, ()=>({
        x:Math.random()*cv.width, y:Math.random()*cv.height,
        char:chars[Math.floor(Math.random()*chars.length)],
        spd:Math.random()*.28+.07,
        op:Math.random()*.12+.03,
        sz:Math.floor(Math.random()*5)+9,
      }));
    }
    buildScene();
    window.addEventListener("resize", buildScene);

    function draw() {
      t++;
      const dk = dkRef.current;
      ctx.clearRect(0,0,cv.width,cv.height);

      // Blueprint grid (light mode)
      if(!dk){
        ctx.strokeStyle="rgba(79,70,229,0.045)"; ctx.lineWidth=.5;
        const g=52;
        for(let x=0;x<cv.width;x+=g){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,cv.height);ctx.stroke();}
        for(let y=0;y<cv.height;y+=g){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(cv.width,y);ctx.stroke();}
      }

      // Constellation lines
      if(dk) conLines.forEach(l=>{
        ctx.beginPath(); ctx.moveTo(l.x1,l.y1); ctx.lineTo(l.x2,l.y2);
        ctx.strokeStyle=`rgba(139,124,248,${l.op})`; ctx.lineWidth=.6; ctx.stroke();
      });

      // Stars
      stars.forEach(s=>{
        const op=s.base*(.3+.7*Math.sin(t*s.tw+s.ph));
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle=dk?`rgba(185,210,255,${op})`:`rgba(79,70,229,${op*.28})`;
        ctx.fill();
        if(dk&&s.r>1.2){
          ctx.strokeStyle=`rgba(200,220,255,${op*.3})`; ctx.lineWidth=.45;
          const cr=s.r*3.8;
          ctx.beginPath();
          ctx.moveTo(s.x-cr,s.y);ctx.lineTo(s.x+cr,s.y);
          ctx.moveTo(s.x,s.y-cr);ctx.lineTo(s.x,s.y+cr);
          ctx.stroke();
        }
      });

      // Code particles
      particles.forEach(p=>{
        p.y-=p.spd; if(p.y<-18){p.y=cv.height+10;p.x=Math.random()*cv.width;}
        ctx.fillStyle=dk?`rgba(45,212,191,${p.op})`:`rgba(11,158,133,${p.op*.5})`;
        ctx.font=`${p.sz}px 'Space Mono',monospace`;
        ctx.fillText(p.char,p.x,p.y);
      });

      // Shooting star (dark only)
      if(dk){
        if(t>=nextShoot){
          shooting={x:Math.random()*cv.width*.65,y:Math.random()*cv.height*.32,
            vx:10+Math.random()*8,vy:3.5+Math.random()*5,life:52,max:52};
          nextShoot=t+320+Math.floor(Math.random()*480);
        }
        if(shooting){
          const prog=1-shooting.life/shooting.max;
          const alpha=Math.sin(prog*Math.PI)*.9;
          const tail=55+prog*95;
          const gr=ctx.createLinearGradient(
            shooting.x-shooting.vx*tail/10,shooting.y-shooting.vy*tail/10,
            shooting.x,shooting.y);
          gr.addColorStop(0,"rgba(255,255,255,0)");
          gr.addColorStop(1,`rgba(210,228,255,${alpha})`);
          ctx.beginPath();
          ctx.moveTo(shooting.x-shooting.vx*tail/10,shooting.y-shooting.vy*tail/10);
          ctx.lineTo(shooting.x,shooting.y);
          ctx.strokeStyle=gr; ctx.lineWidth=1.6; ctx.stroke();
          shooting.x+=shooting.vx; shooting.y+=shooting.vy; shooting.life--;
          if(shooting.life<=0) shooting=null;
        }
      }

      rafRef.current=requestAnimationFrame(draw);
    }
    draw();
    return ()=>{ cancelAnimationFrame(rafRef.current); window.removeEventListener("resize",buildScene); };
  },[]);

  return <canvas ref={cvRef} style={{position:"fixed",inset:0,zIndex:0,width:"100%",height:"100%",pointerEvents:"none"}} />;
}

/* ── Typewriter hook ─────────────────────────────────────────── */
function useTyper(words,spd=82){
  const [txt,setTxt]=useState(""); const [wi,setWi]=useState(0);
  const [ci,setCi]=useState(0);    const [del,setDel]=useState(false);
  useEffect(()=>{
    const w=words[wi%words.length];
    const id=setTimeout(()=>{
      if(!del){
        if(ci<w.length){setTxt(w.slice(0,ci+1));setCi(c=>c+1);}
        else setTimeout(()=>setDel(true),1900);
      } else {
        if(ci>0){setTxt(w.slice(0,ci-1));setCi(c=>c-1);}
        else{setDel(false);setWi(i=>i+1);}
      }
    },del?spd/2:spd);
    return ()=>clearTimeout(id);
  },[ci,del,wi,words,spd]);
  return txt;
}

/* ── Data ────────────────────────────────────────────────────── */
const SKILLS=[
  {cat:"QA Engineering",icon:"⬡",items:[
    {n:"Test Planning & Design",p:90},{n:"UAT Documentation",p:88},
    {n:"API Testing (Postman)",p:83},{n:"Jira / Agile Workflows",p:85}]},
  {cat:"Data & Analytics",icon:"◈",items:[
    {n:"Python — Data Analysis",p:75},{n:"Power BI",p:80},
    {n:"Data Visualisation",p:78},{n:"SQL Fundamentals",p:68}]},
  {cat:"Dev & Docs",icon:"✦",items:[
    {n:"Git / GitHub",p:83},{n:"React / JavaScript",p:72},
    {n:"Technical Writing",p:93},{n:"Research & Analysis",p:89}]},
];
const PROJECTS=[
  {type:"Masters Research",title:"GenAI Technical Readiness Framework",
   desc:"Developing a diagnostic framework to assess generative AI technical readiness among South African IT SMEs — grounded in TOE Framework & UTAUT.",
   tags:["GenAI","TOE Framework","UTAUT","Quantitative"],active:true},
  {type:"QA Project",title:"Power BI UAT Documentation",
   desc:"Full UAT sign-off suite for the CountryDataSpace dashboard: test plans, validation checklists, and structured acceptance criteria.",
   tags:["Power BI","UAT","QA Artefacts"],active:false},
  {type:"Data Analytics",title:"Goodnature IoT Analysis",
   desc:"Eight-module analysis of Chirp trap IoT data: event-pattern analysis, data preparation, and Python visualisations for conservation insights.",
   tags:["Python","IoT","Matplotlib"],active:false},
  {type:"Technical Writing",title:"Postman & GitHub Training Guides",
   desc:"Beginner-friendly onboarding guides for Postman API testing and Gitflow workflows — designed for QA team knowledge transfer.",
   tags:["Postman","Git","Documentation"],active:false},
];
const TECH=["Python","Power BI","Postman","Jira","Git","GitHub","React","JavaScript","HTML/CSS","VS Code","Excel","SQL"];
const NAV=["About","Skills","Projects","Research","Contact"];

/* ── Component ───────────────────────────────────────────────── */
export default function Portfolio(){
  const [isDark,setDark]=useState(true);
  const [scrolled,setScrolled]=useState(false);
  const [activeNav,setActiveNav]=useState("");
  const [skillsFired,setSkFired]=useState(false);
  const skillRef=useRef(null);
  const T=isDark?DARK:LIGHT;
  const typed=useTyper(["Software Developer","IT Technician","Masters Research Student"]);

  useEffect(()=>{
    const el=document.createElement("style");
    el.id="tc-css"; el.textContent=CSS;
    document.head.appendChild(el);
    return()=>document.getElementById("tc-css")?.remove();
  },[]);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>70);
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("vis");}),{threshold:.1});
    document.querySelectorAll(".reveal,.reveal-l").forEach(el=>io.observe(el));
    return()=>io.disconnect();
  });

  useEffect(()=>{
    if(!skillRef.current) return;
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)setSkFired(true);},{threshold:.2});
    io.observe(skillRef.current); return()=>io.disconnect();
  },[]);

  useEffect(()=>{
    const secs=NAV.map(n=>document.getElementById(n.toLowerCase())).filter(Boolean);
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActiveNav(e.target.id);}),{threshold:.35});
    secs.forEach(s=>io.observe(s)); return()=>io.disconnect();
  },[]);

  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const mono={fontFamily:"'Space Mono',monospace"};
  const orb={fontFamily:"'Orbitron',sans-serif"};

  const SLabel=({text})=>(
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
      <span style={{color:T.violet,fontSize:14}}>⊹</span>
      <span style={{...mono,fontSize:9,letterSpacing:3.5,textTransform:"uppercase",
        color:T.violet,fontWeight:700}}>{text}</span>
      <div style={{flex:1,height:1,
        background:`linear-gradient(to right,${T.violet}50,transparent)`,maxWidth:100}} />
    </div>
  );

  const H2=({children,style={}})=>(
    <h2 style={{...orb,fontSize:"clamp(26px,3.8vw,40px)",fontWeight:700,
      lineHeight:1.15,color:T.text,...style}}>{children}</h2>
  );

  const trans="background .4s,color .4s,border-color .4s";

  return(
    <div style={{background:T.bg,color:T.text,fontFamily:"'Exo 2',sans-serif",
      transition:"background .45s,color .45s",minHeight:"100vh",overflowX:"hidden"}}>

      <SpaceCanvas isDark={isDark}/>

      {/* Nebula blobs */}
      <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"0%",right:"-5%",width:540,height:540,
          borderRadius:"50%",
          background:isDark?"radial-gradient(ellipse,rgba(139,124,248,0.07) 0%,transparent 62%)":"radial-gradient(ellipse,rgba(79,70,229,0.05) 0%,transparent 62%)"}}/>
        <div style={{position:"absolute",bottom:"5%",left:"-6%",width:420,height:420,
          borderRadius:"50%",
          background:isDark?"radial-gradient(ellipse,rgba(45,212,191,0.055) 0%,transparent 62%)":"radial-gradient(ellipse,rgba(11,158,133,0.035) 0%,transparent 62%)"}}/>
        <div style={{position:"absolute",top:"42%",left:"35%",width:320,height:320,
          borderRadius:"50%",
          background:isDark?"radial-gradient(ellipse,rgba(56,189,248,0.035) 0%,transparent 62%)":"transparent"}}/>
      </div>

      {/* Circuit board overlay */}
      <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg stroke='${encodeURIComponent(isDark?"#8B7CF8":"#4F46E5")}' stroke-width='.35' fill='none' opacity='.07'%3E%3Cpath d='M0 20h20v20h40v-20h20M20 0v20M60 80v-20M0 60h15M80 40h-20v20'/%3E%3C/g%3E%3Ccircle cx='20' cy='20' r='2' fill='${encodeURIComponent(isDark?"#8B7CF8":"#4F46E5")}' opacity='.1'/%3E%3Ccircle cx='60' cy='60' r='2' fill='${encodeURIComponent(isDark?"#2DD4BF":"#0B9E85")}' opacity='.1'/%3E%3C/svg%3E")`}}/>

      {/* ═══ NAV ════════════════════════════════════════════ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px 52px",
        background:scrolled?T.navBg:"transparent",
        backdropFilter:scrolled?"blur(22px)":"none",
        borderBottom:scrolled?`1px solid ${T.border}`:"1px solid transparent",
        transition:trans}}>
        <div onClick={()=>go("hero")} style={{cursor:"pointer",display:"flex",
          alignItems:"center",gap:10}}>
          <span style={{...orb,fontSize:18,fontWeight:900,color:T.violet}}>TC</span>
          <span style={{...mono,fontSize:8,color:T.green,letterSpacing:2,marginTop:2}}>[SYS:ON]</span>
        </div>
        <div className="hm" style={{display:"flex",gap:34}}>
          {NAV.map(n=>(
            <button key={n} className={`nav-btn${activeNav===n.toLowerCase()?" active":""}`}
              style={{color:activeNav===n.toLowerCase()?T.violet:T.textMid}}
              onClick={()=>go(n.toLowerCase())}>{n}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {/* Theme toggle */}
          <button onClick={()=>setDark(d=>!d)} style={{
            background:"none",border:`1px solid ${T.border}`,cursor:"pointer",
            padding:"7px 13px",display:"flex",alignItems:"center",gap:7,
            transition:trans,color:T.textMid,
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.violet;e.currentTarget.style.color=T.violet;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMid;}}>
            <span style={{fontSize:13}}>{isDark?"☀":"🌙"}</span>
            <span style={{...mono,fontSize:8,letterSpacing:1.5}}>{isDark?"LIGHT":"DARK"}</span>
          </button>
          <button onClick={()=>go("contact")}
            style={{background:T.violet,color:"#fff",border:"none",cursor:"pointer",
              padding:"9px 22px",...orb,fontSize:9.5,fontWeight:700,letterSpacing:2,
              clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
              transition:"all .3s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            HIRE ME
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section id="hero" style={{minHeight:"100vh",position:"relative",zIndex:2,
        display:"flex",alignItems:"center",padding:"140px 52px 100px",overflow:"hidden"}}>

        {/* Scan line */}
        {isDark&&<div style={{position:"absolute",left:0,right:0,height:2,zIndex:0,
          background:`linear-gradient(to right,transparent,${T.violet}12,transparent)`,
          animation:"scan 10s linear infinite",pointerEvents:"none"}}/>}

        {/* HUD readouts */}
        <div className="hm" style={{position:"absolute",top:108,left:40,
          opacity:isDark?.45:.18,zIndex:3}}>
          {["COORD: 26.19°S, 27.50°E","ALT: 1753m MSL","LOCAL: UTC+2","STATUS: NOMINAL"].map(l=>(
            <div key={l} style={{...mono,fontSize:8.5,color:T.green,
              letterSpacing:1.2,lineHeight:1.9}}>{l}</div>
          ))}
        </div>
        <div className="hm" style={{position:"absolute",top:108,right:52,
          textAlign:"right",opacity:isDark?.45:.18,zIndex:3}}>
          {["SYS: ACTIVE","MEM: 87%","CPU: 42%","VER: 2025.12"].map(l=>(
            <div key={l} style={{...mono,fontSize:8.5,color:T.blue,
              letterSpacing:1.2,lineHeight:1.9}}>{l}</div>
          ))}
        </div>

        {/* Orbital avatar (right side) */}
        <div className="hm" style={{position:"absolute",right:"7%",top:"50%",
          transform:"translateY(-52%)",width:260,height:260,zIndex:3}}>
          {/* Rings */}
          <div style={{position:"absolute",inset:0,borderRadius:"50%",
            border:`1px solid ${T.violet}30`}}/>
          <div style={{position:"absolute",inset:"-32px",borderRadius:"50%",
            border:`1px dashed ${T.green}22`}}/>
          <div style={{position:"absolute",inset:"-60px",borderRadius:"50%",
            border:`1px solid ${T.blue}16`}}/>
          {/* Corner tick marks */}
          {[0,90,180,270].map(a=>(
            <div key={a} style={{position:"absolute",top:"50%",left:"50%",
              width:8,height:1.5,background:T.violet,opacity:.3,
              transform:`rotate(${a}deg) translateX(${128}px)`}}/>
          ))}
          {/* Orbiting dots */}
          <div style={{position:"absolute",inset:0,display:"flex",
            alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"absolute",top:"50%",left:"50%",
              width:9,height:9,marginTop:-4.5,marginLeft:-4.5,
              borderRadius:"50%",background:T.violet,
              boxShadow:`0 0 10px ${T.violet}CC`,
              animation:"orbit 9s linear infinite"}}/>
            <div style={{position:"absolute",top:"50%",left:"50%",
              width:6,height:6,marginTop:-3,marginLeft:-3,
              borderRadius:"50%",background:T.green,
              boxShadow:`0 0 8px ${T.green}CC`,
              animation:"orbit2 15s linear infinite"}}/>
            <div style={{position:"absolute",top:"50%",left:"50%",
              width:4,height:4,marginTop:-2,marginLeft:-2,
              borderRadius:"50%",background:T.gold,opacity:.7,
              boxShadow:`0 0 6px ${T.gold}`,
              animation:"orbit3 22s linear infinite"}}/>
          </div>
          {/* Avatar */}
          <div style={{position:"absolute",inset:0,display:"flex",
            alignItems:"center",justifyContent:"center"}}>
            <div style={{width:100,height:100,borderRadius:"50%",
              border:`1.5px solid ${T.violet}60`,
              background:`conic-gradient(from 0deg,${T.violet}22,${T.green}18,${T.blue}14,${T.violet}22)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              ...orb,fontSize:26,fontWeight:900,color:T.text,
              animation:isDark?"glowPulse 4s ease-in-out infinite":"glowPulseG 5s ease-in-out infinite"}}>TC</div>
          </div>
        </div>

        {/* Text */}
        <div style={{position:"relative",zIndex:2,maxWidth:800}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28,
            animation:"fadeIn .8s ease .1s both"}}>
            <span style={{...mono,fontSize:9.5,color:T.green,letterSpacing:2.5}}>
              $ init --user tinashe.chanakira
            </span>
            <div style={{width:8,height:14,background:T.green,
              animation:"blink 1.1s step-end infinite"}}/>
          </div>

          <h1 className="hn" style={{...orb,fontSize:"clamp(46px,8vw,92px)",
            fontWeight:900,lineHeight:.98,letterSpacing:-1,marginBottom:4,
            animation:"fadeUp 1s cubic-bezier(.16,1,.3,1) .2s both"}}>
            TINASHE
          </h1>
          <h1 style={{...orb,fontSize:"clamp(46px,8vw,92px)",fontWeight:900,
            lineHeight:.98,letterSpacing:-1,marginBottom:26,color:T.violet,
            textShadow:isDark?`0 0 48px ${T.violet}55`:"none",
            animation:"fadeUp 1s cubic-bezier(.16,1,.3,1) .32s both"}}>
            CHANAKIRA
          </h1>

          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:26,
            animation:"fadeUp .9s ease .48s both"}}>
            <span style={{color:T.green,fontSize:14}}>›</span>
            <span style={{...mono,fontSize:12.5,color:T.textMid,letterSpacing:.8}}>
              {typed}
            </span>
            <div style={{width:7,height:15,background:T.green,
              animation:"blink 1.1s step-end infinite",flexShrink:0}}/>
          </div>

          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:32,
            animation:"fadeUp .9s ease .56s both"}}>
            {["🎓 UNISA MIT","🏢 Currently employed at Moyo"].map(tag=>(
              <span key={tag} style={{padding:"5px 14px",border:`1px solid ${T.border}`,
                ...mono,fontSize:9.5,color:T.textMid,letterSpacing:.6,
                transition:trans}}>{tag}</span>
            ))}
          </div>

          <p style={{color:T.textMid,fontSize:14.5,lineHeight:1.88,maxWidth:490,
            marginBottom:42,animation:"fadeUp .9s ease .64s both"}}>
            IT professional at the intersection of{" "}
            <span style={{color:T.violet}}>software engineering</span> and
            academic research into{" "}
            <span style={{color:T.green}}>generative AI adoption</span> frameworks
            for South African SMEs.
          </p>

          <div style={{display:"flex",gap:12,flexWrap:"wrap",
            animation:"fadeUp .9s ease .74s both"}}>
            <button onClick={()=>go("projects")} style={{
              background:T.violet,color:"#fff",border:"none",cursor:"pointer",
              padding:"13px 28px",...orb,fontSize:9,fontWeight:700,letterSpacing:2,
              clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
              transition:"all .3s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              VIEW PROJECTS ›
            </button>
            <button onClick={()=>go("contact")} style={{
              background:"transparent",color:T.textMid,
              border:`1px solid ${T.border}`,cursor:"pointer",
              padding:"13px 28px",...orb,fontSize:9,fontWeight:600,letterSpacing:2,
              clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
              transition:trans}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.violet;e.currentTarget.style.color=T.violet;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMid;}}>
              CONTACT ME
            </button>
          </div>
        </div>

        <div style={{position:"absolute",bottom:34,left:"50%",
          transform:"translateX(-50%)",display:"flex",
          flexDirection:"column",alignItems:"center",gap:8,
          animation:"fadeIn 1s ease 2.2s both"}}>
          <div style={{...mono,fontSize:8.5,color:T.textDim,letterSpacing:2.5}}>SCROLL</div>
          <div style={{width:1,height:44,
            background:`linear-gradient(to bottom,${T.violet}70,transparent)`}}/>
        </div>
      </section>

      {/* ═══ ABOUT ══════════════════════════════════════════ */}
      <section id="about" className="sp"
        style={{padding:"108px 52px",maxWidth:1280,margin:"0 auto",
          position:"relative",zIndex:2}}>
        <div className="two-col" style={{display:"grid",
          gridTemplateColumns:"1fr 1fr",gap:68,alignItems:"start"}}>
          <div>
            <div className="reveal-l">
              <SLabel text="About Me"/>
              <H2 style={{marginBottom:22}}>
                System <span style={{color:T.violet}}>Overview</span>
              </H2>
            </div>
            <div className="reveal" style={{transitionDelay:".1s"}}>
              <p style={{color:T.textMid,lineHeight:1.9,fontSize:14.5,marginBottom:17}}>
                I'm an IT professional with precision-driven expertise in quality assurance,
                data analytics, and technical documentation. Every artefact I produce is
                built for real-world readability — from a 42-case financial transaction
                test suite to a structured Masters research proposal.
              </p>
              <p style={{color:T.textMid,lineHeight:1.9,fontSize:14.5,marginBottom:32}}>
                Currently pursuing a Masters in IT at UNISA, researching how South African
                SMEs can practically assess their generative AI technical readiness.
                Fuelled by an equally deep curiosity about aviation, cosmology, and
                the fundamental architecture of reality.
              </p>
            </div>
            <div className="reveal" style={{transitionDelay:".16s",
              background:T.bgCard,border:`1px solid ${T.border}`,
              padding:"20px 20px",...mono,fontSize:12,lineHeight:2.1,
              transition:"border-color .3s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.violet}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <span style={{color:T.violet}}>const</span>{" "}
              <span style={{color:T.green}}>tinashe</span>{" "}
              <span style={{color:T.text}}>=</span>{" "}<span style={{color:T.text}}>{"{"}</span><br/>
              {[["University","UNISA"],
                ["Program","MIT (Masters in Information Technology)"],["Status","Currently Employed"]].map(([k,v])=>(
                <span key={k} style={{display:"block",paddingLeft:18}}>
                  <span style={{color:T.blue}}>{k}</span>
                  <span style={{color:T.text}}>: </span>
                  <span style={{color:T.gold}}>"{v}"</span><span style={{color:T.textMid}}>,</span>
                </span>
              ))}
              <span style={{color:T.text}}>{"}"}</span>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div className="reveal" style={{display:"grid",
              gridTemplateColumns:"1fr 1fr",gap:11}}>
              {[["42+","Test Cases","⬡",T.violet],["3+","Years in IT","◈",T.green],
                ["2027","Masters Target","⊹",T.gold],["5","Research Pillars","✦",T.blue]].map(([n,l,ic,c])=>(
                <div key={l} style={{background:T.bgCard,border:`1px solid ${T.border}`,
                  padding:"22px 16px",position:"relative",overflow:"hidden",
                  transition:"border-color .3s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=c}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <div style={{position:"absolute",top:10,right:12,fontSize:18,
                    color:c,opacity:.22}}>{ic}</div>
                  <div style={{...orb,fontSize:28,fontWeight:900,color:c,
                    lineHeight:1,marginBottom:5}}>{n}</div>
                  <div style={{...mono,fontSize:9.5,color:T.textMid,letterSpacing:1}}>{l}</div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{transitionDelay:".1s",
              background:T.bgCard,border:`1px solid ${T.border}`,padding:"22px 20px"}}>
              <div style={{...mono,fontSize:8.5,color:T.violet,
                letterSpacing:2,marginBottom:14}}>// INTERESTS.log</div>
              {["✈  Aviation — SACAA Pilot Licensing Pathway",
                "🔭 Cosmology & Astrophysics",
                "⚛  Theoretical Physics & Quantum Mechanics",
                "🌍 AI Adoption in Emerging Markets"].map((item,i,arr)=>(
                <div key={item} style={{fontSize:13,color:T.textMid,
                  padding:"8px 0",
                  borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none"}}>{item}</div>
              ))}
            </div>

            <div className="reveal" style={{transitionDelay:".18s",
              background:T.bgCard,border:`1px solid ${T.green}35`,
              padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:8,height:8,borderRadius:"50%",
                background:T.green,boxShadow:`0 0 10px ${T.green}`,
                animation:"pulse 2s infinite",flexShrink:0}}/>
              <div>
                <div style={{...mono,fontSize:9,color:T.green,
                  letterSpacing:1.5,marginBottom:2}}>STATUS: AVAILABLE</div>
                <div style={{fontSize:12,color:T.textMid}}>
                  Open to QA roles & research collaborations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═════════════════════════════════════════ */}
      <section id="skills" className="sp"
        style={{padding:"108px 52px",background:T.bgAlt,position:"relative",zIndex:2,
          borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div className="reveal" style={{marginBottom:48}}>
            <SLabel text="Skills & Expertise"/>
            <H2>Core <span style={{color:T.green}}>Capabilities</span></H2>
          </div>

          <div ref={skillRef} className="three-col"
            style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",
              gap:18,marginBottom:32}}>
            {SKILLS.map(({cat,icon,items},gi)=>(
              <div key={cat} className="reveal"
                style={{background:T.bgCard,border:`1px solid ${T.border}`,
                  padding:"26px 22px",transitionDelay:`${gi*.1}s`,
                  transition:"border-color .3s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.violet}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:22}}>
                  <span style={{color:T.violet,fontSize:14}}>{icon}</span>
                  <span style={{...mono,fontSize:8.5,letterSpacing:2.5,
                    textTransform:"uppercase",color:T.violet,fontWeight:700}}>{cat}</span>
                </div>
                {items.map(({n,p},ii)=>(
                  <div key={n} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:12.5,color:T.text}}>{n}</span>
                      <span style={{...mono,fontSize:9.5,color:T.green}}>{p}%</span>
                    </div>
                    <div style={{height:2.5,background:T.border,overflow:"hidden"}}>
                      <div style={{height:"100%",
                        background:`linear-gradient(to right,${T.violet},${T.green})`,
                        width:skillsFired?`${p}%`:"0%",
                        transition:`width 1.6s cubic-bezier(.25,.46,.45,.94) ${(gi*.14+ii*.06).toFixed(2)}s`}}/>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="reveal" style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {TECH.map(t=>(
              <span key={t} className="chip"
                style={{padding:"8px 15px",border:`1px solid ${T.border}`,
                  ...mono,fontSize:10.5,color:T.textMid,
                  background:T.bgCard,transition:trans}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.violet;
                  e.currentTarget.style.color=T.violet;
                  e.currentTarget.style.background=T.bg;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;
                  e.currentTarget.style.color=T.textMid;
                  e.currentTarget.style.background=T.bgCard;}}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS ═══════════════════════════════════════ */}
      <section id="projects" className="sp"
        style={{padding:"108px 52px",position:"relative",zIndex:2}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div className="reveal" style={{marginBottom:48}}>
            <SLabel text="Projects"/>
            <H2>Mission <span style={{color:T.violet}}>Log</span></H2>
          </div>

          <div className="two-col" style={{display:"grid",
            gridTemplateColumns:"1fr 1fr",gap:16}}>
            {PROJECTS.map((p,i)=>(
              <div key={p.title} className="pcard reveal"
                style={{background:T.bgCard,border:`1px solid ${T.border}`,
                  transitionDelay:`${i*.08}s`,overflow:"hidden",
                  transition:"transform .35s,border-color .3s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.violet}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                {/* Terminal title bar */}
                <div style={{display:"flex",alignItems:"center",gap:6,
                  padding:"9px 15px",background:T.bgAlt,
                  borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:"#FF5F57"}}/>
                  <div style={{width:9,height:9,borderRadius:"50%",background:"#FEBC2E"}}/>
                  <div style={{width:9,height:9,borderRadius:"50%",background:"#28C840"}}/>
                  <span style={{marginLeft:8,...mono,fontSize:8.5,color:T.textMid,letterSpacing:.8}}>
                    ~/{p.type.toLowerCase().replace(/ /g,"_")}.sh
                  </span>
                  <div style={{marginLeft:"auto",display:"flex",
                    alignItems:"center",gap:5}}>
                    <div style={{width:6,height:6,borderRadius:"50%",
                      background:p.active?T.green:T.textDim,
                      animation:p.active?"pulse 2s infinite":"none"}}/>
                    <span style={{...mono,fontSize:7.5,
                      color:p.active?T.green:T.textDim,letterSpacing:1}}>
                      {p.active?"ACTIVE":"DONE"}
                    </span>
                  </div>
                </div>
                <div style={{padding:"20px 18px"}}>
                  <div style={{...mono,fontSize:8.5,color:T.violet,
                    letterSpacing:2.5,marginBottom:9,
                    textTransform:"uppercase"}}>{p.type}</div>
                  <h3 style={{...orb,fontSize:14.5,fontWeight:700,
                    lineHeight:1.35,marginBottom:11,color:T.text}}>{p.title}</h3>
                  <p style={{color:T.textMid,fontSize:13,lineHeight:1.75,
                    marginBottom:16}}>{p.desc}</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {p.tags.map(t=>(
                      <span key={t} style={{padding:"4px 10px",
                        background:`${T.violet}12`,
                        border:`1px solid ${T.violet}28`,
                        ...mono,fontSize:8.5,color:T.violet}}>#{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH ═══════════════════════════════════════ */}
      <section id="research" className="sp"
        style={{padding:"108px 52px",background:T.bgAlt,position:"relative",zIndex:2,
          borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div className="reveal" style={{marginBottom:48}}>
            <SLabel text="Research & Education"/>
            <H2>Academic <span style={{color:T.gold}}>Trajectory</span></H2>
          </div>

          <div className="two-col" style={{display:"grid",
            gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div className="reveal" style={{background:T.bgCard,
              border:`1px solid ${T.gold}35`,padding:"30px 26px"}}>
              <div style={{display:"flex",justifyContent:"space-between",
                alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{...mono,fontSize:8.5,color:T.gold,
                    letterSpacing:2,marginBottom:10}}>ACTIVE QUALIFICATION</div>
                  <h3 style={{...orb,fontSize:18,fontWeight:700,
                    lineHeight:1.3,color:T.text}}>Masters in<br/>Information Technology</h3>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{...orb,fontSize:20,fontWeight:900,color:T.gold}}>UNISA</div>
                  <div style={{...mono,fontSize:8.5,color:T.textMid,marginTop:4}}>
                    2024 → 2027/28
                  </div>
                </div>
              </div>
              <div style={{borderTop:`1px solid ${T.border}`,paddingTop:18,marginBottom:18}}>
                <div style={{...mono,fontSize:8.5,color:T.textMid,
                  letterSpacing:1.5,marginBottom:9}}>// DISSERTATION_FOCUS</div>
                <p style={{fontSize:13.5,color:T.text,lineHeight:1.72}}>
                  Developing a diagnostic framework for assessing generative AI
                  technical readiness among South African IT SMEs.
                </p>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["TOE Framework","UTAUT","Quantitative","SA IT SMEs"].map(t=>(
                  <span key={t} style={{padding:"4px 11px",
                    background:`${T.gold}12`,border:`1px solid ${T.gold}30`,
                    ...mono,fontSize:8.5,color:T.gold}}>#{t}</span>
                ))}
              </div>
            </div>

            <div className="reveal" style={{display:"flex",flexDirection:"column",
              gap:14,transitionDelay:".1s"}}>
              <div style={{background:T.bgCard,border:`1px solid ${T.border}`,padding:"22px 20px"}}>
                <div style={{...mono,fontSize:8.5,color:T.green,
                  letterSpacing:2,marginBottom:14}}>// RESEARCH_CONFIG.json</div>
                {[["Methodology","Quantitative Descriptive"],
                  ["Instrument","Survey"],["Target","IT SME Employees, SA"],
                  ["Dimensions","5 Readiness Pillars"],["Proposal Due","30 June 2026"]].map(([k,v],i,arr)=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",
                    padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",
                    fontSize:12.5}}>
                    <span style={{...mono,fontSize:10,color:T.textMid}}>{k}</span>
                    <span style={{color:i===arr.length-1?T.gold:T.text,
                      fontWeight:500}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{background:T.bgCard,border:`1px solid ${T.border}`,padding:"22px 20px"}}>
                <div style={{...mono,fontSize:8.5,color:T.blue,
                  letterSpacing:2,marginBottom:13}}>// THEORETICAL_BASE</div>
                {["Technology-Organisation-Environment (TOE) Framework",
                  "Unified Theory of Acceptance & Use of Technology (UTAUT)",
                  "5 GenAI Technical Readiness Dimensions",
                  "South African SME Innovation Context"].map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:9,
                    marginBottom:10,alignItems:"flex-start"}}>
                    <span style={{...mono,fontSize:10,color:T.violet,
                      marginTop:1,flexShrink:0}}>→</span>
                    <span style={{color:T.textMid,fontSize:12.5,lineHeight:1.55}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ════════════════════════════════════════ */}
      <section id="contact" className="sp"
        style={{padding:"110px 52px 100px",position:"relative",zIndex:2}}>
        <div style={{maxWidth:680,margin:"0 auto",textAlign:"center"}}>
          <div className="reveal">
            <SLabel text="Contact"/>
            <H2 style={{marginBottom:14}}>
              Establish <span style={{color:T.violet}}>Connection</span>
            </H2>
            <p style={{color:T.textMid,fontSize:14.5,lineHeight:1.88,
              maxWidth:430,margin:"0 auto 40px"}}>
              Open to QA engineering roles, research collaborations, and
              discussions about AI adoption in the South African tech landscape.
            </p>

            <div style={{display:"flex",gap:11,justifyContent:"center",
              marginBottom:44,flexWrap:"wrap"}}>
              <a href="mailto:tinashe@chanakira.co.za"
                style={{textDecoration:"none",background:T.violet,color:"#fff",
                  border:"none",cursor:"pointer",padding:"13px 26px",
                  ...orb,fontSize:9,fontWeight:700,letterSpacing:2,
                  clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)"}}>
                ✉ SEND TRANSMISSION
              </a>
              <a href="https://linkedin.com/in/tinashe-chanakira"
                target="_blank" rel="noopener"
                style={{textDecoration:"none",background:"transparent",
                  border:`1px solid ${T.border}`,color:T.textMid,cursor:"pointer",
                  padding:"13px 26px",...orb,fontSize:9,fontWeight:600,letterSpacing:2,
                  clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
                  transition:trans}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.green;e.currentTarget.style.color=T.green;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMid;}}>
                ⟡ LINKEDIN
              </a>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",
              gap:1,background:T.border}}>
              {[["⊹ EMAIL","tinashe@chanakira.co.za"],
                ["◈ LOCATION","Benoni, Gauteng ZA"],
                ["✦ STATUS","Available"]].map(([l,v])=>(
                <div key={l} style={{background:T.bgCard,padding:"22px 14px"}}>
                  <div style={{...mono,fontSize:8.5,color:T.violet,
                    letterSpacing:2,marginBottom:7}}>{l}</div>
                  <div style={{fontSize:12,color:T.text}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═════════════════════════════════════════ */}
      <footer style={{padding:"20px 52px",borderTop:`1px solid ${T.border}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        flexWrap:"wrap",gap:12,position:"relative",zIndex:2,
        background:T.bgAlt,transition:"background .45s,border-color .45s"}}>
        <span style={{...orb,fontSize:15,fontWeight:900,color:T.violet}}>
          TC<span style={{color:T.green}}>.</span>
        </span>
        <span style={{...mono,fontSize:8.5,color:T.textDim,letterSpacing:1}}>
          © 2025 TINASHE CHANAKIRA · BENONI ZA · ALL SYSTEMS NOMINAL
        </span>
        <div style={{display:"flex",gap:22}}>
          {["GitHub","LinkedIn","UNISA"].map(s=>(
            <a key={s} href="#"
              style={{...mono,fontSize:8.5,letterSpacing:2,textTransform:"uppercase",
                color:T.textDim,textDecoration:"none",transition:"color .25s"}}
              onMouseEnter={e=>e.currentTarget.style.color=T.violet}
              onMouseLeave={e=>e.currentTarget.style.color=T.textDim}>{s}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}