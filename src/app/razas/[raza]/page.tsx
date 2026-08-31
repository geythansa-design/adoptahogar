
interface ImagenResponse {
    message: string;
    status: string;
}

interface Props {
    params: {
        raza: string;
    };
}

export default async function RazaDetallePage({
    params,
}: Props) {

    const ruta = decodeURIComponent(params.raza);

    const partes = ruta.split("/");

    let imagen = "";
    let error = false;

    try {

        const endpoint = partes.length === 2
            ? `https://dog.ceo/api/breed/${partes[0]}/${partes[1]}/images/random`
            : `https://dog.ceo/api/breed/${partes[0]}/images/random`;

        const respuesta = await fetch(endpoint, {
            next: { revalidate: 3600 },
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la imagen");
        }

        const datos: ImagenResponse =
            await respuesta.json();

        imagen = datos.message;

    } catch (e) {

        console.error(
            "Error al consultar Dog API:",
            e
        );

        error = true;
    }

    const nombre = partes
        .map((parte) =>
            parte.charAt(0).toUpperCase() +
            parte.slice(1)
        )
        .join(" ");

    return (
        <main className="min-h-screen bg-orange-50 text-gray-800">

            <nav className="bg-white shadow-sm">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <div className="flex items-center gap-2">

                        <span className="text-3xl">
                            🐾
                        </span>

                        <h1 className="text-2xl font-bold text-orange-600">
                            AdoptaHogar
                        </h1>

                    </div>

                    <a
                        href="/razas"
                        className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                    >
                        ← Volver
                    </a>

                </div>

            </nav>

            <section className="mx-auto max-w-5xl px-6 py-16">

                {error ? (

                    <div className="rounded-2xl bg-white p-10 text-center shadow-xl">

                        <p className="text-xl font-bold text-red-600">
                            No se pudo cargar la información.
                        </p>

                        <p className="mt-3 text-gray-600">
                            Dog API no pudo proporcionar
                            información para esta raza.
                        </p>

                        <a
                            href="/razas"
                            className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
                        >
                            ← Volver a razas
                        </a>

                    </div>

                ) : (

                    <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

                        <div className="grid md:grid-cols-2">

                            <div className="flex min-h-[350px] items-center justify-center bg-orange-100 p-6">

                                {imagen && (

                                    <img
                                        src={imagen}
                                        alt={`Perro de raza ${nombre}`}
                                        className="max-h-[420px] w-full rounded-2xl object-cover"
                                    />

                                )}

                            </div>

                            <div className="p-8 md:p-10">

                                <span className="font-semibold text-orange-500">
                                    INFORMACIÓN DE DOG API
                                </span>

                                <h2 className="mt-3 text-4xl font-extrabold capitalize text-gray-900">
                                    {nombre}
                                </h2>

                                <p className="mt-5 leading-7 text-gray-600">
                                    Esta información se obtiene
                                    directamente mediante Dog API.
                                    La imagen mostrada corresponde
                                    a un ejemplar de la raza seleccionada.
                                </p>

                                <div className="mt-6 rounded-2xl bg-orange-50 p-5">

                                    <h3 className="font-bold text-gray-900">
                                        Datos de la consulta
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-600">
                                        <strong>Raza:</strong>{" "}
                                        {nombre}
                                    </p>

                                    <p className="mt-2 text-sm text-gray-600">
                                        <strong>Fuente:</strong>{" "}
                                        Dog API
                                    </p>

                                    <p className="mt-2 text-sm text-gray-600">
                                        <strong>Estado:</strong>{" "}
                                        Información obtenida correctamente
                                    </p>

                                </div>

                                <a
                                    href="/razas"
                                    className="mt-8 block rounded-full bg-orange-500 py-3 text-center font-bold text-white transition hover:bg-orange-600"
                                >
                                    ← Volver a razas
                                </a>

                            </div>

                        </div>

                    </div>

                )}

            </section>

            <footer className="bg-gray-900 px-6 py-8 text-center text-gray-300">

                <p className="font-semibold text-white">
                    🐾 AdoptaHogar
                </p>

                <p className="mt-2 text-sm">
                    Información proporcionada por Dog API.
                </p>

            </footer>

        </main>
    );
}
