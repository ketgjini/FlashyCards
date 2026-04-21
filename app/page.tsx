'use client';

import { useEffect, useState } from 'react';
import Flashcard from '@/app/components/Flashcard';
import Link from 'next/link';

interface FlashcardItem {
  _id: string;
  word: string;
  meaning: string;
  description: string;
}

export default function Home() {
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/api/flashcards')
      .then(res => res.json())
      .then(setCards);
  }, []);

  const current = cards[index];

  function next() {
    setIndex(prev => Math.min(prev + 1, cards.length - 1));
  }

  function prev() {
    setIndex(prev => Math.max(prev - 1, 0));
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">

      <div className="absolute top-6 right-6">
        <Link href="/add" className="bg-orange-600 text-white px-4 py-2 rounded">
          + Add Card
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-orange-700">
        Flashy Cards
      </h1>

      {current ? (
        <>
          <Flashcard
            word={current.word}
            meaning={current.meaning}
            description={current.description}
          />

          <div className="flex gap-6 mt-6">
            <button
              onClick={prev}
              disabled={index === 0}
              className="px-5 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-40"
            >
              ← Back
            </button>

            <span className="text-slate-700 font-medium">
              {index + 1} / {cards.length}
            </span>

            <button
              onClick={next}
              disabled={index === cards.length - 1}
              className="px-5 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <p className="text-slate-500">No flashcards yet</p>
      )}
    </main>
  );
}