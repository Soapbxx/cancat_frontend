import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Subheader: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Transactions");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tabs = ["Dashboard", "Transactions", "Connection", "Invite", "Profile"];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.slice(1);
    const matchingTab = tabs.find((tab) => tab.toLowerCase() === path);
    if (matchingTab) {
      setActiveTab(matchingTab);
    }
  }, [location]);

  const takeAction = (item: string) => {
    if (item === "Logout") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/signin");
    }
  };

  return (
    <nav className="bg-[#4f46e5] text-white p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-auto md:hidden flex justify-between items-center mb-4 md:mb-0">
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Menu
          </button>
        </div>
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto`}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`pb-1 ${
                activeTab === tab ? "border-b-2 font-bold" : ""
              }`}
              onClick={() => {
                setActiveTab(tab);
                navigate(`/${tab.toLowerCase()}`);
                setIsMenuOpen(false);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => takeAction("Logout")}
          className="text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Subheader;
