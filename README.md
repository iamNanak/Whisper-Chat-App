# Whisper Chat App

A real-time chat application built with a React + Vite frontend and an Express + Socket.IO backend. It supports user authentication, profile images, direct messaging, file uploads, and real-time message delivery via WebSockets.

**Key features**

- Sign up / Login with JWT stored in cookies
- Real-time messaging using Socket.IO (`sendMessage`, `recieveMessage` events)
- File uploads for messages and profile images
- REST endpoints for authentication, contacts and messages

**Tech stack**

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.IO
- Utilities: Axios, Multer, dotenv, bcrypt, jsonwebtoken

## Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB (local or hosted)

## Environment

The server expects a `.env` file at the project root of the `server` folder. Minimal variables used by the code:

```
DATABASE_URI=mongodb://localhost:27017
ORIGIN=http://localhost:5173
PORT=8080
JWT_KEY=your_jwt_secret
```

Note: the server appends the database name `whisper` when it connects (`${DATABASE_URI}/whisper`).

## Install

Install dependencies for both server and client.

```bash
# from project root
cd server
npm install

cd ../client
npm install
```

## Run (development)

Terminal 1 — Start server (with hot reload using nodemon):

```bash
cd server
npm run dev
```

Terminal 2 — Start frontend (Vite dev server):

```bash
cd client
npm run dev
```

Open the client at the URL printed by Vite (commonly `http://localhost:5173`). The server runs on `PORT` (default `8080`). Make sure `ORIGIN` in `.env` matches the client origin.

## Build (production)

To build the frontend:

```bash
cd client
npm run build
```

The backend currently runs separately; you can host the static build on any static hosting or serve it with your own static server.

## API Summary

Base path: `/api`

- Auth (`/api/auth`)
  - `POST /signup` — create account. Returns `jwt` cookie and user data.
  - `POST /login` — login. Returns `jwt` cookie and user data.
  - `GET /user-info` — (protected) get current user info.
  - `POST /update-info` — (protected) update profile (firstName, lastName, color).
  - `POST /upload-profile-image` — (protected, multipart) upload profile image.
  - `DELETE /remove-profile-image` — (protected) remove profile image.
  - `POST /logout` — clear auth cookie.

- Contacts (`/api/contacts`)
  - `POST /search` — (protected) search contacts.
  - `GET /all-contacts` — (protected) list contacts.
  - `GET /all-contacts-for-channels` — (protected) contacts formatted for channels.

- Messages (`/api/messages`)
  - `POST /get-messages` — (protected) get conversation messages between sender and recipient.
  - `POST /upload-files` — (protected, multipart) upload file for messages.

Protected endpoints require the JWT cookie set by login/signup. See `server/middlewares/auth.middleware.js` for verification behavior.

## WebSockets (Socket.IO)

- Namespace: default Socket.IO server initialized in `server/socket.js`.
- Connection handshake: the client sets `userId` in the socket handshake query.
- Events:
  - `sendMessage` — client emits with message payload; server stores it and emits `recieveMessage` to sender and recipient sockets.
  - `recieveMessage` — server emits to clients with populated message data.

Socket message storage is handled by the `Message` model (`server/models/message.model.js`). Uploaded files are stored under `uploads/files/` and profile images under `uploads/profiles/`.

## File storage locations

- Profile images: `uploads/profiles/`
- Message files: `uploads/files/<timestamp>/`

## Project structure (top-level)

- `/client` — React / Vite frontend
- `/server` — Express backend, Socket.IO, MongoDB models and routes
- `/server/uploads` — stored profile images and message files

Key server files:

- [server/index.js](server/index.js) — app entry, connects to MongoDB and starts Socket.IO
- [server/socket.js](server/socket.js) — socket event handlers
- [server/router/routes.js](server/router/routes.js) — auth routes

## Notes & gotchas

- Cookies are set with `secure: true` and `sameSite` settings — in development, if you run over HTTP you may need to relax cookie settings or run client and server with proper origins.
- Ensure `ORIGIN` in your `.env` exactly matches the client origin (including protocol and port).

## Contributing

- Open issues or PRs for bug fixes and improvements. Keep changes focused and test locally.

## License

This repository does not include a license file. Add one if you plan to publish.

---
