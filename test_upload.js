const fs = require('fs');

async function testUpload() {
  try {
    // Create a dummy 1px transparent PNG file buffer
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    
    const blob = new Blob([buffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'test.png');

    console.log('Uploading...');
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    console.log('Result:', data);
  } catch(e) {
    console.error(e);
  }
}
testUpload();
