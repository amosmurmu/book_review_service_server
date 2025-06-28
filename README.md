# Book Review Service

A small backend service for managing books and their reviews.

---

## 📦 Tech Stack

- **Node.js + Express**
- **PostgreSQL** with `drizzle-orm`
- **Redis** for caching
- **Jest** for unit and integration testing
- **Swagger (OpenAPI)** for API docs

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd book_review_service
```

### 2. Install Dependecies add your env variables

```bash
npm install
```

after add env variables DATABASE_URL and REDIS_URL

```bash
npm run dev or npm start
```

### 3. Migrations Scripts

```bash
npm run db:generate
npm run db:migrate
```

### 4. Test

```bash
npm run test
```

## API docs or Postman

[Postman]()
Swagger UI - /api-docs
