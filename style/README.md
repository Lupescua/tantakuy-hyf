# Style Folder

This folder holds global and modular stylesheets.

- Includes CSS, SCSS, or other styling files for the app.
- Can include variables, mixins, and theme-related styles.
- Keep styles organized to maintain a consistent design system.

Example:

```
style/
  globals.css
  variables.css
  layout.css
```

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