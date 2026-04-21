'use client';
import { useState } from 'react';
import Flashcard from '@/app/components/Flashcard';

interface FlashcardItem {
  id: string;
  word: string;
  meaning: string;
  description: string;
}

export default function Home() {
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [form, setForm] = useState({ word: '', meaning: '', description: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newCard = { id: crypto.randomUUID(), ...form };
    setCards(prev => [...prev, newCard]);
    setForm({ word: '', meaning: '', description: '' });
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-12">
      <h1 className="text-3xl font-bold mb-8 text-blue-800 italic">Nederlandse Woordenlijst</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8 flex-wrap justify-center">
        <input className="border rounded px-3 py-2" placeholder="Word" required value={form.word} onChange={e => setForm({ ...form, word: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Meaning" required value={form.meaning} onChange={e => setForm({ ...form, meaning: e.target.value })} />
        <input className="border rounded px-3 py-2" placeholder="Description" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Add</button>
      </form>

      <div className="flex flex-wrap gap-6 justify-center">
        {cards.map(card => (
          <Flashcard key={card.id} word={card.word} meaning={card.meaning} description={card.description} />
        ))}
      </div>
    </main>
  );
}