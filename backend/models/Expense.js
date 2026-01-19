import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      default: 'Other'
    },
    payer: {
      type: String,
      required: true
    },
    participants: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export const Expense = mongoose.model('Expense', expenseSchema);
