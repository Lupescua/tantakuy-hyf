/**
 * Migration script to rebuild Competition indexes
 * Run this after updating the Competition model to add the text index
 *
 * Usage: node scripts/rebuild-competition-indexes.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

async function rebuildIndexes() {
  let exitCode = 0;

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('competitions');

    console.log('\n📋 Current indexes:');
    const existingIndexes = await collection.indexes();
    existingIndexes.forEach((index) => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    // Drop old title index if it exists (from previous regex approach)
    console.log('\n🗑️  Dropping old title index (if exists)...');
    try {
      await collection.dropIndex('title_1');
      console.log('✅ Dropped title_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('ℹ️  No title_1 index to drop');
      } else {
        throw err;
      }
    }

    // Create text index on title
    console.log('\n📝 Creating text index on title...');
    await collection.createIndex({ title: 'text' }, { name: 'title_text' });
    console.log('✅ Created text index on title');

    // Verify company index exists
    console.log('\n📝 Verifying company index...');
    try {
      await collection.createIndex({ company: 1 }, { name: 'company_1' });
      console.log('✅ Company index verified');
    } catch (err) {
      if (err.code === 85) {
        console.log('ℹ️  Company index already exists');
      } else {
        throw err;
      }
    }

    console.log('\n📋 Final indexes:');
    const finalIndexes = await collection.indexes();
    finalIndexes.forEach((index) => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    console.log('\n✅ Index rebuild complete!');
  } catch (error) {
    console.error('\n❌ Error rebuilding indexes:', error);
    exitCode = 1;
  } finally {
    try {
      await mongoose.connection.close();
      console.log('🔌 Disconnected from MongoDB');
    } catch (closeError) {
      console.error('❌ Error closing MongoDB connection:', closeError);
      exitCode = 1;
    }
    process.exit(exitCode);
  }
}

rebuildIndexes();
