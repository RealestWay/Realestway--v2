import { Property } from '../types';

/**
 * Generates a consistent, SEO-friendly URL for a property.
 * Format: /properties/[category]/[state]/[city]/[slug-or-id]
 */
export const getPropertyUrl = (property: Property): string => {
  if (!property) return '/search';

  const category = property.category || 'rent';
  const state = (property.state || 'nigeria').toLowerCase().replace(/\s+/g, '-');
  const city = (property.city || 'city').toLowerCase().replace(/\s+/g, '-');
  const slug = property.slug || property.id;

  return `/properties/${category}/${state}/${city}/${slug}`;
};
