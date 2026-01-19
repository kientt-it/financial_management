import { Member } from '../models/Member.js';
import { defaultMembers } from './data.js';

export const seedDatabase = async () => {
  try {
    const count = await Member.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding database...');
      await Member.insertMany(defaultMembers);
      console.log('✅ Database seeded successfully');
    }
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};
