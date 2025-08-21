// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard/Dashboard';
import ArticleListPage from './components/ArticleListPage/ArticleListPage';
import ArticleDetailPage from './components/ArticlesDetailPage/ArticlesDetailPage';
import ArticleFormPage from './components/WritingArticle/ArticleFormPage';
import ProtectedRoute from './components/protectedRoute'; // add this
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="blog" element={<ArticleListPage />} />
        <Route path="blog/:id" element={<ArticleDetailPage />} />

        {/* Create */}
        <Route path="blog/new" element={
          <ProtectedRoute><ArticleFormPage /></ProtectedRoute>
        } />

        {/* Edit (same component, prefilled via :id) */}
        <Route path="blog/:id/edit" element={
          <ProtectedRoute><ArticleFormPage /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}
