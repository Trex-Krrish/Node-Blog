const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

const adminLayout = '../views/layouts/admin'
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

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (req.body.username === 'admin' && req.body.password === 'password') {
            res.send("You are logged in as admin")
        } else {
            res.send("Wrong username or password")
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;