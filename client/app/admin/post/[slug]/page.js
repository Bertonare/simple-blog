'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import RichTextEditor from '../../../../components/RichTextEditor';

export default function EditPost(props) {
    // Unwrap params using React.use()
    const params = use(props.params);
    const { slug: paramSlug } = params;

    const { t } = useLanguage();
    const { user, loading } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [categories, setCategories] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${paramSlug}`);
                setTitle(data.title);
                setSlug(data.slug);
                setContent(data.content);
                setImage(data.image);
                setCategories(data.categories.join(', '));
            } catch (error) {
                console.error(error);
                alert('Failed to fetch post');
            }
        };
        if (paramSlug) {
            fetchPost();
        }
    }, [paramSlug]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_UPLOAD_URL}/api/upload`, formData, config);
            setImage(`${process.env.NEXT_PUBLIC_UPLOAD_URL}${data}`);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert(t('imageUploadFailed'));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!user || user.role !== 'admin') return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/posts/${paramSlug}`,
                {
                    title,
                    slug,
                    content,
                    image,
                    categories: categories.split(',').map((c) => c.trim()),
                },
                config
            );
            router.push('/admin');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error updating post');
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
            <h1 className="text-3xl font-bold mb-6">{t('updatePost')}</h1>
            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('title')}</label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('slug')}</label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('coverImage')}</label>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-2">{t('uploading')}</p>}
                    {image && <img src={image} alt="Cover" className="h-40 mt-4 object-cover rounded" />}
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('categoriesLabel')}</label>
                    <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-bold mb-2">{t('content')}</label>
                    <RichTextEditor value={content} onChange={setContent} />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {t('updatePost')}
                </button>
            </form>
        </div>
    );
}
