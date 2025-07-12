import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";
import Broadcast from "@/models/Broadcast";
import Subscriber from "@/models/Subscriber";
import nodemailer from "nodemailer";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "cuscedang" });

// Inngest Function to save  user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id : 'sync-user-from-clerk'
    },
    { event : 'clerk/user.created' },
    async ({event}) => {
        const {  id, first_name, last_name, email_addresses, image_url, username } = event.data
        const userData = {
            _id : id,
            email : email_addresses[0].email_address,
            name : first_name + ' ' + last_name,
            username : username,
            imageUrl : image_url
        }
        await connectDB()
        await User.create(userData)
    }
)


// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction (
    {
        id : 'update-user-from-clerk'
    },
    {
        event : 'clerk/user.updated'
    },
    async ({ event }) => {
        const {  id, first_name, last_name, email_addresses, image_url, username} = event.data
        const userData = {
            _id : id,
            email : email_addresses[0].email_address,
            name : first_name + ' ' + last_name,            
            username : username,
            imageUrl : image_url
        }
        await connectDB()
        await User.findByIdAndUpdate( id, userData)
    }
)


//Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id : 'delete-user-with-clerk'
    },
    {
        event : 'clerk/user.deleted'
    },
    async ({ event }) => {
        const { id } = event.data
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)

// Inngest function to create user's order in the database
export const createUserOrder = inngest.createFunction(
    {
        id : 'create-user-order',
        batchEvents : {
            maxSize : 5,
            timeout : '5s'
        }
    },
    {
        event : 'order/created'
    },
    async ({ events }) => {
        const orders = events.map((event) => ({
            userId: event.data.userId,
            items: event.data.items,
            amount: event.data.amount,
            address: event.data.address,
            date: event.data.date,
            paymentMethod: event.data.paymentMethod,
            status: event.data.status || "Pending",
            proofOfPaymentUrl : event.data.proofOfPaymentUrl,
            orderId : event.data.orderId,
        }));

        await connectDB();
        await Order.insertMany(orders);


        return { success: true, processed: orders.length };
    }
)


export const scheduledBroadcastSender = inngest.createFunction(
    { id: "scheduled-broadcast-sender" },
    { cron: "*/5 * * * *" }, // every 5 minutes
    async () => {
        await connectDB();

        const now = new Date();

        const broadcasts = await Broadcast.find({
        status: "scheduled",
        scheduledFor: { $lte: now },
        });

        if (!broadcasts.length) {
        return { message: "No scheduled broadcasts due." };
        }

        const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        });

        for (const broadcast of broadcasts) {
        const subscribers = await Subscriber.find();
        const recipientEmails = subscribers.map((s) => s.email);

        const attachments = (broadcast.attachment || []).map((url, index) => ({
            filename: `attachment-${index + 1}`,
            path: url,
        }));

        const attachmentsHtml = (broadcast.attachment || []).map((url, i) => {
            return url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
            ? `<img src="${url}" style="max-width:100%; height:auto;" />`
            : `<p><a href="${url}" target="_blank">View Attachment ${i + 1}</a></p>`;
        }).join("");

        const results = [];

        for (const email of recipientEmails) {
            try {
            await transporter.sendMail({
                from: `"Cusceda NG" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: broadcast.subject,
                html: `
                <div style="padding: 20px; font-size: 16px;">
                    <h2>${broadcast.subject}</h2>
                    <p>${broadcast.message.replace(/\n/g, "<br>")}</p>
                    ${attachmentsHtml}
                    <p>Cheers,<br/>Cusceda NG Team</p>
                </div>
                `,
                attachments,
            });

            results.push({ email, status: "sent" });
            } catch (err) {
            results.push({ email, status: "failed", error: err.message });
            }
        }

        broadcast.status = "sent";
        broadcast.recipients = results;
        await broadcast.save();
        }

        return { message: "Scheduled broadcasts sent." };
    }
)
