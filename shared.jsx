// Shared building blocks used across all three Looseline MTB variations.
// Visual atoms: striped image placeholders, corner brackets, registration
// marks, mono labels, dimension lines. Plus the LightMode context wired to
// the Tweaks panel so every artboard inverts together.

const LightCtx = React.createContext(false);
const useLight = () => React.useContext(LightCtx);

// Diagonal-stripe placeholder. `caption` is the mono label drawn over it.
// `tone` switches between three flavors so we don't have one stripe-look
// for every shot.
function Stripe({ caption = 'PRODUCT SHOT', tone = 'dark', style, children }) {
  const light = useLight();
  const palettes = {
    dark:  light ? ['#1a1a17', '#2a2a25'] : ['#1a1a17', '#26261f'],
    cream: light ? ['#e8e2d4', '#dbd5c5'] : ['#1f1f1a', '#2a2a23'],
    lime:  light ? ['#c8e02f', '#b3ca28'] : ['#3a4710', '#42500e'],
  };
  const [a, b] = palettes[tone];
  const fg = tone === 'lime' ? (light ? '#1a1a17' : '#0e0e0c')
           : tone === 'cream' ? (light ? '#5a5448' : '#a8a292')
           : (light ? '#a8a292' : '#5a5448');
  const bg = `repeating-linear-gradient(135deg, ${a} 0 14px, ${b} 14px 28px)`;
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: bg, overflow: 'hidden', ...style,
    }}>
      {children}
      <div style={{
        position: 'absolute', left: 12, bottom: 10, color: fg,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: 0.6, textTransform: 'uppercase', opacity: 0.85,
      }}>[ {caption} ]</div>
    </div>
  );
}

// L-shaped corner bracket — drop into a `position:relative` container.
function Bracket({ corner = 'tl', size = 14, color, thickness = 1.4 }) {
  const c = color || (useLight() ? '#0e0e0c' : '#f5f2ec');
  const map = {
    tl: { top: 0, left: 0,  bT: thickness, bL: thickness },
    tr: { top: 0, right: 0, bT: thickness, bR: thickness },
    bl: { bottom: 0, left: 0,  bB: thickness, bL: thickness },
    br: { bottom: 0, right: 0, bB: thickness, bR: thickness },
  }[corner];
  return (
    <div style={{
      position: 'absolute', width: size, height: size,
      borderColor: c,
      borderTopWidth: map.bT || 0, borderBottomWidth: map.bB || 0,
      borderLeftWidth: map.bL || 0, borderRightWidth: map.bR || 0,
      borderStyle: 'solid',
      top: map.top, left: map.left, right: map.right, bottom: map.bottom,
      pointerEvents: 'none',
    }} />
  );
}

// Registration / crosshair mark (printer's mark).
function RegMark({ size = 16, color }) {
  const c = color || (useLight() ? '#0e0e0c' : '#f5f2ec');
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ display: 'block' }}>
      <circle cx="8" cy="8" r="5" fill="none" stroke={c} strokeWidth="1" />
      <line x1="8" y1="0" x2="8" y2="16" stroke={c} strokeWidth="0.8" />
      <line x1="0" y1="8" x2="16" y2="8" stroke={c} strokeWidth="0.8" />
    </svg>
  );
}

// Numbered marker, e.g. [01].
function Idx({ n, prefix = '', color, style }) {
  const c = color || (useLight() ? '#0e0e0c' : '#f5f2ec');
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11, letterSpacing: 0.6, color: c,
      ...style,
    }}>{prefix}[{String(n).padStart(2, '0')}]</span>
  );
}

// Top‑down dimension line with caption: ←——— 27.5″ ———→
function DimLine({ label, color, length = '100%' }) {
  const c = color || (useLight() ? '#0e0e0c' : '#f5f2ec');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, color: c, width: length,
      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 0.5,
    }}>
      <span>◀</span>
      <span style={{ flex: 1, height: 1, background: c }} />
      <span>{label}</span>
      <span style={{ flex: 1, height: 1, background: c }} />
      <span>▶</span>
    </div>
  );
}

// Faint dotted grid background — drop into any container.
function GridBg({ size = 24, color, opacity = 0.5 }) {
  const c = color || (useLight() ? 'rgba(14,14,12,0.08)' : 'rgba(245,242,236,0.08)');
  return (
    <div style={{
      position: 'absolute', inset: 0, opacity, pointerEvents: 'none',
      backgroundImage: `radial-gradient(${c} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
    }} />
  );
}

// Catalog used by all variations — same bikes, different layouts.
const BIKES = [
  { code: 'LL-001', name: 'Descender 170',   tag: 'Enduro',        price: 6420, travel: '170/165mm', weight: '14.9 kg', frame: 'Carbon', wheels: '29/27.5"', stock: 'IN STOCK' },
  { code: 'LL-002', name: 'Trailbreak 140',  tag: 'Trail',         price: 4880, travel: '150/140mm', weight: '13.4 kg', frame: 'Aluminum 6066', wheels: '29"', stock: 'IN STOCK' },
  { code: 'LL-003', name: 'Plummet DH',      tag: 'Downhill',      price: 7950, travel: '203/200mm', weight: '16.1 kg', frame: 'Carbon', wheels: '29/27.5"', stock: 'PREORDER' },
  { code: 'LL-004', name: 'Loamline XC',     tag: 'Cross-Country', price: 3690, travel: '120/115mm', weight: '11.2 kg', frame: 'Carbon', wheels: '29"', stock: 'IN STOCK' },
  { code: 'LL-005', name: 'Switchback 130',  tag: 'Trail',         price: 4220, travel: '140/130mm', weight: '12.8 kg', frame: 'Aluminum 6066', wheels: '29"', stock: 'IN STOCK' },
  { code: 'LL-006', name: 'Rampage 165',     tag: 'Freeride',      price: 5780, travel: '180/170mm', weight: '15.2 kg', frame: 'Steel 4130', wheels: '27.5"', stock: 'LOW STOCK' },
];

const COLORS = {
  bg: '#0e0e0c',
  bgLight: '#f4efe6',
  ink: '#f5f2ec',
  inkLight: '#0e0e0c',
  mute: '#7a7468',
  muteLight: '#8a8475',
  panel: '#16161310',
  panelLight: '#0e0e0c08',
  lime: '#d9ff3a',
  cream: '#f5f2ec',
};

// Resolve fg/bg/etc against current mode.
function useTheme() {
  const light = useLight();
  return {
    bg:   light ? COLORS.bgLight   : COLORS.bg,
    ink:  light ? COLORS.inkLight  : COLORS.ink,
    mute: light ? COLORS.muteLight : COLORS.mute,
    panel: light ? COLORS.panelLight : COLORS.panel,
    line: light ? 'rgba(14,14,12,0.18)' : 'rgba(245,242,236,0.16)',
    line2: light ? 'rgba(14,14,12,0.08)' : 'rgba(245,242,236,0.08)',
    accent: COLORS.lime,
    cream: COLORS.cream,
    inkLight: COLORS.inkLight,
    light,
  };
}

Object.assign(window, {
  LightCtx, useLight, useTheme,
  Stripe, Bracket, RegMark, Idx, DimLine, GridBg,
  BIKES, COLORS,
});
