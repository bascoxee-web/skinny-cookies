import { useState, type MouseEvent } from "react";
import { ArrowRight, Instagram, Menu as MenuIcon, X } from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: "cookies" | "sundaes";
  orderUrl: string;
};

const OWNER_MENU = "https://pzzaand.com/menu";
const img = (name: string) => `./img/${name}.jpg`;
const photos = {
  cookie: img("cookie"),
  sandwich: img("sandwich"),
  cookiesMilk: img("cookiesMilk"),
  oreos: img("oreos"),
  float: img("float"),
  softServe: img("softServe"),
  sundae: img("sundae"),
  salted: img("salted"),
};

// This list mirrors the sweets currently published on PZZA&'s live Owner.com menu.
// Prices, order options, and current availability are shown and controlled there.
const menuItems: MenuItem[] = [
  {
    id: "skinny-cookie-sandwich",
    name: "Skinny Cookie Ice Cream Sandwich",
    description: "Two Skinny Cookies sandwiching Madagascar Vanilla Bean soft serve.",
    image: photos.sandwich,
    category: "cookies",
    orderUrl: `${OWNER_MENU}?item=skinny-cookie-ice-cream-sandwich-7efF`,
  },
  {
    id: "pistachio-sandwich",
    name: "Pistachio Skinny Cookie Ice Cream Sandwich",
    description: "A pistachio version of the Skinny Cookie ice cream sandwich. See the live menu for current details.",
    image: photos.sandwich,
    category: "cookies",
    orderUrl: `${OWNER_MENU}?item=pistachio-skinny-cookie-ice-cream-sandwich-2472`,
  },
  {
    id: "cookies-milk-sundae",
    name: "Cookies and Milk Sundae",
    description: "Madagascar Vanilla soft serve topped with Skinny Cookie pieces and condensed milk.",
    image: photos.cookiesMilk,
    category: "sundaes",
    orderUrl: `${OWNER_MENU}?item=cookies-and-milk-sundae-Y4gE`,
  },
  {
    id: "fried-oreos",
    name: "2 Fried Oreos",
    description: "Oreos deep fried and dusted with powdered sugar.",
    image: photos.oreos,
    category: "cookies",
    orderUrl: `${OWNER_MENU}?item=2-fried-oreos-4l90`,
  },
  {
    id: "soda-floats",
    name: "Soda Floats",
    description: "See the PZZA& order menu for current float options and availability.",
    image: photos.float,
    category: "sundaes",
    orderUrl: `${OWNER_MENU}?item=soda-floats-nNqh`,
  },
  {
    id: "vanilla-soft-serve",
    name: "Madagascar Vanilla Soft Serve Ice Cream",
    description: "Madagascar Vanilla Bean soft serve gelati, made with grass-fed milk and a choice of toppings.",
    image: photos.softServe,
    category: "sundaes",
    orderUrl: `${OWNER_MENU}?item=madagascar-vanilla-soft-serve-ice-cream-lq94`,
  },
  {
    id: "gator-sundae",
    name: "Gator Sundae",
    description: "Vanilla soft serve topped with chocolate shell, Oreo crumbs, and a fried Oreo.",
    image: photos.sundae,
    category: "sundaes",
    orderUrl: `${OWNER_MENU}?item=gator-sundae-xIC3`,
  },
  {
    id: "salted-sunshine",
    name: "The Salted Sunshine",
    description: "Madagascar Vanilla Bean soft serve with extra virgin olive oil, Florida raw honey, and Maldon flake sea salt.",
    image: photos.salted,
    category: "sundaes",
    orderUrl: `${OWNER_MENU}?item=the-salted-sunshine-y6He`,
  },
];

const faqItems = [
  {
    question: "Where can I order Skinny Cookies desserts?",
    answer: "Order directly through the official PZZA& online menu. Product options, current prices, pickup and delivery choices, and availability are confirmed there.",
  },
  {
    question: "Where is Skinny Cookies located?",
    answer: "Skinny Cookies is served inside PZZA& at 126 NE 2nd St, Boca Raton, FL 33432.",
  },
  {
    question: "Does PZZA& offer pickup and delivery?",
    answer: "PZZA&'s online ordering menu offers pickup and delivery options. The ordering page shows the options available for your address and order time.",
  },
  {
    question: "What Skinny Cookie items can I order online?",
    answer: "The live PZZA& menu currently lists Skinny Cookie ice cream sandwiches and desserts made with Skinny Cookies, alongside soft serve and other sweets. Check the menu for the current selection.",
  },
];

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Skinny Cookies by PZZA&",
  url: typeof window === "undefined" ? "https://skinny-cookies.vercel.app/" : window.location.origin,
  telephone: "+1-561-931-2854",
  servesCuisine: ["Cookies", "Desserts", "Ice Cream"],
  brand: { "@type": "Brand", name: "Skinny Cookies" },
  parentOrganization: { "@type": "Organization", name: "PZZA&", url: "https://pzzaand.com/" },
  hasMenu: OWNER_MENU,
  address: {
    "@type": "PostalAddress",
    streetAddress: "126 NE 2nd St",
    addressLocality: "Boca Raton",
    addressRegion: "FL",
    postalCode: "33432",
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 26.3520343, longitude: -80.0848961 },
  openingHoursSpecification: [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ].map((dayOfWeek) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${dayOfWeek}`,
    opens: "11:30",
    closes: "21:00",
  })),
  areaServed: { "@type": "City", name: "Boca Raton" },
};

const productSchemas = menuItems.map((item) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: item.name,
  description: item.description,
  image: typeof window === "undefined" ? item.image : new URL(item.image, window.location.href).href,
  brand: { "@type": "Brand", name: "Skinny Cookies by PZZA&" },
  url: item.orderUrl,
}));

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const structuredData = [businessSchema, ...productSchemas, faqSchema];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"all" | "cookies" | "sundaes">("all");
  const visibleItems = activeCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  const closeMobileMenu = (event: MouseEvent<HTMLAnchorElement>) => {
    const details = event.currentTarget.closest("details");
    if (details) details.open = false;
  };

  return (
    <div className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
        <details className="mobile-menu">
          <summary aria-label="Open navigation menu"><MenuIcon size={19} /><span>Menu</span></summary>
          <div className="mobile-menu-panel">
            <a href="#menu" onClick={closeMobileMenu}>Menu</a>
            <a href="#story" onClick={closeMobileMenu}>Our story</a>
            <a href="#visit" onClick={closeMobileMenu}>Visit us</a>
          </div>
        </details>
        <a className="header-order" href={OWNER_MENU} target="_blank" rel="noopener noreferrer">Order now <ArrowRight size={15} /></a>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Skinny Cookies by PZZA& · Boca Raton, Florida</p>
            <h1 id="hero-title">Boca Raton<br /><em>cookie</em> desserts.</h1>
            <p className="hero-description">Find Skinny Cookie ice cream sandwiches, cookie-studded sundaes, and more sweets on PZZA&'s live menu. Choose pickup or delivery in the official order flow.</p>
            <div className="hero-actions">
              <a className="primary-button" href={OWNER_MENU} target="_blank" rel="noopener noreferrer">Order through PZZA& <ArrowRight size={17} /></a>
              <span className="hero-note">Made in small batches<br />at PZZA& in Boca Raton</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Fresh baked Skinny Cookie">
            <div className="sun-disc" />
            <div className="hero-image-wrap">
              <img src={photos.cookie} alt="A fresh Skinny Cookie outside PZZA& in Boca Raton" />
            </div>
            <img className="hero-mascot" src="./brand/mascot.png" alt="" width="392" height="625" />
          </div>
          <div className="hero-bottomline"><span>✦</span><span>Small-batch sweets</span><span className="line" /><span>Order from PZZA&</span></div>
        </section>

        <section className="marquee-strip" aria-label="Brand promise">
          <div>Fresh baked daily ✦ Valrhona chocolate ✦ Maldon sea salt ✦ Pickup at PZZA& ✦ </div>
          <div aria-hidden="true">Fresh baked daily ✦ Valrhona chocolate ✦ Maldon sea salt ✦ Pickup at PZZA& ✦ </div>
        </section>

        <section id="menu" className="menu-section" aria-labelledby="menu-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow-light">On the PZZA& order menu</p>
              <h2 id="menu-title">Cookies / <em>sweet stuff</em></h2>
            </div>
            <p className="section-intro">Browse the current PZZA& menu. Each order button opens the matching item; current prices, options, and availability are shown there.</p>
          </div>

          <div className="category-tabs" role="group" aria-label="Filter sweets">
            {([['all', 'All sweets'], ['cookies', 'Cookies + treats'], ['sundaes', 'Sundaes + soft serve']] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={activeCategory === value} className={activeCategory === value ? 'active' : ''} onClick={() => setActiveCategory(value)}>{label}</button>
            ))}
          </div>

          <div className="menu-grid">
            {visibleItems.map((item, index) => <MenuCard key={item.id} item={item} index={index} />)}
          </div>

          <div className="menu-note"><span>✦</span><a href={OWNER_MENU} target="_blank" rel="noopener noreferrer">See the full PZZA& menu and current ordering options</a><span>✦</span></div>
        </section>

        <section id="story" className="story-section">
          <div className="story-photo"><img src={photos.sandwich} alt="Skinny Cookie ice cream sandwich made at PZZA&" /></div>
          <div className="story-copy"><p className="eyebrow">The not-so-secret recipe</p><h2>Thin on the edge.<br /><em>Big in the middle.</em></h2><p>Skinny Cookie desserts are part of the PZZA& experience in Boca Raton. Find the live selection—including cookie ice cream sandwiches and sundaes—in the existing PZZA& ordering menu.</p><a href={OWNER_MENU} target="_blank" rel="noopener noreferrer" className="text-link">Order on PZZA& <ArrowRight size={16} /></a></div>
        </section>

        <section id="visit" className="visit-section" style={{ backgroundImage: `linear-gradient(100deg, rgba(17,17,17,.92) 0%, rgba(17,17,17,.78) 45%, rgba(17,17,17,.35) 100%), url(${photos.softServe})` }}>
          <div><p className="eyebrow eyebrow-light">Come say hi</p><h2>Sweet things<br /><em>happen here.</em></h2></div>
          <div className="visit-details">
            <p>Skinny Cookies at<br /><strong>PZZA& · 126 NE 2nd St<br />Boca Raton, FL 33432</strong></p>
            <p>Open daily, 11:30 AM–9 PM. PZZA&'s order page shows the available pickup and delivery options for your address.</p>
            <p><a href="tel:+15619312854">(561) 931-2854</a></p>
            <a className="outline-button" href={OWNER_MENU} target="_blank" rel="noopener noreferrer">Order pickup or delivery <ArrowRight size={16} /></a>
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="faq-inner">
            <p className="eyebrow eyebrow-light">Good to know</p>
            <h2 id="faq-title">Skinny Cookies <em>FAQ</em></h2>
            <div className="faq-list">
              {faqItems.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="footer-brand"><img className="brand-mascot" src="./brand/mascot-sm.png" alt="" width="30" height="48" /><span>Skinny Cookies by PZZA&</span></div><div className="footer-social"><a href="https://www.instagram.com/eatskinnycookies/" target="_blank" rel="noopener noreferrer" aria-label="Skinny Cookies on Instagram"><Instagram size={18} /></a><a href="https://www.facebook.com/profile.php?id=61579066653692" target="_blank" rel="noopener noreferrer" aria-label="Skinny Cookies on Facebook"><span className="facebook-icon">f</span></a></div><span className="footer-copy">© 2026 Skinny Cookies · All rights reserved</span></footer>
    </div>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return <article className="menu-card" style={{ ['--delay' as string]: `${index * 55}ms` }}>
    <div className="card-image-wrap"><img src={item.image} alt={item.name} loading="lazy" /></div>
    <div className="card-content">
      <div className="card-title-row"><h3>{item.name}</h3></div>
      <p>{item.description}</p>
      <a className="card-order" href={item.orderUrl} target="_blank" rel="noopener noreferrer" aria-label={`Order ${item.name} through PZZA&`}>Order through PZZA& <ArrowRight size={14} /></a>
    </div>
  </article>;
}
