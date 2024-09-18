const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todo');
const dotenv = require('dotenv');
const { alertTodo } = require('./controllers/todoController');
const path = require('path');


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:4200"
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', todoRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Schedule the alert job to check for due todos every minute
setInterval(() => {
    alertTodo(io);
}, 60000);

io.on('connection', (socket) => {
    console.log('A user connected');
});
