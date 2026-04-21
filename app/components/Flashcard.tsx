'use client';
import { useState } from 'react';

export default function Flashcard({ word, meaning, description }: { word: string; meaning: string; description: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

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
        {/* Front Side */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-white p-8 [backface-visibility:hidden] flex flex-col items-center justify-center border-2 border-slate-100">
          <span className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-2">Woord</span>
          <h2 className="text-4xl font-bold text-orange-600">{word}</h2>
          <p className="mt-4 text-slate-400 text-xs italic">Click to reveal meaning</p>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-orange-600 p-8 text-white [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-2">{meaning}</h3>
          <p className="text-center text-orange-100 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}