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

router.get('/post/:id', async (req, res) =>{
    try {
        let slug = req.params.id;
        
        const data = await Post.findById( {_id: slug} )
        const locals = {
            title: data.title
        }
        res.render('post', {data, locals})
    } catch (error) {
        console.log(error)
    }
})

router.post('/search', async (req, res) =>{
    try {

        const locals = {
            title: "Search"
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, '');

        const data = await Post.find({
            $or:[
                {title: {$regex: new RegExp(searchNoSpecialChars, 'i')} },
                {body: {$regex: new RegExp(searchNoSpecialChars, 'i')} }
            ]
        })

        res.render('search', {data, locals})
        // res.send(searchTerm)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;