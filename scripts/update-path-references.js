/**
 * Helper script to update all unreferenced paths in our Swagger definitions
 * This is a utility script for a WIP Swagger project
 */
const fs = require('fs');
const path = require('path');
const basePath = path.join(__dirname, '..', 'swagger', 'paths', 'index.json');

// Create a minimal file with basic setup
const createMinimalFile = (directory, filename) => {
  const folderPath = path.join(__dirname, '..', 'swagger', 'paths', directory);
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const content = {
      get: {
        description: 'Placeholder for future implementation',
        responses: {
          200: {
            description: 'Successful operation',
          },
        },
      },
    };

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Created placeholder file: ${filePath}`);
  }
};

// Read the index file
try {
  const indexContent = fs.readFileSync(basePath, 'utf8');
  const indexJson = JSON.parse(indexContent);

  // Process each path reference
  Object.entries(indexJson).forEach(([path, reference]) => {
    const refPath = reference.$ref;
    if (refPath && refPath.startsWith('./')) {
      // Extract the directory and filename from the reference
      const parts = refPath.substring(2).split('/');
      const directory = parts[0];
      const filename = parts[1];

      // Create the file if it doesn't exist
      createMinimalFile(directory, filename);
    }
  });

  console.log('All placeholder files created successfully!');
} catch (error) {
  console.error('Error processing index file:', error);
}
