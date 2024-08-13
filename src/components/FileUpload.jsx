import React, { useState } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileCategory, setFileCategory] = useState('contract');
  const [fileSubCategory, setFileSubCategory] = useState('');
  const [month, setMonth] = useState('7');
  const [year, setYear] = useState(2006);

  const subCategories = {
    contract: [
      { key: "Contract Info", value: 'contractInfo' },
      { key: "Enrollment Info", value: 'enrollmentInfo' }
    ],
    registration: [
      { key: "Registration Info", value: 'registrationInfo' },
      { key: "Center Info", value: 'centerInfo' }
    ],
    financialRecords: [
      { key: "Financial Statements", value: 'financialStatements' },
      { key: "Tax Documents", value: 'taxDocuments' }
    ],
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value >= 2006) {
      setYear(value);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadSuccess(false);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const base64data = reader.result.split(',')[1];

        const requestData = {
          file_cat: fileCategory,
          file_sub_cat: fileSubCategory,
          month: month,
          year: year,
          base64: base64data
        };

        fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })
          .then(response => {
            setLoading(false);
            if (response.ok) {
              console.log('File uploaded successfully');
              setUploadSuccess(true);
            } else {
              console.error('Failed to upload file');
            }
          })
          .catch(error => {
            setLoading(false);
            console.error('Error uploading file:', error);
          });
      };
      reader.onerror = error => {
        setLoading(false);
        console.error('FileReader error:', error);
      };
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Upload a File</h2>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">File Category</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={fileCategory}
                onChange={(e) => {
                  setFileCategory(e.target.value);
                  setFileSubCategory('');
                }}
              >
                <option value="contract">Contract</option>
                <option value="registration">Registration</option>
                <option value="financialRecords">Financial Records</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">File Sub Category</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={fileSubCategory}
                onChange={(e) => setFileSubCategory(e.target.value)}
                disabled={!fileCategory}
              >
                {fileCategory && subCategories[fileCategory].map((subCat) => (
                  <option key={subCat.key} value={subCat.value}>{subCat.key}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={year}
                onChange={handleYearChange}
                min={2006}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Choose File</label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-gray-500"
              />
            </div>
          </div>
          {selectedFile && (
            <div className="mt-4 flex items-center">
              <p className="text-gray-700 mr-2">{selectedFile.name}</p>
              {uploadSuccess && (
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          )}
          <button
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!selectedFile || loading}
            onClick={handleUpload}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"></path>
              </svg>
            ) : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
