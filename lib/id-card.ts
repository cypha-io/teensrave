/* eslint-disable @typescript-eslint/no-explicit-any */
// Turns a person's record into what's printed on their card. Used by the admin print page and personal dashboards.

export type CardType = 'member' | 'media' | 'performer' | 'vendor' | 'sponsor';

export type CardPerson = {
  key: string;
  id: number;
  type: CardType;
  code: string;
  name: string;
  subtitle: string;
  badge: string;
  photo: string | null;
  details: [string, string][];
};

export function formatCardDate(value?: string | null) {
  return value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';
}

export function eventCardLabel(event?: { name: string; eventDate: string | null } | null) {
  if (!event) return 'Not set';
  return event.eventDate ? `${event.name} · ${formatCardDate(event.eventDate)}` : event.name;
}

const code = (prefix: string, id: number) => `${prefix}-${String(id).padStart(4, '0')}`;

export function toCardPerson(type: CardType, row: Record<string, any>, context: { roleName?: string; eventLabel: string }): CardPerson {
  const base = { key: `${type}-${row.id}`, id: row.id, type };
  const { roleName, eventLabel } = context;

  if (type === 'media') {
    return {
      ...base,
      code: code('MD', row.id),
      name: row.fullName,
      subtitle: row.mediaOutlet,
      badge: 'Media',
      photo: row.cardPhoto ?? null,
      details: [['Outlet', row.mediaOutlet], ['Media type', row.mediaType], ['Accreditation', row.accreditationCategory], ['Phone', row.phone], ['Valid for', eventLabel]],
    };
  }
  if (type === 'performer') {
    return {
      ...base,
      code: code('PF', row.id),
      name: row.stageName,
      subtitle: row.groupName || row.performanceCategory,
      badge: 'Performer',
      photo: row.cardPhoto ?? null,
      details: [['Category', row.performanceCategory], ['Act', row.groupName || row.performanceType], ['City', row.city], ['Phone', row.phone], ['Valid for', eventLabel]],
    };
  }
  if (type === 'vendor' || type === 'sponsor') {
    const isVendor = type === 'vendor';
    return {
      ...base,
      code: code(isVendor ? 'VN' : 'SP', row.id),
      name: row.contactName || row.name,
      subtitle: row.contactName ? row.name : isVendor ? row.service || '' : row.tier ? `${row.tier} Sponsor` : '',
      badge: isVendor ? 'Vendor' : 'Sponsor',
      photo: row.photoUrl ?? null,
      details: [
        ['Company', row.name],
        [isVendor ? 'Service' : 'Tier', (isVendor ? row.service : row.tier) || 'Not set'],
        ['Phone', row.contactPhone || 'Not set'],
        ['Email', row.contactEmail || 'Not set'],
        ['Valid for', eventLabel],
      ],
    };
  }
  return {
    ...base,
    code: row.memberCode,
    name: row.fullName,
    subtitle: row.position || roleName || '',
    badge: row.category,
    photo: row.photoUrl ?? null,
    details: [
      ['Role', roleName || 'Not assigned'],
      ['Department', row.department || 'Not set'],
      ['Phone', row.phone || 'Not set'],
      ['Emergency', row.emergencyContact || 'Not set'],
      ['Valid until', formatCardDate(row.validUntil)],
    ],
  };
}
