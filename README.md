# Student Record Management System

A responsive student register built with React, Express, Node.js and MongoDB. Records are stored in MongoDB; the application does not seed or retain browser-local data.

## Features

- Add, view, edit and delete student records
- Search by admission number, student name or father's name
- Required-field, date and name validation in the browser and API
- Unique admission numbers enforced by a MongoDB index
- Responsive form and records table with loading, empty, success and error states
- Centralized API errors and consistent JSON responses

## Tech stack

React 19, Vite, Node.js, Express 5, MongoDB and Mongoose.

## Setup

Prerequisites: Node.js 20.19+ (or 22.12+) and a running MongoDB instance or MongoDB Atlas database.

1. Install dependencies from the project root:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set `MONGO_URI` to your MongoDB connection string. Set `PORT` if the default API port `5000` is unavailable. Keep `.env` private and never commit credentials.

3. Start the API and Vite development server together:

   ```sh
   npm run dev
   ```

   Open the URL printed by Vite (normally `http://localhost:5173`). The development server proxies `/api` requests to the API.

4. Create a production client build with `npm run build`. Start the API alone with `npm start`.

Optional environment variable: `CLIENT_ORIGIN` sets the allowed browser origin(s), separated by commas. It defaults to `http://localhost:5173`.

## API

Base path: `/api/students`. All responses use `{ "success": boolean, "message": string, "data": ... }` on success and `{ "success": false, "message": string }` on errors. Validation failures return `400`, duplicate admission numbers `409`, missing records `404`, and unexpected server errors `500`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/students` | Create a student (`201`) |
| `GET` | `/api/students` | List students |
| `GET` | `/api/students/:id` | Get one student |
| `PUT` | `/api/students/:id` | Update a student |
| `DELETE` | `/api/students/:id` | Delete a student |
| `GET` | `/api/health` | Check API availability |

Student JSON fields: `admissionNo`, `studentName`, `dob` (ISO date), `gender` (`Male`, `Female` or `Other`) and `fatherName`.

## Project flow

React form and table → API service → Express route → controller → Mongoose model → MongoDB → JSON response → React state.