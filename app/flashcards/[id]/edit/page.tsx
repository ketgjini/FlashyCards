'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditCardPage() {
    const { id } = useParams();
    const router = useRouter();

    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchCard = async () => {
            const res = await fetch(`/api/flashcards/${id}`);
            const data = await res.json();

            console.log(data); // debug

            setWord(data.word || '');
            setMeaning(data.meaning || '');
            setDescription(data.description || '');
        };

        fetchCard();
    }, [id]);

    const handleUpdate = async () => {
        await fetch(`/api/flashcards/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word,
                meaning,
                description,
            }),
        });

        router.push('/');
    };

    return (
        <div className="max-w-md mx-auto mt-10 flex flex-col gap-4">
            <input value={word} onChange={(e) => setWord(e.target.value)} className="border p-2" />
            <input value={meaning} onChange={(e) => setMeaning(e.target.value)} className="border p-2" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2" />

            <button
                onClick={handleUpdate}
                className="bg-orange-600 text-white p-2 rounded"
            >
                Save Changes
            </button>
        </div>
    );
}