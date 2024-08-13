import React, { useState, useEffect } from 'react';
import SidebarList from './SidebarList';

const Header = ({ children }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

  const handleResize = () => {
    if (window.innerWidth >= 1024) { // Assuming 1024px is the breakpoint for large screens
      setDrawerOpen(true); // Open the drawer by default on larger screens
    } else {
      setDrawerOpen(false); // Close the drawer by default on smaller screens
    }
  };

  useEffect(() => {
    // Set the initial drawer state based on the screen size
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const closeDrawer = () => {
        if (drawerOpen) {
            setDrawerOpen(false);
        }
    };

    const handleClick = (e) => {
        if (!e.target.closest('.sidebar') && !e.target.closest('.toggle-button') && drawerOpen) {
            closeDrawer();
        }
    };


    return (
        <div className="flex h-screen ">
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center">
                    <button onClick={toggleDrawer} className="mr-4 focus:outline-none toggle-button">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold">Healthcare</h1>
                </div>
            </header>

            <div className="relative">
                <aside className={`sidebar fixed top-16 left-0 w-64 h-full bg-white shadow-lg z-40 transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <nav className="p-4">
                        <SidebarList />
                    </nav>
                </aside>
            </div>
            <div className={`flex-1 transition-transform duration-300 ${drawerOpen ? 'ml-64' : 'ml-0'}`}>
                <main className="p-4 mt-16">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Header;
