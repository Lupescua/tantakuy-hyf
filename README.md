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

Your `.env` file should include all required secrets for the app to run. Here's an example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

The `.env` file is **not committed** to version control. Only `.env.example` is.

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

---```


## 📁 Folder Structure Explained
```

app/
├── components/
│   ├── NavbarLoggedIn/        → Navbar shown when user is logged in
│   ├── NavbarLoggedOut/       → Navbar shown when user is logged out
│   ├── FooterLoggedIn/        → Footer with navigation: Home, Search, Likes, Profile
│   └── FooterLoggedOut/       → Footer for non-authenticated users
│
├── layout.jsx                 → Global layout component that wraps all pages
├── page.jsx                   → Landing page with links to /loggedin and /loggedout
│
├── loggedin/page.jsx          → Simulated logged-in user page with Navbar & Footer when user is logged in
└── loggedout/page.jsx         → Simulated logged-out user page with Navbar & Footer when user is logged out
```

---