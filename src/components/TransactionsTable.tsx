import React, { useEffect, useState } from "react";
import {
  LuPencil,
  LuFlag,
  LuEyeOff,
  LuSearch,
  LuPlus,
  LuX,
} from "react-icons/lu";
import {
  fetchTransactions,
  putTransaction,
  editTransactionLabel,
  updateTransactionTag,
  fetchRules,
  deleteRule,
  getSharedTransactions,
  getTags,
  addTag,
} from "../utils/api";
import { Rules, Transaction, Tag } from "../utils/types";

interface TransactionsTableProps {
  sharedUserId?: number;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  sharedUserId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;
  const [rowData, setRowData] = useState<Transaction[]>([]);
  const [replaceAllLabel, setReplaceAllLabel] = useState(false);
  const [applyToFuture, setApplyToFuture] = useState(false);
  const [rulesData, setRulesData] = useState<Rules[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [newTagName, setNewTagName] = useState("");
  const [searchTag, setSearchTag] = useState("");

  const fetchData = async (page: number) => {
    try {
      let data;
      if (sharedUserId) {
        data = await getSharedTransactions(sharedUserId, page, itemsPerPage);
      } else {
        data = await fetchTransactions(page, itemsPerPage);
      }

      if (data.status !== "success") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
        return;
      }

      setRowData(data.transactions);
      setTotalRecords(data.totalRecords);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchRulesData = async () => {
    try {
      const data = await fetchRules();
      setRulesData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteRuleData = async (id: number) => {
    try {
      await deleteRule(id);
      await fetchRulesData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getTags();
      console.log("Tags:", data);
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleAddCustomTag = async () => {
    if (newTagName.trim()) {
      try {
        const newTag = await addTag(newTagName);
        setTags([...tags, newTag]);
        handleTagChange(selectedTransactionId!, newTag.id);
        setNewTagName("");
      } catch (error) {
        console.error("Error adding custom tag:", error);
      }
    }
  };

  const handleTagChange = async (
    transactionId: number,
    tagId: number
  ) => {
    try {
      await updateTransactionTag(transactionId, tagId);
      fetchData(currentPage);
      setShowTagDialog(false);
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const openTagDialog = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setShowTagDialog(true);
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTag.toLowerCase())
  );

  useEffect(() => {
    fetchData(1);
    fetchRulesData();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [sharedUserId]);

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

  const handleLabelSave = async () => {
    if (editingLabel !== null) {
      try {
        await editTransactionLabel(
          editingLabel,
          newLabel,
          replaceAllLabel,
          applyToFuture
        );

        // Reset state
        setEditingLabel(null);
        setNewLabel("");
        setReplaceAllLabel(false);
        setApplyToFuture(false);

        // Refresh data
        fetchData(currentPage);
        fetchRulesData();
      } catch (error) {
        console.error("Error updating label:", error);
      }
    }
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
    <>
      <div className="w-full p-4 bg-white rounded shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-bold mb-2 sm:mb-0">
            {sharedUserId ? `Shared Transactions` : "Your Transactions"}
          </h2>
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
                    {!sharedUserId && (
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(transaction.id)}
                        onChange={() => handleSelectRow(transaction.id)}
                        className="w-4 h-4"
                      />
                    )}
                  </td>
                  <td className="p-3">{transaction.date}</td>
                  <td className="p-3">
                    {editingLabel === transaction.id && !sharedUserId ? (
                      <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                        id="my-modal"
                      >
                        <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white">
                          <div className="mt-3 text-center">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Edit Label
                              </h3>
                              <span
                                className="text-gray-500 text-sm hover:cursor-pointer"
                                onClick={() => {
                                  setEditingLabel(null);
                                  setNewLabel("");
                                }}
                              >
                                X
                              </span>
                            </div>
                            <div className="flex flex-col items-start mt-3 px-7">
                              <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                className="px-2 py-1 border rounded w-full mb-2"
                                placeholder="Edit label"
                              />
                              <div className="mb-2">
                                <input
                                  type="checkbox"
                                  id="replaceAll"
                                  className="mr-2"
                                  checked={replaceAllLabel}
                                  onChange={(e) =>
                                    setReplaceAllLabel(e.target.checked)
                                  }
                                />
                                <label htmlFor="replaceAll">
                                  Update all transactions with new label
                                </label>
                              </div>
                              <div className="mb-2">
                                <input
                                  type="checkbox"
                                  id="applyFuture"
                                  className="mr-2"
                                  checked={applyToFuture}
                                  onChange={(e) =>
                                    setApplyToFuture(e.target.checked)
                                  }
                                />
                                <label htmlFor="applyFuture">
                                  Apply to future transactions
                                </label>
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
                      <div className="flex items-center">
                        {transaction.custom ? (
                          <div className="flex items-center underline underline-offset-4">
                            <span className="relative group">
                              {transaction.custom}
                              <span className="absolute w-max left-0 bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1">
                                {transaction.label}
                              </span>
                            </span>
                            {!sharedUserId && (
                              <button
                                onClick={() =>
                                  handleLabelEdit(
                                    transaction.id,
                                    transaction.custom ?? transaction.label
                                  )
                                }
                                className="ml-2"
                              >
                                <LuPencil className="text-gray-400" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {transaction.label}
                            {!sharedUserId && (
                              <button
                                onClick={() =>
                                  handleLabelEdit(
                                    transaction.id,
                                    transaction.label
                                  )
                                }
                                className="ml-2"
                              >
                                <LuPencil className="text-gray-400" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-green-700">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span
                      className="bg-gray-100 text-black rounded-full px-2 py-1 text-sm font-medium cursor-pointer"
                      onClick={() => openTagDialog(transaction.id)}
                    >
                      {transaction.tag ? transaction.tag.name : "None"}
                    </span>
                  </td>
                  <td
                    className="p-3"
                    onClick={() =>
                      handleUpdaterow(
                        transaction.id,
                        "pandb",
                        !transaction.pandb
                      )
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
      {!sharedUserId && (
        <div className="w-full p-4 bg-white rounded shadow mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-bold mb-2 sm:mb-0">Rules</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Label</th>
                  <th className="p-3 text-left">Nickname</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rulesData.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3 text-left">{rule.label}</td>
                    <td className="p-3 text-left">{rule.nickname}</td>
                    <td className="p-3 text-left">
                      <button
                        onClick={() => deleteRuleData(rule.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showTagDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select or Add Tag</h3>
              <button
                onClick={() => setShowTagDialog(false)}
                className="text-gray-500"
              >
                <LuX />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="max-h-60 overflow-y-auto mb-4">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                  onClick={() =>
                    handleTagChange(selectedTransactionId!, parseInt(tag.id))
                  }
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="New tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-grow p-2 border rounded-l"
              />
              <button
                onClick={handleAddCustomTag}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                <LuPlus />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionsTable;
