import { supabase } from "@/lib/supabase";

export default async function PruebaSupabase() {
    const { data, error } = await supabase
        .from("mascotas")
        .select("*")
        .limit(5);

    return (
        <main className="min-h-screen bg-orange-50 p-10">
            <h1 className="text-3xl font-bold text-orange-600">
                Prueba de Supabase
            </h1>

            {error ? (
                <p className="mt-6 text-red-600">
                    Error: {error.message}
                </p>
            ) : (
                <pre className="mt-6 rounded-lg bg-white p-6 shadow">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </main>
    );
}