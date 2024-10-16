import React, { useState, useEffect } from "react";
import Filters from "../components/Filters";
import TransactionsTable from "../components/TransactionsTable";

const TransactionsPage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  function setSelectedUserIdCallback(userId: number | null) {
    if (userId !== selectedUserId) {
      setSelectedUserId(userId);
    }
  }

  useEffect(() => {
    console.log("selectedUserId changed to: ", selectedUserId);
  }, [selectedUserId]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toggle button for filters on mobile */}
      <button
        className="md:hidden w-full mb-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        {isFilterVisible ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="flex flex-col md:flex-row">
        <div
          className={`w-full md:w-1/4 ${
            isFilterVisible ? "block" : "hidden md:block"
          } mb-4 md:mb-0`}
        >
          <Filters setSelectedMemberId={setSelectedUserIdCallback} />
        </div>
        <div className="w-full md:w-3/4 md:pl-4">
          {selectedUserId ? (
            <TransactionsTable sharedUserId={selectedUserId} />
          ) : (
            <TransactionsTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;