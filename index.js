const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Create Server
const app = express();

// Connect DB
connectDB();

// Abilitare Cors
app.use(cors());

// Abilitare express json
app.use(express.json({ extended: true }));

// App Port
const port = process.env.PORT || 4000;

// Import Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));


// // Main page define
// app.get('/', (req, res) => {
//     res.send('Hola mundo')
// });

// Run app in port
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is run at ${port} port`)
})
