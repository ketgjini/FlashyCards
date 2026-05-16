'use client';

import { useEffect, useState } from 'react';
import Flashcard from '@/app/components/Flashcard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface FlashcardItem {
  _id: string;
  word: string;
  meaning: string;
  description: string;
  level: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get('focus');

  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  useEffect(() => {
    fetch('/api/flashcards')
        .then(res => res.json())
        .then(setCards);
  }, []);

  const filteredCards =
      selectedLevel === 'ALL'
          ? cards
          : cards.filter(card => card.level === selectedLevel);

  const current = filteredCards[index] ?? null;

  useEffect(() => {
    setIndex(0);
  }, [selectedLevel]);

  useEffect(() => {
    if (!focusId || filteredCards.length === 0) return;

    const i = filteredCards.findIndex(card => card._id === focusId);

    if (i !== -1) {
      setIndex(i);
    }
  }, [focusId, filteredCards]);

  function next() {
    setIndex(prev => Math.min(prev + 1, filteredCards.length - 1));
  }

  function prev() {
    setIndex(prev => Math.max(prev - 1, 0));
  }

  const handleDelete = (id: string) => {
    setCards(prev => {
      const updated = prev.filter(card => card._id !== id);

      setIndex(i =>
          updated.length === 0 ? 0 : Math.min(i, updated.length - 1)
      );

      setToast("Flashcard deleted!");

      setTimeout(() => setToast(null), 2000);

      return updated;
    });
  };

  const refresh = async () => {
    const res = await fetch('/api/flashcards');
    const data = await res.json();
    setCards(data);
  };

  return (
      <main className="min-h-screen flex bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">

        {/* TOAST */}
        {toast && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded-xl shadow-lg z-50">
              {toast}
            </div>
        )}

        {/* SIDEBAR */}
        <aside className="hidden md:flex w-72 flex-col p-6 bg-white/60 backdrop-blur border-r border-slate-200">

          <h1 className="text-2xl font-bold text-orange-700">
            Flashy Cards
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Learn faster with structured levels.
          </p>

          {/* LEVEL INFO */}
          <div className="mt-6 space-y-3 text-sm text-slate-600">

            <p className="text-orange-700 font-semibold">
              Learning session
            </p>

            <p className="text-xs text-slate-500">
              Focus on one level at a time.
            </p>

            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                  className="h-full bg-orange-500"
                  style={{
                    width: `${filteredCards.length
                        ? ((index + 1) / filteredCards.length) * 100
                        : 0}%`
                  }}
              />
            </div>
            <p className="text-xs text-slate-500">
              <i>Progress on current level.</i>
            </p>

          </div>

          <div className="mt-auto">
            <Link
                href="/add"
                className="block text-center bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition"
            >
              + Add Card
            </Link>
          </div>
        </aside>

        {/* MAIN */}
        <section className="flex-1 flex flex-col items-center justify-center p-8 relative">

          {/* LEVEL FILTERS */}
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
                <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${
                        selectedLevel === level
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {level}
                </button>
            ))}
          </div>

          {/* EMPTY STATE */}
          {!current && (
              <div className="text-center max-w-sm">

                <div className="mb-4">
                  <div className="text-5xl mb-3">📚</div>

                  <h2 className="text-xl font-bold text-slate-800">
                    No flashcards here
                  </h2>

                  <p className="text-slate-500 mt-2">
                    This level doesn’t have any cards yet. Add your first one to start learning.
                  </p>
                </div>

                <Link
                    href={`/add?level=${selectedLevel}`}
                    className="block text-center bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition"
                >
                  + Add Card
                </Link>

              </div>
          )}

          {/* CARD */}
          {current && (
              <div className="flex flex-col items-center justify-center gap-6 relative z-10">

                <div className="absolute w-80 h-80 bg-orange-200 blur-3xl opacity-30 rounded-full" />

                <Flashcard
                    id={current._id}
                    word={current.word}
                    meaning={current.meaning}
                    description={current.description}
                    level={current.level}
                    onDelete={handleDelete}
                    onUpdate={refresh}
                />

                {/* NAVIGATION */}
                <div className="flex gap-6 mt-6 z-10 items-center">

                  <button
                      onClick={prev}
                      disabled={index === 0}
                      className="px-5 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-40"
                  >
                    ← Back
                  </button>

                  <span className="text-slate-700 font-medium">
                    {index + 1} / {filteredCards.length}
                  </span>

                  <button
                      onClick={next}
                      disabled={index === filteredCards.length - 1}
                      className="px-5 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-40"
                  >
                    Next →
                  </button>

                </div>
              </div>
          )}

        </section>
      </main>
  );
}