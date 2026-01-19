import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    bank: {
      type: String,
      default: ''
    },
    account: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const Member = mongoose.model('Member', memberSchema);
