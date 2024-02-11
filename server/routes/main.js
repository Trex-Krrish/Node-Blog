const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//* Routes
router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "NodeJS Blog",
            description: "This is a blog made with NodeJS and Express",
        }
        
        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }]).skip(perPage * page - perPage).limit(perPage).exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }

});
module.exports = router;