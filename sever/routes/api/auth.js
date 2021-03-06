const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../modules/User')
const {check, validationResult} = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
/**
 *@route    GET api/users
 *@desc     get user by token
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

/**
 *@route    POST api/auth
 *@desc     authenticate user and get token
 *@access   Public
 */

router.post('/', [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'password is required').exists()
    ],
    async (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const {name, email, password} = req.body;
        try{
            let user = await User.findOne({email});
            if (!user){
                return  res.status(400).json({
                    errors:[{msg: 'invalid credentials'}]
                })
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch){
                return  res.status(400).json({
                    errors:[{msg: 'invalid credentials'}]
                })
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,
                config.get('jwtSecret'),
                {expiresIn: 360000,},
                (err, token)=>{
                    if (err){
                        throw err;
                    }
                    res.json({token})
                })

        } catch (e) {
            console.error(e.message)
            res.status(500).send('server error')
        }

    });

module.exports = router;