// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { ArrowLeft } from "lucide-react";

// export default function ReturnPolicyPanel({ setLegalPanel }) {
//   const [policies, setPolicies] = useState([]);
//   const [heading, setHeading] = useState("");
//   const [subheading, setSubheading] = useState("");
//   const [editingPolicy, setEditingPolicy] = useState(null);
  

//   useEffect(() => {
//     fetchPolicies();
//   }, []);

//   const fetchPolicies = async () => {
//     const res = await fetch("/api/returns");
//     const data = await res.json();
//     setPolicies(data);
//   };

//   const handleSave = async () => {
//     const payload = { heading, subheading };

//     if (editingPolicy) {
//       await fetch(`/api/returns/${editingPolicy._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     } else {
//       await fetch("/api/returns", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     }

//     setHeading("");
//     setSubheading("");
//     setEditingPolicy(null);
//     fetchPolicies();
//   };

//   const startEdit = (policy) => {
//     setEditingPolicy(policy);
//     setHeading(policy.heading);
//     setSubheading(policy.subheading);
//   };

//   const handleDelete = async (id) => {
//     await fetch(`/api/returns/${id}`, { method: "DELETE" });
//     fetchPolicies();
//   };

//   return (
//     <motion.div
//       key="legal-returns"
//       initial={{ x: 300, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: -300, opacity: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-4"
//     >
//       <button
//         onClick={() => setLegalPanel("main")}
//         className="flex items-center text-sm text-gray-600 hover:text-black"
//       >
//         <ArrowLeft className="w-4 h-4 mr-1" /> Back
//       </button>

//       <h3 className="font-semibold text-lg">
//         {editingPolicy ? "Edit Return Policy" : "Add Return Policy"}
//       </h3>

//       <input
//         type="text"
//         placeholder="Heading"
//         value={heading}
//         onChange={(e) => setHeading(e.target.value)}
//         className="w-full border p-2 rounded"
//       />
//       <textarea
//         placeholder="Subheading / content"
//         value={subheading}
//         onChange={(e) => setSubheading(e.target.value)}
//         className="w-full border p-2 rounded"
//         rows={6}
//       />
//       <button
//         onClick={handleSave}
//         className="px-4 py-2 bg-yellow-600 text-white rounded"
//       >
//         {editingPolicy ? "Update" : "Save"}
//       </button>

//       <div className="divide-y">
//         {policies.map((policy) => (
//           <div
//             key={policy._id}
//             className="py-2 flex justify-between items-start"
//           >
//             <div className="text-sm text-gray-700 whitespace-pre-wrap">
//               <h4 className="font-semibold">{policy.heading}</h4>
//               <p>{policy.subheading}</p>
//             </div>
//             <div className="space-x-2">
//               <button
//                 onClick={() => startEdit(policy)}
//                 className="text-blue-600 text-sm"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(policy._id)}
//                 className="text-red-600 text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }










"use client";

import { useEffect, useState } from "react";

export default function ReturnsEditor() {
  const [policies, setPolicies] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/returns")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const list = Array.isArray(data) ? data : [data];
          setPolicies(list);
        }
      });
  }, []);

  const handleAdd = async () => {
    const body = JSON.stringify({ heading, subheading });
    const res = await fetch("/api/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const newPolicy = await res.json();
    setPolicies((prev) => [newPolicy, ...prev]);
    setHeading("");
    setSubheading("");
  };

  const handleUpdate = async () => {
    const body = JSON.stringify({ id: editingId, heading, subheading });
    const res = await fetch("/api/returns", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const updated = await res.json();
    setPolicies((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
    setHeading("");
    setSubheading("");
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/returns?id=${id}`, { method: "DELETE" });
    setPolicies((prev) => prev.filter((p) => p._id !== id));
  };

  const startEdit = (policy) => {
    setEditingId(policy._id);
    setHeading(policy.heading);
    setSubheading(policy.subheading);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setHeading("");
    setSubheading("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Policy Heading"
          className="w-full border px-2 py-1 rounded"
        />
        <textarea
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          placeholder="Policy Subheading"
          rows={6}
          className="w-full border px-2 py-1 rounded"
        />
        {editingId ? (
          <div className="space-x-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update Policy
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
            Add Policy
          </button>
        )}
      </div>

      <div className="divide-y">
        {policies.map((policy) => (
          <div
            key={policy._id}
            className="py-2 flex justify-between items-start"
          >
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              <h4 className="font-semibold">{policy.heading}</h4>
              <p>{policy.subheading}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEdit(policy)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(policy._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
