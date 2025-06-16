# API Folder

This folder contains the backend route handlers and API logic for the application.

- In Next.js App Router, this is where route handler files live to define API endpoints.
- Each subfolder or file corresponds to an API route.
- You can implement RESTful endpoints or other server-side logic here.
- Using Next.js API routes means the backend runs within the same server as your frontend.

Example structure:

api/
users/
route.js # GET, POST for users
meals/
route.js # GET, POST for meals

For more info, see [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).
