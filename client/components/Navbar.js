'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg transition-colors border-b dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Simple Space
                    </Link>

                    <div className="hidden md:flex space-x-6 items-center">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">{t('home')}</Link>

                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">{t('dashboard')}</Link>
                                )}
                                <span className="text-gray-600 dark:text-gray-300">{t('hello')}, {user.username}</span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    {t('logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">{t('login')}</Link>
                                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                    {t('register')}
                                </Link>
                            </>
                        )}
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                    <Link href="/" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">{t('home')}</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link href="/admin" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">{t('dashboard')}</Link>
                            )}
                            <button onClick={logout} className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-100 text-red-500 dark:hover:bg-gray-800">
                                {t('logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">{t('login')}</Link>
                            <Link href="/register" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">{t('register')}</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
