import { useMemo, useState } from 'react';
import { filterWorkshops, reserveSeat } from './workshops.js';

const initialWorkshops = [
  {
    id: 'w01',
    title: 'Thrown Bowls',
    category: 'Clay',
    day: 'Sat',
    time: '10:00–13:00',
    instructor: 'Mei Tan',
    price: 120,
    seats: 8,
    seatsLeft: 2,
    featured: true,
    palette: 'clay',
    level: 'Beginner',
    blurb: 'Center clay, pull a cylinder, and take home two bowls.',
    description: 'A morning on the wheel. You will learn centering, opening, and pulling walls. Clay, firing, and tools are included. Wear clothes you can ruin.',
    longDescription: 'A morning on the wheel. You will learn centering, opening, and pulling walls. Clay, firing, and tools are included. Wear clothes you can ruin.',
  },
  {
    id: 'w02',
    title: 'Risograph Posters',
    category: 'Print',
    day: 'Sat',
    time: '14:00–17:00',
    instructor: 'Jonas Ng',
    price: 90,
    seats: 10,
    seatsLeft: 10,
    level: 'Beginner',
    palette: 'ink',
    blurb: 'Two-color prints on the studio Riso. Leave with a small edition.',
    description: 'Design a two-layer poster, separate colors, and run the Riso. Paper is provided. Bring a simple idea, not a 40-layer file.',
    longDescription: 'Design a two-layer poster, separate colors, and run the Riso. Paper is provided. Bring a simple idea, not a 40-layer file.',
  },
  {
    id: 'w03',
    title: 'Contact Sheets',
    category: 'Photo',
    day: 'Sun',
    time: '09:30–12:30',
    instructor: 'Aisha Rahman',
    price: 110,
    seats: 6,
    seatsLeft: 1,
    level: 'Intermediate',
    palette: 'sage',
    blurb: 'Shoot a roll, process it, and edit a contact sheet in the darkroom.',
    description: 'Bring a 35mm camera if you have one. We have two to lend. You will develop one roll and make a contact sheet. Chemistry is provided.',
    longDescription: 'Bring a 35mm camera if you have one. We have two to lend. You will develop one roll and make a contact sheet. Chemistry is provided.',
  },
  {
    id: 'w04',
    title: 'Dovetail Box',
    category: 'Wood',
    day: 'Sun',
    time: '13:00–17:00',
    instructor: 'Hari Menon',
    price: 160,
    seats: 6,
    seatsLeft: 0,
    level: 'Intermediate',
    palette: 'wood',
    blurb: 'Hand-cut dovetails and assemble a small lid box.',
    description: 'Marking, sawing, and chopping tails and pins. You leave with a box, not a pile of offcuts. Hearing protection provided. Closed shoes required.',
    longDescription: 'Marking, sawing, and chopping tails and pins. You leave with a box, not a pile of offcuts. Hearing protection provided. Closed shoes required.',
  },
  {
    id: 'w05',
    title: 'Sgraffito Plates',
    category: 'Clay',
    day: 'Sun',
    time: '10:00–13:00',
    instructor: 'Mei Tan',
    price: 95,
    seats: 8,
    seatsLeft: 5,
    level: 'Beginner',
    palette: 'sage',
    blurb: 'Carve through slip to draw on leather-hard plates.',
    description: 'We start with leather-hard blanks. You coat, scratch, and refine a simple motif. Firing is included. Take the plates home the following week.',
    longDescription: 'We start with leather-hard blanks. You coat, scratch, and refine a simple motif. Firing is included. Take the plates home the following week.',
  },
  {
    id: 'w06',
    title: 'Cyanotype on Fabric',
    category: 'Photo',
    day: 'Sat',
    time: '14:00–16:30',
    instructor: 'Aisha Rahman',
    price: 75,
    seats: 12,
    seatsLeft: 4,
    level: 'Beginner',
    palette: 'sage',
    blurb: 'Sun prints on cotton. No camera required.',
    description: 'Coat fabric, compose with objects or film negatives, expose, and wash. You leave with two pieces. Weather backup: UV lamps.',
    longDescription: 'Coat fabric, compose with objects or film negatives, expose, and wash. You leave with two pieces. Weather backup: UV lamps.',
  },
  {
    id: 'w07',
    title: 'Linocut Cards',
    category: 'Print',
    day: 'Sun',
    time: '11:00–14:00',
    instructor: 'Jonas Ng',
    price: 80,
    seats: 10,
    seatsLeft: 7,
    level: 'Beginner',
    palette: 'ink',
    blurb: 'Carve a block and print a set of cards.',
    description: 'Transfer a simple drawing, carve, ink, and print. You leave with a block and eight cards. Carving tools are sharp. We will demo safe handling first.',
    longDescription: 'Transfer a simple drawing, carve, ink, and print. You leave with a block and eight cards. Carving tools are sharp. We will demo safe handling first.',
  },
  {
    id: 'w08',
    title: 'Spoon Carving',
    category: 'Wood',
    day: 'Sat',
    time: '09:00–12:30',
    instructor: 'Hari Menon',
    price: 100,
    seats: 8,
    seatsLeft: 3,
    level: 'Beginner',
    palette: 'wood',
    blurb: 'Green wood, a hook knife, and one finished spoon.',
    description: 'Split a blank, shape the bowl, and refine the handle. Knives are provided. Cut-resistant guards are mandatory. No prior woodwork needed.',
    longDescription: 'Split a blank, shape the bowl, and refine the handle. Knives are provided. Cut-resistant guards are mandatory. No prior woodwork needed.',
  },
];

const categories = ['All', 'Clay', 'Print', 'Photo', 'Wood'];
const days = ['All', 'Sat', 'Sun'];

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="arrow-icon"><path d="M4 10h11M11 5l5 5-5 5" /></svg>;
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      <div className="filter-options">
        {options.map((option) => (
          <button key={option} type="button" className={`filter-button ${value === option ? 'is-active' : ''}`} onClick={() => onChange(option)} aria-pressed={value === option}>
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function WorkshopArtwork({ workshop, featured = false }) {
  return (
    <div className={`workshop-art art-${workshop.palette} ${featured ? 'is-featured-art' : ''}`} aria-hidden="true">
      <span className="art-label">{workshop.category}</span>
      <span className="art-shape art-shape-one" />
      <span className="art-shape art-shape-two" />
      <span className="art-shape art-shape-three" />
      <span className="art-index">{String(workshop.id.length).padStart(2, '0')}</span>
    </div>
  );
}

function WorkshopCard({ workshop, selected, onSelect }) {
  const soldOut = workshop.seatsLeft === 0;
  return (
    <article className={`workshop-card ${selected ? 'is-selected' : ''} ${soldOut ? 'is-sold-out' : ''}`}>
      <button type="button" className="card-hit-area" onClick={() => onSelect(workshop.id)} aria-label={`View details for ${workshop.title}`}>
        <WorkshopArtwork workshop={workshop} />
        <div className="card-body">
          <div className="card-meta"><span>{workshop.category}</span><span>{workshop.day}</span></div>
          <h3>{workshop.title}</h3>
          <p>{workshop.description}</p>
        <div className="card-footer"><span>{workshop.time}</span><span className="card-price">${workshop.price}</span></div>
        </div>
        {soldOut && <div className="sold-out-stamp">Sold out</div>}
      </button>
    </article>
  );
}

function DetailPanel({ workshop, onReserve, onClose }) {
  const soldOut = workshop.seatsLeft === 0;
  return (
    <aside className="detail-panel" aria-live="polite">
      <div className="detail-topline"><span>Workshop details</span><button className="close-detail" type="button" onClick={onClose} aria-label="Close workshop details">×</button></div>
      <WorkshopArtwork workshop={workshop} featured />
      <div className="detail-copy">
        <div className="detail-meta"><span>{workshop.category} / {workshop.day}</span><span>{workshop.level}</span></div>
        <h2>{workshop.title}</h2>
        <p className="detail-instructor">with <strong>{workshop.instructor}</strong></p>
        <p className="detail-description">{workshop.longDescription}</p>
        <dl className="detail-facts"><div><dt>Time</dt><dd>{workshop.time}</dd></div><div><dt>Seats left</dt><dd className={soldOut ? 'sold-out-text' : ''}>{soldOut ? 'Sold out' : workshop.seatsLeft}</dd></div><div><dt>Price</dt><dd>${workshop.price}</dd></div></dl>
        <button type="button" className="reserve-button" onClick={() => onReserve(workshop.id)} disabled={soldOut}>{soldOut ? 'Sold out' : 'Reserve a seat'} <ArrowIcon /></button>
      </div>
    </aside>
  );
}

export default function App() {
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [category, setCategory] = useState('All');
  const [day, setDay] = useState('All');
  const [selectedId, setSelectedId] = useState(initialWorkshops[0].id);

  const featured = workshops.find((workshop) => workshop.featured);
  const visibleWorkshops = useMemo(() => filterWorkshops(workshops.filter((workshop) => !workshop.featured), category, day), [workshops, category, day]);
  const selected = workshops.find((workshop) => workshop.id === selectedId) ?? featured;

  function handleReserve(id) {
    setWorkshops((current) => current.map((workshop) => (workshop.id === id ? reserveSeat(workshop) : workshop)));
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Atelier home"><span>Atelier</span><sup>studio / 01</sup></a>
        <nav className="site-nav" aria-label="Primary navigation"><a href="#workshops">Workshops</a><a href="#about">About</a></nav>
        <a className="header-link" href="#workshops">Find a workshop <ArrowIcon /></a>
      </header>

      <section className="intro" id="top">
        <p className="eyebrow">A small studio for making things</p>
        <h1>Make space<br /><em>for your hands.</em></h1>
        <p className="intro-copy">Weekend workshops in clay, print, photo, and wood — led by people who care about the process as much as the finished thing.</p>
      </section>

      <section className="featured-wrap" aria-labelledby="featured-title">
        <div className="section-kicker"><span>01 / Featured workshop</span><span>September sessions</span></div>
        <article className={`featured-card ${featured.seatsLeft === 0 ? 'is-sold-out' : ''}`}>
          <WorkshopArtwork workshop={featured} featured />
          <div className="featured-copy"><div className="featured-meta"><span>{featured.category} · {featured.day}</span><span>{featured.level}</span></div><h2 id="featured-title">{featured.title}</h2><p>{featured.longDescription}</p><div className="featured-bottom"><span>with <strong>{featured.instructor}</strong></span><button type="button" className="text-button" onClick={() => setSelectedId(featured.id)}>View details <ArrowIcon /></button></div></div>
        </article>
      </section>

      <section className="catalog-section" id="workshops" aria-labelledby="catalog-title">
        <div className="catalog-heading"><div><p className="eyebrow">The September edit</p><h2 id="catalog-title">Choose your Saturday<br />or Sunday.</h2></div><p className="catalog-note">Small groups. Good tools.<br />A little time away.</p></div>
        <div className="catalog-controls"><div className="filters"><FilterGroup label="Category" options={categories} value={category} onChange={setCategory} /><FilterGroup label="Day" options={days} value={day} onChange={setDay} /></div><p className="result-count"><strong>{visibleWorkshops.length}</strong> {visibleWorkshops.length === 1 ? 'workshop' : 'workshops'} available</p></div>
        <div className="catalog-layout">
          <div className="workshop-grid">
            {visibleWorkshops.length > 0 ? visibleWorkshops.map((workshop) => <WorkshopCard key={workshop.id} workshop={workshop} selected={selectedId === workshop.id} onSelect={setSelectedId} />) : <div className="empty-state"><span className="empty-mark">○</span><h3>Nothing on this combination.</h3><p>Try opening up one of your filters and see what’s waiting.</p><button type="button" className="text-button" onClick={() => { setCategory('All'); setDay('All'); }}>Clear filters <ArrowIcon /></button></div>}
          </div>
          <DetailPanel workshop={selected} onReserve={handleReserve} onClose={() => setSelectedId(null)} />
        </div>
      </section>

      <footer className="site-footer" id="about"><span>Atelier / Weekend workshops</span><span>Made slowly in the city</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}