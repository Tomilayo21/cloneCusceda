import nodemailer from "nodemailer";

export const sendInvoiceEmail = async ({
  to,
  subject = "Your Order Invoice",
  text,
  html,
  pdfBuffer,
  invoiceNumber,
}) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  await transporter.sendMail({
    from: `"Cusceda Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject + ` - ${invoiceNumber}`,
    text,
    html,
    attachments: [
      {
        filename: `Invoice-${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};