const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const auth = require('./routes/auth');
const question = require('./routes/questions');
const comment = require('./routes/comments');
const adminRoutes = require('./routes/admin');

const cors = require('cors')
const jwtMiddleware = require('./middleware/jwtAuth');

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors({
    origin:'*'
}))
app.use(jwtMiddleware);
// Root route

app.get('/', (req, res) => {
    res.send('Server is running.');
});

app.use('/auth',auth);
app.use('/questions',question);
app.use('/comments',comment);
app.use('/admin',adminRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});