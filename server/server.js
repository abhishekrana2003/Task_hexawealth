const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const passport = require('passport');
const cors = require('cors');
const jwtMiddleware = require('./middleware/jwtAuth');
const auth = require('./routes/auth'); // Email/password routes
const googleAuth = require('./routes/auth_google'); // Google OAuth routes
const question = require('./routes/questions');
const comment = require('./routes/comments');
const adminRoutes = require('./routes/admin');
const session = require('express-session');
const MongoStore = require('connect-mongo');


dotenv.config();


require('./passport.js')(passport);


connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(session({
    secret: process.env.JWT_SECRET, // Replace with a strong secret key
    resave: false,            // Avoid resaving session data unless modified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: { secure: false } // Set `secure: true` if using HTTPS
}));
app.use(express.json());
app.use(cors({ origin: '*' }));

app.use(passport.initialize());

app.use(passport.session());
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/google', '/auth/google/callback'];
app.use((req, res, next) => {
    if (publicRoutes.includes(req.path)) {
        return next(); // Skip middleware for public routes
    }
    jwtMiddleware(req, res, next); 
});

// Root route
app.get('/', (req, res) => {
    res.send('Server is running.');
});



app.use('/auth', auth); 
app.use('/authGoogle', googleAuth); 
app.use('/questions', question);
app.use('/comments', comment);
app.use('/admin', adminRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});