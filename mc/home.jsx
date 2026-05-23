// Looseline Mission Control · Home screen

(() => {
  const { useTheme, Stripe, Bracket, RegMark, Idx, BIKES } = window;
  const { btnReset, ctlBtn, DRow } = window.MC;

  function HomeScreen({ onNav, onSelectBike }) {
    const t = useTheme();
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: '100%' }}>
        <div style={{ borderRight: `1px solid ${t.line}`, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 36, overflow: 'auto' }}>
          <div>
            <Idx n={1} style={{ color: t.mute }} />
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, marginTop: 6, color: t.mute, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Current Transmission
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 36, lineHeight: 1.1, marginTop: 14, letterSpacing: -0.8 }}>
              Built for the descent. <span style={{ color: t.accent }}>Tuned for the line.</span>
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, color: t.mute, marginTop: 16, lineHeight: 1.7 }}>
              Six builds, hand-tuned in Chehalis. Every Looseline is measured,
              fitted, and shop-built before it ships.
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${t.line}`, paddingTop: 20, display: 'grid', gap: 14, fontSize: 13 }}>
            <DRow k="ORIGIN" v="CHEHALIS, WA" />
            <DRow k="SHOP HRS" v="MON–SAT · 10–18" />
            <DRow k="SERVICE QUEUE" v="3 DAYS" />
            <DRow k="DEMOS BOOKED" v="14 / WK" />
          </div>
          <div style={{ marginTop: 'auto', display: 'grid', gap: 10 }}>
            <button onClick={() => onNav('plp')} style={ctlBtn(t, true)}>BROWSE CATALOG →</button>
            <button onClick={() => onNav('config')} style={ctlBtn(t)}>CONFIGURE A BIKE</button>
            <button onClick={() => onNav('service')} style={ctlBtn(t)}>BOOK A SERVICE</button>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateRows: '1fr 240px' }}>
          <button onClick={() => onSelectBike(0)} style={{
            ...btnReset, position: 'relative', borderBottom: `1px solid ${t.line}`,
            cursor: 'pointer', overflow: 'hidden', textAlign: 'left', width: '100%',
          }}>
            <Stripe caption="HERO · DESCENDER 170 IN CHEHALIS LOAM" tone="dark" />
            <Bracket corner="tl" size={18} />
            <Bracket corner="tr" size={18} />
            <Bracket corner="bl" size={18} />
            <Bracket corner="br" size={18} />
            <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.cream, letterSpacing: 0.8, fontFamily: 'JetBrains Mono' }}>
              <span>FRAME · LL-001 · DESCENDER 170</span>
              <span>47°N 122°W · 02:18 LAP</span>
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: t.cream, fontFamily: 'JetBrains Mono' }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 1, opacity: 0.7 }}>FROM</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 600, letterSpacing: -0.6 }}>$6,420</div>
              </div>
              <RegMark size={20} color={t.cream} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, letterSpacing: 1, opacity: 0.7 }}>TRAVEL</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 600, letterSpacing: -0.6 }}>170mm</div>
              </div>
            </div>
            <div style={{
              position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)',
              fontSize: 10, color: t.cream, letterSpacing: 1, fontFamily: 'JetBrains Mono', opacity: 0.7,
              padding: '4px 10px', border: '1px dashed rgba(245,242,236,0.4)',
            }}>↳ CLICK TO INSPECT</div>
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {BIKES.slice(0, 3).map((b, i) => (
              <button key={b.code} onClick={() => onSelectBike(i)} style={{
                ...btnReset, textAlign: 'left',
                borderRight: i < 2 ? `1px solid ${t.line}` : 'none',
                padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative',
                cursor: 'pointer', transition: 'background .12s', height: '100%',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(217,255,58,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.mute, fontFamily: 'JetBrains Mono', letterSpacing: 0.6 }}>
                  <span>{b.code}</span>
                  <span style={{ color: b.stock === 'IN STOCK' ? t.accent : t.mute }}>● {b.stock}</span>
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>{b.name}</div>
                <div style={{ height: 70, position: 'relative' }}>
                  <Stripe caption={b.tag.toUpperCase()} tone={i === 0 ? 'lime' : 'dark'} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'JetBrains Mono' }}>
                  <span style={{ fontSize: 10, color: t.mute }}>{b.travel}</span>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600 }}>${b.price.toLocaleString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  window.MC.HomeScreen = HomeScreen;
})();
