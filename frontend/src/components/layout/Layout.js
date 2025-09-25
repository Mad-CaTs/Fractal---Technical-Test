import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Fractal Test
                            </h1>
                        </div>

                        <div className="flex space-x-8 items-center">
                            <Link 
                                to="/my-orders" className={`px-3 py-2 rounded-md text-sm font-medium 
                                ${location.pathname === '/my-orders' || location.pathname === '/'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >My Orders
                            </Link>

                            <Link
                                to="/products" className={`px-3 py-2 rounded-md text-sm font-medium 
                                ${location.pathname === '/products'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >Products                               
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 px-4">
                {children}                        
            </main>
        </div>
    );
};

export default Layout;