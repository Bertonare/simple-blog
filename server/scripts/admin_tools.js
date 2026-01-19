const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-blog');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const listUsers = async () => {
    const users = await User.find({});
    console.log('Users:');
    users.forEach(u => {
        console.log(`- ${u.username} (${u.email}) [${u.role}]`);
    });
};

const makeAdmin = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        user.role = 'admin';
        await user.save();
        console.log(`User ${user.email} is now an admin.`);
    } else {
        console.log('User not found');
    }
};

const run = async () => {
    await connectDB();

    const args = process.argv.slice(2);
    const command = args[0];
    const email = args[1];

    if (command === 'list') {
        await listUsers();
    } else if (command === 'promote' && email) {
        await makeAdmin(email);
    } else {
        console.log('Usage: node scripts/admin_tools.js [list | promote <email>]');
    }

    process.exit();
};

run();
