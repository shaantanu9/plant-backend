# System Patterns

## System Architecture
- Node.js backend using Express.js framework with TypeScript.
- Likely uses MongoDB for data persistence (based on `app.ts` attempting connection).
- RESTful API structure organized by resource (Containers, Deliveries, Users, etc.).
- Utilizes Socket.IO for potential real-time features.
- Includes a dedicated logging middleware system.

## Key Technical Decisions
- TypeScript for type safety and improved developer experience.
- Express.js as the web framework.
- Swagger for API documentation.
- ESLint and Prettier for enforcing code quality and style.
- Modular routing structure (`src/routes`).
- Centralized logging system.

## Design Patterns in Use
- MVC (Model-View-Controller) or similar pattern likely used (inferred from `controllers`, `services`, `models` directories).
- Middleware pattern extensively used in Express.
- Singleton pattern likely used for exported instances (e.g., `new App()`, `new Routes()`).

## Component Relationships
- `server.ts`: Entry point, potentially handles clustering.
- `app.ts`: Core application setup, initializes Express, middleware, routes, Socket.IO, and DB connection.
- `src/routes/index.ts`: Aggregates and manages all API routes under `/api`.
- Individual route files (`src/routes/*.routes.ts`): Define endpoints for specific resources (e.g., `container.routes.ts`).
- `src/controllers`: Likely contains the logic to handle incoming requests and interact with services.
- `src/services`: Likely contains business logic and interaction with data models/database.
- `src/models` / `src/entity`: Likely defines data structures and database interactions.
- `src/middleware`: Contains custom middleware functions (e.g., authentication, validation, logging). 