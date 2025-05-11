# CONTRIBUTING.md

Thank you for wanting to contribute to **Epaisa**! This guide explains our process, local setup, database handling, and PR workflow.

---

## Reporting Issues

1. Search existing issues to avoid duplicates.
2. Click **New Issue**, choose **Bug report** or **Feature request**.
3. Provide:

   * A clear title
   * Steps to reproduce or use case
   * Expected vs. actual behavior
   * Screenshots or logs (if applicable)

---

## Branch & PR Workflow

We follow a feature-branch model to keep `main` stable and production-ready.

1. **Sync with `main`**

   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a feature branch**

   ```bash
   git checkout -b feature/<short-description>
   # or
   git checkout -b bugfix/<short-description>
   ```
3. **Develop on localhost**

   * Follow the **Environment & Secrets** and **Backend Setup & Database** sections below.
   * Run and test entirely on your local machine; no access to remote servers is required unless you’re adding schema changes.
4. **Commit & push**

   ```bash
   git add .
   git commit -m "feat: short description"
   git push -u origin feature/<short-description>
   ```
5. **Open a Pull Request**

   * Target branch: `main`
   * Title: Brief, imperative summary
   * Description: What and why, any setup or testing notes

### PR Checklist

* [ ] CI checks pass (builds, tests, lint)
* [ ] Code follows project style (ESLint + Prettier)
* [ ] Documentation updated if needed
* [ ] Tested on `localhost`

Once approved and merged, CI/CD will deploy:

* **Netlify** publishes preview & updates production site on `main` merges.
* **Render** rebuilds/restarts the backend service for `main` merges.

---

## Code Style

* Follow existing conventions (ESLint + Prettier).
* Use clear, descriptive naming.
* Document complex logic with comments or JSDoc.

---

## Environment & Secrets

* **Do not commit** `.env` or any secret files.
* To receive example `.env` files for backend and frontend, DM **7439908878** or email **[2710rismi@gmail.com](mailto:2710rismi@gmail.com)**.

---

## Backend Setup & Database

Contributors can work entirely on `localhost` and leverage the existing Render-hosted database schema. Schema changes should be managed via migrations.

1. **Obtain `.env` configs**

   * Contact the maintainer for `server/.env` containing database credentials.
2. **Create local database**

   ```bash
   cd server
   createdb epaisa_db
   ```

   Or in pgAdmin: create a database named `epaisa_db`.
3. **Restore baseline schema**

   * A `backup.dump` file in `server/` holds the current schema.
   * Restore via terminal:

     ```bash
     pg_restore --verbose --clean --no-owner \
       --host "$DB_HOST" --port "$DB_PORT" \
       --username "$DB_USER" --dbname "$DB_NAME" \
       server/backup.dump
     ```
   * Or use pgAdmin’s Restore option pointing to `backup.dump`.
4. **Install dependencies & start server**

   ```bash
   npm install
   nodemon index.js
   ```

   The API runs at `http://localhost:5000`.
5. **Manage schema changes (migrations)**

   * Add SQL files to `server/migrations/`, prefixed `001-*.sql`, `002-*.sql`, etc., with only the necessary DDL statements.
   * Apply all migrations locally:

     ```bash
     for f in server/migrations/*.sql; do
       psql "$POSTGRES_URI" -f "$f"
     done
     ```
   * After merging, the maintainer applies these same migrations to the Render database using the external connection URL.

Contributors do **not** need to provision or maintain the Render Postgres instance—only supply migrations when schema changes are needed.

---

## Getting Help

* For general questions or design discussions, open an issue or discussion.
* Contact **Rishabh Mishra** at **[2710rismi@gmail.com](mailto:2710rismi@gmail.com)** or DM **7439908878**.

Thank you for making Epaisa better! 🙏
