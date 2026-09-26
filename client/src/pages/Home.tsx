import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Instagram, Minus, Plus, ShoppingBag, X } from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: "cookies" | "sundaes";
  variantId: string; // Shopify variant ID in the PZZA& Shopify store
  tag?: string;
};

type CartLine = MenuItem & { quantity: number };

// Checkout runs on the PZZA& Shopify store. Orders, payment, tax and sales reports live there.
const SHOPIFY_STORE = "https://00gqji-th.myshopify.com";

const img = (name: string) => `./img/${name}.jpg`;
const photos = {
  cookie: img("cookie"),
  sandwich: img("sandwich"),
  cookiesMilk: img("cookiesMilk"),
  oreos: img("oreos"),
  float: img("float"),
  softServe: img("softServe"),
  sundae: img("sundae"),
  chocolate: img("chocolate"),
  salted: img("salted"),
  smores: img("smores"),
};

const menuItems: MenuItem[] = [
  { id: "skinny-cookie", name: "The Skinny Cookie", price: 4, variantId: "67475660734678", category: "cookies", tag: "Signature", image: photos.cookie,
    description: "Thin, crispy-edged, and loaded with Valrhona Jivara milk and Caraïbe dark chocolate. Finished with a full chunk of Jivara and Maldon flake sea salt." },
  { id: "cookie-2-pack", name: "The Skinny Cookie (2-Pack)", price: 7, variantId: "67475660964054", category: "cookies", image: photos.cookie,
    description: "Two of our Skinny Cookies. One for now, one for later." },
  { id: "cookie-6-pack", name: "The Skinny Cookie (6-Pack)", price: 19, variantId: "67475661160662", category: "cookies", tag: "Share it", image: photos.cookie,
    description: "Six Skinny Cookies for the office, the party, or the car ride home." },
  { id: "cookie-sandwich", name: "Skinny Cookie Ice Cream Sandwich", price: 9, variantId: "67475735478486", category: "cookies", tag: "Fan favorite", image: photos.sandwich,
    description: "Two Skinny Cookies sandwiching our Madagascar Vanilla Bean soft serve. That's it. That's the sandwich." },
  { id: "pistachio-sandwich", name: "Pistachio Skinny Cookie Ice Cream Sandwich", price: 12, variantId: "67475735609558", category: "cookies", image: photos.sandwich,
    description: "Two Skinny Cookies with Madagascar Vanilla Bean soft serve and pistachio." },
  { id: "soft-serve", name: "Madagascar Vanilla Soft Serve", price: 6, variantId: "67475735773398", category: "cookies", image: photos.softServe,
    description: "Madagascar Vanilla Bean soft serve made with 100% grass-fed milk from Australian and New Zealand cows." },
  { id: "fried-oreos", name: "2 Fried Oreos", price: 4, variantId: "67475736101078", category: "cookies", image: photos.oreos,
    description: "Oreos deep fried and dusted with powdered sugar." },
  { id: "soda-float", name: "Soda Float", price: 7, variantId: "67475736297686", category: "cookies", image: photos.float,
    description: "Soda topped with Madagascar Vanilla Bean soft serve." },
  { id: "cookies-milk-sundae", name: "Cookies and Milk Sundae", price: 10, variantId: "67475736854742", category: "sundaes", tag: "Best seller", image: photos.cookiesMilk,
    description: "Madagascar Vanilla soft serve topped with chunks of a Skinny Cookie and drizzled with condensed milk." },
  { id: "gator-sundae", name: "Gator Sundae", price: 10, variantId: "67475737215190", category: "sundaes", image: photos.sundae,
    description: "Vanilla soft serve with chocolate shell, Oreo crumbs, and a fried Oreo split in four. Add an extra Oreo if you dare." },
  { id: "dubai-sundae", name: "Dubai Chocolate Sundae", price: 11, variantId: "67475737411798", category: "sundaes", tag: "New", image: photos.chocolate,
    description: "Madagascar Vanilla soft serve with Nutella drizzle, Italian pistachio cream, and kataifi crisps." },
  { id: "salted-sunshine", name: "The Salted Sunshine", price: 9, variantId: "67475737772246", category: "sundaes", image: photos.salted,
    description: "Madagascar Vanilla Bean soft serve with extra virgin olive oil, Florida raw honey, and Maldon flake sea salt." },
  { id: "smores-sundae", name: "S'mores Sundae", price: 10, variantId: "67475737936086", category: "sundaes", image: photos.smores,
    description: "Madagascar Vanilla Bean soft serve with Nutella, graham cracker crumbs, and toasted marshmallows." },
];

const CART_KEY = "skinny-cookies-cart";
const loadCart = (): CartLine[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]") as { id: string; quantity: number }[];
    return saved.flatMap(({ id, quantity }) => {
      const item = menuItems.find((m) => m.id === id);
      return item && quantity > 0 ? [{ ...item, quantity }] : [];
    });
  } catch {
    return [];
  }
};
const saveCart = (cart: CartLine[]) => {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity })))); } catch { /* storage unavailable */ }
};
const checkoutUrl = (cart: CartLine[]) =>
  `${SHOPIFY_STORE}/cart/${cart.map((line) => `${line.variantId}:${line.quantity}`).join(",")}?ref=skinnycookies`;

const money = (value: number) => `$${value.toFixed(2)}`;

export default function Home() {
  const [cart, setCart] = useState<CartLine[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "cookies" | "sundaes">("all");

  useEffect(() => saveCart(cart), [cart]);

  const subtotal = useMemo(() => cart.reduce((sum, line) => sum + line.price * line.quantity, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart]);
  const visibleItems = activeCategory === "all" ? menuItems : menuItems.filter((item) => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (existing) return current.map((line) => (line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line));
      return [...current, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) => current.flatMap((line) => {
      if (line.id !== id) return [line];
      const quantity = line.quantity + delta;
      return quantity > 0 ? [{ ...line, quantity }] : [];
    }));
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Skinny Cookies home">
          <img className="brand-mascot" src="./brand/mascot-sm.png" alt="" width="34" height="54" />
          <span className="brand-name"><img className="brand-wordmark" src="./brand/wordmark.png" alt="Skinny Cookies" width="92" height="48" /><small>by PZZA&</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#menu">Menu</a>
          <a href="#story">Our story</a>
          <a href="#visit">Visit us</a>
        </nav>
        <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${itemCount} items`}>
          <ShoppingBag size={17} strokeWidth={2.2} />
          <span>Bag</span>
          <b>{itemCount}</b>
        </button>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Baked fresh in Boca Raton</p>
            <h1 id="hero-title">A little<br /><em>extra</em> skinny.</h1>
            <p className="hero-description">The cookie worth making room for. Crisp edges, molten chocolate, and zero shortcuts.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#menu">Order something sweet <ArrowRight size={17} /></a>
              <span className="hero-note">Made in small batches<br />at PZZA&</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Fresh baked Skinny Cookie">
            <div className="sun-disc" />
            <div className="hero-image-wrap">
              <img src={photos.cookie} alt="The Skinny Cookie, held up in front of PZZA& in Boca Raton" />
            </div>
            <img className="hero-mascot" src="./brand/mascot.png" alt="" width="392" height="625" />
          </div>
          <div className="hero-bottomline"><span>✦</span><span>Small-batch sweets</span><span className="line" /><span>Scroll to explore ↓</span></div>
        </section>

        <section className="marquee-strip" aria-label="Brand promise">
          <div>Fresh baked daily ✦ Valrhona chocolate ✦ Maldon sea salt ✦ Pickup at PZZA& ✦ </div>
          <div aria-hidden="true">Fresh baked daily ✦ Valrhona chocolate ✦ Maldon sea salt ✦ Pickup at PZZA& ✦ </div>
        </section>

        <section id="menu" className="menu-section" aria-labelledby="menu-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow-light">The good stuff</p>
              <h2 id="menu-title">Menu / <em>Price List</em></h2>
            </div>
            <p className="section-intro">Baked fresh in-store, made with zero shortcuts.<br />Order ahead for pickup at PZZA&.</p>
          </div>

          <div className="category-tabs" role="tablist" aria-label="Menu categories">
            {([['all', 'All sweets'], ['cookies', 'Cookies + soft serve'], ['sundaes', 'Sundaes']] as const).map(([value, label]) => (
              <button key={value} type="button" role="tab" aria-selected={activeCategory === value} className={activeCategory === value ? 'active' : ''} onClick={() => setActiveCategory(value)}>{label}</button>
            ))}
          </div>

          <div className="menu-grid">
            {visibleItems.map((item, index) => <MenuCard key={item.id} item={item} index={index} onAdd={() => addToCart(item)} />)}
          </div>

          <div className="menu-note"><span>✦</span> Add a little sweetness to your next order <span>✦</span></div>
        </section>

        <section id="story" className="story-section">
          <div className="story-photo"><img src={photos.sandwich} alt="Skinny Cookie ice cream sandwich cut into quarters" /></div>
          <div className="story-copy"><p className="eyebrow">The not-so-secret recipe</p><h2>Thin on the edge.<br /><em>Big in the middle.</em></h2><p>We use the good stuff: Valrhona chocolate, Kerrygold butter, Madagascar vanilla, and a little Maldon salt. Nothing hidden. Nothing held back.</p><a href="#menu" className="text-link">Shop the menu <ArrowRight size={16} /></a></div>
        </section>

        <section id="visit" className="visit-section" style={{ backgroundImage: `linear-gradient(100deg, rgba(17,17,17,.92) 0%, rgba(17,17,17,.78) 45%, rgba(17,17,17,.35) 100%), url(${photos.softServe})` }}>
          <div><p className="eyebrow eyebrow-light">Come say hi</p><h2>Sweet things<br /><em>happen here.</em></h2></div>
          <div className="visit-details"><p>Find Skinny Cookies inside<br /><strong>PZZA& · 126 NE 2nd St<br />Boca Raton, FL</strong></p><p>Order online and pick up at the counter. You'll get a confirmation email with your order number.</p><a className="outline-button" href="#menu">Build your order <ArrowRight size={16} /></a></div>
        </section>
      </main>

      <footer className="footer"><div className="footer-brand"><img className="brand-mascot" src="./brand/mascot-sm.png" alt="" width="30" height="48" /><span>Skinny Cookies</span></div><div className="footer-social"><a href="https://www.instagram.com/eatskinnycookies/" target="_blank" rel="noopener" aria-label="Skinny Cookies on Instagram"><Instagram size={18} /></a><a href="https://www.facebook.com/profile.php?id=61579066653692" target="_blank" rel="noopener" aria-label="Skinny Cookies on Facebook"><span className="facebook-icon">f</span></a></div><span className="footer-copy">© 2026 Skinny Cookies · All rights reserved</span></footer>

      {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)} />}
      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-label="Shopping cart" aria-hidden={!cartOpen}>
        <div className="drawer-head"><div><p className="eyebrow">Your order</p><h2>Sweet <em>tooth</em></h2></div><button className="icon-button" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={21} /></button></div>
        {cart.length === 0 ? <div className="empty-cart"><img className="empty-mascot" src="./brand/mascot-sm.png" alt="" width="84" height="134" /><h3>Your bag is waiting.</h3><p>Add a little something sweet and it will show up here.</p><button className="primary-button" type="button" onClick={() => { setCartOpen(false); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>Browse menu <ArrowRight size={16} /></button></div> : <>
          <div className="cart-lines">{cart.map((line) => <div className="cart-line" key={line.id}><img src={line.image} alt="" /><div className="cart-line-info"><div className="cart-line-top"><h3>{line.name}</h3><span>{money(line.price * line.quantity)}</span></div><div className="quantity-control"><button type="button" onClick={() => updateQuantity(line.id, -1)} aria-label={`Decrease ${line.name}`}><Minus size={13} /></button><span>{line.quantity}</span><button type="button" onClick={() => updateQuantity(line.id, 1)} aria-label={`Increase ${line.name}`}><Plus size={13} /></button></div></div></div>)}</div>
          <div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Pickup at PZZA&, 126 NE 2nd St, Boca Raton. Tax is added at checkout.</p><a className="checkout-button" href={checkoutUrl(cart)}>Check out <ArrowRight size={17} /></a><span className="demo-label">Secure checkout by Shopify</span></div>
        </>}
      </aside>

    </div>
  );
}

function MenuCard({ item, index, onAdd }: { item: MenuItem; index: number; onAdd: () => void }) {
  return <article className="menu-card" style={{ ['--delay' as string]: `${index * 55}ms` }}><div className="card-image-wrap"><img src={item.image} alt={item.name} loading="lazy" />{item.tag && <span className="card-tag">{item.tag}</span>}<button className="add-button" type="button" onClick={onAdd} aria-label={`Add ${item.name} to cart`}><Plus size={18} /></button></div><div className="card-content"><div className="card-title-row"><h3>{item.name}</h3><span>{money(item.price)}</span></div><p>{item.description}</p><button className="card-order" type="button" onClick={onAdd}>Add to bag <ArrowRight size={14} /></button></div></article>;
}
export { menuItems };
