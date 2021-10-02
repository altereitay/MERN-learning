const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../modules/User')
/**
 *@route    GET api/users
 *@desc     Test route
 *@access  Public
 */

router.get('/', auth, async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }catch (e) {
        console.error(e.message)
        res.status(500).send('server error')
    }
});

module.exports = router;