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

# 5. Run database migrations (creates tables & enums)
npm run db:migrate

# 6. Start the application in watch mode
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

---

## 💡 Design decisions

### Why the `bitnami/postgresql` image?
I chose the Bitnami flavor instead of the vanilla `postgres` image because Bitnami ships opinionated, secure defaults out-of-the-box. Things like non-root execution, disabled remote superuser login, and sensible default configs reduce the attack surface with zero extra effort—perfect for a take-home project where reviewer time is limited.

### Money stored as **integer cents**
Prices are persisted as `INTEGER` values that represent _cents_ (e.g., `1999` ⇒ **$19.99**). For this app there is no need for:
* tax breakdowns
* multi-currency conversions
* interest / yield calculations

Hence `INTEGER` offers sufficient precision, avoids floating-point pitfalls, and is faster and smaller on disk than `DECIMAL`.

### Snapshotted dish prices on order creation
Each `order_item` stores the dish's **unit price at the moment the order was placed**. This guarantees historical accuracy for analytics even if menu prices change later.

---

## 🔧 Suggested RESTful endpoint
The assessment specified certain endpoint paths, so I implemented them verbatim. In a production codebase I would align the API with common REST naming conventions:

| Action | Recommended Path & Verb |
|--------|------------------------|
| Register customer | `POST /customers` |
| Add dish to menu | `POST /dishes` |
| List menu | `GET /dishes` |
| Create order | `POST /orders` |
| List customer orders | `GET /customers/:customerId/orders` |
| Update order status | `PATCH /orders/:orderId/status` |
| Modify order items | `PATCH /orders/:orderId/items` |

All resources are plural and nested only when it clarifies hierarchy (e.g., orders _belong to_ a customer).