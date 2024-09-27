import React, { useEffect, useState } from 'react';
import { fetchUser } from '../utils/api';
import { RxHamburgerMenu } from "react-icons/rx";

interface User {
  email: string;
  phone: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser();
      setUser(user);
    };
    getUser();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-[#4338ca] text-white p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <h1 className="text-xl font-bold">Cancat</h1>
        
        <button 
          className="lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <RxHamburgerMenu className="w-6 h-6 text-white"  />
        </button>

        <div className={`w-full lg:w-auto ${isMenuOpen ? 'block' : 'hidden'} lg:block mt-4 lg:mt-0`}>
          {user && (
            <div className='flex flex-col lg:flex-row lg:items-center'>
              <span className="mr-0 lg:mr-2 font-semibold">{user.email}</span>
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;