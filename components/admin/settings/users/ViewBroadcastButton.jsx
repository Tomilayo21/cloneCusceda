'use client';

export default function ViewBroadcastButton({ setUserPanel }) {
  return (
    <div className="mt-4">
      <button
        onClick={() => setUserPanel('broadcast')}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
      >
        View Broadcast
      </button>
    </div>
  );
}
