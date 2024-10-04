import React, { useEffect, useState } from "react";
import { LuPencil, LuFlag, LuEyeOff, LuSearch } from "react-icons/lu";
import { fetchTransactions, putTransaction } from "../utils/api";

interface Transaction {
  id: number;
  date: string;
  label: string;
  amount: number;
  tag: string;
  pandb: boolean;
  flag: boolean;
  hidden: boolean;
  m: boolean;
  source: string;
}

const TransactionsTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;
  const [rowData, setRowData] = useState<Transaction[]>([]);

  const fetchData = async (page: number) => {
    try {
      const data = await fetchTransactions(page, itemsPerPage);

      if (data.status !== "success") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
        return;
      }

      setRowData(data.transactions);
      setTotalRecords(data.totalRecords); // Assuming the API returns total number of records
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleNextPage = () => {
    fetchData(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1);
    }
  };

  const columns = [
    "Date",
    "Label",
    "Amount",
    "Tag",
    "P/B",
    <LuFlag key="flag" title="Flag" />,
    <LuEyeOff key="hidden" title="Hidden" />,
    "M",
    "Source",
  ];

  const handleLabelEdit = (id: number, currentLabel: string) => {
    setEditingLabel(id);
    setNewLabel(currentLabel);
  };

  const handleLabelSave = () => {
    // Here you would typically update the data in your state or send to an API
    console.log(`Saving new label: ${newLabel} for id: ${editingLabel}`);
    setEditingLabel(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(rowData.map((t) => t.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleUpdaterow = async (
    id: number,
    key: keyof Transaction,
    value: any
  ) => {
    const transaction = rowData.find((t) => t.id === id);
    if (!transaction) {
      return;
    }
    (transaction[key] as any) = value;
    try {
      await putTransaction(id, transaction);
      setRowData((prevData) =>
        prevData.map((t) => (t.id === id ? { ...t, [key]: value } : t))
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold mb-2 sm:mb-0">Transactions</h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search transactions.."
            className="w-full sm:w-auto p-2 pl-8 border rounded border-gray-400"
          />
          <LuSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === rowData.length}
                  className="w-4 h-4"
                />
              </th>
              {columns.map((col, index) => (
                <th key={index} className="p-3 text-left font-semibold">
                  {typeof col === "string" ? (
                    col
                  ) : (
                    <div className="flex">{col}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowData.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3 flex justify-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(transaction.id)}
                    onChange={() => handleSelectRow(transaction.id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="p-3">{transaction.date}</td>
                <td className="p-3">
                  {editingLabel === transaction.id ? (
                    <div
                      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                      id="my-modal"
                    >
                      <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Edit Label
                          </h3>
                          <div className="mt-2 px-7 py-3">
                            <input
                              type="text"
                              value={newLabel}
                              onChange={(e) => setNewLabel(e.target.value)}
                              className="px-3 py-2 border rounded w-full"
                            />
                          </div>
                          <div className="flex flex-col items-start mt-3 px-7">
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="feature1"
                                className="mr-2"
                              />
                              <label htmlFor="feature1">Feature 1</label>
                            </div>
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="feature2"
                                className="mr-2"
                              />
                              <label htmlFor="feature2">Feature 2</label>
                            </div>
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="feature3"
                                className="mr-2"
                              />
                              <label htmlFor="feature3">Feature 3</label>
                            </div>
                          </div>
                          <div className="items-center px-4 py-3">
                            <button
                              id="ok-btn"
                              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                              onClick={handleLabelSave}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center underline underline-offset-4">
                      {transaction.label}
                      <button
                        onClick={() =>
                          handleLabelEdit(transaction.id, transaction.label)
                        }
                        className="ml-2"
                      >
                        <LuPencil className="text-gray-400" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-3 text-green-700">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="p-3">
                  <span className="bg-gray-100 text-black rounded-full px-2 py-1 text-sm font-medium">
                    {transaction.tag == null ? "None" : transaction.tag}
                  </span>
                </td>
                <td
                  className="p-3"
                  onClick={() =>
                    handleUpdaterow(transaction.id, "pandb", !transaction.pandb)
                  }
                >
                  <span
                    className={`rounded-full px-2 py-1 ${
                      transaction.pandb === false
                        ? "bg-green-100"
                        : "bg-blue-100"
                    } text-black text-sm hover:cursor-pointer`}
                  >
                    {transaction.pandb ? "B" : "P"}
                  </span>
                </td>
                <td
                  className="p-3 text-lg"
                  onClick={() =>
                    handleUpdaterow(transaction.id, "flag", !transaction.flag)
                  }
                >
                  <LuFlag
                    className={
                      transaction.flag ? "text-red-500" : "text-gray-400"
                    }
                  />
                </td>
                <td
                  className="p-3 text-lg"
                  onClick={() =>
                    handleUpdaterow(
                      transaction.id,
                      "hidden",
                      !transaction.hidden
                    )
                  }
                >
                  <LuEyeOff
                    className={
                      transaction.hidden ? "text-blue-500" : "text-gray-400"
                    }
                  />
                </td>
                <td
                  className="p-3"
                  onClick={() =>
                    handleUpdaterow(transaction.id, "m", !transaction.m)
                  }
                >
                  {transaction.m ? "Yes" : "No"}
                </td>
                <td className="p-3">{transaction.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="mb-2 sm:mb-0 text-sm">
          Showing{" "}
          <span className="font-bold">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-bold">
            {Math.min(currentPage * itemsPerPage, totalRecords)}
          </span>{" "}
          of <span className="font-bold">{totalRecords}</span> results
        </p>
        <div>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-black text-sm font-medium rounded border border-slate-400 mx-1 hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * itemsPerPage >= totalRecords}
            className="px-4 py-2 text-black text-sm font-medium rounded border border-slate-400 mx-1 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
