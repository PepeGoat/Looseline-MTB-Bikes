// Looseline Mission Control · Cart screen
// Real qty stepper, remove, live totals, service-plan toggle.

(() => {
  const { useTheme, Stripe, Bracket } = window;
  const { btnReset, ctlBtn } = window.MC;
  const { useState } = React;

  function CartScreen({ items, onUpdateQty, onRemove, onContinueShopping }) {
    const t = useTheme();
    const [servicePlan, setServicePlan] = useState(false);

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const planCost = servicePlan ? 190 : 0;
    const shipping = items.length > 0 ? 84 : 0;
    const tax = Math.round((subtotal + planCost) * 0.0825);
    const total = subtotal + planCost + shipping + tax;

    if (items.length === 0) {
      return (
        <div style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 18,
          fontFamily: 'JetBrains Mono', color: t.mute, padding: 40,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 1 }}>[ CART · EMPTY ]</div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 600, color: t.ink, letterSpacing: -0.6 }}>
            No builds queued.
          </div>
          <div style={{ fontSize: 12, maxWidth: 420, textAlign: 'center', lineHeight: 1.6 }}>
            Pick a stock build from the catalog, or spec your own in the
            configurator. Every Looseline is shop-built in Chehalis before it ships.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => onContinueShopping('plp')} style={ctlBtn(t, true)}>BROWSE CATALOG →</button>
            <button onClick={() => onContinueShopping('config')} style={ctlBtn(t)}>CONFIGURE A BIKE</button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', height: '100%' }}>
        {/* Lines */}
        <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '32px 32px', borderBottom: `1px solid ${t.line}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            position: 'sticky', top: 0, background: t.bg, zIndex: 2,
          }}>
            <div>
              <div style={{ fontSize: 10, color: t.mute, letterSpacing: 0.8, fontFamily: 'JetBrains Mono' }}>CART · TRANSMISSION</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
                {items.length} {items.length === 1 ? 'build' : 'builds'} queued
              </div>
            </div>
            <div style={{ fontSize: 11, color: t.mute, fontFamily: 'JetBrains Mono' }}>EST. SHIP · 14 BUSINESS DAYS</div>
          </div>

          {items.map((it) => (
            <CartLine key={it.id} item={it} onQty={(q) => onUpdateQty(it.id, q)} onRemove={() => onRemove(it.id)} />
          ))}

          <button onClick={() => setServicePlan((s) => !s)} style={{
            ...btnReset, cursor: 'pointer', textAlign: 'left',
            padding: '18px 28px', display: 'flex', gap: 12, alignItems: 'center',
            borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`,
            background: servicePlan ? 'rgba(217,255,58,0.04)' : 'transparent',
            transition: 'background .12s',
          }}>
            <span style={{
              width: 16, height: 16, border: `1px solid ${servicePlan ? t.accent : t.line}`,
              background: servicePlan ? t.accent : 'transparent', transition: 'all .12s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0e0e0c', fontSize: 10, fontWeight: 700,
            }}>{servicePlan ? '✓' : ''}</span>
            <div style={{ flex: 1, fontSize: 13, color: t.mute, fontFamily: 'Space Grotesk', lineHeight: 1.6 }}>
              ANNUAL SERVICE PLAN — full tune-up, parts at cost, free flats.
              <span style={{ color: t.accent, marginLeft: 8 }}>+ $190 / YR</span>
            </div>
            <span style={{
              fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 0.6,
              color: servicePlan ? t.accent : t.mute,
            }}>{servicePlan ? '● ADDED' : '+ ADD'}</span>
          </button>

          <button onClick={() => onContinueShopping('plp')} style={{
            ...btnReset, cursor: 'pointer', padding: '18px 28px', textAlign: 'left',
            color: t.mute, fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 0.4,
          }}>← KEEP SHOPPING</button>
        </div>

        {/* Summary */}
        <div style={{
          borderLeft: `1px solid ${t.line}`, padding: '24px 24px',
          display: 'flex', flexDirection: 'column', overflow: 'auto',
        }}>
          <div style={{ fontSize: 10, color: t.mute, letterSpacing: 0.8, fontFamily: 'JetBrains Mono' }}>SUMMARY</div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 600, marginTop: 2 }}>Checkout</div>

          <div style={{ display: 'grid', gap: 8, fontSize: 11, marginTop: 18, fontFamily: 'JetBrains Mono' }}>
            <SumRow k="Subtotal" v={`$${subtotal.toLocaleString()}.00`} />
            <SumRow k="Shop-build & tune" v="INCLUDED" />
            {servicePlan && <SumRow k="Service plan · 1 yr" v="$190.00" highlight />}
            <SumRow k="Shipping · WA" v={`$${shipping.toFixed(2)}`} />
            <SumRow k="Sales tax · est." v={`$${tax.toFixed(2)}`} />
          </div>

          <div style={{
            marginTop: 18, padding: '14px 16px',
            border: `1px solid ${t.accent}`, background: 'rgba(217,255,58,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>TOTAL</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 22 }}>
                ${total.toLocaleString()}<span style={{ color: t.mute, fontSize: 14 }}>.00</span>
              </span>
            </div>
            <div style={{ fontSize: 10, color: t.mute, marginTop: 4, fontFamily: 'JetBrains Mono' }}>
              OR ${Math.round(total / 36)} / MO · 36 MO · 0% APR
            </div>
          </div>

          <button style={{ ...ctlBtn(t, true), marginTop: 14, padding: '14px 16px' }}>CHECKOUT →</button>
          <button style={{ ...ctlBtn(t), marginTop: 8 }}>RESERVE FOR STORE PICKUP</button>

          <div style={{
            marginTop: 'auto', paddingTop: 24,
            fontSize: 10, color: t.mute, lineHeight: 1.6, fontFamily: 'JetBrains Mono', letterSpacing: 0.3,
          }}>
            30-DAY RIDE GUARANTEE. FULL SHOP PRE-FLIGHT BEFORE EVERY SHIPMENT.
            FREE FLAT REPAIR FOR LIFE ON ANY LOOSELINE BUILD.
          </div>
        </div>
      </div>
    );
  }

  function SumRow({ k, v, highlight }) {
    const t = useTheme();
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        borderBottom: `1px dotted ${t.line2}`, paddingBottom: 6,
        color: highlight ? t.accent : t.ink,
      }}>
        <span style={{ color: t.mute }}>{k}</span><span>{v}</span>
      </div>
    );
  }

  function CartLine({ item, onQty, onRemove }) {
    const t = useTheme();
    return (
      <div style={{
        padding: '24px 32px', borderBottom: `1px solid ${t.line}`,
        display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'flex-start',
      }}>
        <div style={{ width: 120, height: 80, position: 'relative' }}>
          <Stripe caption={item.tag.toUpperCase()} tone={item.code.includes('X742') ? 'lime' : 'cream'} />
        </div>
        <div>
          <div style={{ display: 'flex', gap: 10, fontSize: 10, color: t.mute, letterSpacing: 0.8, fontFamily: 'JetBrains Mono' }}>
            <span>{item.code}</span><span>·</span><span>{item.tag.toUpperCase()}</span>
            {item.build !== 'STOCK' && <span style={{ color: t.accent }}>· CUSTOM</span>}
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, marginTop: 6 }}>{item.name}</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontSize: 11, color: t.mute, fontFamily: 'JetBrains Mono' }}>
            <span>· Size {item.size}</span>
            {item.build !== 'STOCK' && <span>· {item.build}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 600 }}>
            ${(item.price * item.qty).toLocaleString()}
          </div>
          <div style={{ marginTop: 10, display: 'inline-flex', border: `1px solid ${t.line}`, fontSize: 11, fontFamily: 'JetBrains Mono' }}>
            <button onClick={() => onQty(Math.max(0, item.qty - 1))} style={{
              ...btnReset, padding: '4px 10px', color: t.mute, borderRight: `1px solid ${t.line}`, cursor: 'pointer',
            }}>−</button>
            <span style={{ padding: '4px 12px' }}>{item.qty}</span>
            <button onClick={() => onQty(item.qty + 1)} style={{
              ...btnReset, padding: '4px 10px', color: t.mute, borderLeft: `1px solid ${t.line}`, cursor: 'pointer',
            }}>+</button>
          </div>
          <button onClick={onRemove} style={{
            ...btnReset, marginTop: 8, fontSize: 10, color: t.mute, cursor: 'pointer',
            fontFamily: 'JetBrains Mono', letterSpacing: 0.4, display: 'block', width: '100%',
          }}>REMOVE ×</button>
        </div>
      </div>
    );
  }

  window.MC.CartScreen = CartScreen;
})();
