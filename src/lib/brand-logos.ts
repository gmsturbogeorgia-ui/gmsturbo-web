/**
 * The bundled car-make logos under /public/images/brands.
 *
 * A make in /admin carries an optional `logo` upload, but filling 49 of them
 * by hand is the sort of chore that never gets finished, so a make with no
 * upload falls back to the file whose name matches its stable `value`:
 * "ALFA ROMEO" -> /images/brands/alfa-romeo.png.
 *
 * The list is checked rather than assumed — pointing an <img> at a file that
 * isn't there renders a broken tile, and a make with no logo either way is
 * drawn as a wordmark instead (see src/components/CarPicker).
 *
 * Regenerating: the files are plain PNGs; drop one in named after the make's
 * value, slugified, and add the slug here.
 */
const BUNDLED = new Set([
  "acura",
  "alfa-romeo",
  "audi",
  "bentley",
  "bmw",
  "buick",
  "cadillac",
  "chevrolet",
  "chrysler",
  "citroen",
  "dacia",
  "daewoo",
  "daihatsu",
  "dodge",
  "fiat",
  "ford",
  "foton",
  "gmc",
  "honda",
  "hyundai",
  "infiniti",
  "iveco",
  "jaguar",
  "jeep",
  "kia",
  "lada",
  "land-rover",
  "lexus",
  "lincoln",
  "man",
  "maserati",
  "mazda",
  "mercedes-benz",
  "mini",
  "mitsubishi",
  "nissan",
  "opel",
  "peugeot",
  "porsche",
  "renault",
  "skoda",
  "smart",
  "subaru",
  "suzuki",
  "tesla",
  "toyota",
  "volkswagen",
  "volvo",
  "zeekr",
]);

/* Makes are filed in /admin under whatever key the shop already used, which
   is not always the name the logo file carries. These are the short forms
   common enough to be worth mapping rather than making someone upload a
   duplicate logo for. */
const ALIASES: Record<string, string> = {
  vw: "volkswagen",
  volkswagon: "volkswagen",
  mercedes: "mercedes-benz",
  benz: "mercedes-benz",
  mb: "mercedes-benz",
  chevy: "chevrolet",
  alfa: "alfa-romeo",
  "range-rover": "land-rover",
  rover: "land-rover",
  vaz: "lada",
  // brandSlug() drops any letter outside a-z, so accented marques arrive here
  // already mangled: "CITROËN" -> "citro-n", "ŠKODA" -> "koda".
  "citro-n": "citroen",
  koda: "skoda",
};

/** "ALFA ROMEO" / "Alfa Romeo" -> "alfa-romeo". */
export function brandSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Path to the bundled logo for a make, or "" when none ships with the site. */
export function bundledBrandLogo(value: string): string {
  const slug = ALIASES[brandSlug(value)] ?? brandSlug(value);
  return BUNDLED.has(slug) ? `/images/brands/${slug}.png` : "";
}
