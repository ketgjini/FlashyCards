'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditCardPage() {
    const { id } = useParams();
    const router = useRouter();

    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('');

    const isValid =
        word.trim() &&
        meaning.trim() &&
        description.trim() &&
        level.trim();

    useEffect(() => {
        if (!id) return;

        const fetchCard = async () => {
            const res = await fetch(`/api/flashcards/${id}`);
            const data = await res.json();

            setWord(data.word || '');
            setMeaning(data.meaning || '');
            setDescription(data.description || '');
            setLevel(data.level || '');
        };

        fetchCard();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch(`/api/flashcards/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word,
                meaning,
                description,
                level,
            }),
        });

        router.push(`/?focus=${id}`);
    };

    const inputClass =
        "border p-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 transition border-slate-200";

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-6">

            <form
                onSubmit={handleUpdate}
                className="w-96 bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-slate-100 flex flex-col gap-4"
            >

                {/* Header */}
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-bold text-orange-600">
                        Edit Flashcard
                    </h1>
                    <p className="text-sm text-slate-500">
                        Update your vocabulary entry
                    </p>
                </div>

                {/* Word */}
                <input
                    className={inputClass}
                    placeholder="Word"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                />

                {/* Meaning */}
                <input
                    className={inputClass}
                    placeholder="Meaning"
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                />

                {/* Description */}
                <textarea
                    className={`${inputClass} resize-y min-h-[140px] max-h-[300px]`}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Level */}
                <select
                    className={inputClass}
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                >
                    <option value="">Select level</option>
                    <option value="A1">A1 (Beginner)</option>
                    <option value="A2">A2 (Elementary)</option>
                    <option value="B1">B1 (Intermediate)</option>
                    <option value="B2">B2 (Upper Intermediate)</option>
                    <option value="C1">C1 (Advanced)</option>
                    <option value="C2">C2 (Proficient)</option>
                </select>

                {/* Buttons */}
                <div className="flex gap-2 mt-2">

                    <button
                        type="button"
                        onClick={() => router.push(`/?focus=${id}`)}
                        className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!isValid}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Save Changes
                    </button>

                </div>

            </form>
        </main>
    );
}