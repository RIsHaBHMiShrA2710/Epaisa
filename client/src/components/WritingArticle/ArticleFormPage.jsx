// ArticleFormPage.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../../AuthContext';
import './ArticleFormPage.css';
import { modules, formats } from './modulesConfig';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ArticleFormPage = () => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState('');


  const MAX_TAGS = 5;
  // Helper: count words
  const countWords = (text) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to submit an article.');
      return;
    }

    // Validate abstract and content
    const abstractWordCount = countWords(abstractText);
    if (abstractWordCount > 70) {
      setError(`Abstract must be 70 words or fewer. Currently ${abstractWordCount} words.`);
      return;
    }
    const contentWordCount = countWords(content.replace(/<[^>]+>/g, ''));
    if (contentWordCount < 200) {
      setError(`Content must be at least 200 words. Currently ${contentWordCount} words.`);
      return;
    }


    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstractText);
    formData.append('thumbnail', thumbnail);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));

    try {
      const res = await fetch('https://epaise-backend.onrender.com/api/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) {
        throw new Error('Failed to create article');
      }
      const data = await res.json();
      console.log('Article created successfully:', data);
      setSubmissionSuccess(true);
      // Clear form fields after a brief delay
      setTimeout(() => {
        setTitle('');
        setAbstractText('');
        setThumbnail(null);
        setContent('');
        setSubmissionSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Error creating article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const addTag = name => {
    // 1) Too many already?
    if (tags.length >= MAX_TAGS) {
      setTagError(`You can only add up to ${MAX_TAGS} tags.`);
      return;
    }
    // 2) No spaces allowed
    if (/\s/.test(name)) {
      setTagError('Tags cannot contain spaces.');
      return;
    }
    // 3) No duplicates (case-insensitive)
    if (tags.some(t => t.toLowerCase() === name.toLowerCase())) {
      setTagError('This tag is already added.');
      return;
    }
    // 4) Good: add it
    setTags([...tags, name]);
    setTagError('');  // clear any old error
  };

  const removeTag = idx => {
    setTags(tags.filter((_, i) => i !== idx));
    setTagError('');
  };

  return (
    <div className="afp-container">
      <h1 className="afp-heading">Create Article</h1>
      {error && <div className="afp-error">{error}</div>}
      {submissionSuccess && <div className="afp-success">✓ Article created successfully!</div>}
      <form onSubmit={handleSubmit} className="afp-form">
        <div className="afp-field">
          <label htmlFor="afp-title">Title</label>
          <input
            id="afp-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter the article title"
          />
        </div>
        <div className="afp-field">
          <label htmlFor="afp-abstract">Abstract (max 70 words)</label>
          <textarea
            id="afp-abstract"
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
            required
            placeholder="Enter a brief abstract..."
          />
        </div>
        <div className="afp-field">
          <label htmlFor="afp-thumbnail">Thumbnail (Image)</label>
          <input
            id="afp-thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}

          />
        </div>
        <div className="afp-field">
          <label>Tags (up to {MAX_TAGS})</label>
          <div className="tag-input">
            {tags.map((tag, i) => (
              <span key={i} className="tag-chip">
                {tag} <button type="button" className="tag-cancel-button" onClick={() => removeTag(i)}>×</button>
              </span>
            ))}
            {tags.length < MAX_TAGS && (
              <input
                type="text"
                placeholder="Type & press Enter"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const val = e.target.value.trim();
                    e.preventDefault();
                    if (val) addTag(val);
                    e.target.value = '';
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
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write your article here..."
            className="afp-editor"
            tabIndex="0"
          />
        </div>
        <button type="submit" className="afp-submit" disabled={submitting}>
          {submitting ? <LoadingSpinner /> : submissionSuccess ? '✓' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
};

export default ArticleFormPage;
