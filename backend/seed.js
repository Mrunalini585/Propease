const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Property = require('./models/Property');
const Payment = require('./models/Payment');
const Maintenance = require('./models/Maintenance');
const Message = require('./models/Message');

async function seed() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect('mongodb://127.0.0.1:27017/');
        console.log('Connected.');

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Property.deleteMany({});
        await Payment.deleteMany({});
        await Maintenance.deleteMany({});
        await Message.deleteMany({});

        console.log('Seeding Users...');
        const ownerHash = await bcrypt.hash('password123', 10);
        const tenantHash = await bcrypt.hash('password123', 10);

        const owner = await User.create({
            name: 'Alice Owner',
            email: 'owner@gmail.com',
            password: ownerHash,
            role: 'owner',
            phone: '555-0100'
        });

        const tenant = await User.create({
            name: 'Bob Tenant',
            email: 'tenant@gmail.com',
            password: tenantHash,
            role: 'tenant',
            phone: '555-0200'
        });

        console.log('Seeding Properties...');
        const property = await Property.create({
            owner: owner._id,
            title: 'Modern Apartment in Downtown',
            description: 'A beautiful 2-bedroom apartment with great city views.',
            address: { street: '123 Main St', city: 'Metropolis', state: 'NY' },
            type: 'apartment',
            rent: 1500,
            deposit: 1500,
            bedrooms: 2,
            bathrooms: 1,
            area: 950,
            amenities: ['WiFi', 'Gym', 'Parking'],
            status: 'occupied',
            currentTenant: tenant._id
        });

        const availableProperty = await Property.create({
            owner: owner._id,
            title: 'Cozy Studio',
            description: 'Perfect for a single professional.',
            address: { street: '456 Oak Avenue', city: 'Metropolis', state: 'NY' },
            type: 'studio',
            rent: 900,
            deposit: 900,
            bedrooms: 1,
            bathrooms: 1,
            area: 500,
            amenities: ['WiFi', 'AC'],
            status: 'available',
            currentTenant: null
        });

        console.log('Seeding Payments...');
        await Payment.create({
            property: property._id,
            tenant: tenant._id,
            owner: owner._id,
            amount: 1500,
            date: new Date(),
            status: 'paid'
        });

        console.log('Seeding Maintenance...');
        await Maintenance.create({
            property: property._id,
            tenant: tenant._id,
            owner: owner._id,
            title: 'Leaking faucet',
            category: 'plumbing',
            description: 'The sink in the bathroom is leaking constantly.',
            status: 'pending',
            dateReported: new Date()
        });

        console.log('Seeding Messages...');
        await Message.create([
            {
                sender: tenant._id,
                receiver: owner._id,
                text: 'Hello, the rent payment has been made.',
                read: true
            },
            {
                sender: owner._id,
                receiver: tenant._id,
                text: 'Thank you for the prompt payment.',
                read: true
            },
            {
                sender: tenant._id,
                receiver: owner._id,
                text: 'Also I saw that leaky faucet. Can you send someone?',
                read: false
            }
        ]);

        console.log('✅ Database seeded successfully!');
        console.log('----------------------------------------------------');
        console.log('You can now log in with:');
        console.log('Owner  -> email: owner@gmail.com | password: password123');
        console.log('Tenant -> email: tenant@gmail.com | password: password123');
        console.log('----------------------------------------------------');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seed();
