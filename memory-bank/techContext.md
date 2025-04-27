# Tech Context

## Technologies Used
- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB (inferred)
- **Real-time:** Socket.IO
- **API Documentation:** Swagger
- **Code Quality:** ESLint, Prettier
- **Package Manager:** npm
- **Module Aliasing:** `module-alias`
- **Logging:** Custom logging middleware (likely Winston or similar, wrapped)
- **Development:** `nodemon` (inferred from `npm run dev` convention)

## Development Setup
- Clone repository.
- Install dependencies using `npm install`.
- Set up environment variables by copying `.env.example` to `.env` and configuring.
- Run development server using `npm run dev`.
- Lint code using `npm run lint`.
- Format code using `npm run format`.
- Run tests using `npm test`.
- Build for production using `npm run build`.
- Generate API docs using `npm run docs`.

## Technical Constraints
- Ensure compatibility with Node.js and TypeScript versions specified in `package.json`.
- Requires MongoDB instance for database operations.
- Environment variables must be correctly configured in `.env`.

## Dependencies
- Managed via `package.json` and `package-lock.json` using npm.
- Key dependencies include: `express`, `typescript`, `mongoose` (likely), `socket.io`, `swagger-ui-express`, `eslint`, `prettier`, `morgan`, `cors`, `module-alias`. 