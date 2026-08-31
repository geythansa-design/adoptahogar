import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

interface Mascota {
    id: number;
    nombre: string;
    tipo: string;
    edad: string;
    descripcion: string;
    imagen: string | null;
    estado: string;
    sexo: string;
    raza: string | null;
}

interface DogApiResponse {
    message: string;
    status: string;
}

function obtenerRazaApi(raza: string | null) {
    if (!raza) return null;

    const mapaRazas: Record<string, string> = {
        "Yorkshire Terrier": "yorkshire",
        "Yorkie": "yorkshire",
        "Poodle": "poodle",
        "Caniche": "poodle",
        "Labrador": "labrador",
        "Beagle": "beagle",
    };

    return mapaRazas[raza] || raza.toLowerCase().replace(/\s+/g, "-");
}

export default async function MascotaDetallePage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { tipo?: string };
}) {
    const id = Number(params.id);
    const tipoRegreso = searchParams.tipo;

    const { data: mascota, error } = await supabase
        .from("mascotas")
        .select(
            "id, nombre, tipo, edad, descripcion, imagen, estado, sexo, raza"
        )
        .eq("id", id)
        .single();

    if (error || !mascota) {
        return (
            <main className="min-h-screen bg-orange-50 px-6 py-12">
                <div className="mx-auto max-w-4xl">

                    <div className="rounded-2xl bg-white p-10 text-center shadow-md">

                        <h1 className="text-3xl font-bold text-gray-900">
                            Mascota no encontrada
                        </h1>

                        <p className="mt-4 text-gray-600">
                            La mascota que buscas no existe.
                        </p>

                        <a
                            href={
                                tipoRegreso
                                    ? `/explorar?tipo=${encodeURIComponent(tipoRegreso)}`
                                    : "/explorar"
                            }
                            className="mt-8 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                        >
                            ← Volver
                        </a>

                    </div>

                </div>
            </main>
        );
    }

    const datos = mascota as Mascota;

    const esDisponible = datos.estado === "Disponible";

    let imagenRaza = "";
    let errorDogApi = false;

    if (
        datos.tipo === "Perro" &&
        datos.raza
    ) {
        const razaApi = obtenerRazaApi(datos.raza);

        if (razaApi) {
            try {
                const respuesta = await fetch(
                    `https://dog.ceo/api/breed/${razaApi}/images/random`,
                    {
                        next: { revalidate: 3600 },
                    }
                );

                if (respuesta.ok) {
                    const datosApi: DogApiResponse =
                        await respuesta.json();

                    if (datosApi.status === "success") {
                        imagenRaza = datosApi.message;
                    } else {
                        errorDogApi = true;
                    }
                } else {
                    errorDogApi = true;
                }
            } catch (error) {
                console.error("Error al consultar Dog API:", error);
                errorDogApi = true;
            }
        }
    }

    return (
        <main className="min-h-screen bg-orange-50 px-6 py-12">

            <div className="mx-auto max-w-5xl">

                <a
                    href={
                        tipoRegreso
                            ? `/explorar?tipo=${encodeURIComponent(tipoRegreso)}`
                            : "/explorar"
                    }
                    className="mb-6 inline-block font-semibold text-orange-600 hover:text-orange-700"
                >
                    ← Volver
                </a>

                <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

                    <div className="grid md:grid-cols-2">

                        <div className="h-96 bg-orange-100 md:h-full">

                            {datos.imagen ? (

                                <img
                                    src={datos.imagen}
                                    alt={`Foto de ${datos.nombre}`}
                                    className="h-full w-full object-cover"
                                />

                            ) : (

                                <div className="flex h-full min-h-96 items-center justify-center text-8xl">
                                    🐾
                                </div>

                            )}

                        </div>

                        <div className="p-8 md:p-10">

                            <span className="font-semibold text-orange-500">
                                CONOCE A
                            </span>

                            <h1 className="mt-2 text-4xl font-extrabold text-gray-900">
                                {datos.nombre}
                            </h1>

                            <p className="mt-4 text-lg text-gray-600">
                                {datos.tipo} · {datos.edad}
                            </p>

                            {datos.raza && (
                                <p className="mt-2 text-lg font-semibold text-orange-600">
                                    Raza: {datos.raza}
                                </p>
                            )}

                            <div className="mt-8">

                                <h2 className="text-xl font-bold text-gray-900">
                                    Sobre {datos.nombre}
                                </h2>

                                <p className="mt-3 leading-7 text-gray-600">
                                    {datos.descripcion}
                                </p>

                            </div>

                            <div className="mt-6">

                                <p className="font-semibold text-gray-700">
                                    Sexo
                                </p>

                                <p className="mt-1 text-gray-600">
                                    {datos.sexo}
                                </p>

                            </div>

                            <div className="mt-6">

                                <span
                                    className={`inline-block rounded-full px-4 py-2 font-semibold ${esDisponible
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {datos.estado}
                                </span>

                            </div>

                            {/* ================= DOG API ================= */}

                            {datos.tipo === "Perro" && datos.raza && (
                                <section className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-5">

                                    <span className="text-sm font-bold text-orange-500">
                                        INFORMACIÓN EXTERNA
                                    </span>

                                    <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
                                        {datos.raza}
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        Información de la raza consultada
                                        mediante Dog CEO API, una API externa
                                        especializada en datos de razas de perros.
                                    </p>

                                    {imagenRaza ? (
                                        <div className="mt-5 overflow-hidden rounded-xl">
                                            <img
                                                src={imagenRaza}
                                                alt={`Imagen de la raza ${datos.raza}`}
                                                className="h-56 w-full object-cover"
                                            />
                                        </div>
                                    ) : errorDogApi ? (
                                        <div className="mt-5 rounded-xl bg-white p-4 text-sm text-gray-600">
                                            No se pudo cargar la imagen externa
                                            de esta raza en este momento.
                                        </div>
                                    ) : null}

                                    <p className="mt-4 text-xs text-gray-400">
                                        Fuente: Dog CEO API
                                    </p>

                                </section>
                            )}

                            {/* ================= ADOPCIÓN ================= */}

                            {esDisponible ? (

                                <a
                                    href={`/solicitud?mascota=${datos.id}&nombre=${encodeURIComponent(datos.nombre)}`}
                                    className="mt-8 block w-full rounded-full bg-orange-500 px-6 py-4 text-center font-bold text-white transition hover:bg-orange-600"
                                >
                                    🐾 Quiero adoptar
                                </a>

                            ) : (

                                <div className="mt-8 rounded-xl bg-gray-100 p-4 text-center font-semibold text-gray-600">
                                    Esta mascota no está disponible para adopción.
                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}