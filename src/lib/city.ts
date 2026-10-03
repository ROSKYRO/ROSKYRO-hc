/** URL-safe slug for a city name: "Navi Mumbai" -> "navi-mumbai". */
export function citySlug(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
