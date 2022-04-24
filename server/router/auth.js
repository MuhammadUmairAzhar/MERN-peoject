const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('../db/connection')
const User = require('../models/userSchema')

router.get('/',(req,res)=> {
    res.send('This is home page')
})

// router.post('/register',(req ,res)=> {
//     const { name, email,phone, work,password,cpassword } = req.body;
//     if(!name || !email || !phone || !work || !password || !cpassword)
//     {
//         return res.status(422).json({ error: 'please fill all the fields' })
//     }

//     User.findOne({ email: email })
//       .then((userExist) => {
//         if(userExist)
//         {
//             res.status(422).json({ error: 'user already registered' })
//         }
//         const user = new User({ name, email,phone, work,password,cpassword });
//         user.save().then(() => {
//             res.status(201).json({ message : 'user registered Successfully' });
//         });
//     }).catch((err) => {
//         console.log(err)
//     });

// });

router.post('/register', async (req ,res)=> {
    const { name, email, phone, work, password, cpassword } = req.body;
    if(!name || !email || !phone || !work || !password || !cpassword)
    {
        return res.status(422).json({ error: 'please fill all the fields' })
    }
    try {
        const userExist = await User.findOne({ email: email });
        if(userExist)
        {
            res.status(422).json({ error: 'user already registered' })
        }
        else if(password != cpassword)
        {
            return res.status(400).json({ message : 'password is not matching' })
        }
        else
        {
            const user = new User({ name, email,phone, work,password,cpassword });
            await user.save();    
            res.status(201).json({ message : 'user registered Successfully' });    
        }
    
    } catch (err) {
        console.log(err)
    }

});

router.post('/signin', async (req,res)=> {
    try {
        let token;
        const {email, password} = req.body;
        if(!email || !password)
        {
            res.status(400).json({ error : "Please fill all the fields" })
        }
        const userLogin = await User.findOne({ email : email });
        // console.log(userLogin);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now()+23232000000),
                httpOnly:true
            })

            if(!isMatch)
        {
            res.status(400).json({ error : 'Invalid Credentials' })
        }else{
            res.json({ message : 'user login successfully' })
        }    
        } else {
            res.status(400).json({ error : 'Invalid Credentials Last' })   
        }
    } catch (err) {
        console.log(err)
    }
})


module.exports = router;











