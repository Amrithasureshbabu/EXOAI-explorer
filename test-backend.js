// Simple test to verify backend functionality
const http = require('http');

console.log('Testing ExoAI Explorer Backend...\n');

// Test health endpoint
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response:', data);
        if (res.statusCode === 200) {
            console.log('✅ Backend is running successfully!');
        } else {
            console.log('❌ Backend test failed');
        }
    });
});

req.on('error', (err) => {
    console.log('❌ Connection failed:', err.message);
    console.log('Make sure the backend server is running on port 3000');
});

req.end();
