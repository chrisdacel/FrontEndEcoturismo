const activities = [
  { title: 'Senderismo (Hiking)', image: '/images/Preferencias/hiking.png', bg: 'bg-[#cfc7c7]' },
  { title: 'Avistamiento de aves (Birdwatching)', image: '/images/Preferencias/birdwatching.png', bg: 'bg-[#f7bb4c]' },
  { title: 'Ciclismo en montaña o ecológico (Bicycle)', image: '/images/Preferencias/bicycle.png', bg: 'bg-[#33c233]' },
  { title: 'Escalada en roca natural (Climbing)', image: '/images/Preferencias/rappelling.png', bg: 'bg-[#b45f21]' },
  { title: 'Voluntariado con fauna', image: '/images/Preferencias/turtle.png', bg: 'bg-[#6fb10d]' },
  { title: 'Visita parques nacionales', image: '/images/Preferencias/national-park.png', bg: 'bg-[#ceb173]' },
  { title: 'Paseo en canoa', image: '/images/Preferencias/kayaking.png', bg: 'bg-[#a2f0d6]' },
  { title: 'Baños de bosque (Forest bathing)', image: '/images/Preferencias/forest.png', bg: 'bg-[#1e6e13]' },
];

const circleBase =
  'group flex h-28 w-28 sm:h-32 sm:w-32 flex-col items-center justify-center rounded-full transition-transform duration-300 shadow-sm';

function App() {
  return (
    <div className="min-h-screen bg-white px-4 py-10 text-slate-800 sm:py-12">
      <header className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-semibold text-[#267E1B] sm:text-4xl md:text-5xl">
          Tú decides el camino, elige una opción
        </h1>
      </header>

      <main className="mx-auto mt-10 w-full max-w-6xl">
        <div className="grid grid-cols-2 justify-items-center gap-8 sm:grid-cols-3 sm:gap-12 lg:grid-cols-4 lg:gap-16">
          {activities.map((activity) => (
            <div key={activity.title} className={`${circleBase} ${activity.bg} hover:scale-105`}>
              <img
                src={activity.image}
                alt={activity.title}
                className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24"
              />
              <p className="mt-3 text-center text-xs font-medium leading-snug text-slate-600 sm:text-sm">
                {activity.title}
              </p>
            </div>
          ))}
        </div>
      </main>

      <div className="mx-auto mt-12 flex w-full max-w-6xl justify-end gap-3 px-2 sm:gap-4">
        <a
          href="/images/Usuario/pagina_inicio_loguin.html"
          className="inline-flex items-center justify-center rounded-md border border-[#267E1B] px-4 py-2 text-sm font-semibold text-[#267E1B] transition hover:bg-[#267E1B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#267E1B]"
        >
          Siguiente
        </a>
        <a
          href="/images/Usuario/pagina_inicio_loguin.html"
          className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
        >
          Omitir &gt;
        </a>
      </div>
    </div>
  );
}

export default App;
