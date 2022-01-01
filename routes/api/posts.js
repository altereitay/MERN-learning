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

/**
 *@route    GET api/posts
 *@desc     get all posts
 *@access   Private
 */
router.get('/',auth, async (req, res)=>{
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    }catch (e) {
        if (e){
            console.error(e);
            res.status(500).send('Server error');
        }
    }
});

/**
 *@route    GET api/posts/:id
 *@desc     get post by id
 *@access   Private
 */
router.get('/:id',auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if (!post){
        return res.status(404).json({msg:'post not found'});
        }
        res.json(post);
    }catch (e) {
        if (e){
            console.error(e);
            if (e.kind === 'ObjectId'){
                return res.status(404).json({msg:'post not found'});
            }
            res.status(500).send('Server error');
        }
    }
});

/**
 *@route    DELETE api/posts/:id
 *@desc     delete post by id
 *@access   Private
 */
router.delete('/:id',auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if (!post){
            return res.status(404).json({msg:'post not found'});
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'user not authorized'});
        }
        await post.remove();
        res.json({msg: 'post removed'});
    }catch (e) {
        if (e){
            console.error(e);
            if (e.kind === 'ObjectId'){
                return res.status(404).json({msg:'post not found'});
            }
            res.status(500).send('Server error');
        }
    }
});

/**
 *@route    PUT api/posts/like/:id
 *@desc     add like to post
 *@access   Private
 */
router.put('/like/:id', auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'post already liked'});
        }
        post.likes.unshift({user: req.user.id});
        await post.save();
        res.json(post.likes);
    }catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})

/**
 *@route    PUT api/posts/unlike/:id
 *@desc     remove like from a post
 *@access   Private
 */
router.put('/unlike/:id', auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg: "post hasn't liked"});
        }

        const removeIndex = post.likes.map(like =>{
            return like.user.toString()
        }).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    }catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})

/**
 *@route    POST api/posts/comment/:id
 *@desc     add a comment to post
 *@access   Private
 */

router.post('/comment/:id',
    [auth,
        [check('text', 'text is required').not().isEmpty()]],
async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    }catch (err) {
        if (err){
            console.error(err);
            res.status(500).send('Server error')
        }
    }
});

/**
 *@route    DELETE api/posts/comment/:id/:comment_id
 *@desc     delete a comment from a post
 *@access   Private
 */

router.delete('/comment/:post_id/:comment_id', auth, async (req, res)=>{
        try {
            const post = await Post.findById(req.params.post_id);
            const comment = post.comments.find(comment => comment.id === req.params.comment_id);
            if(!comment){
                return res.status(404).json({msg: 'comment not found'});
            }
            if(comment.user.toString() !== req.user.id){
                return res.status(401).json({msg:'user not authorized'});
            }

            const removeIndex = post.comments.map(comment =>{
                return comment.user.toString()
            }).indexOf(req.user.id);
            post.comments.splice(removeIndex, 1);
            await post.save();
            res.json(post.comments);
        }catch (err) {
            if (err){
                console.error(err);
                res.status(500).send('Server error')
            }
        }
    });


module.exports = router;