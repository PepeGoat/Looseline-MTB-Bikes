// Looseline Mission Control · Product Detail Page
// Centerpiece: drag-to-spin 360° viewer + size picker + add-to-cart.

(() => {
  const { useTheme, Stripe, Bracket, RegMark, BIKES } = window;
  const { btnReset, ctlBtn } = window.MC;
  const { useState, useEffect, useRef } = React;

  const FRAMES = 72;

  const SPECS = {
    'LL-001': [
      ['FRAME', 'Carbon front · Al rear'],
      ['FORK', 'Fox 38 Factory 170mm'],
      ['SHOCK', 'Fox Float X2 Factory'],
      ['DRIVE', 'SRAM X0 Transmission'],
      ['BRAKES', 'SRAM Code Ultimate'],
      ['WHEELS', 'Reserve 30 HD · DT 350'],
      ['TIRES', 'Maxxis Assegai/DHR II'],
    ],
    'LL-002': [
      ['FRAME', 'Aluminum 6066'],
      ['FORK', 'Fox 36 Factory 150'],
      ['SHOCK', 'Fox Float X Performance'],
      ['DRIVE', 'SRAM GX Eagle T-Type'],
      ['BRAKES', 'SRAM Code RSC'],
      ['WHEELS', 'DT Swiss XM 1700'],
      ['TIRES', 'Maxxis Dissector/Rekon'],
    ],
    'LL-003': [
      ['FRAME', 'Carbon · DH-spec'],
      ['FORK', 'Fox 40 Factory 203'],
      ['SHOCK', 'Fox DHX2 Factory'],
      ['DRIVE', 'SRAM GX DH 7-speed'],
      ['BRAKES', 'SRAM Maven Ultimate'],
      ['WHEELS', 'Reserve DH'],
      ['TIRES', 'Maxxis Assegai DH'],
    ],
    'LL-004': [
      ['FRAME', 'Carbon · XC-race'],
      ['FORK', 'RockShox SID Ultimate 120'],
      ['SHOCK', 'RockShox SIDLuxe Ultimate'],
      ['DRIVE', 'SRAM XX SL T-Type'],
      ['BRAKES', 'SRAM Level Ultimate'],
      ['WHEELS', 'Reserve 25 XC'],
      ['TIRES', 'Maxxis Aspen ST'],
    ],
  };
  const getSpecs = (code) => SPECS[code] || [
    ['FRAME', 'Carbon front · Al rear'],
    ['FORK', 'Fox 36 Factory 140mm'],
    ['DRIVE', 'SRAM GX T-Type'],
    ['BRAKES', 'SRAM Code RSC'],
    ['WHEELS', 'DT Swiss XM 1700'],
  ];

  function PDPScreen({ bikeIdx, onAddToCart, onConfigure, onBack }) {
    const t = useTheme();
    const bike = BIKES[bikeIdx];
    const [size, setSize] = useState('L');
    const [frame, setFrame] = useState(24);
    const [auto, setAuto] = useState(false);
    const [dragging, setDragging] = useState(false);
    const viewerRef = useRef(null);
    const frameRef = useRef(24);
    frameRef.current = frame;

    // Auto-rotate
    useEffect(() => {
      if (!auto || dragging) return;
      const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES), 60);
      return () => clearInterval(id);
    }, [auto, dragging]);

    // Drag to spin — pointer captured on the viewer.
    const onPointerDown = (e) => {
      const el = viewerRef.current;
      if (!el) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      setDragging(true);
      setAuto(false);
      let lastX = e.clientX;
      let f = frameRef.current;
      const move = (ev) => {
        const dx = ev.clientX - lastX;
        lastX = ev.clientX;
        f = (f + dx * 0.22 + FRAMES * 4) % FRAMES;
        setFrame(Math.floor(f));
      };
      const up = (ev) => {
        try { el.releasePointerCapture(ev.pointerId); } catch (_) {}
        setDragging(false);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    };

    const views = [
      { label: 'SIDE',    frame: 0 },
      { label: 'FRONT',   frame: 18 },
      { label: 'REAR',    frame: 36 },
      { label: 'TOP',     frame: 54 },
      { label: 'COCKPIT', frame: 9 },
    ];
    const activeView = views.reduce((best, v) => {
      const d = Math.abs(((frame - v.frame + FRAMES) % FRAMES));
      const bd = Math.abs(((frame - best.frame + FRAMES) % FRAMES));
      return d < bd ? v : best;
    }, views[0]);

    const sizes = [['S','445'],['M','465'],['L','485'],['XL','505'],['XXL','525']];
    const specs = getSpecs(bike.code);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: '100%' }}>
        <div ref={viewerRef} onPointerDown={onPointerDown} style={{
          position: 'relative', borderRight: `1px solid ${t.line}`,
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none', userSelect: 'none',
        }}>
          {/* Frame-shifted background simulates rotation */}
          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${(frame - 24) * -3}px)`,
            transition: dragging ? 'none' : 'transform .12s linear',
          }}>
            <Stripe caption={`360° SPIN · FRAME ${String(frame).padStart(2,'0')}/${FRAMES}`} tone="dark" />
          </div>
          <Bracket corner="tl" size={20} />
          <Bracket corner="tr" size={20} />
          <Bracket corner="bl" size={20} />
          <Bracket corner="br" size={20} />

          {/* Back button */}
          <button onClick={onBack} style={{
            position: 'absolute', top: 20, left: 20,
            ...btnReset, color: t.cream, cursor: 'pointer',
            fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 0.6,
            padding: '6px 10px', border: '1px solid rgba(245,242,236,0.3)',
            background: 'rgba(14,14,12,0.4)', backdropFilter: 'blur(4px)',
          }}>← CATALOG</button>

          <div style={{
            position: 'absolute', top: 24, right: 20, color: t.cream,
            fontSize: 10, letterSpacing: 0.8, fontFamily: 'JetBrains Mono', textAlign: 'right',
          }}>
            <div>{bike.code} · {bike.name.toUpperCase()}</div>
            <div style={{ opacity: 0.7, marginTop: 2 }}>VIEW: 360° SPIN · F{String(frame).padStart(2,'0')}/{FRAMES}</div>
          </div>

          {/* Center crosshair */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
            <RegMark size={56} color="rgba(245,242,236,0.55)" />
          </div>

          {/* Bottom HUD */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(14,14,12,0.7)', padding: '10px 16px',
            border: `1px solid ${t.line}`, color: t.cream, fontSize: 11, letterSpacing: 0.6,
            fontFamily: 'JetBrains Mono', zIndex: 2,
          }}>
            <span>◀ DRAG TO SPIN ▶</span>
            <span style={{ width: 1, height: 14, background: 'rgba(245,242,236,0.3)' }} />
            <button onClick={(e) => { e.stopPropagation(); setFrame((f) => (f - 1 + FRAMES) % FRAMES); setAuto(false); }} style={{
              ...btnReset, color: t.cream, cursor: 'pointer', padding: '0 4px',
            }}>{'<'}</button>
            <button onClick={(e) => { e.stopPropagation(); setFrame((f) => (f + 1) % FRAMES); setAuto(false); }} style={{
              ...btnReset, color: t.cream, cursor: 'pointer', padding: '0 4px',
            }}>{'>'}</button>
            <span style={{ width: 1, height: 14, background: 'rgba(245,242,236,0.3)' }} />
            <button onClick={(e) => { e.stopPropagation(); setAuto((a) => !a); }} style={{
              ...btnReset, color: auto ? t.accent : t.cream, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 11, letterSpacing: 0.6,
            }}>● {auto ? 'AUTO ON' : 'AUTO OFF'}</button>
          </div>

          {/* Spin progress strip */}
          <div style={{
            position: 'absolute', bottom: 76, left: 24, right: 24,
            display: 'flex', gap: 2,
          }}>
            {Array.from({ length: FRAMES }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: i % 6 === 0 ? 10 : 6,
                background: i === frame ? t.accent : (i < frame ? 'rgba(245,242,236,0.6)' : 'rgba(245,242,236,0.2)'),
                transition: 'background .08s',
              }} />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div style={{ position: 'absolute', top: 70, right: 20, display: 'grid', gap: 6 }}>
            {views.map((v) => (
              <button key={v.label} onClick={(e) => { e.stopPropagation(); setFrame(v.frame); setAuto(false); }} style={{
                ...btnReset, width: 68, height: 46, position: 'relative', cursor: 'pointer',
                border: `1px solid ${activeView.label === v.label ? t.accent : 'rgba(245,242,236,0.25)'}`,
                transition: 'border-color .12s',
              }}>
                <Stripe caption={v.label} tone="dark" />
              </button>
            ))}
          </div>
        </div>

        {/* Right rail — spec sheet */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div style={{ padding: '28px 28px', borderBottom: `1px solid ${t.line}` }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 10, color: t.mute, fontFamily: 'JetBrains Mono', letterSpacing: 0.6,
            }}>
              <span>{bike.code} · {bike.tag.toUpperCase()}</span>
              <span style={{ color: bike.stock === 'IN STOCK' ? t.accent : t.mute }}>● {bike.stock}</span>
            </div>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 32,
              letterSpacing: -0.6, marginTop: 6,
            }}>{bike.name}</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, color: t.mute, marginTop: 8, lineHeight: 1.7 }}>
              {bike.tag}-tuned, {bike.travel} of travel. {bike.frame} construction.
              Shop-built before it ships.
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 20 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 30, fontWeight: 700 }}>${bike.price.toLocaleString()}</span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: t.mute }}>
                or ${Math.round(bike.price / 36)}/mo · 36 mo
              </span>
            </div>
          </div>

          <div style={{
            padding: '24px 28px', borderBottom: `1px solid ${t.line}`,
            fontSize: 13, fontFamily: 'Space Grotesk',
          }}>
            <div style={{ color: t.mute, marginBottom: 12, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>Size · mm reach</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
              {sizes.map(([s, v]) => (
                <button key={s} onClick={() => setSize(s)} style={{
                  ...btnReset, cursor: 'pointer', transition: 'all .12s',
                  border: `1px solid ${size === s ? t.accent : t.line}`,
                  background: size === s ? t.accent : 'transparent',
                  color: size === s ? '#0e0e0c' : t.ink,
                  padding: '10px 0', textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{s}</div>
                  <div style={{ fontSize: 9, opacity: 0.8 }}>{v}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '24px 28px', fontSize: 13, flex: 1, overflow: 'auto', fontFamily: 'Space Grotesk' }}>
            <div style={{ color: t.mute, marginBottom: 14, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>Specification</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {specs.map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  borderBottom: `1px solid ${t.line2}`, paddingBottom: 8,
                }}>
                  <span style={{ color: t.mute }}>{k}</span>
                  <span style={{ textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: '14px 24px', borderTop: `1px solid ${t.line}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
          }}>
            <button onClick={onConfigure} style={ctlBtn(t)}>BUILD / CONFIGURE</button>
            <button onClick={() => onAddToCart({
              code: bike.code, name: bike.name, tag: bike.tag,
              price: bike.price, size, qty: 1, build: 'STOCK',
            })} style={ctlBtn(t, true)}>ADD TO CART →</button>
          </div>
        </div>
      </div>
    );
  }

  window.MC.PDPScreen = PDPScreen;
})();
