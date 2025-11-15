# Book Review API (Course Project)

## Overview
Simple REST API to list books, search by ISBN/author/title, manage reviews (add/update/delete) for registered users. Includes a Node client demonstrating four required methods.

## Files
- `server.js` - Main Express server
- `data/books.json` - Sample data
- `client.js` - Node.js client demonstrating the 4 methods
- `package.json` - dependencies and scripts
- `README.md` - this file

## Setup
1. Create project folder and add files exactly as provided above.
2. Run `npm install` to install dependencies.
3. Start server: `npm start` (or `npm run dev` if you want nodemon).
4. Use Postman or curl to test endpoints.

## Endpoints to capture screenshots for grading
- GET `/books` (Task 1)
- GET `/books/isbn/:isbn` (Task 2)
- GET `/books/author/:author` (Task 3)
- GET `/books/title/:title` (Task 4)
- GET `/books/review/:isbn` (Task 5)
- POST `/register` with `{ username, password }` (Task 6)
- POST `/login` with `{ username, password }` (Task 7) → returns JWT
- PUT `/books/review/:isbn` (Task 8) — requires Authorization: Bearer <token>
- DELETE `/books/review/:isbn` (Task 9) — requires Authorization
- Run `node client.js` to capture Task 10–13 console outputs (Tasks 10-13)


