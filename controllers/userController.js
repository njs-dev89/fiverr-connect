const asyncHandler = require('express-async-handler');
const _ = require('lodash');
const User = require("../models/User");

exports.getUserById = asyncHandler(async (req, res) => {
    const userToLoadId = req.params.userId;

    const userLoaded = await User.findById(userToLoadId).select("-password");

    if(!userLoaded) {
        res.status(404)
        throw new Error('User does not exist')
    }

    res.status(200).json({userLoaded})
})

exports.userFeed = asyncHandler(async (req, res) => {
    const {following, _id} = req.user;

    following.push(_id);

    const users = await User.find({_id: {$nin: following}}).select("_id name avatar");

    if(!users) {
        res.status(404)
        throw new Error("No user to follow")
    }

    res.status(200).json({users})
})

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("_id name email createdAt updatedAt");

    if(!users) {
        res.status(404)
        throw new Error("No user found")
    }

    res.status(200).json({users});
})

exports.followUser = asyncHandler(async (req, res) => {
    const userToFollowId = req.params.userId;
    //Add to following
    const following = req.user.following;
    if(following.filter(user => {return user._id.toString() === userToFollowId}).length > 0) {
        res.status(400)
        throw new Error("You have already followed this user")
    }
    following.push(userToFollowId);
    const userModified = await req.user.save()
    await userModified.populate("following", "_id name avatar").execPopulate();

    //Add to followers
    const userToFollow = await User.findByIdAndUpdate(userToFollowId,{$push: {followers: req.user._id}} );

    res.status(200).json({user: userModified})
    
})

exports.unfollowUser = asyncHandler(async (req, res) => {
    const userToUnfollowId = req.params.userId;

    //Delete from following
    const userModified = await User.findByIdAndUpdate(req.user._id, {$pull: {following: userToUnfollowId}}, {new: true}).select("-password").populate("following", "_id name avatar")

    //Delete from followers
    const userToUnfollow = await User.findByIdAndUpdate(userToUnfollowId,{$pull: {followers: req.user._id}}, {new: true} );

    res.status(200).json({user: userModified})
})

