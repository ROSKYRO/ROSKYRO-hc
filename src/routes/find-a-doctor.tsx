import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteHeader";
import { DoctorCard } from "@/components/site/Cards";
import { AppointmentForm } from "@/components/site/Forms";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getDoctors, getDoctorsNearby, getPublicSettings } from "@/lib/server/public";
import type { Doctor } from "@/lib/types";

export const Route = createFileRoute("/find-a-doctor")({
  loader: async () => {
    const [settings, doctors] = await Promise.all([getPublicSettings(), getDoctors({ data: {} })]);
    return { settings, doctors };
  },
  head: () => ({
    meta: [
      { title: "Find a concierge doctor — ROSKYRO" },
      {
        name: "description",
        content: "Search ROSKYRO physicians by name, specialty, or city. Sort by distance from where you are.",
      },
    ],
  }),
  component: FindDoctor,
});

function FindDoctor() {
  const { settings, doctors: initial } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [list, setList] = useState<Doctor[]>(initial);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const specialties = useMemo(
    () => [...new Set(initial.map((d) => d.specialty))].sort(),
    [initial],
  );
  const cities = useMemo(() => [...new Set(initial.map((d) => d.city))].sort(), [initial]);

  async function applyFilters(nextQ = q, nextS = specialty, nextC = city) {
    const rows = await getDoctors({
      data: { q: nextQ || undefined, specialty: nextS || undefined, city: nextC || undefined },
    });
    setList(rows);
  }

  async function locateMe() {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Location is not available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const rows = await getDoctorsNearby({
            data: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
          setList(rows);
        } catch {
          setLocError("Could not sort by distance.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setLocError("Location permission denied. You can still filter by city.");
      },
    );
  }

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">Directory</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Find a concierge doctor</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Filter by name, specialty, or city. Use your location to sort by real distance.
        </p>

        <form
          className="mt-8 grid gap-3 rounded-[24px] border border-line bg-paper p-4 sm:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            void applyFilters();
          }}
        >
          <div className="sm:col-span-2">
            <Label htmlFor="q">Name or keyword</Label>
            <Input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Mehta, cardiology"
            />
          </div>
          <div>
            <Label htmlFor="specialty">Specialty</Label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-line bg-paper px-3"
            >
              <option value="">Any</option>
              {specialties.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-line bg-paper px-3"
            >
              <option value="">Any</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-4">
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={() => void locateMe()} disabled={locating}>
              {locating ? "Locating…" : "Use my location"}
            </Button>
          </div>
          {locError ? (
            <p className="text-sm text-danger sm:col-span-4" role="status">
              {locError}
            </p>
          ) : null}
        </form>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
        {list.length === 0 ? (
          <p className="mt-10 text-muted">No physicians match those filters.</p>
        ) : null}

        <div className="mt-16 max-w-xl">
          <AppointmentForm />
        </div>
      </div>
    </SiteShell>
  );
}
