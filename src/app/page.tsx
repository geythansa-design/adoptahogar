// ==================== DATOS DE LAS MASCOTAS ====================
// Por ahora usamos datos de ejemplo.
// Más adelante estos datos podrán venir de nuestra base de datos.

const mascotas = [
  {
    id: 1,
    nombre: "Max",
    tipo: "Perro",
    edad: "2 años",
    imagen: "/mascotas/Toby (4).png",
    descripcion: "Cariñoso, juguetón y muy amigable.",
  },
  {
    id: 2,
    nombre: "Zeus",
    tipo: "Gato",
    edad: "1 año",
    imagen: "/mascotas/Toby (2).png",
    descripcion: "Tranquila, cariñosa y muy tierna.",
  },
  {
    id: 3,
    nombre: "Rocky",
    tipo: "Perro",
    edad: "3 años",
    imagen: "/mascotas/Toby (5).png",
    descripcion: "Protector, alegre y lleno de energía.",
  },
  {
    id: 4,
    nombre: "Luna",
    tipo: "Gata",
    edad: "8 meses",
    imagen: "/mascotas/Toby (3).png",
    descripcion: "Dulce, curiosa y muy cariñosa.",
  },
  {
    id: 5,
    nombre: "Toby",
    tipo: "Perro",
    edad: "1 año",
    imagen: "/mascotas/Toby (1).png",
    descripcion: "Juguetón, obediente y lleno de alegría.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50 text-gray-800">

      {/* ==================== NAVBAR ==================== */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>

            <h1 className="text-2xl font-bold text-orange-600">
              AdoptaHogar
            </h1>
          </div>

          {/* MENÚ DE NAVEGACIÓN */}
          <div className="hidden gap-8 md:flex">
            <a
              href="#inicio"
              className="font-medium text-gray-700 hover:text-orange-600"
            >
              Inicio
            </a>

            <a
              href="/explorar"
              className="font-medium text-gray-700 hover:text-orange-600"
            >
              Mascotas
            </a>

            <a
              href="#nosotros"
              className="font-medium text-gray-700 hover:text-orange-600"
            >
              Nosotros
            </a>

            <a
              href="#contacto"
              className="font-medium text-gray-700 hover:text-orange-600"
            >
              Contacto
            </a>
          </div>

          {/* BOTÓN DE INICIO DE SESIÓN */}
          <button className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600">
            Iniciar sesión
          </button>
        </div>
      </nav>


      {/* ==================== HERO / PORTADA ==================== */}
      <section id="inicio" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">

          {/* TEXTO PRINCIPAL */}
          <div>

            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
              🐾 Encuentra un nuevo compañero
            </span>

            <h2 className="mt-6 text-5xl font-extrabold leading-tight text-gray-900">
              Dale un hogar a quien
              <span className="text-orange-500">
                {" "}más lo necesita
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              En AdoptaHogar conectamos mascotas que buscan una familia con
              personas dispuestas a brindarles amor, cuidado y un hogar para
              siempre.
            </p>

            {/* BOTONES PRINCIPALES */}
            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="/explorar"
                className="rounded-full bg-orange-500 px-7 py-3 font-bold text-white shadow-md transition hover:bg-orange-600"
              >
                🐶 Ver mascotas
              </a>

              <button className="rounded-full border-2 border-orange-500 px-7 py-3 font-bold text-orange-600 transition hover:bg-orange-100">
                ❤️ Quiero adoptar
              </button>

            </div>
          </div>


          {/* ILUSTRACIÓN DE MASCOTAS */}
          <div className="flex justify-center">
            <div className="flex h-80 w-80 items-center justify-center rounded-full bg-orange-200 shadow-lg">

              <div className="text-center">
                <div className="text-8xl">🐶</div>
                <div className="mt-3 text-4xl">🐱</div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ==================== ESTADÍSTICAS ==================== */}
      <section className="bg-white py-12">

        <div className="mx-auto grid max-w-6xl gap-8 px-6 text-center md:grid-cols-3">

          {/* ESTADÍSTICA 1 */}
          <div>
            <p className="text-4xl font-extrabold text-orange-500">
              150+
            </p>

            <p className="mt-2 text-gray-600">
              Mascotas disponibles
            </p>
          </div>

          {/* ESTADÍSTICA 2 */}
          <div>
            <p className="text-4xl font-extrabold text-orange-500">
              320+
            </p>

            <p className="mt-2 text-gray-600">
              Adopciones realizadas
            </p>
          </div>

          {/* ESTADÍSTICA 3 */}
          <div>
            <p className="text-4xl font-extrabold text-orange-500">
              85+
            </p>

            <p className="mt-2 text-gray-600">
              Familias felices
            </p>
          </div>

        </div>
      </section>

      {/* ==================== NOSOTROS ==================== */}
      <section
        id="nosotros"
        className="bg-orange-500 px-6 py-20 text-white"
      >

        <div className="mx-auto max-w-5xl text-center">

          <h2 className="text-4xl font-extrabold">
            ¿Por qué adoptar?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-orange-50">
            Adoptar significa darle una segunda oportunidad a un animal que
            necesita una familia. En AdoptaHogar buscamos facilitar el proceso
            de adopción y crear conexiones responsables entre mascotas y
            familias.
          </p>


          {/* BENEFICIOS */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white/10 p-6">
              <div className="text-4xl">❤️</div>

              <h3 className="mt-4 text-xl font-bold">
                Amor
              </h3>

              <p className="mt-2 text-orange-50">
                Una mascota puede convertirse en un gran compañero.
              </p>
            </div>


            <div className="rounded-2xl bg-white/10 p-6">
              <div className="text-4xl">🏠</div>

              <h3 className="mt-4 text-xl font-bold">
                Un hogar
              </h3>

              <p className="mt-2 text-orange-50">
                Ayuda a una mascota a encontrar una familia.
              </p>
            </div>


            <div className="rounded-2xl bg-white/10 p-6">
              <div className="text-4xl">🐾</div>

              <h3 className="mt-4 text-xl font-bold">
                Una oportunidad
              </h3>

              <p className="mt-2 text-orange-50">
                Cada adopción puede cambiar una vida.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ==================== CONTACTO ==================== */}
      <section id="contacto" className="bg-white px-6 py-16">

        <div className="mx-auto max-w-4xl text-center">

          <h2 className="text-3xl font-extrabold text-gray-900">
            ¿Quieres adoptar?
          </h2>

          <p className="mt-4 text-gray-600">
            Explora nuestras mascotas y encuentra a tu nuevo mejor amigo.
          </p>

          <button className="mt-7 rounded-full bg-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600">
            Comenzar adopción 🐾
          </button>

        </div>
      </section>


      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 px-6 py-8 text-center text-gray-300">

        <p className="font-semibold text-white">
          🐾 AdoptaHogar
        </p>

        <p className="mt-2 text-sm">
          Conectando mascotas con familias responsables.
        </p>

        <p className="mt-4 text-xs text-gray-500">
          © 2026 AdoptaHogar. Todos los derechos reservados.
        </p>

      </footer>

    </main>
  );
}

