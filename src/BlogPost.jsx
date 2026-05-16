import { useState, useRef, useCallback, useEffect } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = {
  bg:       "#0B0F1A",
  surface:  "#111827",
  surface2: "#1E293B",
  border:   "#1E293B",
  text:     "#E2E8F0",
  muted:    "#64748B",
  faint:    "#1E293B",
  blue:     "#38BDF8",
  green:    "#34D399",
  amber:    "#FBBF24",
  red:      "#F87171",
  purple:   "#A78BFA",
  accent:   "#38BDF8",
};

/* ─────────────────────────────────────────────
   REUSABLE ATOMS
───────────────────────────────────────────── */
function Tag({ children, color = G.blue }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 20,
      background: color + "1A",
      border: `1px solid ${color}44`,
      color,
      fontSize: 11,
      fontFamily: "'SF Mono', monospace",
      fontWeight: 600,
    }}>{children}</span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
    }}>
      <div style={{ flex: 1, height: 1, background: G.border }} />
      <span style={{ color: G.muted, fontSize: 11, fontFamily: "'SF Mono', monospace", letterSpacing: 2 }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: G.border }} />
    </div>
  );
}

function CodeBlock({ children, highlight }) {
  return (
    <pre style={{
      background: "#0D1117",
      border: `1px solid ${G.border}`,
      borderLeft: highlight ? `3px solid ${G.blue}` : undefined,
      borderRadius: 10,
      padding: "14px 18px",
      fontSize: 12,
      lineHeight: 1.9,
      color: "#CBD5E1",
      overflowX: "auto",
      fontFamily: "'SF Mono', 'Fira Code', monospace",
      margin: 0,
    }}>{children}</pre>
  );
}

function Callout({ color = G.blue, icon, children }) {
  return (
    <div style={{
      background: color + "0D",
      border: `1px solid ${color}33`,
      borderRadius: 10,
      padding: "12px 16px",
      fontSize: 13,
      color: G.text,
      lineHeight: 1.7,
      display: "flex",
      gap: 10,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEMO 1 — Single Concave Curve
───────────────────────────────────────────── */
const W1 = 300, H1 = 180, BL1 = 90;

function Demo1() {
  const [ctrl, setCtrl] = useState({ x: 150, y: 45 });
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const get = useCallback((e) => {
    const r = ref.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: Math.max(10, Math.min(W1-10, cx - r.left)), y: Math.max(10, Math.min(BL1-4, cy - r.top)) };
  }, []);
  const onMove = useCallback((e) => { if (!drag) return; e.preventDefault(); setCtrl(get(e)); }, [drag, get]);
  const A = { x: 0, y: BL1 }, B = { x: W1, y: BL1 }, C = ctrl;
  const curve  = `M 0,${BL1} Q ${C.x},${C.y} ${W1},${BL1}`;
  const filled = `${curve} L ${W1},${H1} L 0,${H1} Z`;
  const dip    = Math.round(BL1 - C.y);
  return (
    <div onMouseMove={onMove} onMouseUp={() => setDrag(false)} onTouchMove={onMove} onTouchEnd={() => setDrag(false)}
      style={{ userSelect: "none" }}>
      <svg ref={ref} width={W1} height={H1} style={{ borderRadius: 12, overflow: "hidden", display: "block", touchAction: "none" }}>
        <defs>
          <linearGradient id="d1sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB" /><stop offset="100%" stopColor="#B5E8C8" />
          </linearGradient>
        </defs>
        <rect width={W1} height={H1} fill="url(#d1sky)" />
        <text x="20" y="78" fontSize="18">🌲</text>
        <text x="90" y="82" fontSize="14">🧒</text>
        <text x="138" y="80" fontSize="14">👧</text>
        <text x="210" y="82" fontSize="14">🐒</text>
        <text x="262" y="76" fontSize="18">🌲</text>
        <path d={filled} fill="#F5F3EF" />
        <line x1={0} y1={BL1} x2={W1} y2={BL1} stroke={G.blue} strokeWidth="1" strokeDasharray="4,4" opacity="0.35" />
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={G.amber} strokeWidth="1.2" strokeDasharray="4,4" opacity="0.5" />
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={G.amber} strokeWidth="1.2" strokeDasharray="4,4" opacity="0.5" />
        <path d={curve} fill="none" stroke={G.blue} strokeWidth="2.5" strokeLinecap="round" />
        {dip > 4 && <>
          <line x1={C.x} y1={C.y+2} x2={C.x} y2={BL1-2} stroke={G.amber} strokeWidth="1" strokeDasharray="3,3" opacity="0.7" />
          <text x={C.x+6} y={(C.y+BL1)/2+4} fill={G.amber} fontSize="10">{dip}px</text>
        </>}
        <circle cx={A.x} cy={A.y} r="5" fill={G.blue} stroke="white" strokeWidth="1.5" />
        <circle cx={B.x} cy={B.y} r="5" fill={G.blue} stroke="white" strokeWidth="1.5" />
        <circle cx={C.x} cy={C.y} r="10" fill={G.amber} stroke="white" strokeWidth="2"
          style={{ cursor: drag ? "grabbing" : "grab", filter: "drop-shadow(0 0 5px #FBBF2466)" }}
          onMouseDown={(e) => { e.stopPropagation(); setDrag(true); }}
          onTouchStart={(e) => { e.stopPropagation(); setDrag(true); }} />
        <text x={C.x} y={C.y+4} textAnchor="middle" fill="#1E293B" fontSize="9" fontWeight="bold" style={{ pointerEvents:"none" }}>C</text>
        <text x={W1/2} y={H1-28} textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="bold">Wonder Trails!</text>
        <text x={W1/2} y={H1-13} textAnchor="middle" fill="#94A3B8" fontSize="9">Adventure awaits our little friends!</text>
      </svg>
      <p style={{ textAlign: "center", color: G.muted, fontSize: 11, marginTop: 8, fontFamily: "'SF Mono', monospace" }}>
        drag <span style={{ color: G.amber }}>●</span> up/down · dip = <span style={{ color: G.amber }}>{dip}px</span>
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEMO 2 — Control Point X & Y
───────────────────────────────────────────── */
const W2 = 300, H2 = 160, BL2 = 90;

function Demo2() {
  const [cx, setCx] = useState(150);
  const [cy, setCy] = useState(45);
  const xPct = Math.round((cx / W2) * 100);
  const yDip = Math.round(BL2 - cy);
  const curve  = `M 0,${BL2} Q ${cx},${cy} ${W2},${BL2}`;
  const filled = `${curve} L ${W2},${H2} L 0,${H2} Z`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <svg width={W2} height={H2} style={{ borderRadius: 12, overflow: "hidden", display: "block" }}>
        <defs>
          <linearGradient id="d2sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7EC8E3"/><stop offset="100%" stopColor="#B5E8C8"/>
          </linearGradient>
        </defs>
        <rect width={W2} height={H2} fill="url(#d2sky)" />
        <text x="20"  y="78" fontSize="16">🌲</text>
        <text x="255" y="76" fontSize="16">🌲</text>
        <path d={filled} fill="#F5F3EF" />
        <line x1={0} y1={BL2} x2={W2} y2={BL2} stroke={G.blue} strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
        <path d={curve} fill="none" stroke={G.blue} strokeWidth="2.5" strokeLinecap="round" />
        {/* X indicator */}
        <line x1={0} y1={22} x2={cx} y2={22} stroke={G.blue} strokeWidth="2" opacity="0.7" />
        <line x1={cx} y1={16} x2={cx} y2={28} stroke={G.blue} strokeWidth="1.5" />
        <text x={cx/2} y={16} textAnchor="middle" fill={G.blue} fontSize="10" fontWeight="bold">x={xPct}%</text>
        {/* Y indicator */}
        {yDip > 4 && <>
          <line x1={W2-14} y1={cy} x2={W2-14} y2={BL2} stroke={G.amber} strokeWidth="2" opacity="0.8" />
          <text x={W2-18} y={(cy+BL2)/2+4} textAnchor="end" fill={G.amber} fontSize="10" fontWeight="bold">y=-{yDip}</text>
        </>}
        <circle cx={cx} cy={cy} r="8" fill={G.amber} stroke="white" strokeWidth="2" />
        <circle cx={0}  cy={BL2} r="5" fill={G.blue} stroke="white" strokeWidth="1.5" />
        <circle cx={W2} cy={BL2} r="5" fill={G.blue} stroke="white" strokeWidth="1.5" />
        <text x={W2/2} y={H2-16} textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="bold">Wonder Trails!</text>
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 4 }}>
            <span style={{ color: G.muted, fontSize: 11 }}>x — horizontal</span>
            <span style={{ color: G.blue, fontSize: 11, fontFamily:"'SF Mono',monospace" }}>{xPct}%</span>
          </div>
          <input type="range" min={10} max={W2-10} value={cx} onChange={e => setCx(+e.target.value)}
            style={{ width:"100%", accentColor: G.blue }} />
        </div>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 4 }}>
            <span style={{ color: G.muted, fontSize: 11 }}>y — depth</span>
            <span style={{ color: G.amber, fontSize: 11, fontFamily:"'SF Mono',monospace" }}>midY-{yDip}</span>
          </div>
          <input type="range" min={10} max={BL2} value={cy} onChange={e => setCy(+e.target.value)}
            style={{ width:"100%", accentColor: G.amber }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEMO 3 — Multi-wave chained
───────────────────────────────────────────── */
const W3 = 300, H3 = 200, BL3 = 100, SEGS = 4;
const anchors3 = Array.from({ length: SEGS+1 }, (_, i) => ({ x: (i/SEGS)*W3, y: BL3 }));
const defaultC3 = Array.from({ length: SEGS }, (_, i) => ({
  x: ((i+0.5)/SEGS)*W3,
  y: i%2===0 ? BL3-40 : BL3+40,
}));
const SEG_COLORS = [G.red, G.amber, G.green, G.purple];

function quadAt(p0, p1, p2, t) {
  const mt = 1-t;
  return { x: mt*mt*p0.x+2*mt*t*p1.x+t*t*p2.x, y: mt*mt*p0.y+2*mt*t*p1.y+t*t*p2.y };
}

function Demo3() {
  const [ctrls, setCtrls] = useState(defaultC3);
  const [drag, setDrag]   = useState(null);
  const ref = useRef(null);
  const get = useCallback((e) => {
    const r = ref.current.getBoundingClientRect();
    const cx = e.touches?e.touches[0].clientX:e.clientX;
    const cy = e.touches?e.touches[0].clientY:e.clientY;
    return { x:Math.max(10,Math.min(W3-10,cx-r.left)), y:Math.max(20,Math.min(H3-30,cy-r.top)) };
  }, []);
  const onMove = useCallback((e) => {
    if (drag===null) return; e.preventDefault();
    const pt = get(e);
    setCtrls(prev => prev.map((c,i) => i===drag ? pt : c));
  }, [drag, get]);

  let wavePath = `M 0,${BL3}`;
  ctrls.forEach((c, i) => { wavePath += ` Q ${c.x},${c.y} ${anchors3[i+1].x},${anchors3[i+1].y}`; });
  const filled = wavePath + ` L ${W3},${H3} L 0,${H3} Z`;

  return (
    <div onMouseMove={onMove} onMouseUp={() => setDrag(null)} onTouchMove={onMove} onTouchEnd={() => setDrag(null)}
      style={{ userSelect:"none" }}>
      <svg ref={ref} width={W3} height={H3} style={{ borderRadius:12, overflow:"hidden", display:"block", touchAction:"none" }}>
        <defs>
          <linearGradient id="d3sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#87CEEB"/><stop offset="100%" stopColor="#B5E8C8"/>
          </linearGradient>
        </defs>
        <rect width={W3} height={H3} fill="url(#d3sky)" />
        <text x="8"   y="88" fontSize="16">🌲</text>
        <text x="270" y="86" fontSize="16">🌲</text>
        <path d={filled} fill="#F5F3EF" />
        <line x1={0} y1={BL3} x2={W3} y2={BL3} stroke="white" strokeWidth="1" strokeDasharray="4,4" opacity="0.2" />
        {ctrls.map((c, i) => {
          const col = SEG_COLORS[i];
          const a0 = anchors3[i], a1 = anchors3[i+1];
          const mid = quadAt(a0, c, a1, 0.5);
          const isPeak = c.y < BL3;
          return (
            <g key={i}>
              <line x1={a0.x} y1={a0.y} x2={c.x} y2={c.y} stroke={col} strokeWidth="1" strokeDasharray="4,4" opacity="0.45" />
              <line x1={a1.x} y1={a1.y} x2={c.x} y2={c.y} stroke={col} strokeWidth="1" strokeDasharray="4,4" opacity="0.45" />
              <path d={`M ${a0.x},${a0.y} Q ${c.x},${c.y} ${a1.x},${a1.y}`} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round" />
              <text x={mid.x} y={mid.y+(isPeak?-8:12)} textAnchor="middle" fill={col} fontSize="9" opacity="0.9">S{i+1}</text>
              <circle cx={c.x} cy={c.y} r="10" fill={col} stroke="white" strokeWidth="2"
                style={{ cursor: drag===i?"grabbing":"grab" }}
                onMouseDown={(e)=>{e.stopPropagation();setDrag(i);}}
                onTouchStart={(e)=>{e.stopPropagation();setDrag(i);}} />
              <text x={c.x} y={c.y+4} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" style={{pointerEvents:"none"}}>C{i+1}</text>
            </g>
          );
        })}
        {anchors3.map((a, i) => (
          <circle key={i} cx={a.x} cy={a.y} r="5" fill={G.blue} stroke="white" strokeWidth="1.5" />
        ))}
        <text x={W3/2} y={H3-32} textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="bold">Wonder Trails!</text>
        <text x={W3/2} y={H3-16} textAnchor="middle" fill="#94A3B8" fontSize="9">Adventure awaits!</text>
      </svg>
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:8, flexWrap:"wrap" }}>
        {ctrls.map((c,i) => (
          <span key={i} style={{ fontSize:11, color:SEG_COLORS[i], fontFamily:"'SF Mono',monospace" }}>
            C{i+1} {c.y<BL3?"↑":"↓"}
          </span>
        ))}
        <span style={{ fontSize:11, color:G.muted, cursor:"pointer" }}
          onClick={() => setCtrls(defaultC3)}>↺ reset</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN BLOG POST
───────────────────────────────────────────── */
export default function BlogPost() {
  const [copied, setCopied] = useState(null);
  const copy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div style={{ background: G.bg, minHeight:"100vh", padding:"0 0 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#0B0F1A; }
        ::-webkit-scrollbar-thumb { background:#1E293B; border-radius:3px; }
        input[type=range] { height:4px; border-radius:2px; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(160deg, #0F172A 0%, #0B1628 60%, #0B0F1A 100%)",
        borderBottom: `1px solid ${G.border}`,
        padding: "64px 24px 48px",
        textAlign: "center",
      }}>
        <div style={{ marginBottom: 14, display:"flex", justifyContent:"center", gap:8 }}>
          <Tag color={G.blue}>SwiftUI</Tag>
          <Tag color={G.green}>Interactive</Tag>
          <Tag color={G.purple}>Bezier Curves</Tag>
        </div>
        <h1 style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "clamp(26px, 6vw, 40px)",
          fontWeight: 700,
          color: G.text,
          margin: "0 0 16px",
          lineHeight: 1.25,
          letterSpacing: "-0.5px",
        }}>
          Crafting Curves in SwiftUI
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          color: G.muted,
          maxWidth: 480,
          margin: "0 auto 24px",
          lineHeight: 1.7,
        }}>
          From a single concave panel to a full multi-peak wave — a hands-on visual guide to <code style={{ color: G.blue, fontSize:14 }}>addQuadCurve</code> in SwiftUI paths.
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:6, fontSize:12, color:G.muted, fontFamily:"'SF Mono',monospace" }}>
          <span>Kashif Hussain</span>
          <span style={{ color:G.border }}>·</span>
          <span>May 2026</span>
          <span style={{ color:G.border }}>·</span>
          <span>5 min read</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>

        {/* Intro */}
        <section style={{ paddingTop: 48 }}>
          <p style={prose()}>
            If you've ever seen an app where the bottom sheet rises with a graceful scoop — like a wave carved into the top edge — that's a <strong style={{color:G.text}}>custom SwiftUI Shape</strong> using quadratic Bézier curves. This guide breaks down exactly how it works, interactively.
          </p>
          <p style={prose()}>
            We'll cover three things: the single concave dip, understanding the control point, and chaining multiple curves to make a full wave.
          </p>
        </section>

        <div style={{ height:1, background:G.border, margin:"36px 0" }} />

        {/* Section 1 */}
        <section>
          <SectionLabel>CONCEPT 01</SectionLabel>
          <h2 style={h2()}>The Concave Panel</h2>
          <p style={prose()}>
            The signature look of the Wonder Trails onboarding screen comes from one shape: a white panel whose top edge curves <em style={{color:G.blue}}>inward</em> like a smile flipped upside down. In SwiftUI, this is built with a custom <code style={code()}>Shape</code> and a single <code style={code()}>addQuadCurve</code> call.
          </p>

          <div style={demoBox()}>
            <div style={{ marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:12, color:G.muted }}>Try it —</span>
              <span style={{ fontSize:12, color:G.amber }}>drag the yellow dot up</span>
            </div>
            <Demo1 />
          </div>

          <p style={prose()}>
            The white panel is just a closed <code style={code()}>Path</code>. The top edge is the curve; the rest are straight lines down and across the bottom.
          </p>

          <div style={{ position:"relative" }}>
            <CodeBlock highlight>{`struct ConcaveTopShape: Shape {
  var curveDepth: CGFloat = 40

  func path(in rect: CGRect) -> Path {
    var path = Path()

    // 1. Start at top-left, at mid-height
    path.move(to: CGPoint(x: rect.minX, y: rect.midY))

    // 2. Curve to top-right — control point is ABOVE
    path.addQuadCurve(
      to:      CGPoint(x: rect.maxX, y: rect.midY),
      control: CGPoint(x: rect.midX, y: rect.minY) // ← the magic
    )

    // 3. Close the panel downward
    path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
    path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
    path.closeSubpath()
    return path
  }
}`}</CodeBlock>
            <button onClick={() => copy(1, `struct ConcaveTopShape: Shape {
  var curveDepth: CGFloat = 40
  func path(in rect: CGRect) -> Path {
    var path = Path()
    path.move(to: CGPoint(x: rect.minX, y: rect.midY))
    path.addQuadCurve(
      to: CGPoint(x: rect.maxX, y: rect.midY),
      control: CGPoint(x: rect.midX, y: rect.minY)
    )
    path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
    path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
    path.closeSubpath()
    return path
  }
}`)} style={copyBtn(copied===1)}>
              {copied===1 ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </section>

        <div style={{ height:1, background:G.border, margin:"36px 0" }} />

        {/* Section 2 */}
        <section>
          <SectionLabel>CONCEPT 02</SectionLabel>
          <h2 style={h2()}>Understanding the Control Point</h2>
          <p style={prose()}>
            The control point is the heart of every quadratic curve. It's not drawn on screen — it's a <strong style={{color:G.text}}>magnet</strong> that pulls the curve toward it. It has two jobs:
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, margin:"16px 0 24px" }}>
            {[
              { color:G.blue,  label:"x", title:"Horizontal position", desc:"Where along the width the peak sits. 50% = centred." },
              { color:G.amber, label:"y", title:"Pull height",         desc:"How far above the baseline the curve is dragged." },
            ].map(item => (
              <div key={item.label} style={{
                background: G.surface,
                border: `1px solid ${item.color}33`,
                borderTop: `3px solid ${item.color}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}>
                <div style={{ fontFamily:"'SF Mono',monospace", color:item.color, fontSize:20, fontWeight:700, marginBottom:4 }}>{item.label}</div>
                <div style={{ color:G.text, fontSize:13, fontWeight:600, marginBottom:4 }}>{item.title}</div>
                <div style={{ color:G.muted, fontSize:12, lineHeight:1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={demoBox()}>
            <div style={{ marginBottom:10, fontSize:12, color:G.muted }}>Adjust x and y independently</div>
            <Demo2 />
          </div>

          <Callout color={G.blue} icon="💡">
            <strong>Rule of thumb:</strong> Control point <em>above</em> the anchors → concave (dips inward). Control point <em>below</em> → convex (bulges out). Control point <em>at the same level</em> → flat line.
          </Callout>

          <div style={{ marginTop: 20 }}>
            <CodeBlock>{`// Control point breakdown:
control: CGPoint(
  x: rect.midX,   // 50% → peak is centred
  y: rect.minY    // 0px → as high as possible = deep scoop
)

// Shallower dip:
control: CGPoint(
  x: rect.midX,
  y: rect.midY - 30  // only 30pt above anchors
)`}</CodeBlock>
          </div>
        </section>

        <div style={{ height:1, background:G.border, margin:"36px 0" }} />

        {/* Section 3 */}
        <section>
          <SectionLabel>CONCEPT 03</SectionLabel>
          <h2 style={h2()}>Chaining Curves for a Wave</h2>
          <p style={prose()}>
            A single <code style={code()}>addQuadCurve</code> gives one peak or dip. To make a wave, you chain multiple calls end-to-end — each call shares its start point with the previous call's end point.
          </p>

          <div style={demoBox()}>
            <div style={{ marginBottom:10, fontSize:12, color:G.muted }}>Drag any coloured dot — each is one segment</div>
            <Demo3 />
          </div>

          <p style={prose()}>
            Push a dot above the baseline for a peak, below for a dip. The wave emerges from alternating control points.
          </p>

          <div style={{ position:"relative" }}>
            <CodeBlock highlight>{`func path(in rect: CGRect) -> Path {
  var path = Path()
  let midY  = rect.midY
  let segW  = rect.width / 4  // 4 segments

  path.move(to: CGPoint(x: 0, y: midY))

  // S1 — peak ↑
  path.addQuadCurve(
    to:      .init(x: segW,     y: midY),
    control: .init(x: segW*0.5, y: midY - 40)
  )
  // S2 — dip ↓
  path.addQuadCurve(
    to:      .init(x: segW*2,   y: midY),
    control: .init(x: segW*1.5, y: midY + 40)
  )
  // S3 — peak ↑
  path.addQuadCurve(
    to:      .init(x: segW*3,   y: midY),
    control: .init(x: segW*2.5, y: midY - 40)
  )
  // S4 — dip ↓
  path.addQuadCurve(
    to:      .init(x: rect.maxX, y: midY),
    control: .init(x: segW*3.5,  y: midY + 40)
  )

  // Close the panel
  path.addLine(to: .init(x: rect.maxX, y: rect.maxY))
  path.addLine(to: .init(x: 0,         y: rect.maxY))
  path.closeSubpath()
  return path
}`}</CodeBlock>
            <button onClick={() => copy(3, `// Wave shape — 4 segments`)} style={copyBtn(copied===3)}>
              {copied===3 ? "✓" : "Copy"}
            </button>
          </div>
        </section>

        <div style={{ height:1, background:G.border, margin:"36px 0" }} />

        {/* Summary */}
        <section>
          <SectionLabel>SUMMARY</SectionLabel>
          <h2 style={h2()}>Quick Reference</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:8, margin:"16px 0" }}>
            {[
              { color:G.blue,   sym:"▸", text: "addQuadCurve has 2 params: to (end point) and control (the magnet)" },
              { color:G.amber,  sym:"▸", text: "Control x = horizontal position of peak. 50% = centred" },
              { color:G.amber,  sym:"▸", text: "Control y above anchors = peak. Below = dip. Same level = flat" },
              { color:G.green,  sym:"▸", text: "One call = one peak or dip. Chain N calls = N-segment wave" },
              { color:G.purple, sym:"▸", text: "Close the path with addLine to bottom corners for a filled panel" },
            ].map((r, i) => (
              <div key={i} style={{
                display:"flex", gap:10, alignItems:"flex-start",
                padding:"10px 14px",
                background:G.surface,
                borderRadius:8,
                border:`1px solid ${G.border}`,
              }}>
                <span style={{ color:r.color, fontFamily:"'SF Mono',monospace", fontSize:14, marginTop:1 }}>{r.sym}</span>
                <span style={{ color:G.muted, fontSize:13, lineHeight:1.6 }}>{r.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div style={{ marginTop: 56, padding:"24px 0", borderTop:`1px solid ${G.border}`, textAlign:"center" }}>
          <p style={{ color:G.muted, fontSize:12, fontFamily:"'SF Mono',monospace" }}>
            Written by <span style={{ color:G.text }}>Kashif Hussain</span> · iOS Engineer at Enthral.ai
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:10 }}>
            <a href="https://github.com/Hkashif722" target="_blank" rel="noreferrer"
              style={{ color:G.muted, fontSize:12, textDecoration:"none" }}>GitHub ↗</a>
            <a href="https://in.linkedin.com/in/kashif-hussain-ba5b0a197" target="_blank" rel="noreferrer"
              style={{ color:G.muted, fontSize:12, textDecoration:"none" }}>LinkedIn ↗</a>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Style helpers ── */
const prose = () => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 15,
  color: "#94A3B8",
  lineHeight: 1.8,
  margin: "0 0 16px",
});
const h2 = () => ({
  fontFamily: "'Lora', Georgia, serif",
  fontSize: 22,
  fontWeight: 700,
  color: G.text,
  margin: "0 0 14px",
  letterSpacing: "-0.3px",
});
const code = () => ({
  fontFamily: "'SF Mono', monospace",
  background: "#1E293B",
  padding: "1px 6px",
  borderRadius: 4,
  fontSize: 13,
  color: G.blue,
});
const demoBox = () => ({
  background: G.surface,
  border: `1px solid ${G.border}`,
  borderRadius: 14,
  padding: "20px",
  margin: "20px 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
const copyBtn = (copied) => ({
  position: "absolute", top: 10, right: 10,
  background: copied ? G.green + "22" : G.surface2,
  border: `1px solid ${copied ? G.green : G.border}`,
  color: copied ? G.green : G.muted,
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 11,
  fontFamily: "'SF Mono', monospace",
  cursor: "pointer",
  transition: "all 0.2s",
});
