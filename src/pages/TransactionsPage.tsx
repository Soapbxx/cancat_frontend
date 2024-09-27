import React, { useState } from 'react';
import Filters from '../components/Filters';
import TransactionsTable from '../components/TransactionsTable';

const TransactionsPage: React.FC = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="w-full p-2 bg-[#4338ca] text-white rounded hover:bg-blue-600"
        >
          {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className={`w-full md:w-1/4 ${isFilterVisible ? 'block' : 'hidden md:block'} mb-4 md:mb-0`}>
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