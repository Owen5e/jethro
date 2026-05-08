import { motion } from 'framer-motion';
import { Edit2, Lock, LogOut, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('sermons');
  const [password, setPassword] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - in production this would authenticate against a backend
    if (password === 'admin123') {
      setIsLoggedIn(true);
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-16 md:py-24"
        >
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif">
              Admin Dashboard
            </h1>
          </div>
        </motion.section>

        <motion.section
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate="visible"
          className="py-16 md:py-24 bg-white min-h-screen flex items-center"
        >
          <div className="container mx-auto px-4 max-w-md">
            <motion.div
              variants={fadeInUp}
              className="bg-[#f8f9fa] p-8 rounded-lg shadow-lg"
            >
              <div className="flex justify-center mb-6">
                <Lock size={48} className="text-[#e94560]" />
              </div>
              <h2 className="text-2xl font-bold text-center text-[#1a1a2e] mb-6">
                Admin Login
              </h2>
              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <label className="block text-[#1a1a2e] font-semibold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                    placeholder="Enter admin password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#e94560] hover:bg-[#d43d4f] text-white py-2 rounded-lg font-bold transition"
                >
                  Login
                </button>
              </form>
              <p className="text-center text-gray-600 text-sm mt-4">
                Demo password: admin123
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-16"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold font-serif">Admin Dashboard</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d43d4f] px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-8 bg-white border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex gap-4 flex-wrap">
            {['sermons', 'events', 'ministries', 'testimonials'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab
                    ? 'bg-[#e94560] text-white'
                    : 'bg-[#f8f9fa] text-[#1a1a2e] hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-16 bg-[#f8f9fa] min-h-screen"
      >
        <div className="container mx-auto px-4">
          <motion.button
            variants={fadeInUp}
            className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d43d4f] text-white px-6 py-2 rounded-lg font-semibold transition mb-8"
          >
            <Plus size={20} />
            Add New {activeTab.slice(0, -1)}
          </motion.button>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f9fa] border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1a1a2e]">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1a1a2e]">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1a1a2e]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#1a1a2e]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((item) => (
                  <tr
                    key={item}
                    className="border-b hover:bg-[#f8f9fa] transition"
                  >
                    <td className="px-6 py-4 text-[#1a1a2e]">
                      Sample {activeTab} {item}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      2024-05-{String(10 + item).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button className="text-[#0f3460] hover:text-[#e94560] transition">
                          <Edit2 size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-700 transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
