// Looseline Mission Control · Configurator
// 6 steps: Size → Color → Drive → Wheels → Cockpit → Personalize
// Each step accumulates options into the build; total updates live.

(() => {
  const { useTheme, Stripe, Bracket, Idx, BIKES } = window;
  const { btnReset, ctlBtn } = window.MC;
  const { useState } = React;

  const STEPS = [
    {
      id: 'size', label: 'Frame size',
      opts: [
        { k: 'S',   sub: '445 reach', d: 0 },
        { k: 'M',   sub: '465 reach', d: 0 },
        { k: 'L',   sub: '485 reach', d: 0, on: true },
        { k: 'XL',  sub: '505 reach', d: 0 },
        { k: 'XXL', sub: '525 reach', d: 0 },
      ],
    },
    {
      id: 'color', label: 'Colorway',
      opts: [
        { k: 'Limeflake', sub: 'Lime / matte black', swatch: '#d9ff3a', d: 0, on: true },
        { k: 'Stealth',   sub: 'Matte black-on-black', swatch: '#1a1a17', d: 0 },
        { k: 'Bone',      sub: 'Gloss cream / silver', swatch: '#c8c0ad', d: 0 },
        { k: 'Clay',      sub: 'Burnt clay / black', swatch: '#c1431f', d: 0 },
      ],
    },
    {
      id: 'drive', label: 'Drivetrain',
      opts: [
        { k: 'SRAM X0 T-Type',    sub: 'Wireless · 12sp · 10–52t', d: 0, on: true },
        { k: 'SRAM XX SL T-Type', sub: 'Carbon · race-spec',       d: 820 },
        { k: 'Shimano XT M8200',  sub: 'Mechanical · proven',      d: -240 },
      ],
    },
    {
      id: 'wheels', label: 'Wheels',
      opts: [
        { k: 'Reserve 30 HD',    sub: 'Carbon · DT 350 hub',   d: 0, on: true },
        { k: 'DT Swiss XM 1700', sub: 'Alloy · 30mm internal', d: -380 },
        { k: 'Reserve 31 SL',    sub: 'Lightweight carbon',    d: 540 },
      ],
    },
    {
      id: 'cockpit', label: 'Cockpit',
      opts: [
        { k: 'OneUp 35mm carbon', sub: '800mm · 35 rise', d: 0, on: true },
        { k: 'OneUp 35mm alloy',  sub: '800mm · 35 rise', d: -120 },
        { k: 'Renthal Fatbar',    sub: '800mm · 30 rise', d: 60 },
      ],
    },
    {
      id: 'personalize', label: 'Personalize',
      opts: [
        { k: 'No engraving', sub: 'Skip',                d: 0, on: true },
        { k: 'Rider name',   sub: 'Top tube · 16ch max', d: 80 },
        { k: 'Coordinates',  sub: 'Top tube · lat/long', d: 80 },
      ],
    },
  ];

  const DEFAULT_PICKS = Object.fromEntries(
    STEPS.map((s) => [s.id, s.opts.find((o) => o.on)?.k || s.opts[0].k])
  );

  function ConfigScreen({ onAddToCart, bikeIdx = 0 }) {
    const t = useTheme();
    const base = BIKES[bikeIdx];
    const [picks, setPicks] = useState(DEFAULT_PICKS);
    const [active, setActive] = useState(2);

    const pickedOpt = (sid) => STEPS.find((s) => s.id === sid).opts.find((o) => o.k === picks[sid]);
    const total = base.price + STEPS.reduce((sum, s) => sum + pickedOpt(s.id).d, 0);
    const completedSteps = STEPS.filter((s) => picks[s.id] !== DEFAULT_PICKS[s.id]).length;
    const progress = Math.max(2, completedSteps) / STEPS.length;
    const currentStep = STEPS[active];

    const setPick = (sid, k) => setPicks((p) => ({ ...p, [sid]: k }));
    const next = () => setActive((a) => Math.min(STEPS.length - 1, a + 1));
    const prev = () => setActive((a) => Math.max(0, a - 1));

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', height: '100%' }}>
        {/* Left: live preview canvas */}
        <div style={{ position: 'relative', borderRight: `1px solid ${t.line}` }}>
          <Stripe caption={`LIVE PREVIEW · ${base.name.toUpperCase()} / ${picks.color.toUpperCase()} / ${picks.size}`} tone="dark" />
          <Bracket corner="tl" size={20} />
          <Bracket corner="tr" size={20} />
          <Bracket corner="bl" size={20} />
          <Bracket corner="br" size={20} />

          <div style={{
            position: 'absolute', top: 24, left: 24, color: t.cream,
            fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 0.8,
          }}>
            <Idx n={1} color={t.cream} /> &nbsp;BUILD #LL-001-X742 · {currentStep.label.toUpperCase()}
          </div>

          {/* Color chip strip */}
          <div style={{
            position: 'absolute', top: 24, right: 24,
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'JetBrains Mono', fontSize: 10, color: t.cream, letterSpacing: 0.6,
          }}>
            COLOR
            <span style={{
              width: 28, height: 28,
              background: STEPS[1].opts.find((o) => o.k === picks.color).swatch,
              border: '1px solid rgba(245,242,236,0.4)',
            }} />
          </div>

          {/* Geometry footer */}
          <div style={{
            position: 'absolute', bottom: 24, left: 24, right: 24,
            display: 'flex', gap: 28, color: t.cream, fontSize: 10, fontFamily: 'JetBrains Mono',
            background: 'rgba(14,14,12,0.55)', padding: '12px 16px', backdropFilter: 'blur(4px)',
            border: '1px solid rgba(245,242,236,0.18)',
          }}>
            {[
              ['REACH', { S: '445', M: '465', L: '485', XL: '505', XXL: '525' }[picks.size]],
              ['STACK', '630'],
              ['HTA',   '63.5°'],
              ['STA',   '77°'],
              ['CS',    '440'],
              ['BB',    '348'],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ opacity: 0.6, letterSpacing: 0.8 }}>{k}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: steps */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.line}` }}>
            <div style={{ fontSize: 10, color: t.mute, letterSpacing: 0.8, fontFamily: 'JetBrains Mono' }}>CONFIGURE</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 600, letterSpacing: -0.3 }}>
              {base.name} · Build
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 4 }}>
              {STEPS.map((s, i) => (
                <div key={s.id} style={{
                  flex: 1, height: 3,
                  background: i <= active ? t.accent : t.line,
                }} />
              ))}
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.mute, fontFamily: 'JetBrains Mono' }}>
              <span>STEP {active + 1} / {STEPS.length}</span>
              <span>BUILD COMPLETE {Math.round(progress * 100)}%</span>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', fontSize: 11 }}>
            {STEPS.map((s, i) => {
              const sel = pickedOpt(s.id);
              const isActive = i === active;
              const isPast = i < active;
              return (
                <div key={s.id} style={{
                  padding: '14px 24px',
                  borderBottom: `1px solid ${t.line}`,
                  background: isActive ? 'rgba(217,255,58,0.04)' : 'transparent',
                  cursor: isActive ? 'default' : 'pointer',
                }} onClick={() => !isActive && setActive(i)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 18, height: 18, border: `1px solid ${isPast ? t.accent : t.ink}`,
                        background: isPast ? t.accent : 'transparent',
                        color: isPast ? '#0e0e0c' : t.ink,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono',
                      }}>{isPast ? '✓' : i + 1}</span>
                      <span style={{
                        color: isActive ? t.ink : (isPast ? t.ink : t.mute), fontSize: 12,
                        textTransform: 'uppercase', letterSpacing: 0.4, fontFamily: 'JetBrains Mono',
                      }}>{s.label}</span>
                    </span>
                    <span style={{ fontSize: 10, color: t.mute, fontFamily: 'JetBrains Mono' }}>
                      {isActive ? '—' : sel.k}{sel.d ? `  (${sel.d > 0 ? '+' : ''}${sel.d})` : ''}
                    </span>
                  </div>

                  {isActive && (
                    <div style={{ display: 'grid', gap: 6, marginTop: 12 }}>
                      {s.id === 'size' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                          {s.opts.map((o) => {
                            const on = picks.size === o.k;
                            return (
                              <button key={o.k} onClick={() => setPick('size', o.k)} style={{
                                ...btnReset, cursor: 'pointer', padding: '12px 0', textAlign: 'center',
                                border: `1px solid ${on ? t.accent : t.line}`,
                                background: on ? t.accent : 'transparent',
                                color: on ? '#0e0e0c' : t.ink, transition: 'all .12s',
                              }}>
                                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13 }}>{o.k}</div>
                                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, opacity: 0.8 }}>{o.sub.split(' ')[0]}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {s.id === 'color' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                          {s.opts.map((o) => {
                            const on = picks.color === o.k;
                            return (
                              <button key={o.k} onClick={() => setPick('color', o.k)} style={{
                                ...btnReset, cursor: 'pointer', textAlign: 'left',
                              }}>
                                <div style={{
                                  height: 40, background: o.swatch,
                                  border: `1px solid ${on ? t.accent : t.line}`,
                                  outline: on ? `2px solid ${t.accent}` : 'none', outlineOffset: 2,
                                  transition: 'all .12s',
                                }} />
                                <div style={{
                                  fontSize: 9, color: on ? t.ink : t.mute, marginTop: 6,
                                  letterSpacing: 0.6, fontFamily: 'JetBrains Mono',
                                }}>{o.k.toUpperCase()}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {!['size', 'color'].includes(s.id) && s.opts.map((o) => {
                        const on = picks[s.id] === o.k;
                        return (
                          <button key={o.k} onClick={() => setPick(s.id, o.k)} style={{
                            ...btnReset, cursor: 'pointer', textAlign: 'left',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            border: `1px solid ${on ? t.accent : t.line}`,
                            padding: '12px 14px',
                            background: on ? 'rgba(217,255,58,0.08)' : 'transparent',
                            transition: 'all .12s',
                          }}>
                            <div>
                              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: t.ink }}>{o.k}</div>
                              <div style={{ fontSize: 10, color: t.mute, marginTop: 2, fontFamily: 'JetBrains Mono', letterSpacing: 0.4 }}>{o.sub}</div>
                            </div>
                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: on ? t.accent : t.mute }}>
                              {o.d === 0 ? '+$0' : (o.d > 0 ? `+$${o.d}` : `−$${Math.abs(o.d)}`)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer: total + next/prev */}
          <div style={{
            borderTop: `1px solid ${t.line}`, padding: '14px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 10, color: t.mute, fontFamily: 'JetBrains Mono', letterSpacing: 0.6 }}>RUNNING TOTAL</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 22 }}>${total.toLocaleString()}</div>
            </div>
            {active < STEPS.length - 1 ? (
              <div style={{ display: 'flex', gap: 6 }}>
                {active > 0 && (
                  <button onClick={prev} style={ctlBtn(t)}>← BACK</button>
                )}
                <button onClick={next} style={ctlBtn(t, true)}>
                  NEXT: {STEPS[active + 1].label.toUpperCase()} →
                </button>
              </div>
            ) : (
              <button onClick={() => onAddToCart({
                code: `${base.code}-X742`, name: `${base.name} · Custom`, tag: base.tag,
                price: total, size: picks.size, qty: 1,
                build: `${picks.color} · ${picks.drive} · ${picks.wheels}`,
              })} style={ctlBtn(t, true)}>ADD BUILD TO CART →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  window.MC.ConfigScreen = ConfigScreen;
})();
