'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';

const fieldClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none';

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [required, setRequired] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => (response.ok ? response.json() : null))
      .then((me) => setRequired(Boolean(me?.mustChangePassword)))
      .catch(() => undefined);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (next !== confirm) {
      setError('The new passwords don’t match.');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, next }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok) {
        window.location.href = data.home;
        return;
      }
      setError(data?.message ?? 'Your password could not be changed.');
    } catch {
      setError('Network error. Please try again.');
    }
    setSaving(false);
  };

  const field = (id: string, label: string, value: string, set: (v: string) => void, autoComplete: string) => (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-neutral-300">
        {label}
      </label>
      <input id={id} type="password" autoComplete={autoComplete} value={value} onChange={(e) => set(e.target.value)} required className={fieldClass} />
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/5 p-6 sm:p-8">
        <Image src="/logo.png" alt="TeensRave logo" width={64} height={64} className="mx-auto mb-4 h-16 w-16 object-contain" />
        <h1 className="text-center text-4xl leading-none text-white uppercase" style={{ fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' }}>
          {required ? 'Set Your Password' : 'Change Password'}
        </h1>
        <p className="mt-2 mb-6 text-center text-sm text-neutral-400">{required ? 'Replace your temporary password to continue.' : 'Use at least 10 characters.'}</p>
        <form onSubmit={submit} className="space-y-4">
          {field('current', required ? 'Temporary password' : 'Current password', current, setCurrent, 'current-password')}
          {field('next', 'New password (at least 10 characters)', next, setNext, 'new-password')}
          {field('confirm', 'Confirm new password', confirm, setConfirm, 'new-password')}
          {error && (
            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
              {error}
            </p>
          )}
          <button type="submit" disabled={saving} className="w-full rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 px-6 py-3 font-bold text-white disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
