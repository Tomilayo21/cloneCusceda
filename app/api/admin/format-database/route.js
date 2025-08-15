// import { auth, currentUser } from "@clerk/nextjs/server";
// import connectDB from "@/config/db";

// // Import all models
// import About from "@/models/About";
// import ActivityLog from "@/models/ActivityLog";
// import Address from "@/models/Address";
// import Broadcast from "@/models/Broadcast";
// import Contact from "@/models/Contact";
// import FAQ from "@/models/FAQ";
// import GeneralSettings from "@/models/GeneralSettings";
// import Message from "@/models/Message";
// import Notification from "@/models/Notification";
// import Order from "@/models/Order";
// import Otp from "@/models/Otp";
// import Partner from "@/models/Partner";
// import Privacy from "@/models/Privacy";
// import ReturnPolicy from "@/models/ReturnPolicy";
// import Review from "@/models/Review";
// import Settings from "@/models/Settings";
// import Subscriber from "@/models/Subscriber";
// import Team from "@/models/Team";
// import Terms from "@/models/Terms";
// import { Transaction } from "@/models/Transaction";
// import User from "@/models/User";
// import UserSettings from "@/models/UserSettings";

// // Secure admin password from environment
// const ADMIN_PASSWORD = process.env.ADMIN_DB_CLEAR_PASSWORD || "changeme";

// export async function DELETE(req) {
//   try {
//     // 1️⃣ Clerk Authentication
//     const { userId } = auth();
//     if (!userId) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//     }

//     // 2️⃣ Get Current User
//     const user = await currentUser();
//     const role = user?.publicMetadata?.role;

//     if (role !== "admin") {
//       return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
//     }

//     // 3️⃣ Check password
//     const { password } = await req.json();
//     if (password !== ADMIN_PASSWORD) {
//       return new Response(JSON.stringify({ error: "Invalid password" }), { status: 403 });
//     }

//     // 4️⃣ Connect to DB
//     await connectDB();

//     // 5️⃣ Wipe all collections
//     const models = [
//       About, FAQ, GeneralSettings,
//       Message, Notification, Partner, Privacy, ReturnPolicy,
//        Team, Terms
//     ];

//     for (const Model of models) {
//       await Model.deleteMany({});
//     }

//     return new Response(JSON.stringify({ message: "Database formatted successfully" }), { status: 200 });

//   } catch (error) {
//     console.error("Error formatting DB:", error);
//     return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
//   }
// }














































// import connectDB from "@/config/db";
// import { getAuth } from "@clerk/nextjs/server";
// import authSeller from "@/lib/authAdmin"; // This should check if the user is admin
// import { NextResponse } from "next/server";


// // Import all models
// import About from "@/models/About";
// import ActivityLog from "@/models/ActivityLog";
// import Address from "@/models/Address";
// import Broadcast from "@/models/Broadcast";
// import Contact from "@/models/Contact";
// import FAQ from "@/models/FAQ";
// import GeneralSettings from "@/models/GeneralSettings";
// import Message from "@/models/Message";
// import Notification from "@/models/Notification";
// import Order from "@/models/Order";
// import Otp from "@/models/Otp";
// import Partner from "@/models/Partner";
// import Privacy from "@/models/Privacy";
// import ReturnPolicy from "@/models/ReturnPolicy";
// import Review from "@/models/Review";
// import Settings from "@/models/Settings";
// import Subscriber from "@/models/Subscriber";
// import Team from "@/models/Team";
// import Terms from "@/models/Terms";
// import { Transaction } from "@/models/Transaction";
// import User from "@/models/User";
// import UserSettings from "@/models/UserSettings";

// export async function DELETE(req) {
//   try {
//     // 1️⃣ Clerk Authentication
//     const { userId } = getAuth(request);
//     const isAdmin = await authSeller(userId); // Checks if the user is admin

//     if (!isAdmin) {
//       return NextResponse.json({ message: "Not authorized" }, { status: 403 });
//     }

//     // 3️⃣ Connect to DB
//     await connectDB();

//     // 4️⃣ Wipe all collections
//     const models = [
//       About, FAQ, GeneralSettings,
//        Notification, Otp, Partner, Privacy, ReturnPolicy,
//        Team, Terms
//     ];

//     for (const Model of models) {
//       await Model.deleteMany({});
//     }

//     return new Response(JSON.stringify({ message: "Database formatted successfully" }), { status: 200 });

//   } catch (error) {
//     console.error("Error formatting DB:", error);
//     return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
//   }
// }
































import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authAdmin"; // This should check if the user is admin
import { NextResponse } from "next/server";

// Import all models
import About from "@/models/About";
import ActivityLog from "@/models/ActivityLog";
import Address from "@/models/Address";
import Broadcast from "@/models/Broadcast";
import Contact from "@/models/Contact";
import FAQ from "@/models/FAQ";
import GeneralSettings from "@/models/GeneralSettings";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import Order from "@/models/Order";
import Otp from "@/models/Otp";
import Partner from "@/models/Partner";
import Privacy from "@/models/Privacy";
import ReturnPolicy from "@/models/ReturnPolicy";
import Review from "@/models/Review";
import Settings from "@/models/Settings";
import Subscriber from "@/models/Subscriber";
import Team from "@/models/Team";
import Terms from "@/models/Terms";
import { Transaction } from "@/models/Transaction";
import User from "@/models/User";
import UserSettings from "@/models/UserSettings";

export async function DELETE(request) {
  try {
    // 1️⃣ Get Clerk auth from request
    const { userId } = getAuth(request);
    const isAdmin = await authSeller(userId); // Checks if the user is admin

    if (!isAdmin) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    // 2️⃣ Connect to database
    await connectDB();

    // 3️⃣ List of models to wipe
    const models = [
      About, FAQ, GeneralSettings,
      Notification, Otp, Partner, Privacy, ReturnPolicy,
      Team, Terms
    ];

    // 4️⃣ Delete all documents from these collections
    for (const Model of models) {
      await Model.deleteMany({});
    }

    return NextResponse.json(
      { message: "Database formatted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error formatting DB:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
