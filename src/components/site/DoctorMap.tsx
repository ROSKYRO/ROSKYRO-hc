import { useEffect, useRef } from "react";

type LeafletMap = {
  setView: (ll: [number, number], z: number) => LeafletMap;
  remove: () => void;
};
type LeafletNs = {
  map: (el: HTMLElement) => LeafletMap;
  tileLayer: (url: string, opts: Record<string, unknown>) => { addTo: (m: LeafletMap) => void };
  marker: (ll: [number, number]) => { addTo: (m: LeafletMap) => { bindPopup: (s: string) => void } };
  Icon: { Default: { mergeOptions: (opts: Record<string, string>) => void } };
};

declare global {
  interface Window {
    L?: LeafletNs;
  }
}

async function loadLeaflet() {
  if (window.L) return window.L;
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }
  await new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
    if (existing) {
      if (window.L) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Leaflet failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.body.appendChild(script);
  });
  return window.L!;
}

export function DoctorMap({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: LeafletMap | undefined;
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !ref.current) return;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      map = L.map(ref.current).setView([lat, lng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
      L.marker([lat, lng]).addTo(map).bindPopup(name);
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [lat, lng, name]);

  return (
    <div
      ref={ref}
      className="h-72 w-full overflow-hidden rounded-[20px] border border-line"
      role="img"
      aria-label={`Map showing location of ${name}`}
    />
  );
}
