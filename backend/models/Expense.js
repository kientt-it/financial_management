import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export const Expense = mongoose.model('Expense', expenseSchema);
