const Todo = require('../models/todo');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();


const seedTodos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        for (let i = 0; i < 10000; i++) {
            await Todo.create({
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                dueDate: faker.date.future(),
                completed: faker.datatype.boolean(),
                imageUrl: faker.image.url()
            });
        }

        console.log('100000 Todos seeded');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        mongoose.disconnect();
    }
};

seedTodos();
