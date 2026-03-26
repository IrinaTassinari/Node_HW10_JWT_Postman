# HW10: JWT Authentication API

A REST API built with `Node.js` and `Express` for basic authentication and authorization using JWT.

The project includes:
- user login with `email` and `password`
- token validation through middleware
- role-based access control for `admin`
- email update
- user role update
- JWT token refresh
- account deletion

This project uses an in-memory `users` array instead of a database.

## Technologies

- `Node.js`
- `Express`
- `jsonwebtoken`
- `bcrypt`
- `dotenv`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
PORT=3000
JWT_SECRET=your_secret_key
```

3. Start the server:

```bash
node index.js
```

After startup, the server will be available at:

```text
http://localhost:3000
```

## Test Users

The users are defined directly in [index.js](/c:/Users/irina_fsmug68/my_files/18072025/Node/HW/HW10/index.js).

### Admin

- `email`: `irina01@gmail.com`
- `password`: `password`
- `role`: `admin`

### User

- `email`: `user2@gmail.com`
- `password`: `password`
- `role`: `user`

## API Endpoints

### `GET /`

Checks whether the server is running.

Response:

```json
"Server is running"
```

### `POST /login`

Authenticates a user and returns a JWT.

Request body:

```json
{
  "email": "irina01@gmail.com",
  "password": "password"
}
```

Response:

```json
{
  "token": "your_jwt_token"
}
```

### `POST /update-email`

Updates the email of the currently authenticated user.

Required header:

```text
Authorization: Bearer <token>
```

Request body:

```json
{
  "newEmail": "newmail@example.com"
}
```

### `POST /update-role`

Changes a user's role. Only accessible to users with the `admin` role.

Required header:

```text
Authorization: Bearer <token>
```

Request body:

```json
{
  "id": "02",
  "newRole": "admin"
}
```

### `POST /refresh-token`

Generates a new JWT for the authenticated user.

Required header:

```text
Authorization: Bearer <token>
```

### `DELETE /delete-account`

Deletes the currently authenticated user's account.

Required header:

```text
Authorization: Bearer <token>
```

## Authorization Logic

- JWT is generated after a successful login
- the token payload contains `id`, `email`, and `role`
- token expiration time is `1 hour`
- `authenticateJWT` middleware validates the token
- `authorizeRole('admin')` middleware allows access only to admins

## Project Structure

```text
HW10/
|- index.js
|- package.json
|- .env
\- README.md
```

## Postman Testing

API testing was performed with Postman. The Postman Documenter is available here:

`https://documenter.getpostman.com/view/53300232/2sBXijJXRe`

## Current Limitations

- user data is stored only in memory
- all changes are lost after a server restart
- there is no user registration endpoint
- there are no automated tests
