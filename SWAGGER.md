# Soyar Plant App API Documentation

This project includes a Swagger UI for API documentation. Follow the steps below to access and use the API documentation.

## Accessing the Swagger Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:8088/api-docs
```

This provides an interactive UI where you can:

- Explore all available API endpoints
- View request/response schemas
- Test API endpoints directly from the browser

## Authentication

Most API endpoints require authentication. To authenticate:

1. Use the `/api/user/login` endpoint to obtain a JWT token
2. Click the "Authorize" button at the top of the Swagger UI
3. Enter your JWT token in the format: `Bearer your-token-here`
4. Click "Authorize" to apply the token to all subsequent requests

## Available Resources

The API provides endpoints for managing:

- Users and authentication
- Subscribers
- Subscriptions
- Deliveries
- Delivery Personnel
- Containers
- Reports
- Items

## Development

### Adding New Endpoints

When adding new endpoints to the API:

1. Update the `swagger.json` file to document the new endpoints
2. Include proper request/response schemas
3. Add appropriate tags to organize endpoints

### Running Locally

To run the API and documentation locally:

```
npm run dev
```

This will start the server and make the Swagger documentation available at the URL mentioned above.

## Troubleshooting

If you encounter issues with the Swagger documentation:

1. Ensure the `swagger.json` file is properly formatted
2. Check that you've installed all required dependencies
3. Verify that the server is running correctly

For any questions or issues, please contact the development team.

## Modular Swagger Documentation

The Swagger documentation has been split into multiple files for better maintainability:

### Directory Structure

```
swagger/
├── base.json              # Main Swagger file with references
├── paths/                 # API endpoints
│   ├── index.json         # References to individual path files
│   ├── containers/        # Container endpoint definitions
│   ├── users/             # User endpoint definitions
│   └── admin/             # Admin endpoint definitions
├── schemas/               # Schema definitions
│   ├── index.json         # References to individual schema files
│   ├── Error.json         # Error schema
│   ├── Container.json     # Container schema
│   └── ...                # Other schemas
└── security/              # Security definitions
    └── security.json      # Security schemes

```

### How to Use

1. **Edit Individual Files**: Modify the appropriate JSON file in the `swagger/` directory structure.
2. **Bundle for Production**: Run `npm run swagger:bundle` to combine all files into a single `swagger.json`.
3. **Validate**: Run `npm run swagger:validate` to check if your Swagger documentation is valid.

### Benefits

- Smaller, more manageable files
- Easier collaboration (less merge conflicts)
- Better organization by feature/resource
- Reuse of common components

### Dependencies

The bundling process requires `@redocly/cli`:

```bash
npm install --save-dev @redocly/cli
```

### Commands

- **Bundle files**: `npm run swagger:bundle` - Combines all files into a single `swagger.json`
- **Validate**: `npm run swagger:validate` - Checks if your Swagger documentation is valid
- **Preview**: `npm run swagger:serve` - Starts a local server to preview the documentation

### Workflow

1. Make changes to individual files in the `swagger/` directory
2. Validate your changes with `npm run swagger:validate`
3. Preview documentation with `npm run swagger:serve`
4. Bundle for production with `npm run swagger:bundle`
