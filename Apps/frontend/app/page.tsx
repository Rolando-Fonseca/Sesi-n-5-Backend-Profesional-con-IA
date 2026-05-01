export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        Restaurants
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Descubre restaurantes, ve sus menus, lee reseñas y reserva tu mesa.
      </p>
      <a
        href="/restaurants"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Ver restaurantes
      </a>
    </main>
  );
}
