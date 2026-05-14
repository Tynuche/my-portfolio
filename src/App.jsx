import { useState, useEffect, useRef } from "react";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,700&family=Syne:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  body { overflow-x: hidden; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #0A0A08; }
  ::-webkit-scrollbar-thumb { background: #C8963E; border-radius: 2px; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(50px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideRight {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.8); }
  }
  @keyframes bounceScroll {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(8px); }
  }
  @keyframes glowGold {
    0%, 100% { box-shadow: 0 0 0 0 #C8963E30; }
    50%       { box-shadow: 0 0 24px 4px #C8963E40; }
  }
  @keyframes lineExpand {
    from { width: 0; }
    to   { width: 60px; }
  }

  .reveal {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-left {
    opacity: 0;
    transform: translateX(-40px);
    transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-left.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .nav-link {
    background: none; border: none; cursor: pointer; padding: 0;
    color: #6B6B5F;
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 2.5px; text-transform: uppercase;
    transition: color 0.3s ease;
    position: relative;
  }
  .nav-link::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: #C8963E;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s ease;
  }
  .nav-link:hover { color: #C8963E; }
  .nav-link:hover::after { transform: scaleX(1); }
  .nav-link.active-nav { color: #C8963E; }

  .btn-primary {
    display: inline-block; text-decoration: none;
    background: #C8963E; color: #0A0A08;
    border: 1px solid #C8963E;
    padding: 14px 36px;
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase;
    cursor: pointer; transition: all 0.35s ease;
  }
  .btn-primary:hover {
    background: transparent; color: #C8963E;
  }
  .btn-outline {
    display: inline-block; text-decoration: none;
    background: transparent; color: #C8963E;
    border: 1px solid #C8963E40;
    padding: 14px 36px;
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 2.5px; text-transform: uppercase;
    cursor: pointer; transition: all 0.35s ease;
  }
  .btn-outline:hover {
    border-color: #C8963E;
    background: #C8963E12;
  }

  .project-card {
    background: #111110;
    border: 1px solid #1E1E1A;
    padding: 32px 28px;
    position: relative; overflow: hidden;
    transition: border-color 0.35s ease, transform 0.35s ease;
    cursor: default;
  }
  .project-card:hover {
    border-color: #C8963E60;
    transform: translateY(-5px);
  }
  .project-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #C8963E, transparent);
    opacity: 0; transition: opacity 0.35s ease;
  }
  .project-card:hover::before { opacity: 1; }

  .skill-fill {
    height: 100%;
    background: linear-gradient(90deg, #C8963E, #E8B56A);
    transition: width 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .tag-pill {
    padding: 5px 14px;
    background: #C8963E14;
    border: 1px solid #C8963E30;
    font-size: 11px; color: #C8963E;
    letter-spacing: 0.5px;
    font-family: 'Syne', sans-serif;
  }

  .tech-badge {
    padding: 8px 18px;
    border: 1px solid #1E1E1A;
    font-size: 11.5px; color: #6B6B5F;
    letter-spacing: 0.8px;
    font-family: 'Syne', sans-serif;
    cursor: default;
    transition: all 0.25s ease;
  }
  .tech-badge:hover {
    border-color: #C8963E;
    color: #C8963E;
    background: #C8963E0A;
  }

  .contact-link {
    text-decoration: none;
    color: #6B6B5F;
    font-family: 'Syne', sans-serif;
    font-size: 12px; letter-spacing: 1px;
    transition: color 0.25s ease;
  }
  .contact-link:hover { color: #C8963E; }

  .timeline-dot {
    position: absolute; left: -6px; top: 4px;
    width: 12px; height: 12px; border-radius: 50%;
    border: 1px solid #2A2A24;
    background: #0A0A08;
    transition: border-color 0.3s ease, background 0.3s ease;
  }
  .timeline-item:hover .timeline-dot {
    border-color: #C8963E;
    background: #C8963E20;
  }

  @media (max-width: 900px) {
    .two-col { grid-template-columns: 1fr !important; }
    .three-col { grid-template-columns: 1fr 1fr !important; }
    .hero-title { font-size: 52px !important; }
    .nav-links { display: none !important; }
    .section-pad { padding: 80px 28px !important; }
  }
`;

const C = {
  bg:         "#0A0A08",
  surface:    "#111110",
  surfaceAlt: "#161614",
  gold:       "#C8963E",
  goldSoft:   "#E8B56A",
  text:       "#F0EBE1",
  muted:      "#6B6B5F",
  dim:        "#1E1E1A",
  border:     "#1E1E1A",
};

const skillGroups = [
  {
    cat: "QA Engineering",
    icon: "✦",
    items: [
      { name: "Test Planning & Design",  pct: 90 },
      { name: "UAT Documentation",       pct: 88 },
      { name: "API Testing (Postman)",   pct: 83 },
      { name: "Jira / Agile Workflows",  pct: 85 },
    ],
  },
  {
    cat: "Data & Analytics",
    icon: "◈",
    items: [
      { name: "Python (Data Analysis)",  pct: 75 },
      { name: "Power BI",                pct: 80 },
      { name: "Data Visualisation",      pct: 78 },
      { name: "SQL Fundamentals",        pct: 68 },
    ],
  },
  {
    cat: "Dev & Documentation",
    icon: "⬡",
    items: [
      { name: "Git / GitHub / Gitflow",  pct: 83 },
      { name: "React / JavaScript",      pct: 72 },
      { name: "Technical Writing",       pct: 93 },
      { name: "Research & Analysis",     pct: 89 },
    ],
  },
];

const projects = [
  {
    type: "Masters Research",
    title: "GenAI Technical Readiness Framework",
    desc:  "Designing a diagnostic framework to assess generative AI technical readiness in South African IT SMEs — grounded in the TOE Framework and UTAUT.",
    tags:  ["GenAI", "TOE Framework", "UTAUT", "Quantitative"],
    live:  true,
  },
  {
    type: "QA Project",
    title: "Power BI UAT Documentation",
    desc:  "Full UAT sign-off suite for the CountryDataSpace Power BI dashboard: test plans, validation checklists, and structured sign-off criteria.",
    tags:  ["Power BI", "UAT", "QA Artefacts"],
    live:  false,
  },
  {
    type: "Data Analytics",
    title: "Goodnature IoT Data Analysis",
    desc:  "Eight-module analysis of Chirp trap IoT data for conservation insights, covering data prep, event-pattern analysis, and Python visualisations.",
    tags:  ["Python", "IoT", "Matplotlib", "Data Analysis"],
    live:  false,
  },
  {
    type: "Technical Writing",
    title: "Postman & GitHub Training Guides",
    desc:  "Beginner-friendly step-by-step guides for Postman API testing and GitHub Gitflow workflows, designed for QA team onboarding.",
    tags:  ["Postman", "Git", "Documentation", "Onboarding"],
    live:  false,
  },
];

const timeline = [
  {
    period: "2024 – Present",
    role:   "Masters Researcher",
    org:    "University of South Africa (UNISA)",
    desc:   "Pursuing MIT (Masters in Information Technology) with a dissertation on generative AI technical readiness frameworks for South African IT SMEs.",
  },
  {
    period: "2023 – Present",
    role:   "QA Engineer",
    org:    "IT Industry, South Africa",
    desc:   "Delivering QA artefacts including 42-case test suites, UAT documentation for Power BI dashboards, Postman API guides, and Jira storyboards with Given/When/Then acceptance criteria.",
  },
  {
    period: "2023",
    role:   "Data Analytics Practitioner",
    org:    "Academic & Project Work",
    desc:   "Analysed Goodnature IoT trap data across eight modules: data preparation, event pattern recognition, and Python visualisation for conservation decision-making.",
  },
];

const techStack = [
  "Python", "Power BI", "Postman", "Jira", "Git", "GitHub",
  "React", "JavaScript", "HTML / CSS", "VS Code", "Excel", "SQL",
];

const navLinks = ["About", "Skills", "Experience", "Research", "Contact"];

export default function Portfolio() {
  const [scrolled,       setScrolled]       = useState(false);
  const [activeNav,      setActiveNav]       = useState("");
  const [skillsReady,    setSkillsReady]     = useState(false);
  const [heroLine,       setHeroLine]        = useState(false);
  const skillsSentinel   = useRef(null);

  /* ── inject global styles ── */
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  /* ── nav scroll state ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── hero line animation ── */
  useEffect(() => {
    const t = setTimeout(() => setHeroLine(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* ── reveal on scroll ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal, .reveal-left").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── skills trigger ── */
  useEffect(() => {
    if (!skillsSentinel.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSkillsReady(true); },
      { threshold: 0.2 }
    );
    io.observe(skillsSentinel.current);
    return () => io.disconnect();
  }, []);

  /* ── active nav tracking ── */
  useEffect(() => {
    const sections = navLinks.map(n => document.getElementById(n.toLowerCase())).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); }),
      { threshold: 0.4 }
    );
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Syne', sans-serif", overflowX: "hidden" }}>

      {/* ════════════════════════ NAV ════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 64px",
        background: scrolled ? `${C.bg}EC` : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.dim}` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}>
        {/* Logo */}
        <div onClick={() => scrollTo("hero")} style={{ cursor: "pointer" }}>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
            letterSpacing: 1, color: C.text,
          }}>
            TC<span style={{ color: C.gold }}>.</span>
          </span>
        </div>

        {/* Links */}
        <div className="nav-links" style={{ display: "flex", gap: 40 }}>
          {navLinks.map(n => (
            <button key={n} className={`nav-link ${activeNav === n.toLowerCase() ? "active-nav" : ""}`}
              onClick={() => scrollTo(n.toLowerCase())}>
              {n}
            </button>
          ))}
        </div>

        {/* CTA */}
        <a className="btn-primary" href="mailto:tinashe@chanakira.co.za"
          style={{ fontSize: 10, padding: "10px 22px", letterSpacing: 2 }}>
          Hire Me
        </a>
      </nav>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section id="hero" style={{
        minHeight: "100vh", position: "relative",
        display: "flex", alignItems: "center",
        padding: "140px 64px 100px",
        overflow: "hidden",
      }}>
        {/* Decorative rings */}
        <div style={{
          position: "absolute", top: "8%", right: "4%",
          width: 480, height: 480, borderRadius: "50%",
          border: `1px solid ${C.dim}`,
          animation: "rotateSlow 60s linear infinite",
          opacity: 0.5,
        }} />
        <div style={{
          position: "absolute", top: "17%", right: "11%",
          width: 320, height: 320, borderRadius: "50%",
          border: `1px solid ${C.gold}22`,
          animation: "rotateSlow 40s linear infinite reverse",
        }} />
        <div style={{
          position: "absolute", top: "28%", right: "19%",
          width: 160, height: 160, borderRadius: "50%",
          border: `1px solid ${C.gold}15`,
        }} />

        {/* Corner accent */}
        <div style={{
          position: "absolute", top: "50%", right: 64,
          width: 1, height: 200,
          background: `linear-gradient(to bottom, transparent, ${C.gold}60, transparent)`,
        }} />
        <div style={{
          position: "absolute", top: "50%", right: 64,
          width: 200, height: 1,
          background: `linear-gradient(to left, transparent, ${C.gold}40)`,
        }} />

        {/* Grain overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.6,
        }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>

          {/* Pre-title */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 36,
            animation: "fadeIn 0.8s ease 0.1s both",
          }}>
            <div style={{
              width: heroLine ? 52 : 0, height: 1, background: C.gold,
              transition: "width 0.8s ease 0.3s",
            }} />
            <span style={{
              color: C.gold, fontSize: 11, letterSpacing: 3.5,
              textTransform: "uppercase", fontWeight: 500,
            }}>
              IT Professional · South Africa
            </span>
          </div>

          {/* Name */}
          <h1 className="hero-title" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(56px, 9vw, 104px)",
            fontWeight: 700, lineHeight: 1.02,
            letterSpacing: -2, marginBottom: 0,
            animation: "fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
          }}>
            Tinashe
          </h1>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(56px, 9vw, 104px)",
            fontWeight: 700, lineHeight: 1.02,
            letterSpacing: -2, marginBottom: 32,
            color: C.gold,
            fontStyle: "italic",
            animation: "fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both",
          }}>
            Chanakira
          </h1>

          {/* Role tags */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36,
            animation: "fadeInUp 1s ease 0.55s both",
          }}>
            {["QA Engineer", "Masters Researcher", "Data Analyst", "Technical Writer"].map(r => (
              <span key={r} style={{
                padding: "6px 18px",
                border: `1px solid ${C.dim}`,
                fontSize: 11, letterSpacing: 2,
                textTransform: "uppercase", color: C.muted,
              }}>{r}</span>
            ))}
          </div>

          {/* Bio snippet */}
          <p style={{
            fontSize: 15, lineHeight: 1.85, color: C.muted,
            maxWidth: 530, marginBottom: 52,
            animation: "fadeInUp 1s ease 0.65s both",
          }}>
            Based in <strong style={{ color: C.text, fontWeight: 500 }}>Benoni, Gauteng</strong> — pursuing a Masters in IT at UNISA while delivering
            quality engineering and researching GenAI adoption frameworks for South African SMEs.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 16, flexWrap: "wrap",
            animation: "fadeInUp 1s ease 0.75s both",
          }}>
            <button className="btn-primary" onClick={() => scrollTo("experience")}>View My Work</button>
            <button className="btn-outline" onClick={() => scrollTo("contact")}>Let's Talk</button>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          animation: "fadeIn 1s ease 1.8s both",
        }}>
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.muted }}>Scroll</span>
          <div style={{
            width: 1, height: 50,
            background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
            animation: "bounceScroll 2.5s ease-in-out infinite",
          }} />
        </div>
      </section>

      {/* ════════════════════════ ABOUT ════════════════════════ */}
      <section id="about" className="section-pad" style={{ padding: "130px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

          {/* Left */}
          <div>
            <div className="reveal-left">
              <div style={{ width: 52, height: 1, background: C.gold, marginBottom: 18,
                animation: "slideRight 0.8s ease both", transformOrigin: "left" }} />
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(34px, 4vw, 46px)", fontWeight: 700,
                lineHeight: 1.2, marginBottom: 28,
              }}>
                About <em style={{ color: C.gold }}>Me</em>
              </h2>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <p style={{ color: C.muted, lineHeight: 1.9, fontSize: 15, marginBottom: 20 }}>
                I'm an IT professional with hands-on expertise in quality assurance engineering, 
                data analytics, and structured technical documentation. I approach every project 
                with the same precision — whether it's a 42-case test suite or a research proposal 
                for a Masters dissertation.
              </p>
              <p style={{ color: C.muted, lineHeight: 1.9, fontSize: 15, marginBottom: 36 }}>
                My current academic focus is bridging the gap between generative AI theory and 
                South African SME reality — designing a framework that gives organisations a clear 
                diagnostic lens for readiness assessment. Outside tech, I'm drawn to aviation, 
                cosmology, and the deeper physics of how reality works.
              </p>
            </div>

            <div className="reveal" style={{ transitionDelay: "0.2s" }}>
              <div style={{ display: "flex", gap: 44, flexWrap: "wrap" }}>
                {[
                  ["Location", "Benoni, Gauteng ZA"],
                  ["University", "UNISA"],
                  ["Focus", "GenAI Readiness"],
                  ["Status", "Open to Work"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Avatar card */}
            <div className="reveal" style={{
              background: C.surface, border: `1px solid ${C.dim}`,
              padding: "40px 36px", textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              {/* Corner decoration */}
              <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80,
                borderLeft: `1px solid ${C.dim}`, borderBottom: `1px solid ${C.dim}` }} />

              <div style={{
                width: 88, height: 88, borderRadius: "50%", margin: "0 auto 20px",
                background: `conic-gradient(from 180deg, ${C.gold}30, ${C.gold}08, ${C.gold}30)`,
                border: `1.5px solid ${C.gold}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.gold,
                animation: "glowGold 4s ease-in-out infinite",
              }}>TC</div>

              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
                Tinashe Chanakira
              </div>
              <div style={{ color: C.muted, fontSize: 12, letterSpacing: 1.5 }}>IT Professional · QA Engineer</div>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.dim}`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#5DC87A",
                  animation: "pulseDot 2s infinite" }} />
                <span style={{ fontSize: 11, color: "#5DC87A", letterSpacing: 1.5, textTransform: "uppercase" }}>
                  Available for opportunities
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, transitionDelay: "0.15s" }}>
              {[
                ["42+",  "Test Cases Designed"],
                ["3+",   "Years in IT"],
                ["2028", "Masters Target"],
                ["SA",   "Proudly Local"],
              ].map(([num, lbl]) => (
                <div key={lbl} style={{
                  background: C.surface, border: `1px solid ${C.dim}`,
                  padding: "22px 20px",
                }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700,
                    color: C.gold, marginBottom: 4, lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ SKILLS ════════════════════════ */}
      <section id="skills" className="section-pad" style={{ padding: "130px 64px", background: C.surface }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: 64 }}>
            <div style={{ width: 52, height: 1, background: C.gold, marginBottom: 18 }} />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 4vw, 46px)", fontWeight: 700,
              lineHeight: 1.2, marginBottom: 14,
            }}>
              Skills & <em style={{ color: C.gold }}>Expertise</em>
            </h2>
            <p style={{ color: C.muted, fontSize: 15, maxWidth: 460 }}>
              Competencies built through real delivery, not just theory.
            </p>
          </div>

          {/* Skill bars */}
          <div ref={skillsSentinel} className="three-col" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginBottom: 48,
          }}>
            {skillGroups.map(({ cat, icon, items }, gi) => (
              <div key={cat} className="reveal" style={{
                background: C.bg, border: `1px solid ${C.dim}`,
                padding: "32px 28px", transitionDelay: `${gi * 0.12}s`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                  <span style={{ color: C.gold, fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>{cat}</span>
                </div>
                {items.map(({ name, pct }) => (
                  <div key={name} style={{ marginBottom: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: C.text }}>{name}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>{pct}%</span>
                    </div>
                    <div style={{ height: 2, background: C.dim, overflow: "hidden" }}>
                      <div className="skill-fill" style={{ width: skillsReady ? `${pct}%` : "0%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {techStack.map(t => (
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ EXPERIENCE ════════════════════════ */}
      <section id="experience" className="section-pad" style={{ padding: "130px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: 64 }}>
            <div style={{ width: 52, height: 1, background: C.gold, marginBottom: 18 }} />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 4vw, 46px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 14,
            }}>
              Experience & <em style={{ color: C.gold }}>Projects</em>
            </h2>
          </div>

          {/* Project cards */}
          <div className="two-col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 80,
          }}>
            {projects.map((p, i) => (
              <div key={p.title} className={`project-card reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
                {/* Status badge */}
                <div style={{
                  position: "absolute", top: 20, right: 20,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: p.live ? "#5DC87A" : C.muted,
                    animation: p.live ? "pulseDot 2s infinite" : "none",
                  }} />
                  <span style={{ fontSize: 10, color: p.live ? "#5DC87A" : C.muted, letterSpacing: 0.5 }}>
                    {p.live ? "Active" : "Done"}
                  </span>
                </div>

                <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
                  color: C.gold, marginBottom: 14, fontWeight: 600 }}>{p.type}</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 600,
                  lineHeight: 1.35, marginBottom: 14, paddingRight: 60, color: C.text,
                }}>{p.title}</h3>
                <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.75, marginBottom: 22 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {p.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="reveal">
            <h3 style={{
              fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600,
              color: C.muted, marginBottom: 48,
            }}>Professional Journey</h3>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 6, bottom: 0,
                width: 1, background: C.dim }} />
              {timeline.map((t, i) => (
                <div key={t.role} className="timeline-item" style={{
                  paddingLeft: 36, paddingBottom: 44,
                  position: "relative", cursor: "default",
                }}>
                  <div className="timeline-dot" />
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase",
                    marginBottom: 8, fontWeight: 500 }}>{t.period}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18,
                    fontWeight: 600, marginBottom: 4, color: C.text }}>{t.role}</div>
                  <div style={{ fontSize: 12, color: C.gold, marginBottom: 10,
                    letterSpacing: 0.5 }}>{t.org}</div>
                  <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.75, maxWidth: 620 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ RESEARCH ════════════════════════ */}
      <section id="research" className="section-pad" style={{ padding: "130px 64px", background: C.surface }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: 64 }}>
            <div style={{ width: 52, height: 1, background: C.gold, marginBottom: 18 }} />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 4vw, 46px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 14,
            }}>
              Research & <em style={{ color: C.gold }}>Education</em>
            </h2>
          </div>

          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>

            {/* Qualification card */}
            <div className="reveal" style={{ background: C.bg, border: `1px solid ${C.dim}`, padding: "40px 36px" }}>
              <div style={{ display: "flex", alignItems: "flex-start",
                justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
                    color: C.gold, marginBottom: 12, fontWeight: 600 }}>Current Qualification</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24,
                    fontWeight: 700, lineHeight: 1.3, color: C.text }}>
                    Masters in<br />Information Technology
                  </h3>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: 16 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26,
                    fontWeight: 700, color: C.gold }}>UNISA</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>2024 – 2027/28</div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${C.dim}`, paddingTop: 24 }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, letterSpacing: 1 }}>
                  Dissertation Focus
                </div>
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>
                  Developing a diagnostic framework for assessing generative AI technical 
                  readiness among South African IT SMEs.
                </p>
              </div>

              <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["TOE Framework", "UTAUT", "Quantitative", "SA IT SMEs"].map(t => (
                  <span key={t} className="tag-pill">{t}</span>
                ))}
              </div>
            </div>

            {/* Research detail */}
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 18, transitionDelay: "0.12s" }}>
              <div style={{ background: C.bg, border: `1px solid ${C.dim}`, padding: "28px 28px" }}>
                <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
                  color: C.gold, marginBottom: 18, fontWeight: 600 }}>Research Design</div>
                {[
                  ["Methodology",   "Quantitative Descriptive"],
                  ["Instrument",    "Survey"],
                  ["Target Group",  "IT SME Employees, SA"],
                  ["Dimensions",    "5 Technical Readiness Pillars"],
                  ["Proposal Due",  "June 2026"],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.dim}` : "none",
                    fontSize: 13,
                  }}>
                    <span style={{ color: C.muted }}>{k}</span>
                    <span style={{ color: i === arr.length - 1 ? C.gold : C.text }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: C.bg, border: `1px solid ${C.dim}`, padding: "28px 28px" }}>
                <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
                  color: C.gold, marginBottom: 18, fontWeight: 600 }}>Theoretical Pillars</div>
                {[
                  "Technology-Organisation-Environment (TOE) Framework",
                  "Unified Theory of Acceptance & Use of Technology (UTAUT)",
                  "5 GenAI Technical Readiness Dimensions",
                  "South African SME Innovation Context",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 13, alignItems: "flex-start" }}>
                    <span style={{ color: C.gold, fontSize: 12, marginTop: 2, flexShrink: 0 }}>—</span>
                    <span style={{ color: C.muted, fontSize: 13, lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interests strip */}
          <div className="reveal" style={{ marginTop: 48, padding: "28px 32px",
            border: `1px solid ${C.dim}`, background: C.bg,
            display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
              color: C.gold, fontWeight: 600, flexShrink: 0 }}>Also Interested In</span>
            <div style={{ width: 1, height: 20, background: C.dim }} />
            {["✈ Aviation (SACAA Pathway)", "🔭 Cosmology & Astrophysics", "⚛ Theoretical Physics", "🌍 AI in Africa"].map(i => (
              <span key={i} style={{ fontSize: 13, color: C.muted }}>{i}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ CONTACT ════════════════════════ */}
      <section id="contact" className="section-pad" style={{ padding: "140px 64px 120px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div className="reveal">
            <div style={{ width: 52, height: 1, background: C.gold, margin: "0 auto 20px" }} />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 7vw, 64px)", fontWeight: 700,
              lineHeight: 1.1, marginBottom: 20,
            }}>
              Let's <em style={{ color: C.gold }}>Connect</em>
            </h2>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.85,
              maxWidth: 460, margin: "0 auto 52px" }}>
              Open to QA engineering roles, research collaborations, and conversations 
              about AI adoption in the South African tech landscape.
            </p>

            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 64, flexWrap: "wrap" }}>
              <a className="btn-primary" href="mailto:tinashe@chanakira.co.za">Send an Email</a>
              <a className="btn-outline" href="https://linkedin.com/in/tinashe-chanakira" target="_blank" rel="noopener">LinkedIn</a>
            </div>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1, background: C.dim }}>
              {[
                ["Email",        "tinashe@chanakira.co.za"],
                ["Location",     "Benoni, Gauteng ZA"],
                ["Availability", "Open to Offers"],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ background: C.bg, padding: "28px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2.5,
                    textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>{lbl}</div>
                  <div style={{ fontSize: 13, color: C.text }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer style={{
        padding: "28px 64px",
        borderTop: `1px solid ${C.dim}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700 }}>
          TC<span style={{ color: C.gold }}>.</span>
        </div>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 0.5 }}>
          © 2025 Tinashe Chanakira · Benoni, Gauteng, South Africa
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["GitHub", "LinkedIn", "UNISA Research"].map(s => (
            <a key={s} href="#" className="contact-link"
              style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{s}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}
