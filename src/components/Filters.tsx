import React, { useState, useRef } from "react";
import { uploadcsvfile } from "../utils/api";

interface Member {
  id: string;
  name: string;
}

interface Source {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
  count: number;
}

const Filters: React.FC = () => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>(["all"]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedUploadMember, setSelectedUploadMember] = useState<string>("");
  const [uploadSource, setUploadSource] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data (replace with actual data from your API)
  const members: Member[] = [
    { id: "all", name: "All" },
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
  ];

  const sources: Source[] = [
    { id: "all", name: "All" },
    { id: "1", name: "Bank A" },
    { id: "2", name: "Bank B" },
    { id: "3", name: "Cash" },
  ];

  const tags: Tag[] = [
    { id: "1", name: "Food", count: 15 },
    { id: "2", name: "Transport", count: 8 },
    { id: "3", name: "Entertainment", count: 5 },
    { id: "4", name: "Bills", count: 12 },
  ];

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers((prev) =>
      memberId === "all"
        ? ["all"]
        : prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev.filter((id) => id !== "all"), memberId]
    );
  };

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedUploadMember && uploadSource && selectedFile) {
      // Here you would typically send the file to your server along with the selected member and source
      console.log("Uploading file:", selectedFile.name);
      console.log("Selected Member:", selectedUploadMember);
      console.log("Source:", uploadSource);

      const data = await uploadcsvfile(selectedFile)

      if (data.status === "success") {
        alert("File uploaded successfully!");
        setSelectedUploadMember("");
        setUploadSource("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      alert(
        "Please select a member, enter a source, and choose a file before uploading."
      );
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
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

      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Members */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Members</h3>
        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => handleMemberToggle(member.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedMembers.includes(member.id)
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {member.name}
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
            className="w-full p-2 border rounded"
            value={startDate?.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={endDate?.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
      </div>

      {/* Sources */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Sources</h3>
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center">
              <input
                type="checkbox"
                id={`source-${source.id}`}
                checked={selectedSources.includes(source.id)}
                onChange={() => handleSourceToggle(source.id)}
                className="mr-2"
              />
              <label htmlFor={`source-${source.id}`}>{source.name}</label>
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
