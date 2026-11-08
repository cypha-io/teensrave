// Describes every admin-managed record type. Shared by the API (validation) and the UI (forms and tables),
// so this file must not import anything server-only.

export type FieldType =
  | 'text' | 'textarea' | 'email' | 'phone' | 'url' | 'number' | 'money' | 'date'
  | 'select' | 'checkbox' | 'source' | 'photo' | 'permissions' | 'readonly';

export type ResourceKey =
  | 'members' | 'roles' | 'events' | 'ticket-types' | 'ticket-sales'
  | 'tasks' | 'budget' | 'sponsors' | 'vendors' | 'activity';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  source?: { resource: ResourceKey; label: string };
  /** Show as a table column. */
  table?: boolean;
  /** Offer as a filter above the table. */
  filter?: boolean;
  help?: string;
  defaultValue?: unknown;
  max?: number;
};

export type ResourceConfig = {
  singular: string;
  titleField: string;
  fields: Field[];
  readOnly?: boolean;
  sortAsc?: string;
};

const notes: Field = { name: 'notes', label: 'Notes', type: 'textarea' };

export const resources: Record<ResourceKey, ResourceConfig> = {
  members: {
    singular: 'User',
    titleField: 'fullName',
    fields: [
      { name: 'photoUrl', label: 'Photo', type: 'photo', table: true },
      { name: 'memberCode', label: 'ID', type: 'readonly', table: true },
      { name: 'fullName', label: 'Full name', type: 'text', required: true, table: true },
      { name: 'category', label: 'Group', type: 'select', required: true, options: ['executive', 'volunteer', 'staff', 'crew'], defaultValue: 'staff', table: true, filter: true },
      { name: 'position', label: 'Position', type: 'text', table: true, help: 'Printed on the ID card, e.g. President or Stage Crew' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'roleId', label: 'Role', type: 'source', source: { resource: 'roles', label: 'name' }, table: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'phone', max: 50 },
      { name: 'emergencyContact', label: 'Emergency contact', type: 'text' },
      { name: 'validUntil', label: 'ID valid until', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['active', 'inactive', 'suspended'], defaultValue: 'active', table: true, filter: true },
      notes,
    ],
  },
  roles: {
    singular: 'Role',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Role name', type: 'text', required: true, max: 100, table: true },
      { name: 'description', label: 'Description', type: 'textarea', table: true },
      { name: 'permissions', label: 'Permissions', type: 'permissions', table: true, defaultValue: [] },
    ],
  },
  events: {
    singular: 'Event',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Event name', type: 'text', required: true, table: true },
      { name: 'eventDate', label: 'Date', type: 'date', table: true },
      { name: 'venue', label: 'Venue', type: 'text', table: true },
      { name: 'timeLabel', label: 'Time', type: 'text', max: 100, table: true, help: 'e.g. 11:00 AM - 10:00 PM' },
      { name: 'ticketUrl', label: 'Ticket sales link', type: 'url' },
      { name: 'isCurrent', label: 'Show this event on the public website', type: 'checkbox', table: true, defaultValue: false },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['planning', 'announced', 'completed', 'cancelled'], defaultValue: 'planning', table: true, filter: true },
      notes,
    ],
  },
  'ticket-types': {
    singular: 'Ticket Type',
    titleField: 'name',
    sortAsc: 'sortOrder',
    fields: [
      { name: 'name', label: 'Pass name', type: 'text', required: true, max: 100, table: true, help: 'Types sharing a name appear on one card on the website' },
      { name: 'admits', label: 'Admits', type: 'text', max: 100, table: true, help: 'e.g. Admits 3 Squad' },
      { name: 'tier', label: 'Tier', type: 'select', required: true, options: ['General Admission', 'VIP'], defaultValue: 'General Admission', table: true, filter: true },
      { name: 'price', label: 'Price (₵)', type: 'money', required: true, table: true },
      { name: 'capacity', label: 'Capacity', type: 'number', table: true, help: 'Leave blank for no limit' },
      { name: 'sortOrder', label: 'Display order', type: 'number', required: true, defaultValue: 0 },
      { name: 'isActive', label: 'On sale (show on website)', type: 'checkbox', table: true, defaultValue: true },
    ],
  },
  'ticket-sales': {
    singular: 'Sale',
    titleField: 'buyerName',
    fields: [
      { name: 'receiptCode', label: 'Receipt', type: 'readonly', table: true },
      { name: 'buyerName', label: 'Buyer', type: 'text', required: true, table: true },
      { name: 'ticketTypeId', label: 'Ticket', type: 'source', required: true, source: { resource: 'ticket-types', label: 'name+tier' }, table: true, filter: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, defaultValue: 1, table: true },
      { name: 'amount', label: 'Amount paid (₵)', type: 'money', table: true, help: 'Leave blank to use ticket price × quantity' },
      { name: 'channel', label: 'Channel', type: 'select', required: true, options: ['Chale', 'Cash', 'Mobile Money', 'Complimentary', 'Other'], defaultValue: 'Chale', table: true, filter: true },
      { name: 'paymentReference', label: 'Payment reference', type: 'text' },
      { name: 'buyerEmail', label: 'Buyer email', type: 'email' },
      { name: 'buyerPhone', label: 'Buyer phone', type: 'phone', max: 50 },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['paid', 'pending', 'refunded'], defaultValue: 'paid', table: true, filter: true },
      { name: 'checkedIn', label: 'Checked in', type: 'checkbox', table: true, defaultValue: false },
      { name: 'deviceLabel', label: 'Device', type: 'readonly', table: true },
      { name: 'soldBy', label: 'Sold by', type: 'readonly' },
    ],
  },
  tasks: {
    singular: 'Task',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Task', type: 'text', required: true, table: true },
      { name: 'assigneeId', label: 'Assigned to', type: 'source', source: { resource: 'members', label: 'fullName' }, table: true },
      { name: 'priority', label: 'Priority', type: 'select', required: true, options: ['low', 'medium', 'high'], defaultValue: 'medium', table: true, filter: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['open', 'in progress', 'done'], defaultValue: 'open', table: true, filter: true },
      { name: 'dueDate', label: 'Due', type: 'date', table: true },
      notes,
    ],
  },
  budget: {
    singular: 'Entry',
    titleField: 'description',
    fields: [
      { name: 'description', label: 'Description', type: 'text', required: true, max: 500, table: true },
      { name: 'kind', label: 'Type', type: 'select', required: true, options: ['income', 'expense'], defaultValue: 'expense', table: true, filter: true },
      { name: 'category', label: 'Category', type: 'text', required: true, max: 100, table: true },
      { name: 'amount', label: 'Amount (₵)', type: 'money', required: true, table: true },
      { name: 'entryDate', label: 'Date', type: 'date', table: true },
      notes,
    ],
  },
  sponsors: {
    singular: 'Sponsor',
    titleField: 'name',
    fields: [
      { name: 'photoUrl', label: 'Photo', type: 'photo', table: true, help: 'Shown on the ID card' },
      { name: 'name', label: 'Sponsor', type: 'text', required: true, table: true },
      { name: 'tier', label: 'Tier', type: 'select', options: ['Title', 'Gold', 'Silver', 'Bronze', 'In-kind'], table: true, filter: true },
      { name: 'contactName', label: 'Contact person', type: 'text', table: true },
      { name: 'contactEmail', label: 'Email', type: 'email' },
      { name: 'contactPhone', label: 'Phone', type: 'phone', max: 50 },
      { name: 'amount', label: 'Value (₵)', type: 'money', table: true },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['prospect', 'contacted', 'confirmed', 'declined'], defaultValue: 'prospect', table: true, filter: true },
      notes,
    ],
  },
  vendors: {
    singular: 'Vendor',
    titleField: 'name',
    fields: [
      { name: 'photoUrl', label: 'Photo', type: 'photo', table: true, help: 'Shown on the ID card' },
      { name: 'name', label: 'Vendor', type: 'text', required: true, table: true },
      { name: 'service', label: 'Service', type: 'text', table: true },
      { name: 'contactName', label: 'Contact person', type: 'text', table: true },
      { name: 'contactEmail', label: 'Email', type: 'email' },
      { name: 'contactPhone', label: 'Phone', type: 'phone', max: 50 },
      { name: 'fee', label: 'Fee (₵)', type: 'money', table: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: ['contacted', 'confirmed', 'paid', 'cancelled'], defaultValue: 'contacted', table: true, filter: true },
      notes,
    ],
  },
  activity: {
    singular: 'Activity',
    titleField: 'summary',
    readOnly: true,
    fields: [
      { name: 'createdAt', label: 'When', type: 'readonly', table: true },
      { name: 'actor', label: 'Admin', type: 'readonly', table: true },
      { name: 'action', label: 'Action', type: 'readonly', table: true },
      { name: 'resource', label: 'Section', type: 'readonly', table: true },
      { name: 'summary', label: 'Record', type: 'readonly', table: true },
    ],
  },
};

export function isResourceKey(value: string): value is ResourceKey {
  return Object.prototype.hasOwnProperty.call(resources, value);
}
