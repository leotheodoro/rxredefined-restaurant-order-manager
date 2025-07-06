# RxRedefined – Restaurant Order Manager

An application for managing restaurant orders, customers and dishes. Built with Sequelize & PostgreSQL as part of a technical test for RxRedefined.

---

## Prerequisites

| Tool | Version (recommended) |
|------|-----------------------|
| Node | 18 LTS or later       |
| npm  | 9.x or later          |
| Docker | 24.x or later       |
| Docker Compose | v2 (built-in with Docker Desktop) |

> ✨ **Tip:** Use a version manager such as [`nvm`](https://github.com/nvm-sh/nvm) to switch Node versions effortlessly.

---

## 🚀 Getting Started

Follow the steps below to spin up the development environment.

```bash
# 1. Install all dependencies (CI-friendly & reproducible)
npm ci

# 2. Duplicate the env template and adjust if necessary
cp .env.example .env

# 3. (Optional) Change any database credentials inside .env
#    The defaults work out-of-the-box for local development 🙂

# 4. Launch PostgreSQL via Docker Compose (detached)
docker compose up -d

# 5. Start the application in watch mode
npm run dev
```

When the server is up you should see something like:
```
🚀 HTTP server running on http://localhost:3000
```

> **Alternative:** If you already have a PostgreSQL server running (locally or remotely) you can skip step&nbsp;4. Simply update the database connection variables (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`) in your `.env` file to point to your instance.

---

## 🧪 Running Unit Tests

```bash
npm test
```

The test suite is powered by Jest and uses an in-memory database for fast and deterministic runs.