const app = require('./config/express');
const mongoose = require('./config/database');

const PORT = 3000 + Math.floor(Math.random() * 1000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;