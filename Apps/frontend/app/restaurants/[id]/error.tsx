"use client";

export default function RestaurantDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const is404 = "status" in error && (error as { status: number }).status === 404;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="h-16 w-16 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <h2 className="mt-4 text-lg font-medium">
          {is404
            ? "Restaurante no encontrado"
            : "Error al cargar el restaurante"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {is404
            ? "Este restaurante no existe o fue eliminado."
            : error.message || "Ocurrio un error inesperado."}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Reintentar
          </button>
          <a
            href="/restaurants"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Ver catalogo
          </a>
        </div>
      </div>
    </main>
  );
}
