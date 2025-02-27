// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isProfileOpen && !target.closest('.profile-dropdown')) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    // Mock user
    const currentUser = {
        name: 'Random Guy',
        role: 'steward',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    };

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' },
        { name: 'Parks', href: '/parks', current: location.pathname.startsWith('/parks') },
        { name: 'Report Issue', href: '/issues/report', current: location.pathname === '/issues/report' },
    ];

    // Add admin links for stewards and owners
    if (currentUser.role === 'steward' || currentUser.role === 'owner') {
        navigation.push({
            name: 'Issues',
            href: '/issues',
            current: location.pathname.startsWith('/issues') && location.pathname !== '/issues/report'
        });
    }

    return (
        <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <svg
                                    className="h-9 w-9 text-[#BD4602]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 12L16 10M12 12L12 17M12 12L8 10M12 12L15 8.5M12 12L9 8.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 7.01L12.01 6.99889"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="text-[#BD4602] text-xl font-bold">Trail Pittsburgh</span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`${item.current
                                            ? 'border-[#BD4602] text-[#BD4602]'
                                            : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-[#BD4602]'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {/* Profile dropdown */}
                        <div className="ml-3 relative profile-dropdown">
                            <div>
                                <button
                                    type="button"
                                    className="flex items-center space-x-3 bg-white p-1 rounded-full hover:bg-gray-50 transition-colors"
                                    id="user-menu-button"
                                    aria-expanded={isProfileOpen}
                                    aria-haspopup="true"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-gray-700 truncate">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                                    </div>
                                    <div className="relative flex-shrink-0">
                                        <img
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                            src={currentUser.avatar}
                                            alt={currentUser.name}
                                        />
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-1 ring-white"></span>
                                    </div>
                                </button>
                            </div>

                            {/* Dropdown menu */}
                            {isProfileOpen && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                >
                                    <div className="py-1" role="none">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Profile</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#BD4602] hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#BD4602]"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden absolute w-full bg-white border-b border-gray-200 shadow-lg">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`${item.current
                                        ? 'bg-orange-50 text-[#BD4602] border-l-4 border-[#BD4602]'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#BD4602] border-l-4 border-transparent'
                                    } block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200`}
                                aria-current={item.current ? 'page' : undefined}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4 py-2">
                            <div className="flex-shrink-0 relative">
                                <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                />
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-1 ring-white"></span>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{currentUser.name}</div>
                                <div className="text-sm font-medium text-gray-500 capitalize">{currentUser.role}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <a href="#" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#BD4602]">Profile</a>
                            <a href="#" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#BD4602]">Settings</a>
                            <a href="#" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#BD4602]">Sign out</a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
