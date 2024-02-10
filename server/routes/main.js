const express = require('express');
const router = express.Router();

//* Routes
router.get('/', (req, res) => {

    const locals = {
        title: "NodeJS Blog",
        description: "This is a blog made with NodeJS and Express",
    }

    res.render('index', { locals });
})

module.exports = router;