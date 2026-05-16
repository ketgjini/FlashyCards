'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function AddPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLevel = searchParams.get('level') || '';

  const [form, setForm] = useState({
    word: '',
    meaning: '',
    description: '',
    level: initialLevel,
  });

  const isValid =
      form.word.trim() &&
      form.meaning.trim() &&
      form.description.trim() &&
      form.level.trim();

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      level: initialLevel
    }));
  }, [initialLevel]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const newCard = await res.json();

    setForm({ word: '', meaning: '', description: '', level: '' });

    router.push(`/?focus=${newCard._id}`);
  }

  return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-6">

        <form
            onSubmit={handleSubmit}
            className="w-96 bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-slate-100 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-orange-600">
              Add Flashcard
            </h1>
            <p className="text-sm text-slate-500">
              Build your vocabulary step by step
            </p>
          </div>

          {/* Word */}
          <input
              className={`border p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  !form.word ? 'border-red-200' : 'border-slate-200'
              }`}
              placeholder="Word"
              value={form.word}
              onChange={(e) => setForm({ ...form, word: e.target.value })}
          />

          {/* Meaning */}
          <input
              className={`border p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  !form.meaning ? 'border-red-200' : 'border-slate-200'
              }`}
              placeholder="Meaning"
              value={form.meaning}
              onChange={(e) =>
                  setForm({ ...form, meaning: e.target.value })
              }
          />

          {/* Description */}
          <textarea
              className="border p-3 rounded-xl text-slate-900 resize-y min-h-[120px]"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
              }
          />

          {/* Level */}
          <select
              className={`border p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                  !form.level ? 'border-red-200' : 'border-slate-200'
              }`}
              value={form.level}
              onChange={(e) =>
                  setForm({ ...form, level: e.target.value })
              }
          >
            <option value="">Select level</option>
            <option value="A1">A1 (Beginner)</option>
            <option value="A2">A2 (Elementary)</option>
            <option value="B1">B1 (Intermediate)</option>
            <option value="B2">B2 (Upper Intermediate)</option>
            <option value="C1">C1 (Advanced)</option>
            <option value="C2">C2 (Proficient)</option>
          </select>

          {/* Button */}
          <div className="flex gap-2 mt-2">
            <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition"
            >
              Cancel
            </button>

            <button
                disabled={!isValid}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              Save
            </button>
          </div>
        </form>
      </main>
  );
}