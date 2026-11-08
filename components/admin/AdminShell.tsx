'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { canOpenPage } from '@/lib/permissions';
import { AdminSessionProvider, useAdminSession } from './session-context';
import { Activity, Banknote, CalendarDays, Camera, CheckCircle, Crown, Handshake, HandHeart, IdCard, LayoutDashboard, ListChecks, LogOut, Mail, Menu, MessageSquare, Music, Newspaper, ShieldCheck, ShoppingBasket, Store, Ticket, UserCheck, Users, Wallet, X } from 'lucide-react';

const D = '/admin/dashboard';
const groups = [
  { label: '', items: [{ name: 'Overview', href: `${D}/overview`, icon: LayoutDashboard }] },
  {
    label: 'People',
    items: [
      { name: 'Users', href: `${D}/users`, icon: Users },
      { name: 'Executives', href: `${D}/executives`, icon: Crown },
      { name: 'Volunteers', href: `${D}/volunteers`, icon: HandHeart },
      { name: 'Roles', href: `${D}/roles`, icon: ShieldCheck },
      { name: 'ID Cards', href: `${D}/id-cards`, icon: IdCard },
    ],
  },
  {
    label: 'Festival',
    items: [
      { name: 'Events', href: `${D}/events`, icon: CalendarDays },
      { name: 'Tickets', href: `${D}/tickets`, icon: Ticket },
      { name: 'POS', href: `${D}/pos`, icon: Banknote },
      { name: 'POS Tellers', href: `${D}/tellers`, icon: UserCheck },
      { name: 'Tasks', href: `${D}/tasks`, icon: ListChecks },
      { name: 'Budget', href: `${D}/budget`, icon: Wallet },
      { name: 'Sponsors', href: `${D}/sponsors`, icon: Handshake },
      { name: 'Vendors', href: `${D}/vendors`, icon: Store },
    ],
  },
  {
    label: 'Applications',
    items: [
      { name: 'Artists', href: `${D}/artists`, icon: Music },
      { name: 'Media', href: `${D}/media`, icon: Camera },
      { name: 'Accepted', href: `${D}/accepted`, icon: CheckCircle },
    ],
  },
  {
    label: 'Website',
    items: [
      { name: 'Newsletter', href: `${D}/newsletter`, icon: Mail },
      { name: 'Support', href: `${D}/support`, icon: MessageSquare },
      { name: 'Shop', href: `${D}/shop`, icon: ShoppingBasket },
      { name: 'News', href: `${D}/news`, icon: Newspaper },
    ],
  },
  { label: 'System', items: [{ name: 'Activity Log', href: `${D}/activity`, icon: Activity }] },
];

async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } finally {
    window.location.href = '/login';
  }
}

function Brand() {
  return (
    <Link href="/admin/dashboard/overview" className="flex items-center gap-3">
      <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
      <span>
        <span className="block text-sm font-bold tracking-tight text-white">TEENSRAVE</span>
        <span className="block text-xs text-neutral-500">Admin</span>
      </span>
    </Link>
  );
}

function Navigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const session = useAdminSession();
  const visibleGroups = groups
    .map((group) => ({ ...group, items: group.items.filter((item) => session.isAdmin || (session.loaded && canOpenPage(item.href.split('/').pop() ?? '', session.permissions))) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav aria-label="Admin" className="min-h-0 flex-1 space-y-5 overflow-y-auto [scrollbar-width:none]">
        {session.loaded && !session.isAdmin && (
          <Link href="/dashboard" className="flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold text-neutral-400 transition-colors hover:bg-white/10 hover:text-white">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            My Dashboard
          </Link>
        )}
        {visibleGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {group.label && <p className="px-4 pb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">{group.label}</p>}
            {group.items.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-green-400 ${
                    isActive
                      ? 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white shadow-sm'
                      : 'text-neutral-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-4 flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Log out
      </button>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Dialogs render on <body>, outside this tree, and need the dark theme too.
  useEffect(() => {
    document.body.classList.add('dark');
    return () => document.body.classList.remove('dark');
  }, []);

  return (
    <div className="dark site-shell flex h-screen bg-black text-white">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#030303] p-4 lg:flex">
        <div className="mb-8 px-2 pt-2">
          <Brand />
        </div>
        <Navigation pathname={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#030303] px-4 py-3 lg:hidden">
          <Brand />
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="rounded-full p-2 text-white hover:bg-white/10">
            <Menu className="h-5 w-5" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu backdrop" tabIndex={-1} className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#030303] p-4">
            <div className="mb-8 flex items-center justify-between px-2 pt-2">
              <Brand />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-full p-2 text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Navigation pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminSessionProvider>
      <Shell>{children}</Shell>
    </AdminSessionProvider>
  );
}
