// ArticleFormPage.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../../AuthContext';
import './ArticleFormPage.css';
import { modules, formats } from './modulesConfig';

const ArticleFormPage = () => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Validation helper: count words (splitting on whitespace)
  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure only logged-in users can submit
    if (!user) {
      alert('You must be logged in to submit an article.');
      return;
    }

    // Validate abstract (max 70 words) and content (min 200 words)
    const abstractWordCount = countWords(abstractText);
    if (abstractWordCount > 70) {
      setError(`Abstract must be 70 words or fewer. Currently ${abstractWordCount} words.`);
      return;
    }
    const contentWordCount = countWords(content.replace(/<[^>]+>/g, '')); // remove HTML tags
    if (contentWordCount < 200) {
      setError(`Content must be at least 200 words. Currently ${contentWordCount} words.`);
      return;
    }
    
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstract', abstractText);
    formData.append('thumbnail', thumbnail);
    formData.append('content', content);

    try {
      const res = await fetch('http://localhost:5000/api/articles', {
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
      // Optionally, redirect to the new article page or show success message
      // For example: navigate(`/article/${data.id}`);
    } catch (err) {
      console.error(err);
      setError('Error creating article. Please try again.');
    }
  };

  return (
    <div className="afp-container">
      <h1 className="afp-heading">Create Article</h1>
      {error && <div className="afp-error">{error}</div>}
      <form onSubmit={handleSubmit} className="afp-form">
        {/* Title Field */}
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
        {/* Abstract Field */}
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
        {/* Thumbnail Field */}
        <div className="afp-field">
          <label htmlFor="afp-thumbnail">Thumbnail (Image)</label>
          <input
            id="afp-thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
           
          />
        </div>
        {/* Content Field with Rich Text Editor */}
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
          />
        </div>
        <button type="submit" className="afp-submit">
          Submit Article
        </button>
      </form>
    </div>
  );
};

export default ArticleFormPage;
