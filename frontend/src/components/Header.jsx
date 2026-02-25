import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { format } from 'date-fns';

const NAV_LINKS = [
    { label: 'News', path: '/' },
    { label: 'Business', path: '/category/business' },
    { label: 'Politics', path: '/category/politics' },
    { label: 'Sports', path: '/category/sports' },
    { label: 'Opinion', path: '/category/opinion' },
    { label: 'Entertainment', path: '/category/entertainment' },
    { label: 'Life', path: '/category/life' },
];

const Header = () => {
    const currentDate = format(new Date(), 'EEEE, MMMM do yyyy');
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <header className="bg-white border-b border-gray-200">
            {/* Top Bar */}
            <div className="bg-themorning-dark text-white py-1.5">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex justify-between items-center text-xs font-sans">
                    <div className="hidden md:block tracking-wide opacity-80">{currentDate}</div>
                    <div className="flex space-x-4 items-center w-full justify-between md:w-auto md:justify-end">
                        <span className="md:hidden tracking-wide opacity-80">{format(new Date(), 'MMM do yyyy')}</span>
                        <div className="flex space-x-3 items-center">
                            <a href="#" aria-label="Facebook"><Facebook size={13} className="hover:text-red-400 cursor-pointer transition-colors" /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={13} className="hover:text-red-400 cursor-pointer transition-colors" /></a>
                            <a href="#" aria-label="Instagram"><Instagram size={13} className="hover:text-red-400 cursor-pointer transition-colors" /></a>
                            <a href="#" aria-label="Youtube"><Youtube size={13} className="hover:text-red-400 cursor-pointer transition-colors" /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logo Row */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button className="md:hidden text-gray-600 hover:text-black" aria-label="Menu">
                        <Menu size={22} />
                    </button>
                    <Link to="/" className="flex items-center no-underline">
                        <img src="/logo.png" alt="iVoice Logo" className="h-10 w-auto" />
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <div className="text-right text-xs text-gray-500 font-sans border-r pr-6 border-gray-200 leading-relaxed max-w-[200px] hidden lg:block">
                        <p className="font-bold text-gray-800">Youth-led</p>
                        <p>Citizen Journalism</p>
                    </div>
                    <button aria-label="Search" className="text-gray-500 hover:text-black transition-colors">
                        <Search size={20} />
                    </button>
                </div>
                <button className="md:hidden text-gray-500" aria-label="Search">
                    <Search size={22} />
                </button>
            </div>

            {/* Red accent line */}
            <div className="h-0.5 bg-themorning-red" />

            {/* Navigation */}
            <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100 hidden md:block">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
                    <ul className="flex gap-1 text-xs font-bold font-sans uppercase tracking-widest py-0 overflow-x-auto whitespace-nowrap">
                        {NAV_LINKS.map(({ label, path }) => (
                            <li key={path}>
                                <Link
                                    to={path}
                                    className={`inline-block py-4 px-4 border-b-[3px] transition-colors no-underline ${isActive(path)
                                        ? 'border-themorning-red text-themorning-red'
                                        : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
