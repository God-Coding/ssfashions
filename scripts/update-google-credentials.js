const fs = require('fs');
const path = require('path');

// Google OAuth credentials from the provided JSON
const credentials = {
    clientId: "25531546104-0rd457qta47ev769vo6sflj73qiraqum.apps.googleusercontent.com",
    clientSecret: "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"
};

const envPath = path.join(__dirname, '..', '.env.local');

// Read existing .env.local file
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
    console.log('No existing .env.local file found. Creating new one...');
}

// Parse existing environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key) {
            envVars[key.trim()] = valueParts.join('=').trim();
        }
    }
});

// Update Google credentials
envVars['GOOGLE_CLIENT_ID'] = credentials.clientId;
envVars['GOOGLE_CLIENT_SECRET'] = credentials.clientSecret;

// Generate AUTH_SECRET if it doesn't exist
if (!envVars['AUTH_SECRET']) {
    const crypto = require('crypto');
    envVars['AUTH_SECRET'] = crypto.randomBytes(32).toString('base64');
    console.log('✓ Generated new AUTH_SECRET');
}

// Build new .env.local content
const newEnvContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

// Write to .env.local
fs.writeFileSync(envPath, newEnvContent + '\n', 'utf8');

console.log('\n✓ Successfully updated .env.local with Google OAuth credentials');
console.log('\nConfigured credentials:');
console.log(`  GOOGLE_CLIENT_ID: ${credentials.clientId}`);
console.log(`  GOOGLE_CLIENT_SECRET: ${credentials.clientSecret.substring(0, 20)}...`);
console.log('\nRedirect URIs configured in Google Console:');
console.log('  - http://localhost:3000/api/auth/callback/google');
console.log('  - http://127.0.0.1:3000/api/auth/callback/google');
console.log('\nNext steps:');
console.log('  1. Restart your dev server (npm run dev)');
console.log('  2. Test Google Sign-In at http://localhost:3000');
