import React, { useState, useEffect } from "react";
import { plaidGetAccounts, getMembers } from "../utils/api";
import { Account } from "../utils/types";

interface FilterProps {
  setSelectedMemberId: (memberId: number | null) => void;
}

interface Member {
  id: string;
  inviterId: string;
  inviter: {
    name: string;
    email: string;
  };
}

interface Tag {
  id: string;
  name: string;
  count: number;
}

const Filters: React.FC<FilterProps> = ({ setSelectedMemberId }) => {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>(["all"]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

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

  const getMembersData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMembers();
      console.log("Members data:", response);

      setMembers(response);
    } catch (err) {
      setError("Failed to fetch members");
      console.error("Error fetching members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAccounts();
    getMembersData();
    console.log("is loading", isLoading);
    console.log("error", error);
  }, []);

  const tags: Tag[] = [
    { id: "1", name: "Food", count: 15 },
    { id: "2", name: "Transport", count: 8 },
    { id: "3", name: "Entertainment", count: 5 },
    { id: "4", name: "Bills", count: 12 },
  ];

  const handleMemberToggle = (memberId: number) => {
    setSelectedMember((prev) => (prev === memberId ? null : memberId));
  };

  useEffect(() => {
    setSelectedMemberId(selectedMember);
    console.log("Selected Member:", selectedMember);
  }, [selectedMember]);

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources((prev) =>
      sourceId === "all"
        ? ["all"]
        : prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev.filter((id) => id !== "all"), sourceId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Members */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Members</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedMember(null);
              setSelectedMemberId(null);
            }}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedMember === null
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            My Transactions
          </button>
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => handleMemberToggle(Number(member.inviterId))}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedMember === Number(member.inviterId)
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {member.inviter.name || member.inviter.email}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Date Range</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            className="w-full sm:w-1/2 p-2 border rounded"
            value={startDate?.toISOString().split("T")[0] || ""}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          <input
            type="date"
            className="w-full sm:w-1/2 p-2 border rounded"
            value={endDate?.toISOString().split("T")[0] || ""}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
      </div>

      {/* Sources */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Sources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center">
              <input
                type="checkbox"
                id={`source-${account.id}`}
                checked={selectedSources.includes(account.id.toString())}
                onChange={() => handleSourceToggle(account.id.toString())}
                className="mr-2"
              />
              <label htmlFor={`source-${account.id}`}>{account.name}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag.id)
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {tag.name} ({tag.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
