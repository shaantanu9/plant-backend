/**
 * Script to validate the structure of Swagger documentation
 */
const fs = require('fs');
const path = require('path');

// Configuration
const swaggerDir = path.join(__dirname, '..', 'swagger');
const pathsDir = path.join(swaggerDir, 'paths');
const schemasDir = path.join(swaggerDir, 'schemas');

// Track statistics
const stats = {
  totalFiles: 0,
  totalPaths: 0,
  totalSchemas: 0,
  missingFiles: [],
};

// Check paths index and referenced files
console.log('\n=== Checking Paths ===');
const pathsIndexPath = path.join(pathsDir, 'index.json');
if (!fs.existsSync(pathsIndexPath)) {
  console.error(`❌ Missing paths index file: ${pathsIndexPath}`);
  process.exit(1);
}

const pathsIndex = JSON.parse(fs.readFileSync(pathsIndexPath, 'utf8'));
stats.totalPaths = Object.keys(pathsIndex).length;
console.log(`📊 Found ${stats.totalPaths} path entries in index`);

Object.entries(pathsIndex).forEach(([endpoint, reference]) => {
  const refPath = reference.$ref;
  if (!refPath || !refPath.startsWith('./')) {
    console.error(`❌ Invalid reference for endpoint ${endpoint}: ${refPath}`);
    return;
  }

  const parts = refPath.substring(2).split('/');
  const directory = parts[0];
  const filename = parts[1];
  const fullPath = path.join(pathsDir, directory, filename);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file for endpoint ${endpoint}: ${fullPath}`);
    stats.missingFiles.push(fullPath);
    return;
  }

  try {
    const fileContent = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const methods = Object.keys(fileContent).filter(key =>
      ['get', 'post', 'put', 'delete', 'patch'].includes(key),
    );
    if (methods.length === 0) {
      console.warn(`⚠️ No HTTP methods defined in ${fullPath}`);
    } else {
      console.log(`✅ ${endpoint} (${methods.join(', ')})`);
      stats.totalFiles++;
    }
  } catch (error) {
    console.error(`❌ Error parsing ${fullPath}: ${error.message}`);
  }
});

// Check schemas
console.log('\n=== Checking Schemas ===');
const schemasIndexPath = path.join(schemasDir, 'index.json');
if (!fs.existsSync(schemasIndexPath)) {
  console.error(`❌ Missing schemas index file: ${schemasIndexPath}`);
  process.exit(1);
}

const schemasIndex = JSON.parse(fs.readFileSync(schemasIndexPath, 'utf8'));
stats.totalSchemas = Object.keys(schemasIndex).length;
console.log(`📊 Found ${stats.totalSchemas} schema definitions`);

// Summary
console.log('\n=== Summary ===');
console.log(`📊 Total paths: ${stats.totalPaths}`);
console.log(`📊 Total implemented path files: ${stats.totalFiles}`);
console.log(`📊 Total schema definitions: ${stats.totalSchemas}`);

if (stats.missingFiles.length > 0) {
  console.warn(`⚠️ Missing files: ${stats.missingFiles.length}`);
  console.warn(
    'Run the update-path-references.js script to create placeholder files for these paths',
  );
}

console.log('\n✅ Validation completed!');
