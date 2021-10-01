const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

const User = require('../../modules/User')
/**
 *@route    POST api/users
 *@desc     register a new user
 *@access  Public
 */

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'please enter a password longer then 6 characters').isLength({min: 6})
],
    async (req, res)=>{
    // console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const {name, email, password} = req.body;
        try{
            let user = await User.findOne({email});
            if (user){
               return  res.status(400).json({
                    errors:[{msg: 'User exist'}]
                })
            }
            const avatar = gravatar.url(email, {
                s:'200',
                r:'pg',
                d:'mm'
            })
            user = new User({name, email, avatar, password})

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)
            await user.save()
            res.send('user registered')
        }catch (e) {
            console.error(e.message)
            res.status(500).send('server error')
        }

});

module.exports = router;