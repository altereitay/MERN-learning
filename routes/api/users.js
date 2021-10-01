const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')

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
    (req, res)=>{
    // console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
    res.send('users route')
});

module.exports = router;