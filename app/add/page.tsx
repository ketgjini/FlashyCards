'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    word: '',
    meaning: '',
    description: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setForm({ word: '', meaning: '', description: '' });

    router.push('/');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-6 bg-white shadow rounded w-96"
      >
        <h1 className="text-xl font-bold text-orange-600">Add Flashcard</h1>

        <input
          className="border p-2 rounded text-slate-900"
          placeholder="Word"
          value={form.word}
          onChange={e => setForm({ ...form, word: e.target.value })}
        />

        <input
          className="border p-2 rounded text-slate-900"
          placeholder="Meaning"
          value={form.meaning}
          onChange={e => setForm({ ...form, meaning: e.target.value })}
        />

        <input
          className="border p-2 rounded text-slate-900"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <button className="bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
          Save
        </button>
      </form>
    </main>
  );
}