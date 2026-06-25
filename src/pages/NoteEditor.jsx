import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoteById, saveNote, deleteNote } from '../utils/storage';
import { NOTE_CATEGORIES } from '../utils/categories';
import './NoteEditor.css';

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('reading');
  const [tagsInput, setTagsInput] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const note = getNoteById(id);
      if (note) {
        setTitle(note.title || '');
        setContent(note.content || '');
        setCategory(note.category || 'reading');
        setTagsInput((note.tags || []).join(', '));
      }
    }
  }, [id, isNew]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(/[,，]/)
      .map(t => t.trim())
      .filter(Boolean);

    const note = {
      id: isNew ? Date.now().toString() : id,
      title: title.trim() || '未命名笔记',
      content,
      category,
      tags,
      createdAt: isNew ? new Date().toISOString() : (getNoteById(id)?.createdAt || new Date().toISOString()),
      updatedAt: new Date().toISOString(),
    };

    saveNote(note);
    setSaved(true);
    setTimeout(() => {
      navigate('/');
    }, 600);
  };

  const handleDelete = () => {
    if (!isNew) {
      deleteNote(id);
    }
    navigate('/');
  };

  return (
    <div className="page editor-page">
      {/* Editor header */}
      <div className="editor-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <span className="editor-title-label">{isNew ? '新建笔记' : '编辑笔记'}</span>
        <button className="btn-save" onClick={handleSave}>
          {saved ? '✅ 已保存' : '保存'}
        </button>
      </div>

      <div className="editor-body">
        {/* Title */}
        <input
          className="editor-title-input"
          type="text"
          placeholder="笔记标题..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* Category picker */}
        <div className="editor-cat-row">
          {NOTE_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`editor-cat-btn ${category === cat.key ? 'active' : ''}`}
              style={category === cat.key ? { background: cat.color, borderColor: cat.color, color: '#fff' } : {}}
              onClick={() => setCategory(cat.key)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Tags input */}
        <div className="editor-tags-row">
          <span className="field-icon">🏷️</span>
          <input
            className="editor-tags-input"
            type="text"
            placeholder="添加标签（用逗号分隔，如：React, 前端, 教程）"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
          />
        </div>

        {/* Content */}
        <textarea
          className="editor-content"
          placeholder="开始写笔记...&#10;&#10;支持 Markdown 语法：&#10;# 标题&#10;**加粗**&#10;- 列表&#10;`代码`"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        {/* Delete button */}
        {!isNew && (
          <div className="editor-footer">
            <button className="btn-delete-note" onClick={() => setShowDelete(true)}>
              🗑️ 删除笔记
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal-dialog anim-pop-in" onClick={e => e.stopPropagation()}>
            <p className="modal-text">确定要删除这条笔记吗？</p>
            <p className="modal-sub">删除后无法恢复</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-cancel" onClick={() => setShowDelete(false)}>
                取消
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={handleDelete}>
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
