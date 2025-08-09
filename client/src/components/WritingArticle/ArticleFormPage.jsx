// src/components/WritingArticle/ArticleFormPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../../authContext'; // keep as-is per your setup
import { modules, formats } from './modulesConfig';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './ArticleFormPage.css';

const API =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_BACKEND_URL;

export default function ArticleFormPage() {
  const { id } = useParams();                 // if present → edit mode
  const isEdit = Boolean(id);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);       // array in UI
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(''); // existing URL
  const [error, setError] = useState('');
  const [tagError, setTagError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const MAX_TAGS = 5;

  // Prefill on edit – wait until token AND user are available to avoid 401
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

        // Soft client-side guard (hard check must be on backend)
        if (data.user_id !== user.id) {
          alert('You can only edit your own article.');
          navigate('/dashboard');
          return;
        }

        setTitle(data.title || '');
        setAbstractText(data.abstract || '');
        setContent(data.content || '');

        // Robust tag parsing (supports array, JSON string, null)
        const parsedTags = Array.isArray(data.tags)
          ? data.tags
          : typeof data.tags === 'string'
            ? (() => { try { return JSON.parse(data.tags || '[]'); } catch { return []; } })()
            : [];
        setTags(parsedTags);

        setThumbPreview(data.thumbnail_url || '');
      } catch (e) {
        if (axios.isCancel(e)) return;
        const status = e?.response?.status;
        if (status === 401) setError('Unauthorized');
        else if (status === 404) setError('Not found');
        else setError('Request failed');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [isEdit, id, token, user?.id, navigate]);

  const countWords = (t) => t.trim().split(/\s+/).filter(Boolean).length;
  const contentWordCount = useMemo(
    () => countWords(content.replace(/<[^>]+>/g, '')),
    [content]
  );

  const onFile = (e) => setThumbFile(e.target.files?.[0] || null);

  const addTag = (name) => {
    const val = name.trim();
    if (!val) return;
    if (tags.length >= MAX_TAGS) return setTagError(`Max ${MAX_TAGS} tags`);
    if (/\s/.test(val)) return setTagError('No spaces in tags');
    if (tags.some((t) => t.toLowerCase() === val.toLowerCase()))
      return setTagError('Duplicate tag');
    setTags([...tags, val]);
    setTagError('');
  };

  const removeTag = (i) => setTags(tags.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Login required.');

    // Validation
    if (countWords(abstractText) > 70) return setError('Abstract ≤ 70 words.');
    if (contentWordCount < 200) return setError('Content ≥ 200 words.');
    setError('');
    setSubmitting(true);

    // On edit, ensure an "edited" tag exists
    const finalTags =
      isEdit && !tags.some((t) => t.toLowerCase() === 'edited')
        ? [...tags, 'edited']
        : tags;

    const form = new FormData();
    form.append('title', title);
    form.append('abstract', abstractText);
    form.append('content', content);
    form.append('tags', JSON.stringify(finalTags)); // backend reads JSON
    if (thumbFile) form.append('thumbnail', thumbFile);

    const url = isEdit ? `${API}/api/articles/${id}` : `${API}/api/articles`;
    const method = isEdit ? 'put' : 'post';

    try {
      const { data } = await axios({
        url,
        method,
        headers: { Authorization: `Bearer ${token}` },
        data: form, // axios will set proper multipart boundary
      });
      navigate(`/blog/${data.id}`);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.statusText ||
        e?.message ||
        'Submit failed. Try again.';
      setError(msg);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="afp-container"><LoadingSpinner /></div>;

  return (
    <div className="afp-container">
      <h1 className="afp-heading">{isEdit ? 'Edit Article' : 'Create Article'}</h1>
      {error && <div className="afp-error">{error}</div>}

      <form onSubmit={submit} className="afp-form">
        <div className="afp-field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="afp-field">
          <label>Abstract (max 70 words)</label>
          <textarea
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
            required
          />
        </div>

        <div className="afp-field">
          <label>Thumbnail</label>
          {thumbPreview && !thumbFile && (
            <img
              src={thumbPreview}
              className="afp-thumb-preview"
              alt="current thumbnail"
            />
          )}
          <input type="file" accept="image/*" onChange={onFile} />
        </div>

        <div className="afp-field">
          <label>Tags (up to 5)</label>
          <div className="tag-input">
            {tags.map((t, i) => (
              <span className="tag-chip" key={i}>
                {t}{' '}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="tag-cancel-button"
                >
                  ×
                </button>
              </span>
            ))}
            {tags.length < MAX_TAGS && (
              <input
                placeholder="Type & Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            )}
          </div>
          {tagError && <div className="afp-tag-error">{tagError}</div>}
        </div>

        <div className="afp-field">
          <label>Content (min 200 words)</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
          />
        </div>

        <button className="afp-submit" disabled={submitting}>
          {submitting ? <LoadingSpinner /> : isEdit ? 'Update Article' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
}
