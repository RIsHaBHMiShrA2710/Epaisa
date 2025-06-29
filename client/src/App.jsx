// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard/Dashboard';
import ArticleListPage from './components/ArticleListPage/ArticleListPage';
import ArticleDetailPage from './components/ArticlesDetailPage/ArticlesDetailPage';
import ArticleFormPage from './components/WritingArticle/ArticleFormPage';

export default function App() {
  return (
    <Routes>
      {/* All these routes share the same Navbar/Footer from Layout */}
      <Route element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="blog" element={<ArticleListPage />} />
        <Route path="blog/:id" element={<ArticleDetailPage />} />
        <Route path="create-article" element={<ArticleFormPage />} />
      </Route>
    </Routes>
  );
}
