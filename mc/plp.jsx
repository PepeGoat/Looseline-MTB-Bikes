// Looseline Mission Control · Catalog (PLP) screen
// Live filtering by discipline / travel / frame.

(() => {
  const { useTheme, Stripe, Bracket, BIKES } = window;
  const { btnReset } = window.MC;
  const { useMemo } = React;

  const TRAVEL_BUCKETS = {
    '100–130': (b) => parseInt(b.travel) <= 130,
    '130–160': (b) => { const v = parseInt(b.travel); return v >= 130 && v <= 160; },
    '160–180': (b) => { const v = parseInt(b.travel); return v > 160 && v <= 180; },
    '180–220': (b) => parseInt(b.travel) > 180,
  };
  const DISCIPLINE_TO_TAG = {
    'Enduro': 'Enduro', 'Trail': 'Trail', 'Downhill': 'Downhill',
    'Cross-Country': 'Cross-Country', 'Freeride': 'Freeride',
  };

  function PLPScreen({ onSelectBike, filters, setFilters }) {
    const t = useTheme();
    const visible = useMemo(() => BIKES.filter((b) => {
      if (filters.discipline.size && !filters.discipline.has(b.tag)) return false;
      if (filters.travel.size && ![...filters.travel].some((k) => TRAVEL_BUCKETS[k](b))) return false;
      if (filters.frame.size && ![...filters.frame].some((f) => b.frame.startsWith(f))) return false;
      return true;
    }), [filters]);

    const toggleFilter = (group, val) => {
      setFilters((f) => {
        const next = new Set(f[group]);
        if (next.has(val)) next.delete(val); else next.add(val);
        return { ...f, [group]: next };
      });
    };
    const resetFilters = () => setFilters({
      discipline: new Set(), travel: new Set(), frame: new Set(),
    });

    const activeCount = filters.discipline.size + filters.travel.size + filters.frame.size;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: '100%' }}>
        {/* Filter rail */}
        <div style={{
          borderRight: `1px solid ${t.line}`, padding: '32px 24px',
          fontSize: 13, fontFamily: 'Space Grotesk', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: t.mute }}>FILTERS</span>
            <button onClick={resetFilters} style={{
              ...btnReset, color: activeCount ? t.accent : t.mute, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13,
            }}>
              {activeCount ? `${activeCount} ACTIVE ×` : 'RESET'}
            </button>
          </div>
          <FilterGrp title="DISCIPLINE" items={Object.keys(DISCIPLINE_TO_TAG)}
            selected={filters.discipline} onToggle={(v) => toggleFilter('discipline', DISCIPLINE_TO_TAG[v])}
            isOn={(v) => filters.discipline.has(DISCIPLINE_TO_TAG[v])} />
          <FilterGrp title="TRAVEL · MM" items={Object.keys(TRAVEL_BUCKETS)}
            selected={filters.travel} onToggle={(v) => toggleFilter('travel', v)}
            isOn={(v) => filters.travel.has(v)} />
          <FilterGrp title="FRAME" items={['Carbon', 'Aluminum', 'Steel']}
            selected={filters.frame} onToggle={(v) => toggleFilter('frame', v)}
            isOn={(v) => filters.frame.has(v)} />
        </div>

        {/* Grid */}
        <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 24px', borderBottom: `1px solid ${t.line}`,
            fontSize: 11, color: t.mute, fontFamily: 'JetBrains Mono',
            position: 'sticky', top: 0, background: t.bg, zIndex: 2,
          }}>
            <span>CATALOG · {String(visible.length).padStart(2, '0')} / {String(BIKES.length).padStart(2, '0')} SHOWN</span>
            <span>SORT: TRAVEL ↓ &nbsp;·&nbsp; VIEW: GRID ▢</span>
          </div>
          {visible.length === 0 ? (
            <div style={{
              padding: 80, textAlign: 'center', color: t.mute,
              fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: 0.6,
            }}>
              <div>[ NO BIKES MATCH ]</div>
              <button onClick={resetFilters} style={{
                ...btnReset, marginTop: 16, color: t.accent, cursor: 'pointer',
                textDecoration: 'underline', textUnderlineOffset: 4,
              }}>↳ CLEAR FILTERS</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {visible.map((b, i) => (
                <button key={b.code} onClick={() => onSelectBike(BIKES.indexOf(b))} style={{
                  ...btnReset, textAlign: 'left',
                  borderRight: (i % 3) < 2 ? `1px solid ${t.line}` : 'none',
                  borderBottom: `1px solid ${t.line}`,
                  padding: 28, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
                  cursor: 'pointer', minHeight: 340, transition: 'background .12s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(217,255,58,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <Bracket corner="tl" size={10} color={t.mute} />
                  <Bracket corner="br" size={10} color={t.mute} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.mute, fontFamily: 'JetBrains Mono', letterSpacing: 0.6 }}>
                    <span>{b.code}</span>
                    <span>{b.tag.toUpperCase()}</span>
                  </div>
                  <div style={{ height: 150, position: 'relative' }}>
                    <Stripe caption={b.name.toUpperCase()} tone={i === 0 ? 'lime' : i === 2 ? 'cream' : 'dark'} />
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, letterSpacing: -0.4 }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: t.mute, lineHeight: 1.8, fontFamily: 'Space Grotesk' }}>
                    {b.travel} · {b.weight} · {b.frame}
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700 }}>${b.price.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: b.stock === 'IN STOCK' ? t.accent : t.mute, fontFamily: 'Space Grotesk', fontWeight: 600 }}>● {b.stock}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function FilterGrp({ title, items, onToggle, isOn }) {
    const t = useTheme();
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: t.mute, marginBottom: 12, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>{title}</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {items.map((label) => {
            const on = isOn(label);
            return (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={on} onChange={() => onToggle(label)} style={{ display: 'none' }} />
                <span style={{
                  width: 12, height: 12, border: `1px solid ${on ? t.accent : t.line}`,
                  background: on ? t.accent : 'transparent', transition: 'all .12s',
                }} />
                <span style={{ color: on ? t.ink : t.mute }}>{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  window.MC.PLPScreen = PLPScreen;
})();
