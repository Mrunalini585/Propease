const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/propease').then(async () => {
    const hash = await bcrypt.hash('password123', 10);
    await mongoose.connection.db.collection('users').updateOne(
        { email: 'minni@gmail.com' },
        { $set: { password: hash } }
    );
    console.log('Password reset successfully');
    process.exit(0);
}).catch(console.error);
