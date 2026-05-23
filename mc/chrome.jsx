// Looseline · Mission Control · shared chrome + helpers for the interactive
// prototype. Exposes window.MC.* (Nav, Status, btnReset, ctlBtn, DRow).

(() => {
  const { useTheme, BIKES } = window;
  const { useState, useEffect } = React;

  const btnReset = {
    border: 'none', background: 'transparent', padding: 0, font: 'inherit', color: 'inherit',
  };

  const ctlBtn = (t, primary) => ({
    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: 0.2,
    padding: '13px 18px', textAlign: 'center',
    border: `1px solid ${primary ? t.accent : t.line}`,
    background: primary ? t.accent : 'transparent',
    color: primary ? '#0e0e0c' : t.ink,
    cursor: 'pointer', textTransform: 'uppercase',
    transition: 'all .12s',
  });

  function NavBar({ screen, cartCount, onNav }) {
    const t = useTheme();
    const items = [
      { id: 'plp',     label: 'Catalog' },
      { id: 'config',  label: 'Configurator' },
      { id: 'service', label: 'Service' },
      { id: 'riders',  label: 'Riders' },
      { id: 'journal', label: 'Journal' },
    ];
    return (
      <div style={{
        height: 64, borderBottom: `1px solid ${t.line}`, padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: 40, position: 'relative', zIndex: 5,
        background: t.bg, flexShrink: 0,
      }}>
        <button onClick={() => onNav('home')} style={{
          ...btnReset, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <rect x="1" y="1" width="20" height="20" fill="none" stroke={t.ink} strokeWidth="1.2" />
            <rect x="5" y="5" width="12" height="12" fill={t.accent} />
            <rect x="9" y="9" width="4" height="4" fill={t.bg} />
          </svg>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, letterSpacing: -0.3, color: t.ink }}>
            LOOSELINE<span style={{ color: t.accent }}>/</span>MTB
          </span>
        </button>
        <div style={{ display: 'flex', gap: 28 }}>
          {items.map((l) => {
            const active = screen === l.id || (screen === 'pdp' && l.id === 'plp');
            return (
              <button key={l.id} onClick={() => onNav(l.id)} style={{
                ...btnReset,
                color: active ? t.ink : t.mute,
                borderBottom: active ? `2px solid ${t.accent}` : '2px solid transparent',
                paddingBottom: 3, cursor: 'pointer',
                fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 13, letterSpacing: 0.2,
              }}>{l.label}</button>
            );
          })}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: t.mute, letterSpacing: 0.3, alignItems: 'center', fontFamily: 'Space Grotesk', fontWeight: 500 }}>
          <span>SEARCH /S</span>
          <span>ACCOUNT</span>
          <button onClick={() => onNav('cart')} style={{
            ...btnReset, cursor: 'pointer',
            color: cartCount > 0 ? t.accent : t.ink,
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 0.6,
          }}>
            CART · {String(cartCount).padStart(2, '0')}
            {cartCount > 0 && <span style={{ width: 6, height: 6, background: t.accent, borderRadius: 3 }} />}
          </button>
        </div>
      </div>
    );
  }

  function StatusBar({ status }) {
    const t = useTheme();
    const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-US', { hour12: false }));
    useEffect(() => {
      const i = setInterval(() => setTime(new Date().toLocaleTimeString('en-US', { hour12: false })), 1000);
      return () => clearInterval(i);
    }, []);
    return (
      <div style={{
        height: 36, borderTop: `1px solid ${t.line}`,
        display: 'flex', alignItems: 'center',
        padding: '0 32px', fontSize: 11, color: t.mute, letterSpacing: 0.3, gap: 28,
        background: t.bg, zIndex: 5, fontFamily: 'Space Grotesk', fontWeight: 500, flexShrink: 0,
      }}>
        <span style={{ color: t.accent }}>● LIVE</span>
        <span>SHOP/CHEHALIS-WA</span>
        <span>SYNC: {time} PDT</span>
        <div style={{ flex: 1 }} />
        {status && <span style={{ color: t.accent }}>{status}</span>}
        <span>BUILD v2.6.1</span>
        <span style={{ color: t.accent }}>BEST MTB BIKES EVER!</span>
      </div>
    );
  }

  function DRow({ k, v }) {
    const t = useTheme();
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${t.line2}`, paddingBottom: 10, fontFamily: 'Space Grotesk', fontSize: 13 }}>
        <span style={{ color: t.mute }}>{k}</span>
        <span>{v}</span>
      </div>
    );
  }

  // Tiny toast that auto-dismisses
  function Toast({ msg, onDone }) {
    const t = useTheme();
    useEffect(() => {
      if (!msg) return;
      const id = setTimeout(onDone, 2400);
      return () => clearTimeout(id);
    }, [msg, onDone]);
    if (!msg) return null;
    return (
      <div style={{
        position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
        background: t.accent, color: '#0e0e0c', padding: '10px 16px',
        fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 0.6, zIndex: 20,
        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
      }}>{msg}</div>
    );
  }

  window.MC = { NavBar, StatusBar, DRow, Toast, btnReset, ctlBtn };
})();
