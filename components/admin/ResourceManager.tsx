'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { Download, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { resources, type Field, type ResourceKey } from '@/lib/admin-resources';
import { allPermissions, permissionSections, resourceSection } from '@/lib/permissions';
import { useAdminSession } from './session-context';

export type Row = Record<string, any>;

export const impact = { fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' };
const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none';

export async function fetchRows(resource: ResourceKey, optionsOnly = false): Promise<Row[]> {
  const response = await fetch(`/api/admin/resources/${resource}${optionsOnly ? '?options=1' : ''}`);
  if (response.status === 401) window.location.href = '/login';
  if (!response.ok) throw new Error('Could not load data');
  return (await response.json()).rows;
}

export async function saveRow(resource: ResourceKey, id: number | null, values: Row) {
  const response = await fetch(`/api/admin/resources/${resource}${id ? `/${id}` : ''}`, {
    method: id ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Could not save');
}

export const money = (value: unknown) =>
  `₵${Number(value ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const goodStatuses = ['active', 'paid', 'confirmed', 'done', 'announced', 'completed', 'income', 'created'];
const warnStatuses = ['pending', 'open', 'in progress', 'planning', 'prospect', 'contacted', 'medium', 'updated'];
const badStatuses = ['inactive', 'suspended', 'refunded', 'cancelled', 'declined', 'high', 'expense', 'deleted'];

export function Pill({ value }: { value: string }) {
  const tone = goodStatuses.includes(value)
    ? 'border-green-500/30 bg-green-500/10 text-green-300'
    : warnStatuses.includes(value)
      ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300'
      : badStatuses.includes(value)
        ? 'border-red-500/30 bg-red-500/10 text-red-300'
        : 'border-white/15 bg-white/5 text-neutral-300';
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap capitalize ${tone}`}>{value}</span>;
}

export function Tile({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold text-neutral-300">{label}</p>
      <p className="mt-2 text-4xl leading-none text-white" style={impact}>
        {value}
      </p>
      {detail && <p className="mt-2 text-sm text-neutral-400">{detail}</p>}
    </div>
  );
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-5xl leading-none text-white uppercase md:text-6xl" style={impact}>
        {title}
      </h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

function sourceLabel(row: Row, label: string) {
  return label.split('+').map((key) => row[key]).filter(Boolean).join(' · ');
}

export function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      // Centre-crop to the ID card's 4:5 portrait and keep it small enough to store with the record.
      const width = 240;
      const height = 300;
      const ratio = Math.max(width / image.width, height / image.height);
      const cropW = width / ratio;
      const cropH = height / ratio;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')?.drawImage(image, (image.width - cropW) / 2, (image.height - cropH) / 2, cropW, cropH, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That file could not be read as an image.'));
    };
    image.src = url;
  });
}

function PermissionsField({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const toggle = (key: string, on: boolean) => onChange(on ? [...value, key] : value.filter((p) => p !== key));
  return (
    <div>
      <div className="mb-2 flex gap-3 text-xs font-semibold">
        <button type="button" className="text-green-400 hover:text-green-300" onClick={() => onChange([...allPermissions])}>
          Select all
        </button>
        <button type="button" className="text-neutral-400 hover:text-white" onClick={() => onChange([])}>
          Clear
        </button>
      </div>
      <div className="rounded-xl border border-white/10">
        <div className="grid grid-cols-[1fr_4rem_4rem] border-b border-white/10 px-3 py-2 text-xs font-semibold text-neutral-400">
          <span>Section</span>
          <span className="text-center">View</span>
          <span className="text-center">Manage</span>
        </div>
        {permissionSections.map((section) => (
          <div key={section.key} className="grid grid-cols-[1fr_4rem_4rem] items-center px-3 py-1.5 text-sm text-neutral-200">
            <span>{section.label}</span>
            {['view', 'manage'].map((action) => {
              const key = `${section.key}.${action}`;
              return (
                <input
                  key={key}
                  type="checkbox"
                  aria-label={`${section.label} ${action}`}
                  checked={value.includes(key)}
                  onChange={(e) => toggle(key, e.target.checked)}
                  className="mx-auto h-4 w-4 accent-green-500"
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

type ManagerProps = {
  resource: ResourceKey;
  title?: string;
  singular?: string;
  /** Limits the list to these values and applies them to new records. */
  fixed?: Row;
  rowActions?: (row: Row, reload: () => void) => ReactNode;
  headerActions?: ReactNode;
  summary?: (rows: Row[]) => ReactNode;
  onChange?: () => void;
};

export default function ResourceManager({ resource, title, singular, fixed, rowActions, headerActions, summary, onChange }: ManagerProps) {
  const config = resources[resource];
  const name = singular ?? config.singular;
  const session = useAdminSession();
  const canManage = session.isAdmin || session.can(resourceSection(resource, fixed?.category), 'manage');
  const fields = useMemo(() => config.fields.filter((f) => !(fixed && f.name in fixed)), [config, fixed]);
  const columns = fields.filter((f) => f.table);
  const filters = fields.filter((f) => f.filter);
  const sourceKeys = useMemo(() => Array.from(new Set(fields.flatMap((f) => (f.source ? [f.source.resource] : [])))), [fields]);

  const [rows, setRows] = useState<Row[] | null>(null);
  const [sources, setSources] = useState<Record<string, Row[]>>({});
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Row | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    try {
      const [list, ...related] = await Promise.all([fetchRows(resource), ...sourceKeys.map((key) => fetchRows(key, true))]);
      setRows(list);
      setSources(Object.fromEntries(sourceKeys.map((key, index) => [key, related[index]])));
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, [resource, sourceKeys]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) reload();
    });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const display = useCallback(
    (field: Field, row: Row): string => {
      const value = row[field.name];
      if (field.type === 'source') {
        const match = sources[field.source!.resource]?.find((r) => r.id === value);
        return match ? sourceLabel(match, field.source!.label) : '—';
      }
      if (field.type === 'checkbox') return value ? 'Yes' : 'No';
      if (field.type === 'permissions') return `${(value ?? []).length} of ${allPermissions.length}`;
      if (value == null || value === '') return '—';
      if (field.type === 'money') return money(value);
      if (field.type === 'date') return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if (field.name === 'createdAt') return new Date(value).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      return String(value);
    },
    [sources]
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (rows ?? []).filter((row) => {
      if (fixed && Object.entries(fixed).some(([key, value]) => row[key] !== value)) return false;
      if (Object.entries(active).some(([key, value]) => value && String(row[key]) !== value)) return false;
      if (!term) return true;
      return config.fields.some((f) => f.type !== 'photo' && f.type !== 'permissions' && display(f, row).toLowerCase().includes(term));
    });
  }, [rows, fixed, active, search, config, display]);

  const openNew = () => {
    setFormError('');
    setEditing(Object.fromEntries(fields.filter((f) => f.type !== 'readonly').map((f) => [f.name, f.defaultValue ?? ''])));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setFormError('');
    try {
      const { id, ...rest } = editing;
      const values = Object.fromEntries(fields.filter((f) => f.type !== 'readonly').map((f) => [f.name, rest[f.name] ?? '']));
      await saveRow(resource, id ?? null, id ? values : { ...values, ...fixed });
      setEditing(null);
      await reload();
      onChange?.();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not save');
    }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete "${row[config.titleField]}"? This can't be undone.`)) return;
    const response = await fetch(`/api/admin/resources/${resource}/${row.id}`, { method: 'DELETE' });
    if (!response.ok) {
      window.alert((await response.json().catch(() => null))?.error ?? 'Could not delete');
      return;
    }
    await reload();
    onChange?.();
  };

  const exportCsv = () => {
    const exportable = config.fields.filter((f) => f.type !== 'photo' && f.type !== 'permissions');
    // A leading apostrophe stops spreadsheets running a value as a formula.
    const cell = (text: string) => `"${(/^[=+\-@]/.test(text) ? `'${text}` : text).replace(/"/g, '""')}"`;
    const csv = [exportable.map((f) => cell(f.label)), ...visible.map((row) => exportable.map((f) => cell(display(f, row))))].map((line) => line.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = `${(title ?? name).toLowerCase().replace(/\s+/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const setField = (key: string, value: unknown) => setEditing((current) => (current ? { ...current, [key]: value } : current));

  const renderInput = (field: Field) => {
    const value = editing?.[field.name] ?? '';
    const id = `field-${field.name}`;
    switch (field.type) {
      case 'textarea':
        return <textarea id={id} rows={3} value={value} onChange={(e) => setField(field.name, e.target.value)} className={inputClass} />;
      case 'select':
        return (
          <select id={id} value={value} onChange={(e) => setField(field.name, e.target.value)} className={`${inputClass} capitalize`}>
            {!field.required && <option value="">None</option>}
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'source':
        return (
          <select id={id} value={value ?? ''} onChange={(e) => setField(field.name, e.target.value)} className={inputClass}>
            <option value="">{field.required ? 'Choose…' : 'None'}</option>
            {sources[field.source!.resource]?.map((option) => (
              <option key={option.id} value={option.id}>
                {sourceLabel(option, field.source!.label)}
              </option>
            ))}
          </select>
        );
      case 'photo':
        return (
          <div className="flex items-center gap-4">
            {value ? (
              <Image src={value} alt="" width={64} height={80} unoptimized className="h-20 w-16 rounded-lg object-cover" />
            ) : (
              <span className="flex h-20 w-16 items-center justify-center rounded-lg bg-white/5 text-xs text-neutral-500">None</span>
            )}
            <div className="space-y-2">
              <input
                id={id}
                type="file"
                accept="image/*"
                className="block text-sm text-neutral-300 file:mr-3 file:rounded-full file:border-0 file:bg-green-500/15 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-300"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setField(field.name, await resizePhoto(file));
                  } catch (error) {
                    setFormError(error instanceof Error ? error.message : 'Could not read that image');
                  }
                }}
              />
              {value && (
                <button type="button" onClick={() => setField(field.name, '')} className="text-xs font-semibold text-red-400 hover:text-red-300">
                  Remove photo
                </button>
              )}
            </div>
          </div>
        );
      case 'permissions':
        return <PermissionsField value={Array.isArray(value) ? value : []} onChange={(next) => setField(field.name, next)} />;
      default: {
        const inputType = field.type === 'phone' ? 'tel' : field.type === 'money' ? 'text' : field.type === 'text' ? 'text' : field.type;
        return <input id={id} type={inputType} value={value} onChange={(e) => setField(field.name, e.target.value)} className={inputClass} />;
      }
    }
  };

  const buttonClass = 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors';

  return (
    <div>
      {title && (
        <PageTitle title={title}>
          {headerActions}
        </PageTitle>
      )}

      {summary && rows && <div className="mb-4">{summary(fixed ? visible : rows)}</div>}

      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
          <input aria-label="Search" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} rounded-full pl-10`} />
        </div>
        {filters.map((field) => (
          <select
            key={field.name}
            aria-label={`Filter by ${field.label}`}
            value={active[field.name] ?? ''}
            onChange={(e) => setActive((current) => ({ ...current, [field.name]: e.target.value }))}
            className={`${inputClass} rounded-full capitalize lg:w-44`}
          >
            <option value="">All {field.label.toLowerCase()}</option>
            {field.type === 'source'
              ? sources[field.source!.resource]?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {sourceLabel(option, field.source!.label)}
                  </option>
                ))
              : field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
          </select>
        ))}
        <button onClick={exportCsv} disabled={visible.length === 0} className={`${buttonClass} justify-center border border-white/15 text-white hover:bg-white/10 disabled:opacity-40`}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Export
        </button>
        {!config.readOnly && canManage && (
          <button onClick={openNew} className={`${buttonClass} justify-center bg-green-600 whitespace-nowrap text-white hover:bg-green-700`}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add {name}
          </button>
        )}
      </div>

      {loadError ? (
        <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          This list couldn&apos;t be loaded. Refresh to try again.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold text-neutral-400">
                {columns.map((field) => (
                  <th key={field.name} className="px-5 py-3 whitespace-nowrap">
                    {field.label}
                  </th>
                ))}
                {!config.readOnly && (
                  <th className="px-5 py-3 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visible.map((row) => (
                <tr key={row.id} className="text-neutral-200">
                  {columns.map((field) => (
                    <td key={field.name} className="max-w-xs truncate px-5 py-3">
                      {field.type === 'photo' ? (
                        row[field.name] ? (
                          <Image src={row[field.name]} alt="" width={36} height={45} unoptimized className="h-11 w-9 rounded-md object-cover" />
                        ) : (
                          <span className="flex h-11 w-9 items-center justify-center rounded-md bg-white/10 text-xs font-bold text-neutral-400">
                            {String(row[config.titleField] ?? '?').charAt(0).toUpperCase()}
                          </span>
                        )
                      ) : field.type === 'select' && row[field.name] ? (
                        <Pill value={row[field.name]} />
                      ) : (resource === 'activity' && field.name === 'action') ? (
                        <Pill value={row[field.name]} />
                      ) : (
                        display(field, row)
                      )}
                    </td>
                  ))}
                  {!config.readOnly && (
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        {rowActions?.(row, reload)}
                        {canManage && (<>
                        <button
                          aria-label={`Edit ${row[config.titleField]}`}
                          onClick={() => {
                            setFormError('');
                            setEditing({ ...row });
                          }}
                          className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button aria-label={`Delete ${row[config.titleField]}`} onClick={() => remove(row)} className="rounded-full p-2 text-neutral-400 hover:bg-red-500/10 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        </>)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-neutral-400">{rows === null ? 'Loading…' : search || Object.values(active).some(Boolean) ? 'No matches.' : `Nothing here yet.`}</p>
          )}
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="dark-form max-h-[90vh] overflow-y-auto rounded-[2rem] border-white/15 bg-[#0b0b0b] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editing?.id ? 'Edit' : 'Add'} {name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            {fields
              .filter((f) => f.type !== 'readonly')
              .map((field) =>
                field.type === 'checkbox' ? (
                  <label key={field.name} className="flex items-center gap-3 text-sm text-neutral-200">
                    <input type="checkbox" checked={Boolean(editing?.[field.name])} onChange={(e) => setField(field.name, e.target.checked)} className="h-4 w-4 accent-green-500" />
                    {field.label}
                  </label>
                ) : (
                  <div key={field.name}>
                    <label htmlFor={`field-${field.name}`} className="mb-1.5 block text-sm font-medium text-neutral-300">
                      {field.label}
                      {field.required && <span className="text-red-500"> *</span>}
                    </label>
                    {renderInput(field)}
                    {field.help && <p className="mt-1 text-xs text-neutral-500">{field.help}</p>}
                  </div>
                )
              )}
            {formError && (
              <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className={`${buttonClass} border border-white/15 text-white hover:bg-white/10`}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={`${buttonClass} bg-green-600 text-white hover:bg-green-700 disabled:opacity-60`}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
