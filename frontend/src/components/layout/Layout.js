import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gradient">
            <nav className="nav-gradient">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center" style={{ height: '70px' }}>
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold" style={{ color: '#1890C8' }}>
                                Fractal <span style={{ color: '#F7941D' }}>Test</span>
                            </h1>
                        </div>

                        <div className="flex items-center" style={{ gap: '1rem' }}>
                            <Link 
                                to="/my-orders" 
                                className={`nav-link ${
                                    location.pathname === '/my-orders' || location.pathname === '/'
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                My Orders
                            </Link>
                            <Link
                                to="/products" 
                                className={`nav-link ${
                                    location.pathname === '/products'
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                Products                               
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {children}                        
            </main>
        </div>
    );
};

export default Layout;