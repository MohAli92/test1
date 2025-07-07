#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🌐 Making port 5000 public for API access...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// Check if we're in a codespace environment
function isCodespace() {
  return process.env.CODESPACES === 'true' || 
         process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ||
         process.env.CODESPACE_NAME;
}

function makePortPublic() {
  try {
    if (!isCodespace()) {
      logInfo('Not in codespace environment - port forwarding not needed');
      return;
    }

    logInfo('Detected codespace environment');
    
    // Try to make port 5000 public using GitHub CLI
    try {
      logInfo('Attempting to make port 5000 public...');
      execSync('gh codespace ports visibility 5000:public', { stdio: 'inherit' });
      logSuccess('Port 5000 is now public!');
      logInfo('Your API will be accessible at: https://your-codespace-5000.app.github.dev');
    } catch (error) {
      logWarning('Could not make port public automatically');
      logInfo('Please manually make port 5000 public:');
      logInfo('1. Go to the "PORTS" tab in VS Code');
      logInfo('2. Find port 5000');
      logInfo('3. Click the globe icon to make it public');
      logInfo('4. Or run: gh codespace ports visibility 5000:public');
    }

  } catch (error) {
    logError(`Failed to make port public: ${error.message}`);
  }
}

// Run the script
makePortPublic(); 