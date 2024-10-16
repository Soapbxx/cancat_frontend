import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getInvitationDetails,
  fetchUser,
} from "../utils/api";

const AcceptInvitationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitationDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/signup", {
            state: { redirectTo: `/accept-invitation/${id}` },
          });
          return;
        }

        const data = await getInvitationDetails(id!);

        const { email: userEmail } = await fetchUser();
        if (userEmail === data.invitee.email) {
          navigate("/invite");
          return;
        } else {
          setError("This invitation is not for your account.");
        }
      } catch (err) {
        console.error("Error details:", err);
        setError(
          `Failed to load invitation details: ${(err as Error).message}`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitationDetails();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {isLoading && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      )}
      {error && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AcceptInvitationPage;
