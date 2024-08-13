import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaFileUpload, FaChartBar } from 'react-icons/fa';

export default function SidebarList() {
    const navigate = useNavigate();
    
    return (
        <React.Fragment>
            <button
                onClick={() => navigate('/')}
                className="flex items-center p-4 w-full text-left hover:bg-gray-200"
            >
                <FaTachometerAlt className="mr-4 text-gray-600" />
                <span className="text-gray-800">Dashboard</span>
            </button>
            <button
                onClick={() => navigate('/file-upload')}
                className="flex items-center p-4 w-full text-left hover:bg-gray-200"
            >
                <FaFileUpload className="mr-4 text-gray-600" />
                <span className="text-gray-800">File Upload</span>
            </button>
            <button
                onClick={() => navigate('/reports')}
                className="flex items-center p-4 w-full text-left hover:bg-gray-200"
            >
                <FaChartBar className="mr-4 text-gray-600" />
                <span className="text-gray-800">Reports</span>
            </button>
        </React.Fragment>
    );
}
