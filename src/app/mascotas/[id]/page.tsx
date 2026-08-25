interface Mascota {
    id: number;
    nombre: string;
    tipo: string;
    edad: string;
    imagen: string;
    descripcion: string;
}

const mascotas: Mascota[] = [
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

interface MascotaDetalleProps {
    params: {
        id: string;
    };
}

export default function MascotaDetallePage({
    params,
}: MascotaDetalleProps) {
    const mascota = mascotas.find(
        (item) => item.id === Number(params.id)
    );

    if (!mascota) {
        return (
            <main className="min-h-screen bg-orange-50 px-6 py-12">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Mascota no encontrada
                    </h1>

                    <p className="mt-4 text-gray-600">
                        La mascota que buscas no existe.
                    </p>

                    <a
                        href="/explorar"
                        className="mt-8 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                    >
                        ← Volver a mascotas
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-orange-50 text-gray-800">
            {/* NAVBAR */}
            <nav className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">🐾</span>

                        <h1 className="text-2xl font-bold text-orange-600">
                            AdoptaHogar
                        </h1>
                    </div>

                    <a
                        href="/explorar"
                        className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                    >
                        ← Volver a mascotas
                    </a>
                </div>
            </nav>

            {/* DETALLE */}
            <section className="mx-auto max-w-5xl px-6 py-16">
                <div className="grid overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
                    {/* IMAGEN */}
                    <div className="h-[450px] bg-orange-100">
                        <img
                            src={mascota.imagen}
                            alt={`Foto de ${mascota.nombre}`}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* INFORMACIÓN */}
                    <div className="flex flex-col justify-center p-8 md:p-12">
                        <span className="w-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                            🐾 {mascota.tipo}
                        </span>

                        <h2 className="mt-5 text-5xl font-extrabold text-gray-900">
                            {mascota.nombre}
                        </h2>

                        <p className="mt-4 text-lg text-gray-600">
                            🐾 {mascota.tipo} · {mascota.edad}
                        </p>

                        <p className="mt-6 text-lg leading-relaxed text-gray-600">
                            {mascota.descripcion}
                        </p>

                        <div className="mt-8 rounded-2xl bg-orange-50 p-5">
                            <p className="font-semibold text-gray-900">
                                ❤️ ¿Quieres darle un hogar?
                            </p>

                            <p className="mt-2 text-sm text-gray-600">
                                Puedes iniciar el proceso de adopción y conocer más sobre
                                {` ${mascota.nombre}`}.
                            </p>
                        </div>

                        <button className="mt-8 rounded-full bg-orange-500 px-7 py-3 font-bold text-white shadow-md transition hover:bg-orange-600">
                            ❤️ Quiero adoptar a {mascota.nombre}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}