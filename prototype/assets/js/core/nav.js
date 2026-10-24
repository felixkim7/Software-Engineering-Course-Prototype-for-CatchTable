// URLs are resolved against the prototype root (derived from this module's own URL), so links
// work on a local server and under a project subpath such as GitHub Pages.
const PROTOTYPE_ROOT = new URL('../../../', import.meta.url);

/** pageUrl('customer/restaurant.html', { restaurantId: 'r1' }) */
export function pageUrl(path, params = {}) {
  const url = new URL(path, PROTOTYPE_ROOT);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.href;
}

export function queryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
