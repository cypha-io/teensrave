"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Camera, CheckCircle, Clock, ListChecks, Mail, MessageSquare, Music, Ticket, Users, Wallet, XCircle, type LucideIcon } from "lucide-react";

type Submission = { id: number; status: string; submittedAt: string };
type Artist = Submission & { stageName: string };
type Media = Submission & { fullName: string };
type Contact = Submission & { firstName: string; lastName: string; subject: string };
type Subscriber = { id: number; email: string; isActive: boolean; subscribedAt: string };

type Data = {
  artists: Artist[];
  media: Media[];
  contacts: Contact[];
  subscribers: Subscriber[];
  articles: { isPublished: boolean }[];
  products: unknown[];
  orders: unknown[];
  members: { status: string; category: string }[];
  sales: { status: string; quantity: number; amount: string | null }[];
  tasks: { status: string }[];
};

async function load<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (response.status === 401) {
    window.location.href = "/login";
  }
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
}

const statusStyles: Record<string, { label: string; icon: LucideIcon; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300" },
  approved: { label: "Approved", icon: CheckCircle, className: "border-green-500/30 bg-green-500/10 text-green-300" },
  rejected: { label: "Rejected", icon: XCircle, className: "border-red-500/30 bg-red-500/10 text-red-300" },
  unread: { label: "Unread", icon: AlertCircle, className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300" },
  read: { label: "Read", icon: CheckCircle, className: "border-white/15 bg-white/5 text-neutral-300" },
  replied: { label: "Replied", icon: CheckCircle, className: "border-green-500/30 bg-green-500/10 text-green-300" },
  subscribed: { label: "Subscribed", icon: CheckCircle, className: "border-green-500/30 bg-green-500/10 text-green-300" },
};

function StatusPill({ status }: { status: string }) {
  const style = statusStyles[status] ?? { label: status, icon: Clock, className: "border-white/15 bg-white/5 text-neutral-300" };
  const Icon = style.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.className}`}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {style.label}
    </span>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 md:p-6">
      <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

function StatTile({ label, value, detail, href, icon: Icon }: { label: string; value: number; detail: string; href: string; icon: LucideIcon }) {
  return (
    <Link href={href} className="group rounded-[2rem] border border-white/10 bg-white/5 p-5 transition-colors hover:border-green-500/50 md:p-6">
      <span className="flex items-center justify-between text-sm font-semibold text-neutral-300">
        {label}
        <Icon className="h-4 w-4 text-green-400" aria-hidden="true" />
      </span>
      <span
        className="mt-3 block text-5xl leading-none text-white"
        style={{ fontFamily: "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif" }}
      >
        {value.toLocaleString()}
      </span>
      <span className="mt-2 block text-sm text-neutral-400">{detail}</span>
    </Link>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function OverviewPage() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      load<{ applications?: Artist[] }>("/api/artists"),
      load<{ applications?: Media[] }>("/api/media-accreditation"),
      load<{ contacts?: Contact[] }>("/api/contact"),
      load<{ subscribers?: Subscriber[] }>("/api/newsletter"),
      load<{ articles?: { isPublished: boolean }[] }>("/api/news"),
      load<{ items?: unknown[] }>("/api/shop/items"),
      load<{ orders?: unknown[] }>("/api/shop/orders"),
      load<{ rows: Data["members"] }>("/api/admin/resources/members"),
      load<{ rows: Data["sales"] }>("/api/admin/resources/ticket-sales"),
      load<{ rows: Data["tasks"] }>("/api/admin/resources/tasks"),
    ])
      .then(([artists, media, contacts, subscribers, news, items, orders, members, sales, tasks]) =>
        setData({
          artists: artists.applications ?? [],
          media: media.applications ?? [],
          contacts: contacts.contacts ?? [],
          subscribers: subscribers.subscribers ?? [],
          articles: news.articles ?? [],
          products: items.items ?? [],
          orders: orders.orders ?? [],
          members: members.rows,
          sales: sales.rows,
          tasks: tasks.rows,
        })
      )
      .catch(() => setError(true));
  }, []);

  const heading = (
    <h1 className="mb-8 text-5xl leading-none text-white uppercase md:text-6xl" style={{ fontFamily: "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif" }}>
      Overview
    </h1>
  );

  if (error) {
    return (
      <>
        {heading}
        <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          The dashboard data couldn&apos;t be loaded. Refresh to try again.
        </p>
      </>
    );
  }

  if (!data) {
    return (
      <>
        {heading}
        <p className="text-neutral-400">Loading…</p>
      </>
    );
  }

  const pendingArtists = data.artists.filter((a) => a.status === "pending").length;
  const pendingMedia = data.media.filter((a) => a.status === "pending").length;
  const unread = data.contacts.filter((c) => c.status === "unread").length;
  const activeSubscribers = data.subscribers.filter((s) => s.isActive).length;
  const published = data.articles.filter((a) => a.isPublished).length;

  const paidSales = data.sales.filter((s) => s.status === "paid");
  const ticketsSold = paidSales.reduce((sum, s) => sum + s.quantity, 0);
  const revenue = paidSales.reduce((sum, s) => sum + Number(s.amount ?? 0), 0);
  const activeTeam = data.members.filter((m) => m.status === "active");
  const openTasks = data.tasks.filter((t) => t.status !== "done").length;

  const queue = [
    { label: "Artist applications to review", count: pendingArtists, href: "/admin/dashboard/artists", icon: Music },
    { label: "Media applications to review", count: pendingMedia, href: "/admin/dashboard/media", icon: Camera },
    { label: "Unread messages", count: unread, href: "/admin/dashboard/support", icon: MessageSquare },
  ].filter((item) => item.count > 0);

  const activity = [
    ...data.artists.map((a) => ({ key: `artist-${a.id}`, title: a.stageName, kind: "Artist application", status: a.status, date: a.submittedAt })),
    ...data.media.map((a) => ({ key: `media-${a.id}`, title: a.fullName, kind: "Media application", status: a.status, date: a.submittedAt })),
    ...data.contacts.map((c) => ({ key: `contact-${c.id}`, title: `${c.firstName} ${c.lastName}`, kind: c.subject, status: c.status, date: c.submittedAt })),
    ...data.subscribers.map((s) => ({ key: `newsletter-${s.id}`, title: s.email, kind: "Newsletter signup", status: "subscribed", date: s.subscribedAt })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <>
      {heading}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Artists" value={data.artists.length} detail={`${pendingArtists} pending`} href="/admin/dashboard/artists" icon={Music} />
        <StatTile label="Media" value={data.media.length} detail={`${pendingMedia} pending`} href="/admin/dashboard/media" icon={Camera} />
        <StatTile label="Messages" value={data.contacts.length} detail={`${unread} unread`} href="/admin/dashboard/support" icon={MessageSquare} />
        <StatTile label="Newsletter" value={data.subscribers.length} detail={`${activeSubscribers} active`} href="/admin/dashboard/newsletter" icon={Mail} />
        <StatTile label="Tickets sold" value={ticketsSold} detail={`₵${revenue.toLocaleString("en-GB", { maximumFractionDigits: 2 })} revenue`} href="/admin/dashboard/tickets" icon={Ticket} />
        <StatTile label="Team" value={activeTeam.length} detail={`${activeTeam.filter((m) => m.category === "volunteer").length} volunteers`} href="/admin/dashboard/users" icon={Users} />
        <StatTile label="Open tasks" value={openTasks} detail={`${data.tasks.length} total`} href="/admin/dashboard/tasks" icon={ListChecks} />
        <StatTile label="Shop orders" value={data.orders.length} detail={`${data.products.length} products`} href="/admin/dashboard/shop" icon={Wallet} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <Panel title="Needs attention">
            {queue.length === 0 ? (
              <p className="text-sm text-neutral-400">Nothing waiting for review.</p>
            ) : (
              <ul className="space-y-2">
                {queue.map(({ label, count, href, icon: Icon }) => (
                  <li key={href}>
                    <Link href={href} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-sm text-neutral-200 transition-colors hover:bg-white/10">
                      <Icon className="h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
                      <span className="min-w-0 flex-1">{label}</span>
                      <span className="font-bold text-white">{count}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Content">
            <dl className="space-y-3 text-sm">
              {[
                ["Published articles", published],
                ["Draft articles", data.articles.length - published],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-neutral-400">{label}</dt>
                  <dd className="font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel title="Recent activity">
            {activity.length === 0 ? (
              <p className="py-10 text-center text-sm text-neutral-400">
                No submissions yet. New applications, messages and signups will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-white/10">
                {activity.map((item) => (
                  <li key={item.key} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                      <p className="truncate text-xs text-neutral-400">
                        {item.kind} · {formatDate(item.date)}
                      </p>
                    </div>
                    <StatusPill status={item.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
