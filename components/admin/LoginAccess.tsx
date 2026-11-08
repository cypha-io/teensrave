'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Account = { email: string; isActive: boolean; mustChangePassword: boolean; lastLoginAt: string | null };
type Issued = { email: string; temporaryPassword: string };

export default function LoginAccess({ type, id, name }: { type: 'member' | 'media' | 'performer' | 'vendor' | 'sponsor'; id: number; name: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const request = async (method: string, body?: object) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(method === 'GET' ? `/api/admin/accounts?type=${type}&id=${id}` : '/api/admin/accounts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify({ type, id, ...body }) : undefined,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? 'Something went wrong');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const show = async () => {
    setOpen(true);
    setIssued(null);
    setCopied(false);
    const data = await request('GET');
    if (data) {
      setAccount(data.account);
      setEmail(data.email);
    }
  };

  const issue = async () => {
    const data = await request('POST', {});
    if (data) {
      setAccount(data.account);
      setIssued({ email: data.email, temporaryPassword: data.temporaryPassword });
    }
  };

  const toggle = async () => {
    const data = await request('PATCH', { isActive: !account?.isActive });
    if (data) setAccount(data.account);
  };

  const button = 'rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50';

  return (
    <>
      <button type="button" onClick={show} aria-label={`Manage login for ${name}`} title="Login access" className="inline-flex rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white">
        <KeyRound className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[2rem] border-white/15 bg-[#0b0b0b] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Login for {name}</DialogTitle>
          </DialogHeader>

          {issued ? (
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">Share these details privately. The password won&apos;t be shown again, and they&apos;ll be asked to change it when they first sign in.</p>
              <div className="rounded-2xl bg-white/5 p-4 text-sm">
                <p className="text-xs text-neutral-400">Email</p>
                <p className="mb-3 font-semibold text-white">{issued.email}</p>
                <p className="text-xs text-neutral-400">Temporary password</p>
                <p data-temporary-password className="font-mono text-lg text-green-300">{issued.temporaryPassword}</p>
              </div>
              <button
                type="button"
                className={`${button} border border-white/15 text-white hover:bg-white/10`}
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}/login\nEmail: ${issued.email}\nTemporary password: ${issued.temporaryPassword}`);
                  setCopied(true);
                }}
              >
                {copied ? 'Copied' : 'Copy details'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              {account ? (
                <p className="text-neutral-300">
                  Signs in as <span className="font-semibold text-white">{account.email}</span>.{' '}
                  {!account.isActive ? 'This login is disabled.' : account.mustChangePassword ? 'Hasn’t set their own password yet.' : account.lastLoginAt ? `Last signed in ${new Date(account.lastLoginAt).toLocaleDateString('en-GB')}.` : ''}
                </p>
              ) : (
                <p className="text-neutral-300">{loading ? 'Loading…' : email ? `No login yet. It will use ${email}.` : 'Add an email address to this person before creating a login.'}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={issue} disabled={loading || (!account && !email)} className={`${button} bg-green-600 text-white hover:bg-green-700`}>
                  {account ? 'Reset password' : 'Create login'}
                </button>
                {account && (
                  <button type="button" onClick={toggle} disabled={loading} className={`${button} border border-white/15 text-white hover:bg-white/10`}>
                    {account.isActive ? 'Disable login' : 'Enable login'}
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
