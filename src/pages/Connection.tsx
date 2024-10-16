import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePlaidLink } from "react-plaid-link";
import { FiUploadCloud, FiLink2 } from "react-icons/fi";
import {
  plaidGetLinkToken,
  plaidSetAccessToken,
  plaidGetAccounts,
  plaidDeleteAccount,
  plaidAccountsSync,
  uploadcsvfile,
} from "../utils/api";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Account } from "../utils/types";

const Connection: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"connected" | "manual">(
    "connected"
  );
  const [selectedUploadMember, setSelectedUploadMember] = useState<string>("");
  const [uploadSource, setUploadSource] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await plaidGetAccounts();
      setAccounts(response.accounts);
    } catch (err) {
      setError("Failed to fetch accounts");
      console.error("Error fetching accounts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await plaidAccountsSync();
      await getAccounts();
    } catch (err) {
      setError("Failed to sync accounts");
      console.error("Error syncing accounts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await plaidSetAccessToken(public_token, metadata.institution);
      await getAccounts();
    } catch (err) {
      setError("Failed to link account");
      console.error("Error linking account:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      try {
        const { link_token } = await plaidGetLinkToken();
        setLinkToken(link_token);
        await getAccounts();
      } catch (err) {
        setError("Failed to initialize");
        console.error("Error initializing:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  const config = {
    token: linkToken,
    onSuccess,
    onExit: (err: any, metadata: any) => {
      console.log("Exit:", err, metadata);
    },
    onEvent: (eventName: string, metadata: any) => {
      console.log("Event:", eventName, metadata);
    },
  };

  const deleteAccount = async (accountId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await plaidDeleteAccount(accountId);
      await getAccounts();
    } catch (err) {
      setError("Failed to delete account");
      console.error("Error deleting account:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedUploadMember || !uploadSource || !selectedFile) {
      setError("Please fill all fields before uploading");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await uploadcsvfile(selectedFile);
      if (data.status === "success") {
        // Reset form
        setSelectedUploadMember("");
        setUploadSource("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Refresh accounts/transactions
        await getAccounts();
      }
    } catch (err) {
      setError("Failed to upload CSV file");
      console.error("Error uploading CSV:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for members and sources
  const members = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ];

  const sources = [
    { id: "1", name: "Bank A" },
    { id: "2", name: "Bank B" },
  ];

  const { open, ready } = usePlaidLink(config);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {/* Tab Navigation */}
        <div className="flex mb-6 border-b">
          <button
            className={`py-2 px-4 ${
              activeTab === "connected"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("connected")}
          >
            <div className="flex items-center gap-2">
              <FiLink2 />
              Connected Banks
            </div>
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "manual"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("manual")}
          >
            <div className="flex items-center gap-2">
              <FiUploadCloud />
              Manual Upload
            </div>
          </button>
        </div>

        {activeTab === "connected" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Bank Connections
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => open()}
                  disabled={!ready || isLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400"
                >
                  Connect a bank account
                </button>
                <button
                  onClick={syncAccounts}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400"
                >
                  {isLoading ? "Update..." : "Update Transactions"}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Connected Accounts
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : accounts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {account.name}
                        </h3>
                        <button
                          onClick={() => deleteAccount(account.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <RiDeleteBin2Line className="h-5 w-5" />
                        </button>
                      </div>
                      {account.officialName && (
                        <p className="text-gray-600 text-sm mb-1">
                          {account.officialName}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm mb-2">
                        {account.type}
                        {account.mask && ` - ****${account.mask}`}
                      </p>
                      {account.currentBalance !== undefined && (
                        <p className="text-lg font-medium text-gray-900">
                          ${account.currentBalance.toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No accounts connected yet.</p>
                  <p className="mt-2 text-sm">
                    Click "Connect a bank account" to get started.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "manual" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Upload Transactions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="upload-member"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Select Member
                </label>
                <select
                  id="upload-member"
                  value={selectedUploadMember}
                  onChange={(e) => setSelectedUploadMember(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="upload-source"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Source
                </label>
                <input
                  id="upload-source"
                  list="source-options"
                  type="text"
                  value={uploadSource}
                  onChange={(e) => setUploadSource(e.target.value)}
                  placeholder="Select or type a source"
                  className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <datalist id="source-options">
                  {sources.map((source) => (
                    <option key={source.id} value={source.name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                CSV File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV files only</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                  />
                </label>
              </div>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUploadCloud className="h-5 w-5" />
                  Upload Transactions
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connection;
