# RxRedefined – Restaurant Order Manager

Technical test for RxRedefined - Restaurant Order Manager. Using Express.js & PostgreSQL

---

## 🚀 Getting Started

Step-by-step instructions:

```bash
# 1. Install all dependencies
npm ci

# 2. Duplicate the env template and adjust if necessary
cp .env.example .env

# 3. Launch PostgreSQL via Docker Compose
docker compose up -d

# 4. Run database migrations
npm run db:migrate

# 5. Start the application in watch mode
npm run dev
```

You should see this:
```
Server is running on port 3333 in development mode
```

---

## 🧪 Running Unit Tests

```bash
npm test
```

I used in-memory layer repositories to run unit tests.