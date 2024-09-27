import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Subheader: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Transactions');

  const tabs = ['Dashboard', 'Transactions', 'Report'];
  const rightItems = ['Tags', 'Sources', 'Members', 'Rules', 'My Account'];
  const navigate = useNavigate();

  const takeAction = (item: string) => {
    if(item === 'Logout') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/signin');
    }
  }

  return (
    <nav className="bg-[#4f46e5] text-white p-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`pb-1 ${activeTab === tab ? 'border-b-2 font-bold' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
            <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              Options
              <ChevronDownIcon
                className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />
              </Menu.Button>
            </div>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="px-1 py-1">
                {rightItems.map((item) => (
                <Menu.Item key={item}>
                  {({ active }) => (
                  <button
                    className={`${
                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => takeAction(item)}
                  >
                    {item}
                  </button>
                  )}
                </Menu.Item>
                ))}
              </div>
              </Menu.Items>
            </Transition>
            </Menu>
          <button 
            onClick={() => takeAction('Logout')}
            className="text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Subheader;