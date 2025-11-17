import React from 'react';
import { LogOut, User } from 'lucide-react';

const HomePage: React.FC = () => {
  const handleLogout = () => {
    console.log('Logout clicked');
    // Add your logout logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MyApp</h1>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">John Doe</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome, John Doe!</h2>
          <p className="text-gray-600">This is your home page. You can add your content here.</p>
        </div>
      </main>
    </div>
  );
};
export default HomePage;
