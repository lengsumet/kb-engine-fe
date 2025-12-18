import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, BookOpen, Clock, Menu, GitCompare } from 'lucide-react';
import './Header.css';

const Header = ({ onOpenChat }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Search, label: 'ค้นหา', id: 'search' },
    { path: '/category/all', icon: BookOpen, label: 'หมวดหมู่', id: 'category' },
    { path: '/updates', icon: Clock, label: 'อัปเดตล่าสุด', id: 'updates' },
    { path: '/compare', icon: GitCompare, label: 'เปรียบเทียบไฟล์', id: 'compare' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-brand">
          <div className="brand-logo">
            <BookOpen size={32} />
          </div>
          <div className="brand-text">
            <h1>เงินเทอร์โบ</h1>
            <span>ระบบฐานความรู้องค์กร</span>
          </div>
        </Link>

        <nav className="header-nav">
          {navItems.map(({ path, icon: Icon, label, id }) => (
            <Link
              key={id}
              to={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;