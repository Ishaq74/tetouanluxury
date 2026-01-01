export function getRouteFromUrl(url: URL): string {
  const pathname = url.pathname;
  return pathname;
}

export function useTranslatedPath() {
  return (path: string) => path;
}
