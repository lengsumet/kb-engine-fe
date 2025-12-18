import { Search, BookOpen, Zap, Shield } from 'lucide-react';
import './LandingHero.css';

const LandingHero = ({ onSearchFocus }) => {
  // const features = [
  //   {
  //     icon: Search,
  //     title: 'ค้นหาอัจฉริยะ',
  //     description: 'ค้นหาข้อมูลได้อย่างรวดเร็วด้วย AI ที่เข้าใจบริบท'
  //   },
  //   {
  //     icon: BookOpen,
  //     title: 'จัดการความรู้',
  //     description: 'รวบรวมและจัดระเบียบความรู้องค์กรอย่างเป็นระบบ'
  //   },
  //   {
  //     icon: Zap,
  //     title: 'เข้าถึงง่าย',
  //     description: 'ใช้งานง่าย เข้าถึงได้ทุกที่ ทุกเวลา'
  //   },
  //   {
  //     icon: Shield,
  //     title: 'ปลอดภัย',
  //     description: 'ระบบรักษาความปลอดภัยระดับองค์กร'
  //   }
  // ];

  return (
    <div className="landing-hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            ระบบฐานความรู้
            <span className="title-highlight">องค์กรอัจฉริยะ</span>
          </h1>
          <p className="hero-description">
            ค้นหา เรียนรู้ และแบ่งปันความรู้ในองค์กรได้อย่างมีประสิทธิภาพ
            ด้วยเทคโนโลยี AI ที่ทันสมัย
          </p>
          <div className="hero-actions">
            <button 
              className="btn btn-primary hero-cta"
              onClick={onSearchFocus}
            >
              <Search size={20} />
              เริ่มค้นหาเลย
            </button>
            <button className="btn btn-ghost">
              <BookOpen size={20} />
              เรียนรู้เพิ่มเติม
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="hero-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-fallback" style={{display: 'none'}}>
              <div className="minimal-logo">
                <div className="logo-icon">
                  <div className="logo-shape blue-shape"></div>
                  <div className="logo-shape pink-shape"></div>
                </div>
                <div className="logo-text">
                  <span className="logo-blue">เงิน</span>
                  <span className="logo-pink">เทอร์โบ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              <feature.icon size={24} />
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default LandingHero;