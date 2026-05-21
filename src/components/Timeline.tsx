import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { chatApi, ChatSessionDetail, ChatSessionSummary } from '../services/api';
import { Clock3, MessagesSquare, ArrowRight } from 'lucide-react';

export const Timeline: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await chatApi.getSessions();
        setSessions(data);
      } catch (err) {
        setError('Không thể tải lịch sử tương tác.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const openSession = async (sessionId: string) => {
    setDetailLoading(true);
    setError('');
    try {
      const detail = await chatApi.getSession(sessionId);
      setSelectedSession(detail);
    } catch (err) {
      setError('Không thể mở chi tiết phiên này.');
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline text-primary">Dòng thời gian</h1>
        <p className="text-on-surface-variant mt-2">Xem lại những phiên chat đã lưu và truy xuất lại ký ức.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-surface-container-low rounded-[2rem] p-6 shadow-lg shadow-primary/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
              <Clock3 size={20} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-secondary">Phiên đã lưu</p>
              <p className="font-medium text-on-surface-variant text-sm">{sessions.length} phiên gần đây</p>
            </div>
          </div>

          {loading ? (
            <p className="text-on-surface-variant">Đang tải...</p>
          ) : error ? (
            <p className="text-negative">{error}</p>
          ) : sessions.length === 0 ? (
            <p className="text-on-surface-variant">Chưa có lịch sử tương tác.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <button
                  key={session._id}
                  type="button"
                  onClick={() => openSession(session._id)}
                  className="w-full text-left p-4 rounded-3xl border border-outline hover:border-primary/40 transition-colors bg-background"
                >
                  <div className="font-semibold text-on-surface">{session.title || 'Phiên Oracle'}</div>
                  <div className="text-xs text-on-surface-variant mt-2">
                    {new Date(session.updatedAt).toLocaleString('vi-VN')} · {session.messageCount} tin nhắn
                  </div>
                  <div className="text-sm text-on-surface-variant mt-3 line-clamp-2">{session.lastSnippet}</div>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-surface-container-low rounded-[2rem] p-6 shadow-lg shadow-primary/5 min-h-[400px]"
        >
          {detailLoading ? (
            <p className="text-on-surface-variant">Đang tải phiên...</p>
          ) : selectedSession ? (
            <>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-headline text-on-surface">{selectedSession.title || 'Phiên Oracle'}</h2>
                  <p className="text-sm text-on-surface-variant">Cập nhật: {new Date(selectedSession.updatedAt).toLocaleString('vi-VN')}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-secondary text-sm">
                  <MessagesSquare size={18} />
                  {selectedSession.messageCount} tin nhắn
                </div>
              </div>
              <div className="space-y-4">
                {selectedSession.messages.map((message, idx) => (
                  <div key={`${message.role}-${idx}`} className={message.role === 'user' ? 'bg-primary/10 rounded-3xl p-5' : 'bg-surface-container-high rounded-3xl p-5'}>
                    <div className="text-xs uppercase tracking-[0.3em] font-semibold mb-2 text-secondary">{message.role === 'user' ? 'Bạn' : 'Linh hồn cây'}</div>
                    <p className="whitespace-pre-line text-on-surface">{message.text}</p>
                    {message.timestamp && <p className="text-[10px] text-on-surface-variant mt-3">{message.timestamp}</p>}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant">
              <p className="mb-4">Chọn một phiên để xem chi tiết nội dung trò chuyện.</p>
              <p className="inline-flex items-center gap-2 px-6 py-4 rounded-3xl bg-surface-container-high text-sm text-secondary">
                <ArrowRight size={18} /> Chọn phiên bên trái để mở
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
