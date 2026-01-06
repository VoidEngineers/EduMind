import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiShoppingCart,
  FiBook,
  FiGraduationCap,
  FiAward,
  FiTrophy,
  FiBriefcase,
  FiBuilding,
  FiUsers,
  FiStar,
  FiBrain
} from 'react-icons/fi';
import './LMS.css';

const LMSHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const menuItems = [
    { label: 'Browse', icon: '📚' },
    { label: 'Degrees', icon: '🎓' },
    { label: 'Professional Certificates', icon: '📜' },
    { label: 'MasterTrack® Certificates', icon: '🏆' },
    { label: 'For Enterprise', icon: '🏢' },
    { label: 'For Universities', icon: '🏛️' },
    { label: 'For Students', icon: '👨‍🎓' },
    { label: 'EduMind Plus', icon: '⭐' }
  ];

  return (
    <header className="lms-header">
      <div className="lms-header-container">
        <div className="lms-header-left">
          <div className="lms-menu-wrapper" ref={menuRef}>
            <button 
              className="lms-menu-btn" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            {menuOpen && (
              <div className="lms-sidebar-menu">
                <div className="lms-menu-header">
                  <h3>Menu</h3>
                  <button 
                    className="lms-menu-close"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    ✕
                  </button>
                </div>
                <nav className="lms-menu-nav">
                  <a 
                    href="#" 
                    className="lms-menu-item lms-menu-item-edumind"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                      setMenuOpen(false);
                    }}
                  >
                    <span className="lms-menu-icon">🧠</span>
                    <span className="lms-menu-label">EduMind AI Platform</span>
                  </a>
                  {menuItems.map((item, index) => (
                    <a 
                      key={index} 
                      href="#" 
                      className="lms-menu-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="lms-menu-icon">{item.icon}</span>
                      <span className="lms-menu-label">{item.label}</span>
                    </a>
                  ))}
                </nav>
                <div className="lms-menu-footer">
                  <button className="lms-menu-btn-login">Log In</button>
                  <button className="lms-menu-btn-join">Join for Free</button>
                </div>
              </div>
            )}
          </div>
          <div className="lms-logo">
            <span className="lms-logo-icon">🎓</span>
            <span className="lms-logo-text">EduMind</span>
          </div>
        </div>
        <div className="lms-header-right">
          <button 
            className="lms-header-btn edumind-platform-btn"
            onClick={() => navigate('/')}
            title="Go to EduMind AI Platform"
          >
            <span className="edumind-btn-icon">🧠</span>
            <span>EduMind AI</span>
          </button>
          <button className="lms-header-icon-btn">
            <span>🔍</span>
          </button>
          <button className="lms-header-icon-btn">
            <span>🛒</span>
          </button>
          <button className="lms-header-btn secondary">Log In</button>
          <button className="lms-header-btn primary">Join for Free</button>
        </div>
      </div>
      {menuOpen && <div className="lms-menu-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
};

export default LMSHeader;

