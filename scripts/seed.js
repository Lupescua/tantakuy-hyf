import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import Company from '../app/api/models/Company.js';
import Competition from '../app/api/models/Competition.js';
import Participant from '../app/api/models/Participant.js';
import Vote from '../app/api/models/Vote.js';

// Dummy Entry model
const EntrySchema = new mongoose.Schema({
  title: String,
  participant: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
  competition: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition' },
});
const Entry = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const NUM_RECORDS = 10;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear old data
    await Promise.all([
      Company.deleteMany({}),
      Competition.deleteMany({}),
      Participant.deleteMany({}),
      Vote.deleteMany({}),
      Entry.deleteMany({}),
    ]);

    const companies = [];
    const now = new Date();
    const endDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
    const winnerSelectionDate = new Date(
      endDate.getTime() + 2 * 24 * 60 * 60 * 1000,
    ); // 2 days after e
    const competitions = [];
    const participants = [];
    const entries = [];

    // Seed Companies
    for (let i = 0; i < NUM_RECORDS; i++) {
      const password = await bcrypt.hash('Password123', 10);
      const company = await Company.create({
        logoUrl: faker.image.avatar(),
        coverPictureUrl: `https://picsum.photos/1280/300?random=${i}`,
        name: faker.person.fullName(),
        position: faker.person.jobTitle(),
        companyName: faker.company.name() + i, // Ensure uniqueness
        businessNumber: faker.number
          .int({ min: 10000000, max: 99999999 })
          .toString(),
        cvrNumber: (80000000 + i).toString(),
        email: `company${i}@example.com`,
        password,
        location: faker.location.city(),
        shortDescription: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        website: faker.internet.url(),
        facebook: faker.internet.url(),
        instagram: faker.internet.url(),
      });
      companies.push(company);
    }

    // Seed Competitions
    for (let i = 0; i < NUM_RECORDS; i++) {
      const company = companies[i % companies.length];
      const competition = await Competition.create({
        title: faker.commerce.productName(),
        description: faker.lorem.sentences(2),
        competitionTerms: faker.lorem.sentence(),
        endDate,
        winnerSelectionDate,
        company: company._id,
      });
      company.competitions.push(competition._id);
      await company.save();
      competitions.push(competition);
    }

    // Seed Participants
    for (let i = 0; i < NUM_RECORDS; i++) {
      const password = await bcrypt.hash('Password123', 10);
      const participant = await Participant.create({
        userName: `user${i}`,
        email: `user${i}@example.com`,
        password,
      });
      participants.push(participant);
    }

    // Seed Entries
    for (let i = 0; i < NUM_RECORDS; i++) {
      const competition = competitions[i % competitions.length];
      const participant = participants[i % participants.length];
      const entry = await Entry.create({
        title: faker.commerce.product(),
        competition: competition._id,
        participant: participant._id,
      });
      entries.push(entry);
    }

    // Seed Votes
    for (let i = 0; i < NUM_RECORDS; i++) {
      const entry = entries[i % entries.length];
      const participant = participants[(i + 1) % participants.length]; // Prevent self-voting
      await Vote.create({
        entry: entry._id,
        participant: participant._id,
        voteType: 'like',
      });
    }

    console.log('✅ Database seeded with dummy data');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
