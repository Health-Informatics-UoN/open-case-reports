import { Note } from '@/types/OmopTables';
import { useState } from 'react';

export default function NoteCard({ note }: { note: Note }) {
    const pmcid = note.note_source_value?.match(/PMC(\d+)/)?.[1];
    const [article, setArticle] = useState<any>(null);

    const loadArticle = async () => {
        if (!pmcid) return;
        const res = await fetch(`/api/pmc?pmcid=${pmcid}`);
        const data = await res.json();
        setArticle(data);
        if (data.articleUrl) {
            window.open(data.articleUrl, '_blank');
        } else {
            alert('No article found');
        }

    };

    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
            <div className="text-sm text-gray-500">
                Note ID: {note.note_id}
            </div>
            <div className="text-sm text-gray-500">
                PMC ID: {pmcid || 'N/A'}
            </div>
            <div className="text-sm">
                Date: {note.note_date}
            </div>

            {pmcid && (

                <button
                    onClick={loadArticle}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Go to Article
                </button>

            )}


        </div>
    );
}