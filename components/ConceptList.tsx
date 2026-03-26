import { Concept } from '@/types/OmopTables';

export default function ConceptList({
  concepts,
  onSelect
}: {
  concepts: Concept[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4"> Common Search Terms</h2>

      <ul className="space-y-2">
        {concepts.map((c) => (
          <li key={c.concept_id}>
            <button
              onClick={() => onSelect(c.concept_id)}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-100 focus:bg-slate-100 transition"
            >
              <div className="flex justify-between">
                <span>{c.name}</span>
                
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}