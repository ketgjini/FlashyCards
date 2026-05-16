'use client';

import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Flashcard({id, word, meaning, description, level, onDelete, onUpdate}: {
  id: string;
  word: string;
  meaning: string;
  description: string;
  level: string;
  onDelete?: (id: string) => void;
  onUpdate?: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  const levelColors: Record<string, string> = {
    A1: 'bg-green-100 text-green-700',
    A2: 'bg-blue-100 text-blue-700',
    B1: 'bg-orange-100 text-orange-700',
    B2: 'bg-purple-100 text-purple-700',
    C1: 'bg-red-100 text-red-700',
    C2: 'bg-slate-200 text-slate-800',
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const res = await fetch(`/api/flashcards/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      onDelete?.(id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/flashcards/${id}/edit?focus=${id}`);
  };

  return (
      <div
          className="group h-64 w-96 [perspective:1000px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
            className={`relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 h-full w-full rounded-xl bg-white p-8 [backface-visibility:hidden] flex flex-col items-center justify-center border-2 border-slate-100 relative">
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              {/* Level */}
              <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                      levelColors[level] || 'bg-gray-100 text-gray-700'
                  }`}
              >
                {level}
              </span>

              {/* Icons */}
              <div className="flex gap-2 text-slate-400">
                <button onClick={handleEdit} className="hover:text-orange-500">
                  <Edit size={18} />
                </button>

                <button onClick={handleDelete} className="hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>

            </div>

            <span className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-2">
            Woord
          </span>
            <h2 className="text-4xl font-bold text-orange-600">{word}</h2>
            <p className="mt-4 text-slate-400 text-xs italic">
              Click to reveal meaning
            </p>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 h-full w-full rounded-xl bg-orange-600 p-8 text-white [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center">

            <div className="absolute top-3 right-3 flex gap-2 text-orange-100">
              <button onClick={handleEdit}>
                <Edit size={18} />
              </button>
            </div>

            <h3 className="text-2xl font-bold mb-2">{meaning}</h3>
            <p className="text-center text-orange-100 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
  );
}