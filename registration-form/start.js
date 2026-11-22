require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE);

mongoose.connection
  .on('open', () => console.log('MongoDB connection open'))
  .on('error', (error) => console.error(`MongoDB connection error: ${error.message}`));

require('./models/Registration');

const app = require('./app');
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Simple Kitchen is running on port ${server.address().port}`);
});
