# Tantakuy HYF Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Lupescua/tantakuy-hyf.git
cd tantakuy-hyf
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

A `.env.example` file is provided. Copy it and fill in the values:

```bash
cp .env.example .env
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Environment Variables

Your `.env` file should include all required secrets for the app to run. See `.env.example` for a complete template:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

The `.env` file is **not committed** to version control. Only `.env.example` is.

### Rate Limiting & Proxy Configuration

This application uses [Upstash Redis](https://upstash.com/) for rate limiting authentication endpoints. The rate limiter extracts the client IP from the `x-forwarded-for` or `x-real-ip` headers.

**Important**: The IP extraction assumes you're behind a **trusted proxy or load balancer** (Vercel, Cloudflare, nginx, etc.) that correctly sets these headers. If deploying without a trusted proxy:

- The leftmost IP in `x-forwarded-for` is considered the real client IP
- Clients can potentially spoof this header without a trusted proxy
- For anonymous users (no IP available), a SHA-256 fingerprint of the User-Agent is used

---

## Code Style & Linting

This project uses **ESLint** and **Prettier** for linting and formatting.

- To lint your code:

  ```bash
  npm run lint
  ```

- To auto-format your code:

  ```bash
  npm run format
  ```

> Make sure your code passes lint checks before pushing.

---

## Installed Dependencies

This project includes:

- [Next.js](https://nextjs.org/)
- [Mongoose](https://mongoosejs.com/)
- [Axios](https://axios-http.com/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cookie](https://www.npmjs.com/package/cookie)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

---

## Optional: Recommended VS Code Extension

- **Material Icon Theme** (for prettier file icons)

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) – learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) – an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) – your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Tantakuy — Voting & Gallery Module (Sprint 06 / July 2025)

This update explains the architecture and usage of the voting workflow, gallery pages and the new authentication flow introduced in **PR #50**.

---

## 1. Folder map

```text
app/
 ├─ api/
 │   ├─ votes/               ← HTTP wrappers only
 │   │   ├─ route.js         POST / GET (count)
 │   │   └─ [id]/route.js    DELETE
 │   ├─ entries/
 │   │   ├─ route.js         list / create
 │   │   └─ [id]/route.js    GET / DELETE
 │   ├─ competitions/…
 │   └─ auth/…
 │
 ├─ context/
 │   └─ AuthContext.jsx      ← client-side user state
 │
 ├─ components/
 │   ├─ competitions/
 │   │   ├─ CompetitionList.jsx
 │   │   └─ CompetitionCard.jsx
 │   ├─ entries/
 │   │   └─ EntryCard.jsx
 │   └─ loader/
 │       └─ Loader.jsx
 │
 ├─ competition/
 │   └─ [id]/page.jsx        ← gallery
 ├─ entry/
 │   └─ [id]/page.jsx        ← single entry
 └─ …

Back-end data work lives in app/services/. Example:
import { saveVote } from '@/app/services/voteServices'
// handles validation + DB, returns { ok, vote | reason }


2. Auth flow
/api/login sets token (httpOnly).

AuthContext runs once on mount → GET /api/auth/me.
success → user state ; fail → user = null

logout clears cookie (/api/logout) + refresh().

Any component can:
const { user, loading, refresh } = useAuth()

3. Voting API
Method & route	Body / Query	Returns
POST /api/votes \ Body / Query:	{ entry, voteType } \ Returns:	201 + vote or 409 duplicate
GET /api/votes/me	\ Body/ Query : ?entryId=	\ returns: { votes, hasVoted, recordId}
DELETE /api/votes/:id \ Body/Query: 	–	  \ returns 204 on success

voteServices.js throws AppError for consistent HTTP codes.

4. Frontend components
4.1 EntryCard
Placeholders: entryId === null → skip API, disable buttons.

Real ids:

GET vote info on mount.

Auth-guarded vote toggle → optimistic UI.

409 from API means the user already voted (edge-case double-click).

4.2 CompetitionCard
Fetch up to six most-recent entries.

Build fixed 6-slot array [ {id,src}, … ].

Renders EntryCards with showActions={false} in overview.

5. Pages
/competitions
CompetitionList → grid of cards.

/competition/:id
Loads entries + competition name, shows JoinButton.

/entry/:id
Single full-width image, caption, participant name, vote/share.

6. Styling notes
Buttons follow the global .submitButton palette.

Layout uses simple grid / flex – see entryPage.module.css.

Happy testing & let us know if you hit any edge cases 🙌


-------------
```

## 🛠 Integration Branch (integration/03072025)

This branch is our “staging ground” for all merged work prior to cutting a release. It already includes:

- **AuthContext** (login/logout & current user)

- **Competitions** list & detail views

- **Entries** gallery, detail page, and participant upload flow

- **Voting** API & `EntryCard` UI

- **Image-upload modal** (Cloudinary) + new `create-new-entry` endpoint

### 1. Getting started

#### 1. Check out the branch

```bash
git fetch origin integration/03072025
git checkout integration/03072025
```

#### 2. Install & env setup

```bash
npm install
```

#### 3. Create a `.env.local` with at least:

```ini
MONGODB_URI=…
JWT_SECRET=…
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_UPLOAD_PRESET=…
```

#### 4. Run the dev server

```bash
npm run dev
```

### 2. AuthContext

Lives in `app/context/AuthContext.jsx`

Wraps your app (in `RootLayout`) and exposes:

```js
const { user, loading, refresh } = useAuth();
```

On login/logout it manages the `token` cookie and refetches `/api/auth/me`.

🔑 All client‐side calls guard on `loading || !user` and redirect to `/login` when needed.

### 3. API Routes Overview

| Route                           | Method | Purpose                            |
| ------------------------------- | :----: | ---------------------------------- |
| `/api/auth/login`               |  POST  | Issue JWT cookie                   |
| `/api/auth/logout`              |  POST  | Clear cookie                       |
| `/api/auth/me`                  |  GET   | Who am I?                          |
| `/api/competitions`             |  GET   | List all competitions              |
| `/api/competitions/[id]`        |  GET   | One competition by ID              |
| `/api/entries?competitionId=`   |  GET   | Entries in a competition           |
| `/api/entries/[id]`             |  GET   | One entry (populates participant)  |
| `/api/entries/create-new-entry` |  POST  | Participant uploads new entry      |
| `/api/votes/me?entryId=`        |  GET   | Count + whether current user voted |
| `/api/votes`                    |  POST  | Cast a vote                        |
| `/api/votes/[id]`               | DELETE | Remove a vote                      |

_Note:_ All write routes require (or at least shoud require) auth cookie + JWT.

### 4. Key Components & Pages

`<CompetitionList />` & `<CompetitionCard />`
Shows active competitions, hiding voting UI.

`<CompetitionGalleryPage />` (`/competition/[id]`)
Grid of `<EntryCard />`, plus Join button.

`<EntryCard />`
Fetches votes + hasVoted, toggles vote on click, links to /entry/[id].

`<EntryPage />` (`/entry/[id]`)
Big image, caption, vote & share buttons, participant name.

`<JoinButton />`
Uses `useAuth()` to send guests to `/login` or users to `/participant-entry`.

`<UploadImageModal />` + `<EntryForm />` (`/participant-entry/[competitionId]`)
Cloudinary picker + POST to `create-new-entry`, then redirect to the new `/entry/…` page.

### 5. Branch hygiene

Before merging any new PR:

1. **Rebase** on `integration/03072025`

2. **Important** ---> Run `npm run lint && npm test`

3. **Format** ---> Run `npm run format`

After merging, kick off a quick smoke test of login, competition list, voting, and entry-upload.

## 🔐 Authentication UPDATE 04-07-2025

**The login flow now includes role-based redirection:**

- If the user has a role of `"company"`, they will be redirected to `/company/profile`
- If the user is a `"participant"` (or any other role), they are redirected to the home page `/`

Login uses:

- `POST /api/login` for authentication
- A `Set-Cookie` header to persist a JWT token
- Role is determined server-side and passed to the client for redirect logic

Ensure `.env.local` includes:

```env
DOMAIN_API=http://localhost:3000/api
```

Anywhere you need role check, you can for example the following:

```js
const { user } = useAuth();

if (user?.role === 'company') {
  // show/hide company-specific UI
}
```
