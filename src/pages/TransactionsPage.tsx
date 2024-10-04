import React, { useState, useCallback, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import Filters from "../components/Filters";
import TransactionsTable from "../components/TransactionsTable";
import { plaidGetLinkToken, plaidSetAccessToken, plaidGetAccounts } from "../utils/api";

// Define the Account interface
interface Account {
  id: number;
  name: string;
  officialName?: string;
  type: string;
  subtype?: string;
  mask?: string;
  currentBalance?: number;
  availableBalance?: number;
  isoCurrencyCode?: string;
  plaidItem: {
    plaidInstitutionId: string;
    status: string;
  };
}

const TransactionsPage: React.FC = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    try {
      await plaidSetAccessToken(public_token, metadata.institution);
      // Refresh accounts list after linking a new account
      getAccounts();
    } catch (err) {
      setError("Failed to link account");
      console.error("Error linking account:", err);
    }
  }, []);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const { link_token } = await plaidGetLinkToken();
        setLinkToken(link_token);
        getAccounts();
      } catch (err) {
        setError("Failed to initialize");
        console.error("Error initializing:", err);
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

  const { open, ready } = usePlaidLink(config);

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div className="md:hidden">
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="w-full p-2 bg-[#4338ca] text-white rounded hover:bg-blue-600"
          >
            {isFilterVisible ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        <button
          onClick={() => open()}
          disabled={!ready}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Connect a bank account
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Connected Accounts</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="border rounded p-4">
                <h3 className="font-semibold">{account.name}</h3>
                {account.officialName && (
                  <p className="text-gray-600">{account.officialName}</p>
                )}
                <p className="text-gray-600">
                  {account.type}
                  {account.mask && ` - ****${account.mask}`}
                </p>
                {account.currentBalance !== undefined && (
                  <p className="mt-2">
                    Balance: ${account.currentBalance.toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No accounts connected yet.</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row">
        <div
          className={`w-full md:w-1/4 ${
            isFilterVisible ? "block" : "hidden md:block"
          } mb-4 md:mb-0`}
        >
          <Filters />
        </div>
        <div className="w-full md:w-3/4 md:pl-4">
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;