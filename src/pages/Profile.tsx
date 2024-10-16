import React, { useEffect, useState } from 'react';
import { fetchUser, updateUser } from '../utils/api';
import { FaEnvelope, FaPhone, FaUser, FaCheck, FaTimes, FaCamera } from 'react-icons/fa';
import defaultProfilePicture from '../assets/default_profile.png';

interface User {
  name: string;
  email: string;
  phone: string;
  picture: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const [editedPicture, setEditedPicture] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    getUser();
  }, []);

  const handleEditClick = (field: 'name' | 'picture') => {
    if (field === 'name') {
      setIsEditing(true);
      setEditedName(user?.name || '');
    } else {
      setIsEditingPicture(true);
      setEditedPicture(user?.picture || '');
    }
  };

  const handleCancelEdit = (field: 'name' | 'picture') => {
    if (field === 'name') {
      setIsEditing(false);
    } else {
      setIsEditingPicture(false);
    }
  };

  const handleSubmitEdit = async (field: 'name' | 'picture') => {
    if (!user) return;

    let updatedUser: User;
    if (field === 'name') {
      if (editedName.trim() === '' || editedName === user.name) {
        setIsEditing(false);
        return;
      }
      updatedUser = { ...user, name: editedName };
    } else {
      if (editedPicture.trim() === '' || editedPicture === user.picture) {
        setIsEditingPicture(false);
        return;
      }
      updatedUser = { ...user, picture: editedPicture };
    }

    try {
      await updateUser(updatedUser.name, updatedUser.picture);
      setUser(updatedUser);
      setIsEditing(false);
      setIsEditingPicture(false);
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  const displayUser = user || { name: '', email: '', phone: '', picture: '' };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-[#4338ca] h-32"></div>
          <div className="px-4 py-5 sm:px-6 -mt-16 flex flex-col items-center">
            <div className="relative">
              <img
                className="h-32 w-32 rounded-full ring-4 ring-white"
                src={displayUser.picture || defaultProfilePicture}
                alt={displayUser.name || 'Profile Picture'}
              />
              <button
                onClick={() => handleEditClick('picture')}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md"
              >
                <FaCamera className="text-gray-600" />
              </button>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{displayUser.name}</h1>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaEnvelope className="mr-2" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{displayUser.email}</dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaPhone className="mr-2" />
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{displayUser.phone}</dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaUser className="mr-2" />
                  Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                      />
                      <button
                        onClick={() => handleSubmitEdit('name')}
                        className="ml-2 text-green-600 hover:text-green-900"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleCancelEdit('name')}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      {displayUser.name}
                      <button
                        className="ml-4 text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleEditClick('name')}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </dd>
              </div>
              {isEditingPicture && (
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FaCamera className="mr-2" />
                    Picture URL
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <input
                      type="text"
                      value={editedPicture}
                      onChange={(e) => setEditedPicture(e.target.value)}
                      className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                    />
                    <button
                      onClick={() => handleSubmitEdit('picture')}
                      className="ml-2 text-green-600 hover:text-green-900"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleCancelEdit('picture')}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      <FaTimes />
                    </button>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;