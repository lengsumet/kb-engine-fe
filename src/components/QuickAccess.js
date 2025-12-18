import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Monitor, BookOpen, Shield, TrendingUp, Calendar, Clock, GitCompare } from 'lucide-react';
import './QuickAccess.css';

const QuickAccess = ({ onQuickSearch }) => {
  const categories = [
    {
      id: 'hr',
      title: 'นโยบาย HR',
      description: 'นโยบายทรัพยากรบุคคล การลา เงินเดือน',
      icon: Users,
      color: 'blue',
      count: 156
    },
    {
      id: 'credit',
      title: 'นโยบายสินเชื่อ',
      description: 'เกณฑ์การอนุมัติ ขั้นตอนการตรวจสอบ',
      icon: CreditCard,
      color: 'green',
      count: 89
    },
    {
      id: 'it',
      title: 'คู่มือ IT',
      description: 'การใช้งานระบบ แก้ไขปัญหาเทคนิค',
      icon: Monitor,
      color: 'purple',
      count: 234
    },
    {
      id: 'operation',
      title: 'คู่มือปฏิบัติงาน',
      description: 'ขั้นตอนการทำงาน กระบวนการต่างๆ',
      icon: BookOpen,
      color: 'orange',
      count: 178
    },
    {
      id: 'compliance',
      title: 'กฎระเบียบ',
      description: 'กฎหมาย ระเบียบข้อบังคับ มาตรฐาน',
      icon: Shield,
      color: 'red',
      count: 67
    },
    {
      id: 'updates',
      title: 'อัปเดตล่าสุด',
      description: 'ข้อมูลใหม่ การเปลี่ยนแปลงนโยบาย',
      icon: TrendingUp,
      color: 'indigo',
      count: 23
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
      red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
    };
    return colors[color] || colors.blue;
  };

  const handleQuickSearch = (searchType, params) => {
    if (onQuickSearch) {
      onQuickSearch(searchType, params);
    }
  };

  const quickSearches = [
    {
      id: 'holiday-comparison',
      title: 'เปรียบเทียบวันหยุด',
      description: 'เปรียบเทียบวันหยุดระหว่างปี 2568 และ 2569',
      icon: Calendar,
      color: 'indigo',
      action: () => handleQuickSearch('วันหยุด', { compareYear1: '2568', compareYear2: '2569' })
    },
    {
      id: 'policy-updates',
      title: 'นโยบายใหม่ล่าสุด',
      description: 'ข้อมูลนโยบายที่อัปเดตในช่วง 30 วันที่ผ่านมา',
      icon: Clock,
      color: 'green',
      action: () => handleQuickSearch('นโยบายใหม่', { dateRange: 'month' })
    }
  ];

  const quickActions = [
    {
      id: 'file-comparison',
      title: 'เปรียบเทียบไฟล์',
      description: 'เปรียบเทียบเอกสาร 2 ฉบับเพื่อดูความแตกต่าง',
      icon: GitCompare,
      color: 'purple',
      link: '/compare'
    }
  ];

  return (
    <div className="quick-access">
      <div className="section-header">
        <h2>เข้าถึงด่วน</h2>
        <p>หมวดหมู่เอกสารและข้อมูลที่ใช้บ่อย</p>
      </div>

      {/* Quick Search Actions */}
      <div className="quick-searches">
        <h3>การค้นหาด่วน</h3>
        <div className="quick-search-grid">
          {quickSearches.map((search) => {
            const Icon = search.icon;
            return (
              <button
                key={search.id}
                onClick={search.action}
                className={`quick-search-btn ${getColorClasses(search.color)}`}
              >
                <div className="search-icon">
                  <Icon size={20} />
                </div>
                <div className="search-content">
                  <h4>{search.title}</h4>
                  <p>{search.description}</p>
                </div>
              </button>
            );
          })}
          
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                to={action.link}
                className={`quick-search-btn ${getColorClasses(action.color)}`}
              >
                <div className="search-icon">
                  <Icon size={20} />
                </div>
                <div className="search-content">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>



      {/* Category Grid */}
      <div className="categories-section">
        <h3>หมวดหมู่เอกสาร</h3>
        <div className="categories-grid">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className={`category-card ${getColorClasses(category.color)}`}
              >
                <div className="category-icon">
                  <Icon size={24} />
                </div>
                <div className="category-content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <div className="category-count">
                    {category.count} เอกสาร
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;