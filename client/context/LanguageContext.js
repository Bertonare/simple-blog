'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        home: 'Home',
        dashboard: 'Dashboard',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        hello: 'Hello',
        latestPosts: 'Latest Posts',
        searchPlaceholder: 'Search posts...',
        searchButton: 'Search',
        noPosts: 'No posts found.',
        loading: 'Loading posts...',
        noImage: 'No Image',
        readMore: 'Read More',
        comments: 'Comments',
        writeComment: 'Write a comment...',
        postComment: 'Post Comment',
        pleaseLogin: 'Please login to leave a comment.',
        delete: 'Delete',
        edit: 'Edit',
        unknownUser: 'Unknown User',
        noComments: 'No comments yet.',
        postNotFound: 'Post not found',
        by: 'By',
        adminDashboard: 'Admin Dashboard',
        createPost: 'Create New Post',
        users: 'Users',
        posts: 'Posts',
        publishPost: 'Publish Post',
        updatePost: 'Update Post',
        title: 'Title',
        slug: 'Slug',
        coverImage: 'Cover Image',
        categoriesLabel: 'Categories (comma separated)',
        content: 'Content',
        uploading: 'Uploading...',
        imageUploadFailed: 'Image upload failed',
    },
    id: {
        home: 'Beranda',
        dashboard: 'Dasbor',
        login: 'Masuk',
        register: 'Daftar',
        logout: 'Keluar',
        hello: 'Halo',
        latestPosts: 'Postingan Terbaru',
        searchPlaceholder: 'Cari postingan...',
        searchButton: 'Cari',
        noPosts: 'Tidak ada postingan ditemukan.',
        loading: 'Memuat postingan...',
        noImage: 'Tidak Ada Gambar',
        readMore: 'Baca Selengkapnya',
        comments: 'Komentar',
        writeComment: 'Tulis komentar...',
        postComment: 'Kirim Komentar',
        pleaseLogin: 'Silakan masuk untuk meninggalkan komentar.',
        delete: 'Hapus',
        edit: 'Edit',
        unknownUser: 'Pengguna Tidak Dikenal',
        noComments: 'Belum ada komentar.',
        postNotFound: 'Postingan tidak ditemukan',
        by: 'Oleh',
        adminDashboard: 'Dasbor Admin',
        createPost: 'Buat Postingan Baru',
        users: 'Pengguna',
        posts: 'Postingan',
        publishPost: 'Terbitkan Postingan',
        updatePost: 'Perbarui Postingan',
        title: 'Judul',
        slug: 'Slug',
        coverImage: 'Gambar Sampul',
        categoriesLabel: 'Kategori (pisahkan dengan koma)',
        content: 'Konten',
        uploading: 'Mengunggah...',
        imageUploadFailed: 'Gagal mengunggah gambar',
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'id' : 'en'));
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
