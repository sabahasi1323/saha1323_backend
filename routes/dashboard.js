const express = require('express')
const jwt = require('jsonwebtoken')
const Customer = require('../models/Customer')

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

// Get dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({ createdBy: req.user })
    
    // Get customers created this month
    const currentMonth = new Date()
    currentMonth.setDate(1)
    const newCustomersThisMonth = await Customer.countDocuments({
      createdBy: req.user,
      createdAt: { $gte: currentMonth }
    })

    // Calculate total revenue (mock calculation - you can adjust based on your business logic)
    const totalRevenue = totalCustomers * 1000 // Mock calculation

    res.json({
      totalCustomers,
      newCustomersThisMonth,
      totalRevenue
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' })
  }
})

module.exports = router
