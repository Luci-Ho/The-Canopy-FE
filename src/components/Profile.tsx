import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Star, Upload, Edit, Save, X } from 'lucide-react';
import { authApi, ApiError, UserProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ZodiacInfo {
  sign: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
}

const getZodiacSign = (birthdate: string): string => {
  const date = new Date(birthdate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let sign = '';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = 'Aquarius';
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sign = 'Pisces';
  else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = 'Aries';
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = 'Taurus';
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = 'Gemini';
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = 'Cancer';
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = 'Leo';
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = 'Virgo';
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = 'Libra';
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = 'Scorpio';
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = 'Sagittarius';
  else sign = 'Capricorn';

  return sign;
};

export const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState({
    username: '',
    birthdate: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003';

  const resolveAvatarUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${baseUrl}${url}`;
    return `${baseUrl}/${url}`;
  };

  useEffect(() => {
    if (user) {
      setProfile(user);
      setEditData({
        username: user.username || '',
        birthdate: user.birthdate || '',
      });
      
      // Fetch zodiac info if birthdate is available
      if (user.birthdate) {
        fetchZodiacInfo(user.birthdate);
      }
      
      loadChatHistory();
    }
  }, [user]);

  const fetchZodiacInfo = async (birthdate: string) => {
    try {
      const sign = getZodiacSign(birthdate);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003';
      const response = await fetch(`${baseUrl}/api/content/zodiac/${sign}`);
      const data = await response.json();
      setZodiacInfo(data);
    } catch (error) {
      console.error('Error fetching zodiac info:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const history = await authApi.getChatHistory();
      setChatHistory(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updates: Partial<UserProfile> = {};
      if (editData.username !== profile.username) updates.username = editData.username;
      if (editData.birthdate !== profile.birthdate) updates.birthdate = editData.birthdate;

      if (Object.keys(updates).length > 0) {
        const updatedProfile = await authApi.updateProfile(updates);
        setProfile(updatedProfile);
        setUser(updatedProfile);
        
        // Fetch zodiac info if birthdate was updated
        if (editData.birthdate !== profile.birthdate && editData.birthdate) {
          await fetchZodiacInfo(editData.birthdate);
        }
        
        setSuccess('Cập nhật thành công!');
      }

      if (avatarFile) {
        const uploadRes = await authApi.uploadAvatar(avatarFile);
        const avatarUrl = resolveAvatarUrl(uploadRes.avatarUrl);
        const updatedProfile = await authApi.updateProfile({ avatarUrl });
        setProfile(updatedProfile);
        setUser(updatedProfile);
        setAvatarFile(null);
        setAvatarPreviewUrl(null);
        setSuccess('Avatar đã được cập nhật!');
      }

      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreviewUrl(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-headline text-primary">Hồ sơ của bạn</h1>
          <p className="text-on-surface-variant mt-2">Quản lý thông tin cá nhân và khám phá bản thân</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-low rounded-[2rem] p-8"
        >
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {avatarPreviewUrl ? (
                  <img src={avatarPreviewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : profile.avatarUrl ? (
                  <img src={resolveAvatarUrl(profile.avatarUrl)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-primary" />
                )}
              </div>
              {editing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                  <Upload size={16} className="text-on-primary" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Tên hiển thị</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Ngày sinh</label>
                    <input
                      type="date"
                      value={editData.birthdate}
                      onChange={(e) => setEditData(prev => ({ ...prev, birthdate: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline text-on-surface">{profile.username}</h2>
                  <p className="text-on-surface-variant">{profile.email}</p>
                  {profile.birthdate && (
                    <p className="text-on-surface-variant flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(profile.birthdate).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
              )}

              {/* Zodiac Info */}
              {zodiacInfo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-secondary-container/20 rounded-xl p-4 mt-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={20} className="text-secondary" />
                    <h3 className="font-headline text-lg text-on-surface">Chòm sao: {zodiacInfo.sign}</h3>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-2">{zodiacInfo.personality}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-green-600">Điểm mạnh:</p>
                      <ul className="list-disc list-inside text-on-surface-variant">
                        {zodiacInfo.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-red-600">Điểm yếu:</p>
                      <ul className="list-disc list-inside text-on-surface-variant">
                        {zodiacInfo.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Edit Button */}
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="p-2 bg-primary text-on-primary rounded-full hover:bg-primary/80 transition-colors disabled:opacity-50"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="p-2 bg-outline text-on-surface rounded-full hover:bg-outline/80 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 bg-primary text-on-primary rounded-full hover:bg-primary/80 transition-colors"
                >
                  <Edit size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-tertiary/10 border border-tertiary/20 text-tertiary px-4 py-3 rounded-2xl text-sm mt-4"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-2xl text-sm mt-4"
            >
              {success}
            </motion.div>
          )}
        </motion.div>

        {/* Chat History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low rounded-[2rem] p-8"
        >
          <h3 className="text-xl font-headline text-on-surface mb-4">Lịch sử tương tác</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <p className="text-on-surface-variant text-center py-8">Chưa có lịch sử tương tác</p>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className="bg-surface-container-high rounded-xl p-4">
                  <p className="text-on-surface font-medium">{chat.message}</p>
                  <p className="text-on-surface-variant text-sm mt-1">
                    {new Date(chat.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};