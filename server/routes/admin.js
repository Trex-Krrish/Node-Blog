const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin'

const jwtSecret = process.env.JWT_SECRET

// *** Admin Auth Middleware ***
const authMiddleware = async (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }

    try{
        const decoded = jwt.verify(token, jwtSecret)
        req.userId = decoded.userId;
        next()
    }catch(err){
        return res.status(401).json({message: "Unauthorized"})
    }
}

// *** Admin Login Page ***
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: 'Admin',
            description: 'Admin page',
        }

        res.render('admin/index', { locals, layout: adminLayout })

    } catch (error) {
        console.log(error);
    }
})

// *** Admin Login ***
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: "Invalid Creditionals" })
        }

        const isPasswordValid = await bycrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Creditionals" })
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret)
        res.cookie('token', token, {httpsOnly: true})
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
})


// *** Admin Dashboard ***
router.get('/dashboard',authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Admin Dashboard',
        }
        const data = await Post.find()
        res.render('admin/dashboard', { locals, data, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

// *** Admin Registration ***
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bycrypt.hash(password, 10);
        try {
            const user = await User.create({ username, password: hashedPassword })
            res.status(201).json({ message: "User Created", user })
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: "User already exists" })
            }
            res.status(500).json({ message: "Internal Server Error" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Admin Dashboard',
        }

        res.render('admin/add-post', { locals, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            })

            await Post.create(newPost)
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
        res.render('admin/add-post', {layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;