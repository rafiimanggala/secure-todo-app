// Health check script for Docker
const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET',
  rejectUnauthorized: false
};

const req = https.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', (err) => {
  process.exit(1);
});

req.end();

