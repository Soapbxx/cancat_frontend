// import React, { useState, useRef, useEffect } from "react";
// import { FiRefreshCw, FiUploadCloud, FiLink2 } from "react-icons/fi";
// import { uploadcsvfile, plaidGetAccounts, plaidAccountsSync } from "../utils/api";
// import { Account } from "../utils/types";

// // ... keep your existing interfaces

// const Filters: React.FC = () => {
//   // ... keep your existing states
//   const [isUpdatingTransactions, setIsUpdatingTransactions] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
//   const [activeTab, setActiveTab] = useState<'connected' | 'manual'>('connected');

//   // ... keep your existing functions

//   const updateBankTransactions = async () => {
//     setIsUpdatingTransactions(true);
//     setError(null);
//     try {
//       await plaidAccountsSync();
//       await getAccounts();
//       setLastUpdated(new Date());
//     } catch (err) {
//       setError("Failed to update transactions");
//       console.error("Error updating transactions:", err);
//     } finally {
//       setIsUpdatingTransactions(false);
//     }
//   };

//   return (
//     <div className="w-full p-4 bg-white rounded shadow">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold mb-4">Transactions</h2>
        
//         {/* Tab Navigation */}
//         <div className="flex mb-4 border-b">
//           <button
//             className={`py-2 px-4 ${activeTab === 'connected' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('connected')}
//           >
//             <div className="flex items-center gap-2">
//               <FiLink2 />
//               Connected Banks
//             </div>
//           </button>
//           <button
//             className={`py-2 px-4 ${activeTab === 'manual' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('manual')}
//           >
//             <div className="flex items-center gap-2">
//               <FiUploadCloud />
//               Manual Upload
//             </div>
//           </button>
//         </div>

//         {/* Connected Banks Tab */}
//         {activeTab === 'connected' && (
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex-grow">
//                 <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
//                 <p className="text-sm text-gray-600">
//                   {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'} connected
//                 </p>
//               </div>
//               <button
//                 onClick={updateBankTransactions}
//                 disabled={isUpdatingTransactions}
//                 className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:bg-indigo-400 flex items-center gap-2 ${
//                   isUpdatingTransactions ? 'animate-pulse' : ''
//                 }`}
//               >
//                 <FiRefreshCw className={`h-5 w-5 ${isUpdatingTransactions ? 'animate-spin' : ''}`} />
//                 {isUpdatingTransactions ? 'Updating...' : 'Update Transactions'}
//               </button>
//             </div>

//             {lastUpdated && !isUpdatingTransactions && (
//               <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
//                 Last updated: {lastUpdated.toLocaleString()}
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//               {accounts.map((account) => (
//                 <div key={account.id} className="border rounded-lg p-4">
//                   <h4 className="font-semibold">{account.name}</h4>
//                   <p className="text-sm text-gray-600">{account.officialName}</p>
//                   {account.currentBalance !== undefined && (
//                     <p className="mt-2 font-medium">${account.currentBalance.toFixed(2)}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Manual Upload Tab */}
//         {activeTab === 'manual' && (
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Upload CSV File</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label htmlFor="upload-member" className="block mb-2 text-sm font-medium">
//                   Select Member:
//                 </label>
//                 <select
//                   id="upload-member"
//                   value={selectedUploadMember}
//                   onChange={(e) => setSelectedUploadMember(e.target.value)}
//                   className="w-full p-2 border rounded-md"
//                 >
//                   <option value="">Select a member</option>
//                   {members
//                     .filter((m) => m.id !== "all")
//                     .map((member) => (
//                       <option key={member.id} value={member.id}>
//                         {member.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label htmlFor="upload-source" className="block mb-2 text-sm font-medium">
//                   Source:
//                 </label>
//                 <input
//                   id="upload-source"
//                   list="source-options"
//                   type="text"
//                   value={uploadSource}
//                   onChange={(e) => setUploadSource(e.target.value)}
//                   placeholder="Select or type a source"
//                   className="w-full p-2 border rounded-md"
//                 />
//                 <datalist id="source-options">
//                   {sources
//                     .filter((s) => s.id !== "all")
//                     .map((source) => (
//                       <option key={source.id} value={source.name} />
//                     ))}
//                 </datalist>
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm font-medium">
//                 Select CSV File:
//               </label>
//               <div className="flex items-center justify-center w-full">
//                 <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <FiUploadCloud className="w-8 h-8 mb-4 text-gray-500" />
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">CSV files only</p>
//                   </div>
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept=".csv"
//                     onChange={handleFileSelect}
//                     ref={fileInputRef}
//                   />
//                 </label>
//               </div>
//               {selectedFile && (
//                 <p className="mt-2 text-sm text-gray-600">
//                   Selected file: {selectedFile.name}
//                 </p>
//               )}
//             </div>

//             <button
//               onClick={handleUpload}
//               className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
//             >
//               <FiUploadCloud className="h-5 w-5" />
//               Upload Transactions
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Filters Section */}
//       <div className="mt-8">
//         <h2 className="text-xl font-bold mb-4">Filters</h2>
//         {/* ... keep your existing filters code ... */}
//       </div>
//     </div>
//   );
// };

// export default Filters;

// import React from "react";
// import { useState, useEffect, useCallback, useRef } from "react";
// import { usePlaidLink } from "react-plaid-link";
// import { FiRefreshCw, FiUploadCloud, FiLink2 } from "react-icons/fi";
// import {
//   plaidGetLinkToken,
//   plaidSetAccessToken,
//   plaidGetAccounts,
//   plaidDeleteAccount,
//   plaidAccountsSync,
//   uploadcsvfile
// } from "../utils/api";
// import { RiDeleteBin2Line } from "react-icons/ri";
// import { Account } from "../utils/types";

// const Connection: React.FC = () => {
//   // ... keep your existing states
//   const [activeTab, setActiveTab] = useState<'connected' | 'manual'>('connected');
//   const [selectedUploadMember, setSelectedUploadMember] = useState<string>("");
//   const [uploadSource, setUploadSource] = useState<string>("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ... keep your existing functions

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedUploadMember || !uploadSource || !selectedFile) {
//       setError("Please fill all fields before uploading");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await uploadcsvfile(selectedFile);
//       if (data.status === "success") {
//         // Reset form
//         setSelectedUploadMember("");
//         setUploadSource("");
//         setSelectedFile(null);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }
//         // Refresh accounts/transactions
//         await getAccounts();
//       }
//     } catch (err) {
//       setError("Failed to upload CSV file");
//       console.error("Error uploading CSV:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Mock data for members and sources
//   const members = [
//     { id: "1", name: "John Doe" },
//     { id: "2", name: "Jane Smith" },
//   ];

//   const sources = [
//     { id: "1", name: "Bank A" },
//     { id: "2", name: "Bank B" },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         {/* Tab Navigation */}
//         <div className="flex mb-6 border-b">
//           <button
//             className={`py-2 px-4 ${activeTab === 'connected' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('connected')}
//           >
//             <div className="flex items-center gap-2">
//               <FiLink2 />
//               Connected Banks
//             </div>
//           </button>
//           <button
//             className={`py-2 px-4 ${activeTab === 'manual' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('manual')}
//           >
//             <div className="flex items-center gap-2">
//               <FiUploadCloud />
//               Manual Upload
//             </div>
//           </button>
//         </div>

//         {activeTab === 'connected' && (
//           <>
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//               <h1 className="text-2xl font-bold text-gray-900">Bank Connections</h1>
//               <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//                 <button
//                   onClick={() => open()}
//                   disabled={!ready || isLoading}
//                   className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400"
//                 >
//                   Connect a bank account
//                 </button>
//                 <button
//                   onClick={syncAccounts}
//                   disabled={isLoading}
//                   className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 flex items-center justify-center gap-2"
//                 >
//                   <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
//                   {isLoading ? "Updating..." : "Update Transactions"}
//                 </button>
//               </div>
//             </div>

//             {/* ... keep your existing connected accounts display code ... */}
//           </>
//         )}

//         {activeTab === 'manual' && (
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Transactions</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <div>
//                 <label htmlFor="upload-member" className="block mb-2 text-sm font-medium text-gray-700">
//                   Select Member
//                 </label>
//                 <select
//                   id="upload-member"
//                   value={selectedUploadMember}
//                   onChange={(e) => setSelectedUploadMember(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">Select a member</option>
//                   {members.map((member) => (
//                     <option key={member.id} value={member.id}>
//                       {member.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label htmlFor="upload-source" className="block mb-2 text-sm font-medium text-gray-700">
//                   Source
//                 </label>
//                 <input
//                   id="upload-source"
//                   list="source-options"
//                   type="text"
//                   value={uploadSource}
//                   onChange={(e) => setUploadSource(e.target.value)}
//                   placeholder="Select or type a source"
//                   className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 <datalist id="source-options">
//                   {sources.map((source) => (
//                     <option key={source.id} value={source.name} />
//                   ))}
//                 </datalist>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 CSV File
//               </label>
//               <div className="flex items-center justify-center w-full">
//                 <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <FiUploadCloud className="w-10 h-10 mb-3 text-gray-400" />
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">CSV files only</p>
//                   </div>
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept=".csv"
//                     onChange={handleFileSelect}
//                     ref={fileInputRef}
//                   />
//                 </label>
//               </div>
//               {selectedFile && (
//                 <p className="mt-2 text-sm text-gray-500">
//                   Selected file: {selectedFile.name}
//                 </p>
//               )}
//             </div>

//             <button
//               onClick={handleUpload}
//               disabled={isLoading}
//               className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   Uploading...
//                 </>
//               ) : (
//                 <>
//                   <FiUploadCloud className="h-5 w-5" />
//                   Upload Transactions
//                 </>
//               )}
//             </button>
//           </div>
//         )}

//         {error && (
//           <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Connection;


<h2 className="text-xl font-bold mb-4">Upload CSV</h2>

{/* Member Selection for Upload */}
<div className="mb-4">
  <label htmlFor="upload-member" className="block mb-2">
    Select Member:
  </label>
  <select
    id="upload-member"
    value={selectedUploadMember}
    onChange={(e) => setSelectedUploadMember(e.target.value)}
    className="w-full p-2 border rounded"
  >
    <option value="">Select a member</option>
    {members
      .filter((m) => m.id !== "all")
      .map((member) => (
        <option key={member.id} value={member.id}>
          {member.name}
        </option>
      ))}
  </select>
</div>

{/* Source Input */}
<div className="mb-4">
  <label htmlFor="upload-source" className="block mb-2">
    Source:
  </label>
  <input
    id="upload-source"
    list="source-options"
    type="text"
    value={uploadSource}
    onChange={(e) => setUploadSource(e.target.value)}
    placeholder="Select or type a source"
    className="w-full p-2 border rounded"
  />
  <datalist id="source-options">
    {sources
      .filter((s) => s.id !== "all")
      .map((source) => (
        <option key={source.id} value={source.name} />
      ))}
  </datalist>
</div>

{/* File Upload */}
<div className="mb-4">
  <label htmlFor="file-upload" className="block mb-2">
    Select CSV File:
  </label>
  <input
    id="file-upload"
    type="file"
    accept=".csv"
    onChange={handleFileSelect}
    ref={fileInputRef}
    className="w-full p-2 border rounded"
  />
</div>

{/* Upload Button */}
<button
  onClick={handleUpload}
  className="w-full p-2 bg-[#4338ca] text-white rounded hover:bg-blue-600 mb-8"
>
  Upload CSV
</button>