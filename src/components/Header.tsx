import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-blue-200">Transactions</Link>
          </li>
          <li>
            <Link to="/upload" className="hover:text-blue-200">Upload CSV</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;