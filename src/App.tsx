import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import TransactionList from './components/TransactionList';
import UploadCSV from './components/UploadCSV';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TransactionList />} />
            <Route path="/upload" element={<UploadCSV />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;