require('dotenv').config({ path: '.env.local' });

console.log('Environment Variables Check:');
console.log('============================');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing');
console.log('AUTH_SECRET:', process.env.AUTH_SECRET ? '✓ Set' : '✗ Missing');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set (optional)');
console.log('DB_SERVER:', process.env.DB_SERVER ? '✓ Set' : '✗ Missing');
console.log('============================');

if (!process.env.GOOGLE_CLIENT_ID) {
    console.log('\n⚠️  GOOGLE_CLIENT_ID is missing!');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.log('⚠️  GOOGLE_CLIENT_SECRET is missing!');
}
if (!process.env.AUTH_SECRET) {
    console.log('⚠️  AUTH_SECRET is missing!');
}
