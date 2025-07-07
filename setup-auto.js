#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting automatic setup for Share Dish project...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step) {
  log(`\n${colors.cyan}📋 ${step}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

// Check if we're in a codespace environment
function isCodespace() {
  return process.env.CODESPACES === 'true' || 
         process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ||
         process.env.CODESPACE_NAME;
}

// Detect the current environment
function detectEnvironment() {
  if (isCodespace()) {
    return 'codespace';
  }
  return 'local';
}

// Create server .env file
function createServerEnv() {
  logStep('Creating server .env file...');
  
  const envPath = path.join(__dirname, 'server', '.env');
  const isCodespaceEnv = isCodespace();
  
  const envContent = `# MongoDB Configuration
MONGO_URI=mongodb+srv://admin:M123456M@cluster0.7wmwaer.mongodb.net/foodshare?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=dhqi68qck
CLOUDINARY_API_KEY=883382227937463
CLOUDINARY_API_SECRET=g_5hwXcqQ-EQopcJrL4bJ3_v8Ds

# Server Configuration
PORT=5000
NODE_ENV=${isCodespaceEnv ? 'production' : 'development'}

# CodeSpaces Configuration
CODESPACES=${isCodespaceEnv ? 'true' : 'false'}
`;

  try {
    fs.writeFileSync(envPath, envContent);
    logSuccess('Server .env file created successfully');
  } catch (error) {
    logError(`Failed to create server .env: ${error.message}`);
    throw error;
  }
}

// Create client .env file
function createClientEnv() {
  logStep('Creating client .env file...');
  
  const envPath = path.join(__dirname, 'client', '.env');
  
  // Don't create client .env file at all - let the app auto-detect
  // This ensures no manual URL configuration is needed
  if (fs.existsSync(envPath)) {
    logInfo('Client .env file already exists, checking if it has manual URL...');
    
    // Read existing file and check if it has REACT_APP_API_URL
    const existingContent = fs.readFileSync(envPath, 'utf8');
    if (existingContent.includes('REACT_APP_API_URL=')) {
      logWarning('Found REACT_APP_API_URL in existing .env file');
      logInfo('The app will use auto-detection instead of manual URL');
    }
    return;
  }
  
  // Don't create .env file at all - let React use default behavior
  logInfo('No client .env file needed - auto-detection will work without it');
  logSuccess('Client auto-detection enabled (no .env file created)');
}

// Install dependencies
function installDependencies() {
  logStep('Installing dependencies...');
  
  try {
    // Install root dependencies
    logInfo('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Install server dependencies
    logInfo('Installing server dependencies...');
    execSync('cd server && npm install', { stdio: 'inherit' });
    
    // Install client dependencies
    logInfo('Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });
    
    logSuccess('All dependencies installed successfully');
  } catch (error) {
    logError(`Failed to install dependencies: ${error.message}`);
    throw error;
  }
}

// Main setup function
function main() {
  try {
    const environment = detectEnvironment();
    logInfo(`Detected environment: ${environment}`);
    
    // Create .env files
    createServerEnv();
    createClientEnv();
    
    // Install dependencies
    installDependencies();
    
    logSuccess('\n🎉 Setup completed successfully!');
    logInfo('\nNext steps:');
    logInfo('1. Run "npm start" to start the development server');
    logInfo('2. The application will automatically detect your environment');
    logInfo('3. NO manual URL configuration needed!');
    
    if (environment === 'codespace') {
      logInfo('\n🌐 Codespace detected!');
      logInfo('- The API will be available on port 5000');
      logInfo('- The frontend will be available on port 3000');
      logInfo('- API URL will be auto-detected from your codespace URL');
      logInfo('- No need to manually configure REACT_APP_API_URL');
      logInfo('- The app will automatically find the correct backend URL');
    } else {
      logInfo('\n💻 Local environment detected!');
      logInfo('- The API will be available on http://localhost:5000');
      logInfo('- The frontend will be available on http://localhost:3000');
      logInfo('- No manual configuration needed');
    }
    
    logInfo('\n🚀 Ready to run: npm start');
    
  } catch (error) {
    logError(`\n💥 Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the setup
main(); 