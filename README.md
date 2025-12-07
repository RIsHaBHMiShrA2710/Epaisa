# Epaisa

**A one-stop solution for finance enthusiasts and those seeking tax consultation from industry experts.**

Epaisa empowers users to read and publish finance-focused blogs, share personal financial journeys, engage via comments and votes, and upload images seamlessly.

---

## Features

* Publish and read finance-specific blog posts
* Share your personal financial journey
* Comment, upvote/downvote articles
* Secure login with Google OAuth
* Image uploads via Cloudinary (use sparingly)
* Contact form for expert tax consultation

---

## Tech Stack

* **Frontend:** React + Vite
* **Backend:** Node.js + Express.js
* **Database:** PostgreSQL (managed on Render)
* **Storage:** Cloudinary for images
* **Session Store:** PostgreSQL via `connect-pg-simple`
* **Deployment:** Netlify (frontend) & Render (backend + DB)

---

## Live Demo

[https://epaisafinance.app](https://epaisafinance.com)

---

## Installation & Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/RIshaBHMishrA2710/Epaisa.git
   cd Epaisa
   ```
2. **Install dependencies**

   * Backend: `cd server && npm install`
   * Frontend: `cd client && npm install`
3. **Obtain environment files**
   DM **7439908878** or email **[2710rismi@gmail.com](mailto:2710rismi@gmail.com)** to receive the private `.env` examples.
4. **Start the services**

   * Backend (inside `/server`):  `nodemon index.js`
   * Frontend (inside `/client`): `npm run dev`

Once running, navigate to:

* Backend: `http://localhost:5000`
* Frontend: `http://localhost:5173`

---

## Database

The application uses a managed PostgreSQL instance on Render. Contributors work locally against the schema defined in the `server/backup.dump` or migrations. Schema changes should be submitted as SQL migration files and will be applied to the Render database after PR approval.

---

## Deployment

* **Frontend**: Merges into `main` auto‐deploy to Netlify at `https://epaisa.netlify.app`. Preview deploys created for pull requests.
* **Backend & Database**: Merges into `main` trigger rebuild and restart on Render. The existing database instance remains until migrations are applied.

---

## Branching & Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contributor guidelines, issue reporting, and PR workflow.

---

## License & Contact

©2025 Rishabh Mishra

For questions, env files, or support, please DM **7439908878** or email **[2710rismi@gmail.com](mailto:2710rismi@gmail.com)**.
