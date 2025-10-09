# Database Indexing Guide

## Overview

This document describes the database indexes used in the Tantakuy application and how to manage them.

## Competition Collection Indexes

### 1. Company Index

**Field:** `company`
**Type:** Single field ascending index
**Purpose:** Efficiently fetch competitions by company
**Usage:** `GET /api/competitions?companyId=xxx`

```javascript
CompetitionSchema.index({ company: 1 });
```

### 2. Title Text Index

**Field:** `title`
**Type:** Text index
**Purpose:** Case-insensitive full-text search on competition titles
**Usage:** `GET /api/competitions?search=keyword`

```javascript
CompetitionSchema.index({ title: 'text' });
```

**Benefits:**

- ✅ Prevents full collection scans on searches
- ✅ Case-insensitive by default
- ✅ Supports partial word matching
- ✅ Language-aware stemming (if needed)

**Query Example:**

```javascript
// Before (slow - collection scan)
Competition.find({ title: { $regex: search, $options: 'i' } });

// After (fast - uses index)
Competition.find({ $text: { $search: search } });
```

## Other Collection Indexes

### Notifications

- **Compound index:** `{ recipient: 1, createdAt: -1 }` - Fetch user notifications sorted by date

### Entry

- **Single index:** `{ competition: 1 }` - Fetch entries by competition
- **Single index:** `{ participant: 1 }` - Fetch entries by participant

### Vote

- **Compound unique:** `{ participant: 1, entry: 1 }` - One vote per user per entry
- **Single index:** `{ entry: 1 }` - Count votes for entries

## Rebuilding Indexes

### When to Rebuild

- After updating index definitions in models
- After changing collation settings
- When indexes become fragmented
- When migrating to production

### How to Rebuild

**Option 1: Run Migration Script (Recommended)**

```bash
npm run migrate:indexes
```

This will:

1. Connect to MongoDB
2. Show current indexes
3. Drop old indexes (if needed)
4. Create new indexes
5. Verify the changes

**Option 2: Manual MongoDB Commands**

```javascript
// Connect to MongoDB
use tantakuy

// Drop old index (if exists)
db.competitions.dropIndex("title_1")

// Create text index
db.competitions.createIndex({ title: "text" }, { name: "title_text" })

// Verify indexes
db.competitions.getIndexes()
```

**Option 3: Mongoose Auto-Index (Development Only)**

```javascript
// In development, indexes are created automatically
// when the model is first used
mongoose.set('autoIndex', true); // Default in development
```

⚠️ **Warning:** Auto-indexing should be disabled in production for performance:

```javascript
mongoose.set('autoIndex', false); // Recommended for production
```

## Performance Impact

### Before Text Index (Regex Search)

```
Query: { title: { $regex: "photo", $options: "i" } }
Execution: Collection scan (COLLSCAN)
Time: ~200ms for 1000 documents
```

### After Text Index

```
Query: { $text: { $search: "photo" } }
Execution: Index scan (IXSCAN)
Time: ~5ms for 1000 documents
```

**Improvement: 40x faster! 🚀**

## Text Search Features

### Basic Search

```javascript
// Single word
Competition.find({ $text: { $search: 'photo' } });

// Multiple words (OR logic)
Competition.find({ $text: { $search: 'photo competition' } });
```

### Phrase Search

```javascript
// Exact phrase
Competition.find({ $text: { $search: '"photo competition"' } });
```

### Exclusion

```javascript
// Exclude words
Competition.find({ $text: { $search: 'photo -video' } });
```

### Relevance Scoring

```javascript
// Sort by text score
Competition.find(
  { $text: { $search: 'photo' } },
  { score: { $meta: 'textScore' } },
).sort({ score: { $meta: 'textScore' } });
```

## Monitoring Index Usage

### Check Index Usage

```javascript
// Explain query plan
db.competitions.find({ $text: { $search: 'photo' } }).explain('executionStats');

// Look for:
// - "stage": "TEXT" (index is being used)
// - "totalDocsExamined" (should be low)
```

### Index Stats

```javascript
// Get index statistics
db.competitions.aggregate([{ $indexStats: {} }]);
```

## Best Practices

1. ✅ **Create indexes before deploying to production**
2. ✅ **Monitor index usage with explain()**
3. ✅ **Keep indexes to minimum needed**
4. ✅ **Text indexes are case-insensitive by default**
5. ✅ **Use text search for better performance than regex**
6. ❌ **Don't use autoIndex in production**
7. ❌ **Don't create redundant indexes**

## Troubleshooting

### Index Not Being Used

```javascript
// Check if index exists
db.competitions.getIndexes()

// Rebuild index
npm run migrate:indexes

// Verify query uses index
db.competitions.find({ $text: { $search: "test" } }).explain()
```

### Slow Queries

```javascript
// Enable profiling
db.setProfilingLevel(2);

// View slow queries
db.system.profile.find({ millis: { $gt: 100 } });
```

## Migration Checklist

- [ ] Update model with new index definition
- [ ] Run migration script: `npm run migrate:indexes`
- [ ] Verify indexes in database
- [ ] Update queries to use new indexes
- [ ] Test query performance with explain()
- [ ] Deploy to production
- [ ] Run migration script in production
- [ ] Monitor performance

## References

- [MongoDB Text Indexes](https://docs.mongodb.com/manual/core/index-text/)
- [MongoDB Index Strategies](https://docs.mongodb.com/manual/applications/indexes/)
- [Mongoose Indexes](https://mongoosejs.com/docs/guide.html#indexes)
