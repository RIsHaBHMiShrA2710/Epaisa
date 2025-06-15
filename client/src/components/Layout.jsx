// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />      {/* ← This is where Homepage, Blog, Dashboard, etc. will render */}
      </main>
      <Footer />
    </>
  );
}
