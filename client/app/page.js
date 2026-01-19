'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import parse from 'html-react-parser';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (search = '') => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts?keyword=${search}`);
      setPosts(data.posts);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(keyword);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Latest Posts</h1>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search posts..."
            className="border rounded-l px-4 py-2 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Search</button>
        </form>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col dark:bg-gray-800 dark:border-gray-700">
              {post.image ? (
                <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400 dark:bg-gray-700 dark:text-gray-500">No Image</div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="text-sm text-blue-600 mb-2 font-semibold dark:text-blue-400">
                  {post.categories.join(', ')}
                </div>
                <Link href={`/post/${post.slug}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 line-clamp-2 dark:text-white dark:hover:text-blue-400">{post.title}</h2>
                </Link>
                <div className="text-gray-600 mb-4 line-clamp-3 flex-1 dark:text-gray-300">
                  {/* Access text content from HTML roughly for preview, or just use substring/css */}
                  <div className="line-clamp-3 text-sm">
                    {post.content.replace(/<[^>]+>/g, '')}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:text-gray-400 dark:border-gray-700">
                  <span>{post.author?.username}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No posts found.</p>
      )}
    </div>
  );
}
