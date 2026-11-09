'use client';
import { useState } from 'react';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    const res = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    const data = await res.json();
    if (!res.ok) { setBusy(false); return setError(data.error || 'Something went wrong.'); }
    window.location.href = '/';
  }

  return (
    <div className="container section">
      <form onSubmit={submit} className="box narrow">
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        {mode === 'register' && <>
          <label>Full name<input required value={f.name} onChange={set('name')} /></label>
          <label>Phone<input value={f.phone} onChange={set('phone')} /></label>
        </>}
        <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
        <label>Password<input type="password" required minLength={mode === 'register' ? 8 : 1} value={f.password} onChange={set('password')} /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary block" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}</button>
        <p className="center small muted">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Create an account' : 'Log in'}</button>
        </p>
      </form>
    </div>
  );
}
