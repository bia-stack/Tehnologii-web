require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models');

//initializare aplicatie
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://proiect-tw-1.onrender.com'],
    credentials: true
}));


app.use(express.json());


app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//rute API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});




//rute API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));



//err handling middleware
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Route not found!',
        path: req.path
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

//pornire server
db.sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
        console.log(`Server is runnig on http://localhost:${port}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        console.log(`Database: ${process.env.DB_NAME}`);
    });
}).catch((err) => {
    console.error('Unable to connect to database:', err);
    process.exit(1);
});

module.exports = app;