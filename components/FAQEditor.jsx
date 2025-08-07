// "use client";

// import { useEffect, useState } from "react";

// export default function FAQEditor() {
//   const [faqs, setFaqs] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetch("/api/faq")
//       .then(res => res.json())
//       .then(setFaqs);
//   }, []);

//   const handleSubmit = async () => {
//     const method = editingId ? "PUT" : "POST";
//     const body = JSON.stringify({ question, answer, ...(editingId && { id: editingId }) });

//     const res = await fetch("/api/faq", { method, body, headers: { "Content-Type": "application/json" } });
//     const updated = await res.json();

//     if (editingId) {
//       setFaqs(prev => prev.map(f => (f._id === updated._id ? updated : f)));
//     } else {
//       setFaqs(prev => [updated, ...prev]);
//     }

//     setQuestion("");
//     setAnswer("");
//     setEditingId(null);
//   };

//   const handleDelete = async (id) => {
//     await fetch(`/api/faq?id=${id}`, { method: "DELETE" });
//     setFaqs(prev => prev.filter(f => f._id !== id));
//   };

//   const startEdit = (faq) => {
//     setEditingId(faq._id);
//     setQuestion(faq.question);
//     setAnswer(faq.answer);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <input
//           value={question}
//           onChange={e => setQuestion(e.target.value)}
//           placeholder="FAQ Question"
//           className="w-full border px-2 py-1 rounded"
//         />
//         <textarea
//           value={answer}
//           onChange={e => setAnswer(e.target.value)}
//           placeholder="FAQ Answer"
//           rows={4}
//           className="w-full border px-2 py-1 rounded"
//         />
//         <button
//           onClick={handleSubmit}
//           className="px-4 py-2 bg-green-600 text-white rounded"
//         >
//           {editingId ? "Update FAQ" : "Add FAQ"}
//         </button>
//       </div>

//       <div className="divide-y">
//         {faqs.map((faq) => (
//           <div key={faq._id} className="py-2 flex justify-between items-start">
//             <div>
//               <h4 className="font-semibold">{faq.question}</h4>
//               <p className="text-sm text-gray-700">{faq.answer}</p>
//             </div>
//             <div className="space-x-2">
//               <button onClick={() => startEdit(faq)} className="text-blue-600 text-sm">Edit</button>
//               <button onClick={() => handleDelete(faq._id)} className="text-red-600 text-sm">Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






































"use client";

import { useEffect, useState } from "react";

export default function FAQEditor() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/faq")
      .then(res => res.json())
      .then(setFaqs);
  }, []);

  const handleAdd = async () => {
    const body = JSON.stringify({ question, answer });
    const res = await fetch("/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const newFaq = await res.json();
    setFaqs(prev => [newFaq, ...prev]);
    setQuestion("");
    setAnswer("");
  };

  const handleUpdate = async () => {
    const body = JSON.stringify({ id: editingId, question, answer });
    const res = await fetch("/api/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const updatedFaq = await res.json();
    setFaqs(prev => prev.map(f => (f._id === updatedFaq._id ? updatedFaq : f)));
    setQuestion("");
    setAnswer("");
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/faq?id=${id}`, { method: "DELETE" });
    setFaqs(prev => prev.filter(f => f._id !== id));
  };

  const startEdit = (faq) => {
    setEditingId(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="FAQ Question"
          className="w-full border px-2 py-1 rounded"
        />
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="FAQ Answer"
          rows={4}
          className="w-full border px-2 py-1 rounded"
        />

        {editingId ? (
          <div className="space-x-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update FAQ
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel Edit
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Add FAQ
          </button>
        )}
      </div>

      <div className="divide-y">
        {faqs.map((faq) => (
          <div key={faq._id} className="py-2 flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{faq.question}</h4>
              <p className="text-sm text-gray-700">{faq.answer}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => startEdit(faq)} className="text-blue-600 text-sm">
                Edit
              </button>
              <button onClick={() => handleDelete(faq._id)} className="text-red-600 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
