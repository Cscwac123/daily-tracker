import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote } from '../utils/storage';
import { NOTE_CATEGORIES } from '../utils/categories';
import './Notes.css';

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(getNotes);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const refresh = () => setNotes(getNotes());

  /* ── tag stats ── */
  const tagStats = useMemo(() => {
    const map = {};
    notes.forEach(n => {
      (n.tags || []).forEach(t => {
        if (t) map[t] = (map[t] || 0) + 1;
      });
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])  // most used first
      .slice(0, 20);
  }, [notes]);

  /* ── filter ── */
  const filtered = useMemo(() => {
    let list = notes;
    if (activeCategory !== 'all') {
      list = list.filter(n => n.category === activeCategory);
    }
    if (selectedTag) {
      list = list.filter(n => (n.tags || []).includes(selectedTag));
    }
    if (search.trim()) {
      const kw = search.trim().toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(kw) ||
        n.content.toLowerCase().includes(kw) ||
        (n.tags || []).some(t => t.toLowerCase().includes(kw))
      );
    }
    return list;
  }, [notes, activeCategory, selectedTag, search]);

  const handleDelete = (id) => {
    deleteNote(id);
    refresh();
    setDeleteId(null);
  };

  const formatDate = (d) => {
    if (!d) return '';
    const now = new Date();
    const date = new Date(d);
    const diff = now - date;
    if (diff < 86400000 && now.getDate() === date.getDate()) {
      return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diff < 172800000 && now.getDate() - date.getDate() === 1) {
      return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) +
      ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const getPreview = (content) => {
    if (!content) return '暂无内容';
    const plain = content
      .replace(/[#*`>\-\[\]()]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return plain.slice(0, 80) + (plain.length > 80 ? '...' : '');
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="notes-header">
        <h2 className="notes-title">学习笔记</h2>
        <button className="btn-new-note" onClick={() => navigate('/note/new')}>
          ✏️ 新建
        </button>
      </div>

      {/* Search */}
      <div className="notes-search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="搜索笔记标题、内容、标签..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Category filter */}
      <div className="note-cat-scroll">
        <button
          className={`note-cat-tag ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >全部</button>
        {NOTE_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`note-cat-tag ${activeCategory === cat.key ? 'active' : ''}`}
            style={activeCategory === cat.key ? { background: cat.color, borderColor: cat.color, color: '#fff' } : {}}
            onClick={() => setActiveCategory(cat.key)}
          >{cat.icon} {cat.label}</button>
        ))}
      </div>

      {/* ── Tag statistics ── */}
      {tagStats.length > 0 && (
        <div className="tag-stats-bar">
          <span className="tag-stats-label">🏷️ 标签</span>
          <div className="tag-stats-scroll">
            {tagStats.map(([tag, count]) => (
              <button
                key={tag}
                className={`tag-stat-chip ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                #{tag}
                <span className="tag-count">{count}</span>
              </button>
            ))}
          </div>
          {selectedTag && (
            <button className="tag-clear-btn" onClick={() => setSelectedTag(null)}>✕</button>
          )}
        </div>
      )}

      {/* Note list */}
      <div className="page-scroll note-list-scroll">
        {selectedTag && (
          <div className="active-filter-hint">
            标签 <strong>#{selectedTag}</strong> · {filtered.length} 篇笔记
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>{search || selectedTag ? '没有匹配的笔记' : '暂无笔记'}</p>
            <p className="empty-hint">点击右上角"新建"开始写笔记吧</p>
          </div>
        ) : (
          <div className="note-list">
            {filtered.map(note => {
              const cat = NOTE_CATEGORIES.find(c => c.key === note.category) || NOTE_CATEGORIES[0];
              return (
                <div
                  key={note.id}
                  className="note-card anim-fade-in"
                  onClick={() => navigate(`/note/${note.id}`)}
                >
                  <div className="note-card-top">
                    <span className="note-card-cat" style={{ background: cat.color + '18', color: cat.color }}>
                      {cat.icon} {cat.label}
                    </span>
                    <span className="note-card-date">{formatDate(note.updatedAt)}</span>
                  </div>
                  <h4 className="note-card-title">{note.title || '未命名笔记'}</h4>
                  <p className="note-card-preview">{getPreview(note.content)}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="note-card-tags">
                      {note.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`note-tag ${selectedTag === tag ? 'highlight' : ''}`}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedTag(selectedTag === tag ? null : tag);
                          }}
                        >#{tag}</span>
                      ))}
                    </div>
                  )}
                  <button
                    className="note-delete-btn"
                    onClick={e => {
                      e.stopPropagation();
                      setDeleteId(deleteId === note.id ? null : note.id);
                    }}
                  >🗑️</button>
                  {deleteId === note.id && (
                    <div className="delete-confirm anim-fade-in" onClick={e => e.stopPropagation()}>
                      <span>确定删除？</span>
                      <button className="btn-confirm-yes" onClick={() => handleDelete(note.id)}>删除</button>
                      <button className="btn-confirm-no" onClick={() => setDeleteId(null)}>取消</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
