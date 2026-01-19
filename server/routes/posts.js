const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    try {
        const count = await Post.countDocuments({ ...keyword });
        const posts = await Post.find({ ...keyword })
            .populate('author', 'username')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ posts, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/posts/:slug
// @desc    Get single post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { title, slug, content, image, categories } = req.body;

    try {
        const post = new Post({
            title,
            slug,
            content,
            image,
            categories,
            author: req.user._id,
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/posts/:slug
// @desc    Update a post
// @access  Private/Admin
router.put('/:slug', protect, admin, async (req, res) => {
    const { title, slug, content, image, categories, isPublished } = req.body;

    try {
        const post = await Post.findOne({ slug: req.params.slug });

        if (post) {
            post.title = title || post.title;
            post.slug = slug || post.slug;
            post.content = content || post.content;
            post.image = image || post.image;
            post.categories = categories || post.categories;
            post.isPublished = isPublished !== undefined ? isPublished : post.isPublished;

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/posts/:slug
// @desc    Delete a post
// @access  Private/Admin
router.delete('/:slug', protect, admin, async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });

        if (post) {
            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
