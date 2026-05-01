"use client";

import { useState } from "react";
import { createBooking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Booking } from "@/types";

type BookingFormProps = {
  restaurantId: string;
  menuId?: string;
};

export function BookingForm({ restaurantId }: BookingFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const date = form.get("date") as string;
    const time = form.get("time") as string;

    try {
      const { data } = await createBooking({
        restaurantId,
        userId: "guest",
        reservationDateTime: `${date}T${time}:00.000Z`,
        numberOfGuests: Number(form.get("guests")),
        guestName: form.get("name") as string,
        guestPhone: form.get("phone") as string,
        guestEmail: form.get("email") as string,
        specialRequests: (form.get("requests") as string) || undefined,
      });
      setBooking(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al reservar");
      setStatus("error");
    }
  }

  if (status === "success" && booking) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground">
            ✓
          </div>
          <h3 className="mt-4 text-xl font-bold">Reserva confirmada</h3>
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <p>
              <strong>Nombre:</strong> {booking.guestName}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(booking.reservationDateTime).toLocaleDateString("es-MX", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Hora:</strong>{" "}
              {new Date(booking.reservationDateTime).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Invitados:</strong> {booking.numberOfGuests}
            </p>
            <p>
              <strong>Estado:</strong> {booking.status}
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setStatus("idle");
              setBooking(null);
            }}
          >
            Hacer otra reserva
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservar mesa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nombre</label>
              <input
                name="name"
                required
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Telefono</label>
              <input
                name="phone"
                type="tel"
                required
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="+52 555 1234"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Fecha</label>
              <input
                name="date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Hora</label>
              <input
                name="time"
                type="time"
                required
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Numero de invitados
            </label>
            <select
              name="guests"
              required
              defaultValue={2}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "persona" : "personas"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Solicitudes especiales
            </label>
            <textarea
              name="requests"
              rows={3}
              maxLength={500}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Alergias, ocasion especial, preferencias..."
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Reservando..." : "Confirmar reserva"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
