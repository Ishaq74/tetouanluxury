// Translation function for middleware and other non-component contexts
export function t(key: string, lang: string = 'fr'): string {
  // This is a simple pass-through implementation
  // In production, you would load translations from a file or database
  return key;
}
