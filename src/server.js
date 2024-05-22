const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// This would typically be fetched from a database
let messages = [
  'Hello, world!',
  'This is a test message.',
  'Another message.',
];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});