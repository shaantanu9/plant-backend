/**
 * Script to build the complete Swagger documentation from component files
 */
const fs = require('fs');
const path = require('path');

// Configuration
const swaggerDir = path.join(__dirname, '..', 'swagger');
const outputPath = path.join(__dirname, '..', 'public', 'swagger.json');

// Ensure public directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'public'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'public'), { recursive: true });
}

// Base Swagger document
const swagger = {
  openapi: '3.0.0',
  info: {
    title: 'Cooding-Soyar API',
    description: 'API for plant container management and delivery system',
    version: '1.0.0',
    contact: {
      name: 'Cooding-Soyar Support',
      email: 'support@example.com',
      url: 'https://example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Main API server',
    },
  ],
  tags: [
    {
      name: 'Container',
      description: 'Container management operations',
    },
    {
      name: 'Delivery',
      description: 'Delivery management operations',
    },
    {
      name: 'User',
      description: 'User management operations',
    },
    {
      name: 'Admin',
      description: 'Admin operations',
    },
    {
      name: 'Analytics',
      description: 'System analytics and reporting',
    },
  ],
  paths: {},
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

// Load paths
console.log('Loading paths...');
const pathsIndexPath = path.join(swaggerDir, 'paths', 'index.json');
if (fs.existsSync(pathsIndexPath)) {
  const pathsIndex = JSON.parse(fs.readFileSync(pathsIndexPath, 'utf8'));

  // Process each path reference
  Object.entries(pathsIndex).forEach(([endpointPath, reference]) => {
    const refPath = reference.$ref;
    if (!refPath || !refPath.startsWith('./')) {
      console.error(`Invalid reference for endpoint ${endpointPath}: ${refPath}`);
      return;
    }

    const parts = refPath.substring(2).split('/');
    const directory = parts[0];
    const filename = parts[1];
    const fullPath = path.join(swaggerDir, 'paths', directory, filename);

    if (!fs.existsSync(fullPath)) {
      console.error(`Missing file for endpoint ${endpointPath}: ${fullPath}`);
      return;
    }

    try {
      const fileContent = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      swagger.paths[endpointPath] = fileContent;
      console.log(`✅ Added endpoint: ${endpointPath}`);
    } catch (error) {
      console.error(`Error parsing ${fullPath}: ${error.message}`);
    }
  });

  console.log(`Total endpoints added: ${Object.keys(swagger.paths).length}`);
} else {
  console.error('Missing paths index file');
}

// Load schemas
console.log('\nLoading schemas...');
const schemasIndexPath = path.join(swaggerDir, 'schemas', 'index.json');
if (fs.existsSync(schemasIndexPath)) {
  const schemasIndex = JSON.parse(fs.readFileSync(schemasIndexPath, 'utf8'));

  Object.entries(schemasIndex).forEach(([schemaName, schemaContent]) => {
    swagger.components.schemas[schemaName] = schemaContent;
    console.log(`✅ Added schema: ${schemaName}`);
  });

  console.log(`Total schemas added: ${Object.keys(swagger.components.schemas).length}`);
} else {
  console.error('Missing schemas index file');
}

// Save the complete Swagger file
try {
  fs.writeFileSync(outputPath, JSON.stringify(swagger, null, 2));
  console.log(`\n✅ Swagger documentation successfully built and saved to: ${outputPath}`);
} catch (error) {
  console.error(`Error writing Swagger file: ${error.message}`);
}

// Copy to API docs location for Express
const apiDocsPath = path.join(__dirname, '..', 'src', 'api-docs', 'swagger.json');
try {
  if (!fs.existsSync(path.join(__dirname, '..', 'src', 'api-docs'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'src', 'api-docs'), { recursive: true });
  }
  fs.copyFileSync(outputPath, apiDocsPath);
  console.log(`✅ Copied to API docs: ${apiDocsPath}`);
} catch (error) {
  console.error(`Error copying to API docs: ${error.message}`);
}

console.log('\nDone!');
