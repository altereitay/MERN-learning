const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../modules/Profile');
const {check, validationResult} = require('express-validator');
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

/**
 *@route   POST api/profile/me
 *@desc    create or update a user profile
 *@access  private
 */

router.post('/',[auth,
    [
        check('status', 'status is required').not().isEmpty(),
        check('skills', 'skills is required').not().isEmpty()
    ]
], async (req, res)=>{
    const errors = validationResult(req);
    if(! errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills){
        profileFields.skills = skills.split(',').map(skill =>  skill.trim());
    }

    //build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.exists({user: req.user.id})
        if (profile){
            let profile = await Profile.findOneAndUpdate({user: req.user.id},
                {
                $set: profileFields
                },
                {
                    new: true
                });
            await profile.save();
            return res.json(profile)
        }else {
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        }
    }catch (e) {
        if (e){
            console.error(e.message)
            res.status(500).send('Server error')
        }
    }
})

/**
 *@route   GET api/profile
 *@desc    get all profile
 *@access  public
 */

router.get('/', async (req, res)=>{
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)

    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error')
    }
})

/**
 *@route   GET api/profile/user/:user_id
 *@desc    get profile be user id
 *@access  public
 */

router.get('/user/:user_id', async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg:'there is no profile'})
        }
        res.json(profile)
    }catch (e) {
        console.error(e.message);
        if (e.kind === 'ObjectId'){
            return res.status(400).json({msg:'profile not found'})
        }
        res.status(500).send('Server error')
    }
})


module.exports = router;