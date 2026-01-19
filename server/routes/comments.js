const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/comments/:postId
// @desc    Add a comment to a post
// @access  Private
router.post('/:postId', protect, async (req, res) => {
    const { content } = req.body;

    try {
        const post = await Post.findById(req.params.postId);

        if (post) {
            const comment = new Comment({
                content,
                post: req.params.postId,
                author: req.user._id,
            });

            const createdComment = await comment.save();
            res.status(201).json(createdComment);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/comments/:postId
// @desc    Get comments for a post
// @access  Public
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment) {
            await comment.deleteOne();
            res.json({ message: 'Comment removed' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
