'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`);
            setComments(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const submitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`,
                { content: newComment },
                config
            );
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error(error);
            alert('Failed to post comment');
        }
    };

    const deleteComment = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`, config);
            fetchComments();
        } catch (error) {
            alert('Failed to delete comment');
        }
    }

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Comments ({comments.length})</h3>

            {user ? (
                <form onSubmit={submitComment} className="mb-8">
                    <textarea
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows="3"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Post Comment
                    </button>
                </form>
            ) : (
                <p className="mb-8 text-gray-600 dark:text-gray-400">Please <a href="/login" className="text-blue-500 underline dark:text-blue-400">login</a> to leave a comment.</p>
            )}

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-700 dark:border-gray-600">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{comment.author?.username || 'Unknown User'}</p>
                                <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                            </div>
                            {user && user.role === 'admin' && (
                                <button onClick={() => deleteComment(comment._id)} className="text-red-500 text-sm hover:underline dark:text-red-400">Delete</button>
                            )}
                        </div>
                    </div>
                ))}
                {comments.length === 0 && !loading && <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>}
            </div>
        </div>
    );
};

export default CommentSection;
