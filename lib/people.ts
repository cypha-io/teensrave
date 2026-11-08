/* eslint-disable @typescript-eslint/no-explicit-any */
import { artistApplications, mediaAccreditation, members, sponsors, vendors } from '@/lib/schema';

export type AccountType = 'member' | 'media' | 'performer' | 'vendor' | 'sponsor';

// Where each kind of person lives, and when they are allowed to sign in.
export const personSources: Record<AccountType, { table: any; emailField: string; nameField: string; isActive: (row: any) => boolean }> = {
  member: { table: members, emailField: 'email', nameField: 'fullName', isActive: (row) => row.status === 'active' },
  media: { table: mediaAccreditation, emailField: 'email', nameField: 'fullName', isActive: (row) => row.status === 'approved' },
  performer: { table: artistApplications, emailField: 'email', nameField: 'stageName', isActive: (row) => row.status === 'approved' },
  vendor: { table: vendors, emailField: 'contactEmail', nameField: 'name', isActive: (row) => row.status !== 'cancelled' },
  sponsor: { table: sponsors, emailField: 'contactEmail', nameField: 'name', isActive: (row) => row.status !== 'declined' },
};

export function isAccountType(value: unknown): value is AccountType {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(personSources, value);
}
