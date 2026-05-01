import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRestaurants } from "@/lib/api";

const CUISINE_IMAGES: Record<string, string> = {
  Mexican: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  Asian: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80",
  Italian: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
  French: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  American: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
  Spanish: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&q=80",
  Indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80";

const TESTIMONIALS = [
  {
    name: "María González",
    role: "Foodie",
    text: "La mejor experiencia gastronómica que he tenido. El ambiente es increíble y la comida espectacular.",
    rating: 5,
    avatar: "MG",
  },
  {
    name: "Carlos Rivera",
    role: "Chef profesional",
    text: "Los sabores son auténticos y la presentación impecable. Un lugar que todo amante de la buena mesa debe visitar.",
    rating: 5,
    avatar: "CR",
  },
  {
    name: "Ana Martínez",
    role: "Cliente frecuente",
    text: "Reservé en segundos desde la página y todo fue perfecto. La atención del personal es de primera.",
    rating: 4,
    avatar: "AM",
  },
];

const FEATURES = [
  {
    icon: "🍽️",
    title: "Menú variado",
    description: "Platos para todos los gustos, desde entradas hasta postres artesanales.",
  },
  {
    icon: "📍",
    title: "Múltiples sedes",
    description: "Encuentra tu ubicación más cercana y reserva tu mesa favorita.",
  },
  {
    icon: "⭐",
    title: "Reseñas reales",
    description: "Opiniones verificadas de clientes que ya disfrutaron la experiencia.",
  },
  {
    icon: "📱",
    title: "Reserva fácil",
    description: "Reserva tu mesa en segundos, sin llamadas ni esperas.",
  },
];

export default async function HomePage() {
  let topRestaurants: { id: string; name: string; cuisineType: string; rating: number }[] = [];
  try {
    const { data } = await getRestaurants({ limit: 3 });
    topRestaurants = data;
  } catch {
    // landing still renders without backend
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Badge variant="secondary" className="mb-6 text-sm">
            Bienvenido a Restaurants
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Descubre tu próximo
            <br />
            <span className="text-primary-light">lugar favorito</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            Explora restaurantes, consulta sus menús, lee reseñas reales y
            reserva tu mesa en segundos.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/restaurants">
              <Button size="lg" className="h-12 px-8 text-base">
                Explorar restaurantes
              </Button>
            </Link>
            <a href="#reservar">
              <Button
                variant="outline"
                size="lg"
                className="h-12 border-white/30 px-8 text-base text-white hover:bg-white/10 hover:text-white"
              >
                Reservar mesa
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Todo lo que necesitas
          </h2>
          <p className="mt-2 text-muted-foreground">
            La plataforma completa para descubrir y disfrutar restaurantes.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="border-0 shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center text-center">
                <span className="text-4xl">{f.icon}</span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Top restaurants ──────────────────────────────── */}
      {topRestaurants.length > 0 && (
        <section className="bg-muted/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Restaurantes destacados
              </h2>
              <p className="mt-2 text-muted-foreground">
                Los mejor valorados por nuestra comunidad.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topRestaurants.map((r) => (
                <Link key={r.id} href={`/restaurants/${r.id}`} className="group block">
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img
                        src={CUISINE_IMAGES[r.cuisineType] ?? DEFAULT_IMAGE}
                        alt={r.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 backdrop-blur-sm"
                      >
                        {r.cuisineType}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {r.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-sm">
                        <span className="text-primary">
                          {"★".repeat(Math.floor(r.rating))}
                        </span>
                        <span className="text-muted-foreground">{r.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/restaurants">
                <Button variant="outline" size="lg">
                  Ver todos los restaurantes
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Lo que dicen nuestros clientes
            </h2>
            <p className="mt-2 text-muted-foreground">
              Reseñas reales de quienes ya vivieron la experiencia.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-primary">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {t.avatar ?? t.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Reserva ──────────────────────────────────── */}
      <section
        id="reservar"
        className="relative overflow-hidden bg-primary py-20"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Reserva tu mesa ahora
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Elige tu restaurante, selecciona la fecha y número de invitados.
            Sin llamadas, sin esperas.
          </p>
          <div className="mt-8">
            <Link href="/restaurants">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base"
              >
                Reservar ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
