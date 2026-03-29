const mongoose = require('mongoose')
const User = require('./models/User')
const Customer = require('./models/Customer')
require('dotenv').config()

// Seed data
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Customer.deleteMany({})
    console.log('Cleared existing data')

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    })
    await adminUser.save()
    console.log('Created admin user')

    // Create sample customers
    const sampleCustomers = [
      {
        customerNumber: 'CUST001',
        name: 'John Doe',
        fatherName: 'Robert Doe',
        dateOfBirth: new Date('1990-05-15'),
        address: '123 Main St, New York, NY 10001',
        mobileNo: '+1234567890',
        createdBy: adminUser._id
      },
      {
        customerNumber: 'CUST002',
        name: 'Jane Smith',
        fatherName: 'William Smith',
        dateOfBirth: new Date('1985-08-22'),
        address: '456 Oak Ave, Los Angeles, CA 90001',
        mobileNo: '+1234567891',
        createdBy: adminUser._id
      },
      {
        customerNumber: 'CUST003',
        name: 'Michael Johnson',
        fatherName: 'David Johnson',
        dateOfBirth: new Date('1992-03-10'),
        address: '789 Pine Rd, Chicago, IL 60007',
        mobileNo: '+1234567892',
        createdBy: adminUser._id
      }
    ]

    await Customer.insertMany(sampleCustomers)
    console.log('Created sample customers')

    console.log('Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedData()
