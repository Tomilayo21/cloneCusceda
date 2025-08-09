// "use client";

// import { useEffect, useState } from "react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// export default function Testimonial() {
//   const [reviews, setReviews] = useState([]);

//   // Fetch reviews from /api/reviews on mount
//   useEffect(() => {
//   fetch("/api/reviews", {
//     credentials: "include"
//   })
//   .then((res) => {
//     if (!res.ok) {
//       console.error("Failed to fetch:", res.status);
//       return null;
//     }
//     return res.json();
//   })
//   .then(data => {
//     if (data) setEntries(data.reviews || []);
//   });
// }, []);


//   // Drag and drop reorder handler
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;

//     const oldIndex = reviews.findIndex((r) => r._id === active.id);
//     const newIndex = reviews.findIndex((r) => r._id === over.id);

//     const newReviews = arrayMove(reviews, oldIndex, newIndex);
//     setReviews(newReviews);
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto p-4">
//       <h2 className="text-xl font-semibold mb-4">Testimonials</h2>

//       <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//         <SortableContext
//           items={reviews.map((r) => r._id)}
//           strategy={verticalListSortingStrategy}
//         >
//           {reviews.map((review) => (
//             <SortableReview key={review._id} review={review} />
//           ))}
//         </SortableContext>
//       </DndContext>
//     </div>
//   );
// }

// function SortableReview({ review }) {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
//     id: review._id,
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="border p-4 rounded bg-white shadow-sm mb-2 cursor-move"
//     >
//       <p className="font-semibold mb-1">{review.username || "Anonymous"}</p>
//       <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
//       <p className="text-sm text-yellow-500">Rating: {"⭐".repeat(review.rating)}</p>
//     </div>
//   );
// }






























"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Testimonial() {
  const { user, isLoaded } = useUser();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!isLoaded) return; // Wait until Clerk loads user info
    if (!user) return; // Or require logged-in user if needed

    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        // Only display approved reviews
        const approvedReviews = data.reviews.filter((r) => r.approved);
        setReviews(approvedReviews);
      })
      .catch(console.error);
  }, [isLoaded, user]);

  // Handle drag and drop sorting locally
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = reviews.findIndex((r) => r._id === active.id);
    const newIndex = reviews.findIndex((r) => r._id === over.id);

    const newReviews = arrayMove(reviews, oldIndex, newIndex);
    setReviews(newReviews);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Customer Testimonials</h2>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={reviews.map((r) => r._id)}
          strategy={verticalListSortingStrategy}
        >
          {reviews.map((review) => (
            <SortableReview key={review._id} review={review} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableReview({ review }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: review._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    backgroundColor: "white",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <p className="font-semibold">{review.username || "Anonymous"}</p>
      <p className="text-yellow-600 font-bold">{`Rating: ${review.rating} ⭐`}</p>
      <p className="mt-2">{review.comment}</p>
    </div>
  );
}
