const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: true, // Auto-approve for now, can be changed to false for moderation
    },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
