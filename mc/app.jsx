// Looseline Mission Control · App shell + simple router.
// Owns: current screen, selected bike, cart state, filters.

(() => {
  const { useTheme, Stripe, Bracket, BIKES } = window;
  const {
    NavBar, StatusBar, Toast,
    HomeScreen, PLPScreen, PDPScreen, ConfigScreen, CartScreen,
    btnReset, ctlBtn,
  } = window.MC;
  const { useState, useCallback } = React;

  function ComingSoon({ label, subtitle, onBack }) {
    const t = useTheme();
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 18, padding: 40,
        fontFamily: 'JetBrains Mono', color: t.mute, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: t.accent }}>[ {label.toUpperCase()} · SOON ]</div>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 600, color: t.ink, letterSpacing: -0.6 }}>
          {subtitle}
        </div>
        <button onClick={onBack} style={ctlBtn(t)}>← BACK TO CATALOG</button>
      </div>
    );
  }

  function App() {
    const t = useTheme();
    const [screen, setScreen] = useState('home');
    const [bikeIdx, setBikeIdx] = useState(0);
    const [cart, setCart] = useState([]);
    const [filters, setFilters] = useState({
      discipline: new Set(),
      travel: new Set(),
      frame: new Set(),
    });
    const [toast, setToast] = useState(null);
    const [history, setHistory] = useState(['home']);

    const navigate = useCallback((next) => {
      setScreen(next);
      setHistory((h) => [...h, next]);
    }, []);
    const goBack = useCallback(() => {
      setHistory((h) => {
        if (h.length <= 1) return h;
        const trimmed = h.slice(0, -1);
        setScreen(trimmed[trimmed.length - 1]);
        return trimmed;
      });
    }, []);

    const selectBike = (idx) => { setBikeIdx(idx); navigate('pdp'); };

    const addToCart = (line) => {
      const id = `${line.code}-${line.size}-${Date.now()}`;
      setCart((c) => [...c, { ...line, id }]);
      setToast(`✓ ${line.name} added to cart`);
      setTimeout(() => navigate('cart'), 500);
    };
    const updateQty = (id, qty) => {
      if (qty <= 0) return setCart((c) => c.filter((it) => it.id !== id));
      setCart((c) => c.map((it) => (it.id === id ? { ...it, qty } : it)));
    };
    const removeItem = (id) => setCart((c) => c.filter((it) => it.id !== id));

    const screenStatus = {
      home:    'HOME · CHEHALIS, WA',
      plp:     'CATALOG · BROWSING',
      pdp:     `INSPECTING · ${BIKES[bikeIdx].code}`,
      config:  'BUILD MODE',
      cart:    `CART · ${cart.length} ITEM(S)`,
    }[screen];

    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        background: t.bg, color: t.ink, fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        overflow: 'hidden',
      }}>
        <NavBar screen={screen} cartCount={cart.length} onNav={navigate} />
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* dotted grid bg layer for all screens */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.45,
            backgroundImage: `radial-gradient(${t.line2} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }} />
          <div style={{ position: 'absolute', inset: 0 }}>
            {screen === 'home'    && <HomeScreen   onNav={navigate} onSelectBike={selectBike} />}
            {screen === 'plp'     && <PLPScreen    onSelectBike={selectBike} filters={filters} setFilters={setFilters} />}
            {screen === 'pdp'     && <PDPScreen    bikeIdx={bikeIdx} onAddToCart={addToCart} onConfigure={() => navigate('config')} onBack={() => navigate('plp')} />}
            {screen === 'config'  && <ConfigScreen bikeIdx={bikeIdx} onAddToCart={addToCart} />}
            {screen === 'cart'    && <CartScreen   items={cart} onUpdateQty={updateQty} onRemove={removeItem} onContinueShopping={navigate} />}
            {screen === 'service' && <ComingSoon   label="Service"  subtitle="Book a tune-up · 3-day queue."           onBack={() => navigate('plp')} />}
            {screen === 'riders'  && <ComingSoon   label="Riders"   subtitle="Looseline's race + ambassador roster."    onBack={() => navigate('plp')} />}
            {screen === 'journal' && <ComingSoon   label="Journal"  subtitle="Trail reports, build diaries, ride logs." onBack={() => navigate('plp')} />}
          </div>
          <Toast msg={toast} onDone={() => setToast(null)} />
        </div>
        <StatusBar status={screenStatus} />
      </div>
    );
  }

  window.MC.App = App;
})();
