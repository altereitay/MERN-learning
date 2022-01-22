const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../modules/Profile');
const User = require('../../modules/User')
const {check, validationResult} = require('express-validator');
const request = require('request');
const config = require('config');

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

/**
 *@route   DELETE api/profile
 *@desc    delete profile, user and posts
 *@access  private
 */

router.delete('/', auth, async (req, res)=>{
    try {
        await Profile.findOneAndRemove({user: req.user.id});

        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'user removed'})
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error')
    }
})

/**
 *@route   PUT api/profile/experience
 *@desc    add profile experience
 *@access  private
 */

router.put('/experience', auth, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()
], async (req, res)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error')
    }
})

/**
 *@route   PATCH api/profile/experience
 *@desc    edit profile experience
 *@access  private
 */

router.patch('/experience', auth, async (req, res)=>{

    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const {
            currTitle,
            currCompany,
            currLocation,
            currFrom,
            currTo,
            currCurrent,
            currDescription
        } = profile.experience[0];
        const updated = {
            title: newExp.title !== currTitle? newExp.title:currTitle,
            company: newExp.company !== currCompany? newExp.company:currCompany,
            location: newExp.location !== currLocation? newExp.location:currLocation,
            from: newExp.from !== currFrom? newExp.from:currFrom,
            to: newExp.to !== currTo? newExp.to:currTo,
            current: newExp.current !== currCurrent? newExp.current:currCurrent,
            description: newExp.description !== currDescription? newExp.description:currDescription
        }
        let updatedProfile = await Profile.findOneAndUpdate({user: req.user.id},{experience: updated}, {new:true});
        await updatedProfile.save();
        res.json(updatedProfile);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error')
    }
})


/**
 *@route   DELETE api/profile/experience/:exp_id
 *@desc    delete experience
 *@access  private
 */

router.delete('/experience/:exp_id', auth, async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');
    }
})

/**
 *@route   PUT api/profile/education
 *@desc    add profile education
 *@access  private
 */

router.put('/education', auth,
    [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
    check('fieldofstudy', 'filed of study date is required').not().isEmpty()
],
    async (req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    console.log('put edu')
    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error')
    }
})

/**
 *@route   PATCH api/profile/education
 *@desc    edit profile education
 *@access  private
 */

router.patch('/education', auth, async (req, res)=>{
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const {
            currSchool,
            currDegree,
            currFieldOfStudy,
            currFrom,
            currTo,
            currCurrent,
            currDescription
        } = profile.education[0];
        const updated = {
            school: newEdu.school !== currSchool? newEdu.school : currSchool,
            degree: newEdu.degree !== currDegree? newEdu.degree : currDegree,
            fieldofstudy: newEdu.fieldofstudy !== currFieldOfStudy? newEdu.fieldofstudy : currFieldOfStudy,
            from: newEdu.from !== currFrom? newEdu.from : currFrom,
            to: newEdu.to !== currTo? newEdu.to : currTo,
            current: newEdu.current !== currCurrent? newEdu.current : currCurrent,
            description: newEdu.description !== currDescription? newEdu.description : currDescription
        }
        console.log(updated)
        let updatedProfile = await Profile.findOneAndUpdate({user: req.user.id},{education: updated}, {new:true});
        await updatedProfile.save();
        res.json(updatedProfile);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error')
    }
})

/**
 *@route   DELETE api/profile/education/:edu_id
 *@desc    delete education
 *@access  private
 */

router.delete('/education/:edu_id', auth, async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.education.map(exp => exp.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');
    }
})

/**
 *@route   GET api/profile/github/:username
 *@desc    get user github repos
 *@access  public
 */

router.get('/github/:username',   (req, res)=>{
    try {
        let uri= `https://api.github.com/users/${req.params.username}/repos?per_page=5&
                                                sort=created:asc&
                                                client_id=${config.get('gitHubClientID')}&
                                                client_secret=${config.get('gitHubClientSecret')}`
        const options = {
            method:'GET',
            headers:{'user-agent': 'node.js'}
        }
            request(uri, options, (err, response, body)=>{
                if(err){
                    console.error(err);
                }
                if(response.statusCode !== 200 || body === []){
                    return res.status(404).json({msg: 'no github profile found'});
                }
                res.json(JSON.parse(body));
            })
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;