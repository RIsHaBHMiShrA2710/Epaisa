// AuthorModal.jsx
import React from 'react';
import './AuthorModal.css';

const AuthorModal = ({ opened, onClose, authorId, authorName, authorAvatar }) => {
  if (!opened) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-author">
          <img
            className="modal-author-avatar"
            src={authorAvatar || 'avatar_placeholder.jpg'}
            alt="Author"
          />
          <h2 className="modal-author-name">{authorName || 'Unknown Author'}</h2>
          <p className="modal-author-bio">
            This is a placeholder for the author's bio and other details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorModal;
