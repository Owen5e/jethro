import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Edit2,
  FileText,
  Lock,
  LogOut,
  Mic,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  blogApi,
  booksApi,
  eventsApi,
  sermonsApi,
  uploadApi,
} from '../lib/api';

type TabType = 'events' | 'sermons' | 'books' | 'blog';

interface FormData {
  [key: string]: any;
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_token', password);
    setIsLoggedIn(true);
    setPassword('');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setData([]);
  };

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'sermons', label: 'Sermons', icon: Mic },
    { key: 'books', label: 'Books', icon: BookOpen },
    { key: 'blog', label: 'Blog', icon: FileText },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      let result;
      switch (activeTab) {
        case 'events':
          result = await eventsApi.getAll();
          break;
        case 'sermons':
          result = await sermonsApi.getAll();
          break;
        case 'books':
          result = await booksApi.getAll();
          break;
        case 'blog':
          result = await blogApi.getAll();
          break;
      }
      setData(result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, activeTab]);

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      switch (activeTab) {
        case 'events':
          await eventsApi.delete(id);
          break;
        case 'sermons':
          await sermonsApi.delete(id);
          break;
        case 'books':
          await booksApi.delete(id);
          break;
        case 'blog':
          await blogApi.delete(id);
          break;
      }
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleFileUpload = async (file: File, bucket: string) => {
    setUploading(true);
    try {
      const result = await uploadApi.upload(file, bucket);
      return result.url;
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Upload any pending file uploads first
    const updatedFormData = { ...formData };

    try {
      // Check for header image file (blog)
      if (
        updatedFormData._headerImageFile &&
        updatedFormData._headerImageFile instanceof File
      ) {
        const url = await handleFileUpload(
          updatedFormData._headerImageFile,
          'blog-images',
        );
        if (url) {
          updatedFormData.header_image = url;
        }
        delete updatedFormData._headerImageFile;
      }

      // Check for additional images (blog)
      if (
        Array.isArray(updatedFormData._additionalImages) &&
        updatedFormData._additionalImages.length > 0
      ) {
        const imageUrls: string[] = [];
        for (const file of updatedFormData._additionalImages) {
          if (file instanceof File) {
            const url = await handleFileUpload(file, 'blog-images');
            if (url) {
              imageUrls.push(url);
            }
          }
        }
        if (imageUrls.length > 0) {
          updatedFormData.images = imageUrls;
        }
        delete updatedFormData._additionalImages;
      }

      // Check for image files that need uploading (events/books)
      if (
        updatedFormData._imageFile &&
        updatedFormData._imageFile instanceof File
      ) {
        const bucket = `${activeTab.slice(0, -1)}-images`;
        const url = await handleFileUpload(updatedFormData._imageFile, bucket);
        if (url) {
          updatedFormData.image_url = url;
        }
        delete updatedFormData._imageFile;
      }

      // Check for audio files
      if (
        updatedFormData._audioFile &&
        updatedFormData._audioFile instanceof File
      ) {
        const bucket = `${activeTab.slice(0, -1)}-audio`;
        const url = await handleFileUpload(updatedFormData._audioFile, bucket);
        if (url) {
          updatedFormData.audio_url = url;
        }
        delete updatedFormData._audioFile;
      }

      // Check for video files
      if (
        updatedFormData._videoFile &&
        updatedFormData._videoFile instanceof File
      ) {
        const bucket = `${activeTab.slice(0, -1)}-video`;
        const url = await handleFileUpload(updatedFormData._videoFile, bucket);
        if (url) {
          updatedFormData.video_url = url;
        }
        delete updatedFormData._videoFile;
      }

      if (editingId) {
        switch (activeTab) {
          case 'events':
            await eventsApi.update(editingId, updatedFormData);
            break;
          case 'sermons':
            await sermonsApi.update(editingId, updatedFormData);
            break;
          case 'books':
            await booksApi.update(editingId, updatedFormData);
            break;
          case 'blog':
            await blogApi.update(editingId, updatedFormData);
            break;
        }
      } else {
        switch (activeTab) {
          case 'events':
            await eventsApi.create(updatedFormData);
            break;
          case 'sermons':
            await sermonsApi.create(updatedFormData);
            break;
          case 'books':
            await booksApi.create(updatedFormData);
            break;
          case 'blog':
            await blogApi.create(updatedFormData);
            break;
        }
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const renderFileInput = (
    label: string,
    field: string,
    accept: string,
    bucket: string,
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 bg-[#f8f9fa] border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
          <Upload size={18} className="text-[#e94560]" />
          <span className="text-sm text-gray-600">
            {formData[field] instanceof File
              ? (formData[field] as File).name
              : formData[field]
                ? 'Replace file'
                : 'Choose file'}
          </span>
          <input
            type="file"
            accept={accept}
            onChange={(e) =>
              handleFileChange(field, e.target.files?.[0] || null)
            }
            className="hidden"
          />
        </label>
        {formData[field] instanceof File && (
          <button
            type="button"
            onClick={() => handleFileChange(field, null)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Clear
          </button>
        )}
      </div>
      {formData[`_${field}Preview`] && (
        <img
          src={formData[`_${field}Preview`]}
          alt="Preview"
          className="mt-2 h-20 rounded object-cover"
        />
      )}
    </div>
  );

  const renderFormFields = () => {
    switch (activeTab) {
      case 'events':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            {renderFileInput('Image', '_imageFile', 'image/*', 'event-images')}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time || ''}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Location *
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
          </>
        );
      case 'sermons':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Author *
              </label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                  Category *
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) =>
                    handleInputChange('category', e.target.value)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                >
                  <option value="">Select category</option>
                  <option value="Faith">Faith</option>
                  <option value="Love">Love</option>
                  <option value="Purpose">Purpose</option>
                  <option value="Purity">Purity</option>
                  <option value="Deliverance">Deliverance</option>
                  <option value="Prayer">Prayer</option>
                  <option value="Prosperity">Prosperity</option>
                  <option value="Worship">Worship</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            {renderFileInput('Audio', '_audioFile', 'audio/*', 'sermon-audio')}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Video URL
              </label>
              <input
                type="url"
                value={formData.video_url || ''}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                placeholder="https://youtube.com/..."
              />
            </div>
          </>
        );
      case 'books':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Author *
              </label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            {renderFileInput('Image', '_imageFile', 'image/*', 'book-images')}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Link/URL *
              </label>
              <input
                type="url"
                value={formData.link_url || ''}
                onChange={(e) => handleInputChange('link_url', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                placeholder="https://..."
              />
            </div>
          </>
        );
      case 'blog':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
              />
            </div>
            {renderFileInput(
              'Header Image',
              '_headerImageFile',
              'image/*',
              'blog-images',
            )}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Additional Images
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 bg-[#f8f9fa] border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
                  <Upload size={18} className="text-[#e94560]" />
                  <span className="text-sm text-gray-600">Choose images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleInputChange('_additionalImages', files);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {Array.isArray(formData._additionalImages) &&
                formData._additionalImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData._additionalImages.map((file: File, i: number) => (
                      <div key={i} className="relative">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const remaining = [...formData._additionalImages];
                            remaining.splice(i, 1);
                            handleInputChange('_additionalImages', remaining);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              {Array.isArray(formData.images) &&
                formData.images.length > 0 &&
                !formData._additionalImages && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images.map((url: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >
                        Image {i + 1}
                      </span>
                    ))}
                  </div>
                )}
            </div>
            {renderFileInput('Audio', '_audioFile', 'audio/*', 'blog-audio')}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Video URL
              </label>
              <input
                type="url"
                value={formData.video_url || ''}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-1">
                Testimonies (one per line)
              </label>
              <textarea
                value={
                  Array.isArray(formData.testimonies)
                    ? formData.testimonies.join('\n')
                    : formData.testimonies || ''
                }
                onChange={(e) =>
                  handleInputChange(
                    'testimonies',
                    e.target.value.split('\n').filter((t: string) => t.trim()),
                  )
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                placeholder="Enter each testimony on a new line"
              />
            </div>
          </>
        );
    }
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'events':
        return ['Image', 'Title', 'Date', 'Time', 'Location', 'Actions'];
      case 'sermons':
        return ['Title', 'Author', 'Date', 'Category', 'Actions'];
      case 'books':
        return ['Image', 'Title', 'Author', 'Link', 'Actions'];
      case 'blog':
        return ['Image', 'Title', 'Created', 'Actions'];
    }
  };

  const renderTableRow = (item: any) => {
    switch (activeTab) {
      case 'events':
        return (
          <>
            <td className="px-6 py-4">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-12 w-16 object-cover rounded"
                />
              ) : (
                <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                  No img
                </div>
              )}
            </td>
            <td className="px-6 py-4 text-[#1a1a2e] font-medium">
              {item.title}
            </td>
            <td className="px-6 py-4 text-gray-600">{item.date}</td>
            <td className="px-6 py-4 text-gray-600">{item.time}</td>
            <td className="px-6 py-4 text-gray-600">{item.location}</td>
          </>
        );
      case 'sermons':
        return (
          <>
            <td className="px-6 py-4 text-[#1a1a2e] font-medium">
              {item.title}
            </td>
            <td className="px-6 py-4 text-gray-600">{item.author}</td>
            <td className="px-6 py-4 text-gray-600">{item.date}</td>
            <td className="px-6 py-4">
              <span className="bg-[#e94560] text-white px-3 py-1 rounded text-sm">
                {item.category}
              </span>
            </td>
          </>
        );
      case 'books':
        return (
          <>
            <td className="px-6 py-4">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-12 w-16 object-cover rounded"
                />
              ) : (
                <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                  No img
                </div>
              )}
            </td>
            <td className="px-6 py-4 text-[#1a1a2e] font-medium">
              {item.title}
            </td>
            <td className="px-6 py-4 text-gray-600">{item.author}</td>
            <td className="px-6 py-4">
              <a
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0f3460] hover:text-[#e94560] underline text-sm"
              >
                View
              </a>
            </td>
          </>
        );
      case 'blog':
        return (
          <>
            <td className="px-6 py-4">
              {item.header_image ? (
                <img
                  src={item.header_image}
                  alt={item.title}
                  className="h-12 w-16 object-cover rounded"
                />
              ) : (
                <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                  No img
                </div>
              )}
            </td>
            <td className="px-6 py-4 text-[#1a1a2e] font-medium">
              {item.title}
            </td>
            <td className="px-6 py-4 text-gray-600">
              {new Date(item.created_at).toLocaleDateString()}
            </td>
          </>
        );
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
                    API Key
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e94560]"
                    placeholder="Enter your admin API key"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#e94560] hover:bg-[#d43d4f] text-white py-2 rounded-lg font-bold transition"
                >
                  Login
                </button>
              </form>
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
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d43d4f] px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </motion.section>

      {/* Tab Navigation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-8 bg-white border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex gap-4 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setShowForm(false);
                }}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-[#e94560] text-white'
                    : 'bg-[#f8f9fa] text-[#1a1a2e] hover:bg-gray-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {showForm ? (
            /* Form Modal */
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a2e]">
                  {editingId ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-[#e94560] transition"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {renderFormFields()}
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-[#e94560] hover:bg-[#d43d4f] text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {uploading
                      ? 'Uploading...'
                      : editingId
                        ? 'Update'
                        : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 hover:bg-gray-300 text-[#1a1a2e] px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <>
              {/* Add Button */}
              <motion.button
                variants={fadeInUp}
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-[#e94560] hover:bg-[#d43d4f] text-white px-6 py-2 rounded-lg font-semibold transition mb-8"
              >
                <Plus size={20} />
                Add New {activeTab.slice(0, -1)}
              </motion.button>

              {/* Data Table */}
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading...
                  </div>
                ) : data.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No {activeTab} found. Click "Add New{' '}
                    {activeTab.slice(0, -1)}" to create one.
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-[#f8f9fa] border-b">
                      <tr>
                        {renderTableHeaders().map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-sm font-semibold text-[#1a1a2e]"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b hover:bg-[#f8f9fa] transition"
                        >
                          {renderTableRow(item)}
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-[#0f3460] hover:text-[#e94560] transition"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-700 transition"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </motion.section>
    </div>
  );
}
