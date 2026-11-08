export const permissionSections = [
  { key: 'users', label: 'Users' },
  { key: 'executives', label: 'Executives' },
  { key: 'volunteers', label: 'Volunteers' },
  { key: 'roles', label: 'Roles & Permissions' },
  { key: 'artists', label: 'Artist Applications' },
  { key: 'media', label: 'Media Applications' },
  { key: 'events', label: 'Events' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'pos', label: 'POS (Manage = can sell and admit)' },
  { key: 'tellers', label: 'POS Tellers (allowances)' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'budget', label: 'Budget' },
  { key: 'sponsors', label: 'Sponsors' },
  { key: 'vendors', label: 'Vendors' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'support', label: 'Support' },
  { key: 'shop', label: 'Shop' },
  { key: 'news', label: 'News' },
  { key: 'activity', label: 'Activity Log' },
] as const;

export const allPermissions: string[] = permissionSections.flatMap((section) => [`${section.key}.view`, `${section.key}.manage`]);

/** Admin-area pages a non-admin can open, and the permissions each one needs. Anything not listed is admin-only. */
export const pagePermissions: Record<string, string[]> = {
  ...Object.fromEntries(permissionSections.map((section) => [section.key, [`${section.key}.view`]])),
  accepted: ['artists.view', 'media.view'],
  pos: ['pos.manage'],
};

export function canOpenPage(segment: string, permissions: string[]) {
  const needed = pagePermissions[segment];
  return Boolean(needed) && needed.every((permission) => permissions.includes(permission));
}

export function resourceSection(resource: string, category?: string) {
  if (resource === 'members') return category === 'executive' ? 'executives' : category === 'volunteer' ? 'volunteers' : 'users';
  if (resource === 'ticket-types' || resource === 'ticket-sales') return 'tickets';
  return resource;
}
