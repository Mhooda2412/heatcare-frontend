// src/components/Sidebar.js

import React from 'react';

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-cream-200 text-white flex flex-col">
            <div className="flex-shrink-0 p-4 text-lg font-bold">
                Sidebar
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <a href="#" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded group">
                    <svg className="w-6 h-6 mr-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
                    </svg>
                    <span className="ml-2 hidden lg:inline">Report</span>
                </a>
                <a href="#" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded group">
                    <svg className="w-6 h-6 mr-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 hidden lg:inline">Upload File</span>
                </a>
            </nav>
        </div>
    );
};

export default Sidebar;
