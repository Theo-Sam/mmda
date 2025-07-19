// Utility to filter entities by district/jurisdiction
// Usage: filterByJurisdiction(user, entities, 'district')

export function filterByJurisdiction<T extends { district?: string }>(
  user: { role: string; district?: string },
  entities: T[],
  districtField: keyof T = 'district'
): T[] {
  if (user.role === 'super_admin') return entities;
  return entities.filter(e => e[districtField] === user.district);
} 