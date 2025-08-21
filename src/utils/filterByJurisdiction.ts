// Utility to filter entities by district/jurisdiction
// Usage: filterByJurisdiction(user, entities, 'district')

export function filterByJurisdiction<T extends { district?: string }>(
  user: { role: string; district?: string },
  entities: T[] | undefined,
  districtField: keyof T = 'district'
): T[] {
  if (!entities || !Array.isArray(entities)) return [];
  if (user.role === 'super_admin') return entities;
  return entities.filter(e => e[districtField] === user.district);
} 