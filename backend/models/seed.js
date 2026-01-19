import { Member } from '../models/Member.js';
import { defaultMembers } from './data.js';

export const seedDatabase = async () => {
  try {
    console.log('📊 Checking members collection...');
    const count = await Member.countDocuments();
    console.log(`Found ${count} members in database`);
    
    if (count === 0) {
      console.log('🌱 Seeding database with default members...');
      await Member.insertMany(defaultMembers);
      console.log(`✅ Database seeded with ${defaultMembers.length} members`);
    } else {
      console.log('✅ Database already has members, skipping seed');
    }
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};
