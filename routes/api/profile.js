const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../modules/Profile')
/**
 *@route   GET api/profile/me
 *@desc    get current user profile
 *@access  private
 */

router.get('/me', auth, async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({msg: 'no profile for this user'});
        }
        res.json(profile)

    }catch (e) {
        if (e){
            console.error(e.message)
            res.status(500).send('Server error')
        }
    }
});

module.exports = router;