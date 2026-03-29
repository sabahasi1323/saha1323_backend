const express = require('express')
const jwt = require('jsonwebtoken')
const Customer = require('../models/Customer')
const { body, validationResult } = require('express-validator')

const router = express.Router()

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Get all customers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user }).sort({ createdAt: -1 })
    res.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({ message: 'Failed to fetch customers' })
  }
})

// Get single customer
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, createdBy: req.user })
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    res.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    res.status(500).json({ message: 'Failed to fetch customer' })
  }
})

// Create new customer
router.post('/', [
  authMiddleware,
  body('customerNumber').notEmpty().withMessage('Customer number is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('fatherName').notEmpty().withMessage('Father name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('mobileNo').notEmpty().withMessage('Mobile number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { customerNumber, name, fatherName, dateOfBirth, address, mobileNo } = req.body

    // Check if customer number already exists
    const existingCustomer = await Customer.findOne({ customerNumber })
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer number already exists' })
    }

    const customer = new Customer({
      customerNumber,
      name,
      fatherName,
      dateOfBirth,
      address,
      mobileNo,
      createdBy: req.user
    })

    await customer.save()
    res.status(201).json({ message: 'Customer created successfully', customer })
  } catch (error) {
    console.error('Error creating customer:', error)
    res.status(500).json({ message: 'Failed to create customer' })
  }
})

// Update customer
router.put('/:id', [
  authMiddleware,
  body('customerNumber').notEmpty().withMessage('Customer number is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('fatherName').notEmpty().withMessage('Father name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('mobileNo').notEmpty().withMessage('Mobile number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    const { customerNumber, name, fatherName, dateOfBirth, address, mobileNo } = req.body

    // Check if customer number already exists (excluding current customer)
    const existingCustomer = await Customer.findOne({ 
      customerNumber, 
      _id: { $ne: req.params.id } 
    })
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer number already exists' })
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user },
      { customerNumber, name, fatherName, dateOfBirth, address, mobileNo },
      { new: true, runValidators: true }
    )

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    res.json({ message: 'Customer updated successfully', customer })
  } catch (error) {
    console.error('Error updating customer:', error)
    res.status(500).json({ message: 'Failed to update customer' })
  }
})

// Delete customer
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user 
    })

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    res.status(500).json({ message: 'Failed to delete customer' })
  }
})

module.exports = router
