const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the scripts directory exists
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

// Check if redocly is installed locally
try {
  // Bundle the split swagger files
  console.log('Bundling Swagger files...');
  execSync('npx @redocly/cli bundle swagger/base.json -o swagger.json', { stdio: 'inherit' });
  console.log('Swagger files bundled successfully into swagger.json');
} catch (error) {
  console.error('Error bundling Swagger files:', error.message);
  console.log('Make sure @redocly/cli is installed: npm install --save-dev @redocly/cli');
}

console.log('');
console.log('To split a monolithic swagger.json into smaller files:');
console.log('1. Create the directory structure in swagger/');
console.log('2. Extract each path group into its own file in swagger/paths/');
console.log('3. Extract schemas into swagger/schemas/');
console.log('4. Extract security schemes into swagger/security/');
console.log('5. Update the references in all files');
console.log('6. Validate with: npx @redocly/cli lint swagger/base.json');
