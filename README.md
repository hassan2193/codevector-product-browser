# CodeVector Backend Take-Home Task

## Overview

This project implements a scalable product browsing API using Node.js, Express, PostgreSQL, and Neon.

The system supports:

- Browsing 200,000+ products
- Category filtering
- Cursor-based pagination
- Stable ordering while data changes
- Fast queries using database indexes

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Neon Database
- Render (for deployment)

---

## Database Design

### Products Table

Fields:

- id
- name
- category
- price
- created_at
- updated_at

A seed script generates 200,000 products directly inside PostgreSQL using `generate_series()` for fast bulk insertion.

---

## Pagination Strategy

I used **Cursor Pagination** instead of Offset Pagination.

### Why not Offset Pagination?

Offset pagination can produce duplicate or missing records when new products are inserted or existing products are updated while a user is browsing.

Example:

Page 1 loads.

50 new products are inserted.

Page 2 using OFFSET may now skip or repeat products.

### Solution

Cursor pagination uses the last record of the previous page as a bookmark.

Products are sorted using:

```sql
ORDER BY updated_at DESC, id DESC
```

The next page is fetched using:

```sql
WHERE (updated_at, id) < (cursorUpdatedAt, cursorId)
```

This ensures stable pagination and avoids duplicates during browsing.

---

## Indexing

To make pagination efficient on large datasets, I created a composite index:

```sql
CREATE INDEX idx_products_pagination
ON products(updated_at DESC, id DESC);
```

For category filtering:

```sql
CREATE INDEX idx_products_category_pagination
ON products(category, updated_at DESC, id DESC);
```

These indexes allow PostgreSQL to efficiently retrieve sorted records without expensive table scans.

---

## API Endpoints

### Get Products

```http
GET /products
```

Returns first page of products.

---

### Filter By Category

```http
GET /products?category=electronics
```

Returns products from a specific category.

---

### Cursor Pagination

```http
GET /products?cursorUpdatedAt=<timestamp>&cursorId=<id>
```

Returns the next page.

---

### Category + Cursor Pagination

```http
GET /products?category=electronics&cursorUpdatedAt=<timestamp>&cursorId=<id>
```

Returns the next page within a category.

---

## Running Locally

Install dependencies:

```bash
npm install
```

Configure:

```env
DATABASE_URL=your_neon_connection_string
PORT=5000
```

Run:

```bash
npm run dev
```

Seed database:

```bash
npm run seed
```

---

## Frontend

A simple frontend is included to:

- Browse products
- Filter by category
- Load more products using cursor pagination

The frontend was intentionally kept lightweight because the focus of the assignment is backend correctness and scalability.

---

## What I Would Improve With More Time

- Product search
- Infinite scrolling
- Better frontend UI/UX
- API validation using middleware
- Automated tests
- Docker setup
- Caching layer for frequently accessed queries

---

## AI Usage

I used AI as a development assistant for:

- Discussing pagination approaches
- Reviewing implementation ideas
- Explaining database indexing concepts

All implementation details, debugging, testing, and final decisions were verified manually.
