'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchPosts = useCallback(async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
            setPosts(data.posts);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, config);
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                router.push('/');
            } else {
                fetchPosts();
                fetchUsers();
            }
        }
    }, [user, loading, router, fetchPosts, fetchUsers]);

    const deletePost = async (slug) => {
        if (confirm('Are you sure?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`, config);
                fetchPosts();
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    if (loading || !user) return <p>Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">{t('adminDashboard')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">{t('posts')} ({posts.length})</h2>
                        <Link href="/admin/post/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            {t('createPost')}
                        </Link>
                    </div>
                    <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {posts.map((post) => (
                                <li key={post._id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <Link href={`/post/${post.slug}`} className="text-blue-600 hover:underline font-medium dark:text-blue-400">
                                            {post.title}
                                        </Link>
                                        <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link href={`/admin/post/${post.slug}`} className="text-yellow-500 hover:text-yellow-600">{t('edit')}</Link>
                                        <button onClick={() => deletePost(post.slug)} className="text-red-500 hover:text-red-600">{t('delete')}</button>
                                    </div>
                                </li>
                            ))}
                            {posts.length === 0 && <li className="p-4 text-gray-500">{t('noPosts')}</li>}
                        </ul>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">{t('users')} ({users.length})</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((u) => (
                                <li key={u._id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{u.username}</p>
                                        <p className="text-sm text-gray-500">{u.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                                        {u.role}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
