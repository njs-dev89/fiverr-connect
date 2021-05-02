const express = require('express');
const authenticate = require('../middlewares/authMiddleware')
const { getUserById, getAllUsers, followUser, unfollowUser, userFeed} = require("../controllers/userController")

const router = express.Router();

//@routeDescription Get all users
//@route /api/users

router.get("/", getAllUsers)

//@routeDescription Get user feed
//@route GET /api/users/feed

router.get("/feed", authenticate, userFeed)

//@routeDescription Get other user profile
//@route /api/users/profile/:userId

router.get('/profile/:userId', getUserById)

//@routeDescription Follow user
//@route PUT /api/users/follow/:userId

router.put('/follow/:userId', authenticate, followUser)

//@routeDescription Unfollow user
//@route PUT /api/users/unfollow/:userId

router.put('/unfollow/:userId', authenticate, unfollowUser)

module.exports = router;