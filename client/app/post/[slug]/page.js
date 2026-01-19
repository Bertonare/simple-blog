'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import parse from 'html-react-parser'; // To render rich text HTML
import CommentSection from '../../../components/CommentSection';
import Image from 'next/image';

export default function PostPage(props) {
    const params = use(props.params);
    const { slug } = params;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`);
                setPost(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!post) return <div className="text-center py-10">Post not found</div>;

    return (
        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800">
            {post.image && (
                <div className="relative h-96 w-full">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-8">
                <header className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        {post.categories.map((cat, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide dark:bg-blue-900 dark:text-blue-200">
                                {cat}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight dark:text-white">{post.title}</h1>
                    <div className="flex items-center text-gray-500 text-sm">
                        <span>By <span className="font-semibold text-gray-800 dark:text-gray-200">{post.author?.username}</span></span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert">
                    {parse(post.content)}
                </div>

                <hr className="my-12 border-gray-200 dark:border-gray-700" />

                <CommentSection postId={post._id} />
            </div>
        </article>
    );
}
