const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const {signIn, signUp, getUser, uploadAvatar, resizeAvatar, 
        updateUser, deleteUser} = require('../controllers/authController');

const router = express.Router();

//@routeDescription SignUp route
//@route POST /api/signup
router.post('/signup', signUp)

//@routeDescription SignIn route
//@route POST /api/signin
router.post('/signin', signIn)

//@routeDescription Get user from token
//@route GET /api/profile
router.get('/profile', authenticate, getUser)

//@routeDescription Update profile
//@route PUT /api/profile

router.put('/profile/update', authenticate, uploadAvatar, resizeAvatar, updateUser)

//@routeDescription Delete profile
//@route DELETE /api/profile

router.delete('/profile/delete', authenticate, deleteUser)

module.exports = router;