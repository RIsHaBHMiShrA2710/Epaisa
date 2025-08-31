// src/components/WritingArticle/ArticleFormPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../../authContext';
import { modules, formats } from './modulesConfig';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './ArticleFormPage.css';

const API =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_BACKEND_URL;

export default function ArticleFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [error, setError] = useState('');
  const [tagError, setTagError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const MAX_TAGS = 5;
  const MAX_ABSTRACT_WORDS = 70;
  const MIN_CONTENT_WORDS = 200;

  // Enhanced word counting function
  const countWords = useCallback((text) => {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    return cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  }, []);

  // Memoized word counts
  const abstractWordCount = useMemo(() => countWords(abstractText), [abstractText, countWords]);
  const contentWordCount = useMemo(() => countWords(content), [content, countWords]);

  // Enhanced file preview with drag and drop
  const handleFileChange = useCallback((file) => {
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB');
      return;
    }
    
    setThumbFile(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setThumbPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const onFile = (e) => handleFileChange(e.target.files?.[0]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  }, [handleFileChange]);

  // Enhanced tag management
  const addTag = useCallback((name) => {
    const val = name.trim();
    if (!val) return;
    
    if (tags.length >= MAX_TAGS) {
      setTagError(`Maximum ${MAX_TAGS} tags allowed`);
      return;
    }
    
    if (/\s/.test(val)) {
      setTagError('Tags cannot contain spaces');
      return;
    }
    
    if (val.length > 20) {
      setTagError('Tags must be 20 characters or less');
      return;
    }
    
    if (tags.some((t) => t.toLowerCase() === val.toLowerCase())) {
      setTagError('Tag already exists');
      return;
    }
    
    setTags(prev => [...prev, val]);
    setTagError('');
  }, [tags]);

  const removeTag = useCallback((i) => {
    setTags(prev => prev.filter((_, idx) => idx !== i));
    setTagError('');
  }, []);

  // Enhanced tag input with better UX
  const handleTagKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(e.currentTarget.value);
      e.currentTarget.value = '';
    } else if (e.key === 'Backspace' && !e.currentTarget.value && tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(tags.length - 1);
    }
  }, [addTag, removeTag, tags.length]);

  // Prefill data for edit mode
  useEffect(() => {
    if (!isEdit || !token || !user?.id) return;

    const ac = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const { data } = await axios.get(`${API}/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ac.signal,
        });

        if (data.user_id !== user.id) {
          alert('You can only edit your own articles.');
          navigate('/dashboard');
          return;
        }

        setTitle(data.title || '');
        setAbstractText(data.abstract || '');
        setContent(data.content || '');

        // Robust tag parsing
        const parsedTags = Array.isArray(data.tags)
          ? data.tags
          : typeof data.tags === 'string'
            ? (() => { 
                try { 
                  return JSON.parse(data.tags || '[]'); 
                } catch { 
                  return []; 
                } 
              })()
            : [];
        setTags(parsedTags);

        setThumbPreview(data.thumbnail_url || '');
      } catch (e) {
        if (axios.isCancel(e)) return;
        const status = e?.response?.status;
        if (status === 401) setError('Unauthorized access');
        else if (status === 404) setError('Article not found');
        else setError('Failed to load article');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [isEdit, id, token, user?.id, navigate]);

  // Enhanced form submission
  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    // Clear previous errors
    setError('');

    // Enhanced validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long');
      return;
    }

    if (abstractWordCount > MAX_ABSTRACT_WORDS) {
      setError(`Abstract must be ${MAX_ABSTRACT_WORDS} words or less (currently ${abstractWordCount} words)`);
      return;
    }

    if (contentWordCount < MIN_CONTENT_WORDS) {
      setError(`Content must be at least ${MIN_CONTENT_WORDS} words (currently ${contentWordCount} words)`);
      return;
    }

    if (!abstractText.trim()) {
      setError('Abstract is required');
      return;
    }

    setSubmitting(true);

    // Auto-add "edited" tag for edits
    const finalTags =
      isEdit && !tags.some((t) => t.toLowerCase() === 'edited')
        ? [...tags, 'edited']
        : tags;

    const form = new FormData();
    form.append('title', title.trim());
    form.append('abstract', abstractText.trim());
    form.append('content', content);
    form.append('tags', JSON.stringify(finalTags));
    if (thumbFile) form.append('thumbnail', thumbFile);

    const url = isEdit ? `${API}/api/articles/${id}` : `${API}/api/articles`;
    const method = isEdit ? 'put' : 'post';

    try {
      const { data } = await axios({
        url,
        method,
        headers: { Authorization: `Bearer ${token}` },
        data: form,
      });
      
      // Success animation before navigation
      const successMsg = isEdit ? 'Article updated successfully!' : 'Article created successfully!';
      setError(''); // Clear any previous errors
      
      // Small delay to show success state
      setTimeout(() => {
        navigate(`/blog/${data.id}`);
      }, 500);
      
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.statusText ||
        e?.message ||
        'Submission failed. Please try again.';
      setError(msg);
      console.error('Submission error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-save functionality (optional)
  useEffect(() => {
    const autoSaveKey = `article-draft-${user?.id || 'anonymous'}`;
    
    if (!isEdit && (title || abstractText || content || tags.length > 0)) {
      const draft = { title, abstractText, content, tags };
      localStorage.setItem(autoSaveKey, JSON.stringify(draft));
    }
    
    // Load draft on component mount for new articles
    if (!isEdit && !title && !abstractText && !content && tags.length === 0) {
      try {
        const saved = localStorage.getItem(autoSaveKey);
        if (saved) {
          const draft = JSON.parse(saved);
          setTitle(draft.title || '');
          setAbstractText(draft.abstractText || '');
          setContent(draft.content || '');
          setTags(draft.tags || []);
        }
      } catch (err) {
        console.warn('Failed to load draft:', err);
      }
    }
  }, [title, abstractText, content, tags, isEdit, user?.id]);

  // Clear draft on successful submission
  const clearDraft = useCallback(() => {
    const autoSaveKey = `article-draft-${user?.id || 'anonymous'}`;
    localStorage.removeItem(autoSaveKey);
  }, [user?.id]);

  if (loading) {
    return (
      <div className="afp-container">
        <div className="afp-form-card">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="afp-container">
      <div className="afp-form-card">
        <h1 className="afp-heading">
          {isEdit ? 'Edit Article' : 'Create Article'}
        </h1>
        
        {error && <div className="afp-error">{error}</div>}

        <form onSubmit={submit} className="afp-form">
          <div className="afp-field">
            <label>
              📝 Title
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              required
              maxLength={200}
            />
          </div>

          <div className="afp-field">
            <label>
              📄 Abstract
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: 400, 
                color: abstractWordCount > MAX_ABSTRACT_WORDS ? '#ef4444' : '#64748b',
                marginLeft: '0.5rem'
              }}>
                ({abstractWordCount}/{MAX_ABSTRACT_WORDS} words)
              </span>
            </label>
            <textarea
              value={abstractText}
              onChange={(e) => setAbstractText(e.target.value)}
              placeholder="Write a compelling abstract that summarizes your article..."
              required
              rows={4}
              style={{
                borderColor: abstractWordCount > MAX_ABSTRACT_WORDS ? '#ef4444' : undefined
              }}
            />
          </div>

          <div className="afp-field">
            <label>🖼️ Thumbnail Image</label>
            {thumbPreview && (
              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={thumbPreview}
                  className="afp-thumb-preview"
                  alt="Article thumbnail preview"
                />
              </div>
            )}
            <div
              style={{
                border: dragOver ? '2px solid #15f5ba' : '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                background: dragOver ? 'rgba(21, 245, 186, 0.05)' : 'rgba(248, 250, 252, 0.8)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('thumbnail-upload').click()}
            >
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '1rem' }}>
                {dragOver ? '📁 Drop image here!' : '📤 Click to upload or drag & drop'}
              </p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                PNG, JPG, WebP up to 5MB
              </p>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={onFile}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="afp-field">
            <label>
              🏷️ Tags
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: 400, 
                color: '#64748b',
                marginLeft: '0.5rem'
              }}>
                ({tags.length}/{MAX_TAGS} tags)
              </span>
            </label>
            <div className="tag-input" style={{
              borderColor: tagError ? '#ef4444' : undefined
            }}>
              {tags.map((tag, i) => (
                <span className="tag-chip" key={i}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    className="tag-cancel-button"
                    aria-label={`Remove ${tag} tag`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {tags.length < MAX_TAGS && (
                <input
                  placeholder={tags.length === 0 ? "Add tags (press Enter)" : "Add another tag..."}
                  onKeyDown={handleTagKeyDown}
                  maxLength={20}
                />
              )}
            </div>
            {tagError && <div className="afp-tag-error">⚠️ {tagError}</div>}
          </div>

          <div className="afp-field full-width" style={{ position: 'relative' }}>
            <label>
              ✍️ Content
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            </label>
            <div className="afp-editor">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Start writing your article... Share your thoughts, insights, and expertise!"
                style={{ height: '350px' }}
              />
            </div>
            <div className={`word-count ${
              contentWordCount < MIN_CONTENT_WORDS 
                ? 'error' 
                : contentWordCount < MIN_CONTENT_WORDS + 50 
                ? 'warning' 
                : ''
            }`}>
              {contentWordCount} / {MIN_CONTENT_WORDS} words minimum
            </div>
          </div>

          <button 
            type="submit" 
            className="afp-submit" 
            disabled={submitting || contentWordCount < MIN_CONTENT_WORDS || abstractWordCount > MAX_ABSTRACT_WORDS}
          >
            {submitting ? (
              <>
                <LoadingSpinner />
                <span>{isEdit ? 'Updating...' : 'Publishing...'}</span>
              </>
            ) : (
              <>
                <span>{isEdit ? '💾 Update Article' : '🚀 Publish Article'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}