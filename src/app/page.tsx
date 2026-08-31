"use client";

import { useEffect, useState } from "react";

interface RazaPerro {
  nombre: string;
  imagen: string;
}

export default function Home() {
  const [menuMascotasAbierto, setMenuMascotasAbierto] = useState(false);
  const [razas, setRazas] = useState<RazaPerro[]>([]);
  const [errorApi, setErrorApi] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("menu") === "mascotas") {
      setMenuMascotasAbierto(true);
    }

  }, []);

  useEffect(() => {
    async function cargarRazas() {
      try {
        const respuesta = await fetch(
          "https://dog.ceo/api/breeds/list/all"
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener la información");
        }

        const datos = await respuesta.json();

        const nombres = Object.keys(datos.message).slice(0, 12);

        const razasConImagenes = await Promise.all(
          nombres.map(async (nombre) => {
            try {
              const respuestaImagen = await fetch(
                `https://dog.ceo/api/breed/${nombre}/images/random`
              );

              const datosImagen = await respuestaImagen.json();

              return {
                nombre:
                  nombre.charAt(0).toUpperCase() + nombre.slice(1),
                imagen: datosImagen.message,
              };
            } catch {
              return {
                nombre:
                  nombre.charAt(0).toUpperCase() + nombre.slice(1),
                imagen: "",
              };
            }
          })
        );

        setRazas(razasConImagenes);
      } catch (error) {
        console.error("Error al consumir Dog API:", error);
        setErrorApi(
          "No se pudo cargar la información de la API."
        );
      }
    }

    cargarRazas();

  }, []);

  return (<main className="min-h-screen bg-orange-50 text-gray-800">

    {/* ==================== NAVBAR ==================== */}
    <nav className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <div className="flex items-center gap-2">
          <span className="text-3xl">🐾</span>

          <h1 className="text-2xl font-bold text-orange-600">
            AdoptaHogar
          </h1>
        </div>

        <div className="hidden items-center gap-8 md:flex">

          <a
            href="#inicio"
            className="font-medium text-gray-700 hover:text-orange-600"
          >
            Inicio
          </a>

          <div className="group relative">

            <button
              onClick={() =>
                setMenuMascotasAbierto(!menuMascotasAbierto)
              }
              className="font-medium text-gray-700 hover:text-orange-600"
            >
              Mascotas ▾
            </button>

            <div
              className={`absolute left-0 top-full z-50 mt-2 w-40 rounded-xl bg-white py-2 shadow-lg transition-all duration-200 ${menuMascotasAbierto
                ? "visible opacity-100"
                : "invisible opacity-0"
                }`}
            >

              <a
                href="/explorar?tipo=Perro"
                className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                🐶 Perros
              </a>

              <a
                href="/explorar?tipo=Gato"
                className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                🐱 Gatos
              </a>

            </div>
          </div>

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

          <a
            href="/login"
            className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
          >
            Iniciar sesión
          </a>

        </div>
      </div>
    </nav>

    {/* ==================== HERO ==================== */}
    <section
      id="inicio"
      className="mx-auto max-w-7xl px-6 py-20"
    >
      <div className="grid items-center gap-12 md:grid-cols-2">

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

          <div className="mt-8 flex flex-wrap gap-4">

            <a
              href="/explorar"
              className="rounded-full border-2 border-orange-500 px-7 py-3 font-bold text-orange-600 transition hover:bg-orange-100"
            >
              ❤️ Quiero adoptar
            </a>

          </div>
        </div>

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

        <div>
          <p className="text-4xl font-extrabold text-orange-500">
            150+
          </p>

          <p className="mt-2 text-gray-600">
            Mascotas disponibles
          </p>
        </div>

        <div>
          <p className="text-4xl font-extrabold text-orange-500">
            320+
          </p>

          <p className="mt-2 text-gray-600">
            Adopciones realizadas
          </p>
        </div>

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

    {/* ==================== API EXTERNA ==================== */}
    <section className="bg-white px-6 py-20">

      <div className="mx-auto max-w-7xl text-center">

        <span className="font-semibold text-orange-500">
          INFORMACIÓN EXTERNA
        </span>

        <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
          Razas de perros
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Consulta razas de perros obtenidas dinámicamente desde
          Dog CEO API. Selecciona una raza para conocer más información.
        </p>

        {errorApi ? (

          <div className="mt-10 rounded-2xl bg-orange-50 p-8 text-red-600 shadow-md">
            {errorApi}
          </div>

        ) : razas.length === 0 ? (

          <div className="mt-10 rounded-2xl bg-orange-50 p-8 text-gray-600 shadow-md">
            Cargando información de las razas...
          </div>

        ) : (

          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {razas.map((raza) => (

              <a
                key={raza.nombre}
                href={`/razas/${raza.nombre.toLowerCase()}`}
                className="overflow-hidden rounded-2xl bg-orange-50 text-left shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="h-48 overflow-hidden bg-orange-100">

                  {raza.imagen ? (

                    <img
                      src={raza.imagen}
                      alt={`Imagen de la raza ${raza.nombre}`}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center text-7xl">
                      🐶
                    </div>

                  )}

                </div>

                <div className="p-5">

                  <h3 className="text-xl font-bold capitalize text-gray-900">
                    {raza.nombre}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Información obtenida desde Dog CEO API.
                  </p>

                  <p className="mt-4 font-semibold text-orange-600">
                    Ver información →
                  </p>

                </div>

              </a>

            ))}

          </div>

        )}

        <p className="mt-8 text-xs text-gray-400">
          Información obtenida mediante fetch desde Dog CEO API.
        </p>

        <a
          href="/razas"
          className="mt-6 inline-block rounded-full bg-orange-500 px-7 py-3 font-bold text-white transition hover:bg-orange-600"
        >
          Ver todas las razas
        </a>

      </div>
    </section>

    {/* ==================== CONTACTO ==================== */}
    <section
      id="contacto"
      className="bg-orange-50 px-6 py-16"
    >

      <div className="mx-auto max-w-4xl text-center">

        <h2 className="text-3xl font-extrabold text-gray-900">
          ¿Quieres adoptar?
        </h2>

        <p className="mt-4 text-gray-600">
          Explora nuestras mascotas y encuentra a tu nuevo mejor amigo.
        </p>

        <a
          href="/explorar"
          className="mt-7 inline-block rounded-full bg-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600"
        >
          Explorar mascotas 🐾
        </a>

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
