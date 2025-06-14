import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  proofOfPaymentUrl: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
