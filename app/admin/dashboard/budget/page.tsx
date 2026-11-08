'use client';

import ResourceManager, { money, Tile, type Row } from '@/components/admin/ResourceManager';

function Summary({ rows }: { rows: Row[] }) {
  const total = (kind: string) => rows.filter((r) => r.kind === kind).reduce((sum, r) => sum + Number(r.amount), 0);
  const income = total('income');
  const expenses = total('expense');
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Tile label="Income" value={money(income)} />
      <Tile label="Expenses" value={money(expenses)} />
      <Tile label="Balance" value={`${income - expenses < 0 ? '-' : ''}${money(Math.abs(income - expenses))}`} />
    </div>
  );
}

export default function BudgetPage() {
  return <ResourceManager resource="budget" title="Budget" summary={(rows) => <Summary rows={rows} />} />;
}
