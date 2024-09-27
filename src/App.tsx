import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TransactionsPage from './pages/TransactionsPage';
import Header from './components/Header';
import Subheader from './components/Subheader';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');


    if (accessToken && refreshToken) {
      console.log('User is authenticated');
      console.log("Auth: ", isAuthenticated);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/transactions" 
            element={
                <>
                  <Header />
                  <Subheader />
                  <TransactionsPage />
                </>
            } 
          />
          <Route path="/" element={<Navigate to="/transactions" replace />} />
          <Route path="*" element={<Navigate to="/transactions" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;