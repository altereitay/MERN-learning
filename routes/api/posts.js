const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth')
const Post = require('../../modules/Post')
const Profile = require('../../modules/Profile')
const User = require('../../modules/User')
const e = require("express");

/**
 *@route    POST api/posts
 *@desc     create a post
 *@access   Private
 */

router.post('/',
    [auth,
        [check('text', 'text is required').not().isEmpty()]],
        async (req, res)=>{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            }
            try {
                const user = await User.findById(req.user.id).select('-password');
                const newPost = new Post({
                    text: req.body.text,
                    name: user.name,
                    avatar: user.avatar,
                    user: req.user.id
                })
                const post = await newPost.save();
                res.json(post);
            }catch (err) {
                if (err){
                    console.error(err);
                    res.status(500).send('Server error')
                }
            }

});

module.exports = router;