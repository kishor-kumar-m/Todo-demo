const Todo = require('../models/todo');
const nodemailer = require('nodemailer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


// Initialize email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Helper function to send email notifications
const sendEmailNotification = async (email, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        });
    } catch (error) {
        console.error('Email notification failed:', error);
    }
};

exports.getPaginatedTodos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || '';
        const completed = req.query.completed; 

        const query = {};

        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (completed !== undefined) {
            query.completed = completed === 'true';
        }

        const skip = (page - 1) * limit;

        const todos = await Todo.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalTodos = await Todo.countDocuments(query);

        res.json({
            page,
            limit,
            totalPages: Math.ceil(totalTodos / limit),
            totalTodos,
            todos,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTodoStatus = async (req, res) => {
    try {
        const todoId = req.params.id; 
        const { completed } = req.body; 

        const updatedTodo = await Todo.findByIdAndUpdate(todoId, { completed }, { new: true });

        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};



exports.createTodo = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        let compressedImagePath = null;

        if (imageUrl) {
            const outputFilename = `compressed-${Date.now()}-${req.file.originalname}`;
            compressedImagePath = path.join(__dirname, '../uploads', outputFilename);

            await sharp(req.file.path)
                .resize(800) 
                .jpeg({ quality: 70 }) 
                .toFile(compressedImagePath);

            fs.unlinkSync(req.file.path);
        }

        const todo = new Todo({
            title,
            description,
            dueDate,
            imageUrl: compressedImagePath ? compressedImagePath : null
        });

        await todo.save();

        return res.status(201).json(todo);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};



exports.alertTodo = async (io) => {
    if (!io) {
        console.error('Socket.IO instance is undefined');
        return;
    }

    const todos = await Todo.find({ dueDate: { $lte: new Date() }, completed: false });
    todos.forEach(async todo => {
        sendEmailNotification('kishorkumarmahalingam@gmail.com', 'Todo Alert', `Todo "${todo.title}" is due now.`);
        io.emit('todoAlert', todo);
    });
};

