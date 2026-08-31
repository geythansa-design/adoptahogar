interface RazasResponse {
    message: {
        [raza: string]: string[];
    };
    status: string;
}

export default async function RazasPage() {
    let razas: string[] = [];
    let error = false;

    try {
        const respuesta = await fetch(
            "https://dog.ceo/api/breeds/list/all",
            {
                next: { revalidate: 3600 },
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar la API");
        }

        const datos: RazasResponse = await respuesta.json();

        razas = Object.keys(datos.message).slice(0, 30);
    } catch (e) {
        console.error("Error al consumir Dog API:", e);
        error = true;
    }

    return (
        <main className="min-h-screen bg-orange-50 text-gray-800">

            <nav className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <div className="flex items-center gap-2">
                        <span className="text-3xl">🐾</span>

                        <h1 className="text-2xl font-bold text-orange-600">
                            AdoptaHogar
                        </h1>
                    </div>

                    <a
                        href="/"
                        className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                    >
                        ← Volver
                    </a>

                </div>
            </nav>

            <section className="mx-auto max-w-6xl px-6 py-16">

                <div className="mb-12 text-center">

                    <span className="font-semibold text-orange-500">
                        INFORMACIÓN EXTERNA
                    </span>

                    <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
                        Razas de perros
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Consulta información de razas obtenida desde una API
                        externa relacionada con nuestra temática.
                    </p>

                </div>

                {error ? (

                    <div className="rounded-2xl bg-white p-10 text-center shadow-md">
                        <p className="text-lg font-semibold text-red-600">
                            No se pudo cargar la información.
                        </p>

                        <p className="mt-2 text-gray-600">
                            Intenta nuevamente más tarde.
                        </p>
                    </div>

                ) : (

                    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                        {razas.map((raza) => (

                            <div
                                key={raza}
                                className="rounded-2xl bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                <div className="text-4xl">
                                    🐶
                                </div>

                                <h3 className="mt-3 text-lg font-bold capitalize text-gray-900">
                                    {raza}
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Información obtenida mediante API externa
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </section>

            <footer className="bg-gray-900 px-6 py-8 text-center text-gray-300">

                <p className="font-semibold text-white">
                    🐾 AdoptaHogar
                </p>

                <p className="mt-2 text-sm">
                    Información de referencia proporcionada por Dog API.
                </p>

            </footer>

        </main>
    );
}
