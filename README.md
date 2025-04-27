# Cooding-Soyar Backend

Backend service for plant container management and delivery system.

## Overview

This project provides a REST API for managing plant container inventory, deliveries, and subscriptions. It includes features for tracking containers throughout their lifecycle, managing delivery routes, and collecting analytics.

## API Documentation

The API is documented using Swagger. The endpoints are organized into the following categories:

### Containers

- **GET /containers** - Get all containers
- **GET /containers/{containerId}** - Get container by ID
- **GET /containers/type/{type}** - Get containers by type
- **GET /containers/status/{status}** - Get containers by status
- **GET /containers/stats** - Get container statistics
- **PUT /containers/{containerId}/transit-out** - Mark container as in transit to subscriber
- **PUT /containers/{containerId}/with-subscriber** - Mark container as with subscriber
- **PUT /containers/{containerId}/transit-in** - Mark container as in transit to warehouse
- **PUT /containers/{containerId}/returned** - Mark container as returned to warehouse
- **POST /containers/{containerId}/maintenance** - Record container maintenance
- **PUT /containers/{containerId}/cleaned** - Mark container as cleaned
- **PUT /containers/{containerId}/condition** - Update container condition
- **PUT /containers/{containerId}/under-maintenance** - Mark container as under maintenance
- **PUT /containers/{containerId}/inventory** - Return container to inventory
- **PUT /containers/{containerId}/deposit/collect** - Mark deposit as collected
- **PUT /containers/{containerId}/deposit/refund** - Mark deposit as refunded
- **PUT /containers/{containerId}/lost** - Mark container as lost

### Deliveries

- **GET /deliveries/listing** - Get deliveries listing
- **POST /deliveries** - Create new delivery
- **GET /deliveries/{deliveryId}** - Get delivery by ID
- **PUT /deliveries/{deliveryId}/status** - Update delivery status
- **PUT /deliveries/{deliveryId}/in-transit** - Mark delivery as in transit
- **PUT /deliveries/{deliveryId}/delivered** - Mark delivery as delivered
- **PUT /deliveries/{deliveryId}/partial** - Mark delivery as partially completed
- **PUT /deliveries/{deliveryId}/cancel** - Cancel delivery
- **POST /deliveries/{deliveryId}/container/delivered** - Add delivered container
- **PUT /deliveries/{deliveryId}/container/{containerId}/verify** - Verify container
- **GET /deliveries/personnel/{personnelId}/optimize-route** - Optimize delivery route

### Users and Administration

- **GET /users** - Get all users
- **POST /users** - Create new user
- **GET /admin** - Get all admins
- **POST /admin** - Create new admin

### Analytics

- **GET /analytics** - Get system analytics

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Cooding-Soyar-Backend.git
   cd Cooding-Soyar-Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Start the development server:
   ```
   npm run dev
   ```

## Development

### Code Quality

- **Linting**: We use ESLint for code quality
  ```
  npm run lint
  ```

- **Formatting**: We use Prettier for code formatting
  ```
  npm run format
  ```

### Testing

Run the test suite:
```
npm test
```

### Build

Build the application for production:
```
npm run build
```

## Documentation

Generate and view API documentation:
```
npm run docs
npm run docs:view
```

## License

[MIT](LICENSE)

# Logging System

The application uses a comprehensive logging system that provides:

## Features

- Multiple log levels (ERROR, WARN, INFO, DEBUG)
- Request/response logging middleware
- Automatic log file rotation
- Context-based logging
- Performance tracking
- Request ID tracking for correlation
- Global logger functions accessible anywhere in the app

## Usage

### Basic Logging

```typescript
import { logger } from './middleware/logger.middleware';

// Different log levels
logger.error('Critical error occurred', { userId: '123', orderId: '456' });
logger.warn('Something unusual happened');
logger.info('Normal operation completed');
logger.debug('Detailed information for troubleshooting');
```

### Context-Based Logging

```typescript
import { createScopedLogger } from './middleware/logger.middleware';

// Create a logger with context that will be included in all log entries
const orderLogger = createScopedLogger({ orderId: '123', userId: '456' });

orderLogger.info('Order processing started');
orderLogger.debug('Payment validation passed');
orderLogger.info('Order completed successfully');
```

### Configuration

```typescript
import { configureLogger, LogLevel } from './middleware/logger.middleware';

// Change log level
configureLogger({ level: LogLevel.DEBUG });

// Disable file logging
configureLogger({ enableFile: false });

// Change log file location
configureLogger({ 
  logDirectory: '/custom/path',
  logFileName: 'custom.log'
});

// Temporarily disable logging
import { disableLogger, enableLogger } from './middleware/logger.middleware';

disableLogger();
// No logs will be generated here
enableLogger();
```

### Express Middleware

The logging system includes middleware for request/response logging and error handling:

```typescript
import { requestLogger, errorLogger } from './middleware/logger.middleware';

// Add early in the middleware chain
app.use(requestLogger);

// Add before error handlers
app.use(errorLogger);
```
