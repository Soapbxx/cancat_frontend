import axios from "axios";

// https://cancat.io/

const API_BASE_URL = "https://cancat.io/api";

// const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["x-new-access-token"];
    const newRefreshToken = response.headers["x-new-refresh-token"];

    if (newAccessToken && newRefreshToken) {
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return response;
  },
  (error) => {
    // Handle unauthorized errors or implement token refresh logic here
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export const fetchTransactions = async (page: number, limit: number) => {
  try {
    const response = await api.get("/transactions", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const putTransaction = async (id:number, transaction: any) => {
  try {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

export const fetchUser = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await api.post("/signin", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signUp = async (
  email: string,
  phone: string,
  password: string
) => {
  try {
    const response = await api.post("/signup", { email, phone, password });
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post("/verifyotp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const uploadcsvfile = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload", formData);
        return response.data;
    }
    catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

export const googleSignIn = async (credentialResponse: any) => {
  try {
    const response = await api.post("/auth/google", {
      credential: credentialResponse.credential,
    });

    return response.data;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export const editTransactionLabel = async (transactionId: number, label: string, replaceAllLabel: boolean = false, applyToFuture: boolean = false) => {
  try {
    const response = await api.put(`/transactions/${transactionId}`, { label, replaceAllLabel, applyToFuture });
    return response.data;
  } catch (error) {
    console.error("Error updating transaction label:", error);
    throw error;
  }
}

export const plaidGetLinkToken = async () => {
  try {
    const response = await api.post("/create_link_token");
    return response.data;
  } catch (error) {
    console.error("Error fetching Plaid link token:", error);
    throw error;
  }
}

export const plaidSetAccessToken = async (publicToken: string, metadata: any) => {
  try {
    const response = await api.post("/set_access_token", { public_token: publicToken, institution: metadata });
    return response.data;
  } catch (error) {
    console.error("Error setting Plaid access token:", error);
    throw error;
  }
}

export const plaidGetAccounts = async () => {
  try {
    const response = await api.get("/accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching Plaid accounts:", error);
    throw error;
  }
}

export const plaidAccountsSync = async () => {
  try {
    const response = await api.post("/accounts/sync");
    return response.data;
  } catch (error) {
    console.error("Error syncing Plaid accounts:", error);
    throw error;
  }
}

export const plaidDeleteAccount = async (accountId: number) => {
  try {
    const response = await api.delete(`/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Plaid account:", error);
    throw error;
  }
}

// rules api
export const fetchRules = async () => {
  try {
    const response = await api.get("/rules");
    return response.data;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
}

export const deleteRule = async (ruleId: number) => {
  try {
    const response = await api.delete(`/rules/${ruleId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting rule:", error);
    throw error;
  }
}

export default api;
