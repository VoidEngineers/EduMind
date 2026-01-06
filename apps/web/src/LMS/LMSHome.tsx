import { useState } from 'react';
import './LMS.css';
import LMSCourseCard from './LMSCourseCard';
import LMSHeader from './LMSHeader';
import LMSFooter from './LMSFooter';

const LMSHome = () => {
  const [activeFilter, setActiveFilter] = useState('Top picks');
  const [selectedOrg, setSelectedOrg] = useState('Google');

  const courses = [
    // Google Courses
    {
      id: 1,
      badge: 'Free Trial',
      title: 'Google AI Essentials',
      provider: 'Google',
      rating: 4.8,
      reviews: 2156,
      level: 'Beginner',
      duration: '3 weeks',
      image: '🔍'
    },
    {
      id: 2,
      badge: 'Free Trial',
      title: 'Google Prompt Engineering Essentials',
      provider: 'Google',
      rating: 4.7,
      reviews: 1890,
      level: 'Beginner',
      duration: '2 weeks',
      image: '✍️'
    },
    {
      id: 3,
      badge: 'Free Trial',
      title: 'What is Generative AI?',
      provider: 'Google',
      rating: 4.8,
      reviews: 3456,
      level: 'Beginner',
      duration: '1 week',
      image: '💡'
    },
    {
      id: 4,
      badge: 'Free Trial',
      title: 'Generative AI for Developers',
      provider: 'Google',
      rating: 4.7,
      reviews: 2341,
      level: 'Intermediate',
      duration: '5 weeks',
      image: '👨‍💻'
    },
    // OpenAI Courses
    {
      id: 5,
      badge: 'Free Trial',
      title: 'GPT Models and Fine-tuning',
      provider: 'OpenAI',
      rating: 4.9,
      reviews: 3124,
      level: 'Intermediate',
      duration: '6 weeks',
      image: '🤖'
    },
    {
      id: 6,
      badge: 'Free Trial',
      title: 'Building with ChatGPT API',
      provider: 'OpenAI',
      rating: 4.8,
      reviews: 2789,
      level: 'Intermediate',
      duration: '4 weeks',
      image: '⚙️'
    },
    {
      id: 7,
      badge: 'Free Trial',
      title: 'Advanced Prompt Engineering',
      provider: 'OpenAI',
      rating: 4.7,
      reviews: 1923,
      level: 'Advanced',
      duration: '5 weeks',
      image: '🎯'
    },
    // Stanford Courses
    {
      id: 8,
      badge: 'Free Trial',
      title: 'Machine Learning Specialization',
      provider: 'Stanford',
      rating: 4.9,
      reviews: 4567,
      level: 'Intermediate',
      duration: '12 weeks',
      image: '🎓'
    },
    {
      id: 9,
      badge: 'Free Trial',
      title: 'Deep Learning Fundamentals',
      provider: 'Stanford',
      rating: 4.8,
      reviews: 3890,
      level: 'Intermediate',
      duration: '8 weeks',
      image: '🧠'
    },
    {
      id: 10,
      badge: 'Free Trial',
      title: 'Natural Language Processing',
      provider: 'Stanford',
      rating: 4.7,
      reviews: 2345,
      level: 'Advanced',
      duration: '10 weeks',
      image: '💬'
    },
    // Anthropic Courses
    {
      id: 11,
      badge: 'Free Trial',
      title: 'Claude AI: Building Safe AI Systems',
      provider: 'Anthropic',
      rating: 4.8,
      reviews: 1567,
      level: 'Intermediate',
      duration: '6 weeks',
      image: '🛡️'
    },
    {
      id: 12,
      badge: 'Free Trial',
      title: 'Constitutional AI Principles',
      provider: 'Anthropic',
      rating: 4.6,
      reviews: 1234,
      level: 'Advanced',
      duration: '4 weeks',
      image: '⚖️'
    },
    // IBM Courses
    {
      id: 13,
      badge: 'Free Trial',
      title: 'IBM Watson AI Fundamentals',
      provider: 'IBM',
      rating: 4.7,
      reviews: 2890,
      level: 'Beginner',
      duration: '5 weeks',
      image: '💼'
    },
    {
      id: 14,
      badge: 'Free Trial',
      title: 'Enterprise AI Solutions',
      provider: 'IBM',
      rating: 4.6,
      reviews: 1789,
      level: 'Intermediate',
      duration: '7 weeks',
      image: '🏢'
    },
    {
      id: 15,
      badge: 'Free Trial',
      title: 'AI Ethics and Governance',
      provider: 'IBM',
      rating: 4.8,
      reviews: 2234,
      level: 'Intermediate',
      duration: '4 weeks',
      image: '📋'
    },
    // Google Cloud Courses
    {
      id: 16,
      badge: 'Free Trial',
      title: 'Google Cloud AI Platform',
      provider: 'Google Cloud',
      rating: 4.7,
      reviews: 3456,
      level: 'Intermediate',
      duration: '6 weeks',
      image: '☁️'
    },
    {
      id: 17,
      badge: 'Free Trial',
      title: 'Vertex AI: Building ML Models',
      provider: 'Google Cloud',
      rating: 4.8,
      reviews: 2678,
      level: 'Intermediate',
      duration: '5 weeks',
      image: '🔧'
    },
    {
      id: 18,
      badge: 'Free Trial',
      title: 'Cloud AI Solutions Architecture',
      provider: 'Google Cloud',
      rating: 4.6,
      reviews: 1890,
      level: 'Advanced',
      duration: '8 weeks',
      image: '🏗️'
    },
    // AWS Courses
    {
      id: 19,
      badge: 'Free Trial',
      title: 'AWS Machine Learning Specialty',
      provider: 'AWS',
      rating: 4.8,
      reviews: 4123,
      level: 'Intermediate',
      duration: '10 weeks',
      image: '⚡'
    },
    {
      id: 20,
      badge: 'Free Trial',
      title: 'Amazon SageMaker Deep Dive',
      provider: 'AWS',
      rating: 4.7,
      reviews: 2987,
      level: 'Intermediate',
      duration: '7 weeks',
      image: '🔬'
    },
    {
      id: 21,
      badge: 'Free Trial',
      title: 'Building AI on AWS',
      provider: 'AWS',
      rating: 4.9,
      reviews: 3567,
      level: 'Advanced',
      duration: '9 weeks',
      image: '🚀'
    },
    // Other Courses
    {
      id: 22,
      badge: 'Free Trial',
      title: 'Generative AI with Large Language Models',
      provider: 'DeepLearning.AI',
      rating: 4.7,
      reviews: 1234,
      level: 'Intermediate',
      duration: '4 weeks',
      image: '🤖'
    },
    {
      id: 23,
      badge: 'Free Trial',
      title: 'Master of Science in Artificial Intelligence',
      provider: 'University of London',
      rating: 4.6,
      reviews: 567,
      level: 'Advanced',
      duration: '24 months',
      image: '🎓'
    }
  ];

  const organizations = [
    { name: 'Google', logo: '🔵' },
    { name: 'OpenAI', logo: '🤖' },
    { name: 'Stanford', logo: '🎓' },
    { name: 'Anthropic', logo: '🧠' },
    { name: 'IBM', logo: '💼' },
    { name: 'Google Cloud', logo: '☁️' },
    { name: 'AWS', logo: '⚡' }
  ];

  const benefits = [
    {
      icon: '🎯',
      title: 'Gain competitive edge',
      description: 'Stay ahead with cutting-edge AI skills'
    },
    {
      icon: '📈',
      title: 'Boost your productivity',
      description: 'Learn tools that enhance your workflow'
    },
    {
      icon: '🚀',
      title: 'Start a new career',
      description: 'Open doors to AI-powered opportunities'
    }
  ];

  const roleCategories = [
    {
      title: 'Business',
      description: 'Learn how AI transforms business operations',
      icon: '💼'
    },
    {
      title: 'Developers',
      description: 'Build AI-powered applications and systems',
      icon: '👨‍💻'
    },
    {
      title: 'Marketers',
      description: 'Leverage AI for marketing and customer engagement',
      icon: '📢'
    },
    {
      title: 'Data',
      description: 'Master AI for data analysis and insights',
      icon: '📊'
    }
  ];

  const articles = [
    {
      title: 'What is generative AI? Everything you need to know about the new AI',
      date: 'December 20, 2023',
      image: '📰'
    },
    {
      title: 'How to use generative AI: 5 ways to get started',
      date: 'December 20, 2023',
      image: '📝'
    }
  ];

  const faqs = [
    {
      question: 'What are the most popular generative AI courses?',
      answer: 'Our most popular courses include Generative AI with Large Language Models, Google AI Essentials, and Prompt Engineering Essentials.'
    },
    {
      question: 'What are the best generative AI courses?',
      answer: 'The best courses depend on your level and goals. Beginners should start with Google AI Essentials, while advanced learners can explore our Master of Science program.'
    },
    {
      question: 'How long does it take to complete a course?',
      answer: 'Course duration varies from 1 week for introductory courses to 24 months for degree programs. Most courses are self-paced.'
    },
    {
      question: 'Are the courses free?',
      answer: 'Many courses offer free trials. You can audit courses for free or enroll in paid programs for certificates and full access.'
    }
  ];

  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="lms-container">
      <LMSHeader />
      
      {/* Hero Section */}
      <section className="lms-hero">
        <div className="lms-hero-content">
          <div className="lms-hero-text">
            <h1 className="lms-hero-title">Next level skills. New Year savings.</h1>
            <p className="lms-hero-description">
              Put your resolutions into action. EduMind Plus—now 50% off for a limited time. 
              Access over 7,000 courses, projects, and Professional Certificates and get 
              job-ready with skills in Generative AI, data science, and more.
            </p>
            <button className="lms-cta-button">Join for Free</button>
          </div>
          <div className="lms-hero-visual">
            <div className="lms-discount-badge">
              <div className="lms-discount-circle">50%</div>
              <div className="lms-sparkles">✨</div>
            </div>
            <div className="lms-company-logos">
              <div className="lms-logo-item">Microsoft</div>
              <div className="lms-logo-item">IBM</div>
              <div className="lms-logo-item">Google</div>
              <div className="lms-logo-item">Meta</div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started with AI */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">Get started with AI</h2>
          <div className="lms-filters">
            {['New', 'Top picks', 'Projects'].map((filter) => (
              <button
                key={filter}
                className={`lms-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="lms-courses-grid">
            {courses.slice(0, 2).map((course) => (
              <LMSCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Courses by Leading Organizations */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">AI courses by leading organizations</h2>
          <div className="lms-organizations">
            {organizations.map((org, index) => (
              <div 
                key={index} 
                className={`lms-org-logo ${selectedOrg === org.name ? 'active' : ''}`}
                onClick={() => setSelectedOrg(org.name)}
              >
                <span className="lms-org-icon">{org.logo}</span>
                <span className="lms-org-name">{org.name}</span>
              </div>
            ))}
          </div>
          <div className="lms-courses-grid">
            {courses
              .filter(course => course.provider === selectedOrg)
              .slice(0, 4)
              .map((course) => (
                <LMSCourseCard key={course.id} course={course} />
              ))}
          </div>
          {courses.filter(course => course.provider === selectedOrg).length > 4 && (
            <button className="lms-show-more">Show more</button>
          )}
        </div>
      </section>

      {/* Add to your AI skill set */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">Add to your AI skill set</h2>
          <div className="lms-filters">
            {['New to AI', 'Job-ready skills', 'Build your own AI'].map((filter) => (
              <button
                key={filter}
                className={`lms-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="lms-courses-grid">
            {courses.slice(0, 2).map((course) => (
              <LMSCourseCard key={course.id} course={course} />
            ))}
          </div>
          <button className="lms-show-more">Show more</button>
        </div>
      </section>

      {/* Popular with new, in-demand skills */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">Popular with new, in-demand skills</h2>
          <p className="lms-section-subtitle">
            Get job-ready with Professional Certificates—now including AI skills.
          </p>
          <div className="lms-courses-grid">
            {courses.slice(0, 2).map((course) => (
              <LMSCourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="lms-section-actions">
            <button className="lms-show-more">Show more</button>
            <a href="#" className="lms-explore-link">Explore programs</a>
          </div>
        </div>
      </section>

      {/* GenAI tools */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">GenAI tools to make everyday tasks easier</h2>
          <div className="lms-filters">
            {['Top picks', 'New', 'Projects', 'Courses', 'Specializations'].map((filter) => (
              <button
                key={filter}
                className={`lms-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="lms-courses-grid">
            {courses.slice(4, 6).map((course) => (
              <LMSCourseCard key={course.id} course={course} />
            ))}
          </div>
          <button className="lms-show-more">Show more</button>
        </div>
      </section>

      {/* Why learn AI */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">Why learn AI?</h2>
          <p className="lms-section-subtitle">
            AI is transforming every industry. Learn how to apply AI to your work and career.
          </p>
          <div className="lms-benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="lms-benefit-card">
                <div className="lms-benefit-icon">{benefit.icon}</div>
                <h3 className="lms-benefit-title">{benefit.title}</h3>
                <p className="lms-benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GenAI courses by role */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">GenAI courses by role or industry</h2>
          <div className="lms-roles-grid">
            {roleCategories.map((role, index) => (
              <div key={index} className="lms-role-card">
                <div className="lms-role-icon">{role.icon}</div>
                <h3 className="lms-role-title">{role.title}</h3>
                <p className="lms-role-description">{role.description}</p>
              </div>
            ))}
          </div>
          <button className="lms-show-more">Show more</button>
        </div>
      </section>

      {/* Testimonial */}
      <section className="lms-testimonial-section">
        <div className="lms-container-inner">
          <div className="lms-testimonial">
            <div className="lms-testimonial-image">
              <div className="lms-testimonial-avatar">👤</div>
            </div>
            <div className="lms-testimonial-content">
              <blockquote className="lms-testimonial-quote">
                "Just as electricity transformed daily life a century ago, AI is now reshaping 
                the way we live, work, and interact. In this rapidly evolving world, it's crucial 
                to acquire the necessary AI skills and knowledge. By learning to use AI more effectively, 
                you will enhance your ability to navigate this new landscape and will empower you to 
                excel in your daily activities and work. Learning AI is an important step for everyone 
                in this increasingly AI-powered world."
              </blockquote>
              <div className="lms-testimonial-author">
                <strong>Andrew Ng</strong>
                <p>Co-founder, CEO, and Chairman of EduMind; Co-founder of DeepLearning.AI; General Partner at AI Fund; Adjunct Professor at Stanford University.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Articles */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">AI Articles</h2>
          <p className="lms-section-subtitle">
            Learn more about generative AI and how it's transforming industries.
          </p>
          <div className="lms-articles-grid">
            {articles.map((article, index) => (
              <div key={index} className="lms-article-card">
                <div className="lms-article-image">{article.image}</div>
                <h3 className="lms-article-title">{article.title}</h3>
                <p className="lms-article-date">{article.date}</p>
              </div>
            ))}
          </div>
          <button className="lms-show-more">Show more</button>
        </div>
      </section>

      {/* Coursera Plus Banner */}
      <section className="lms-plus-banner">
        <div className="lms-container-inner">
          <div className="lms-plus-content">
            <div className="lms-plus-text">
              <h2 className="lms-plus-title">Maximize your potential with EduMind Plus</h2>
              <p className="lms-plus-description">
                Unlimited access to 7,000+ courses, projects, and Professional Certificates.
              </p>
              <button className="lms-cta-button">Learn more</button>
            </div>
            <div className="lms-plus-image">
              <div className="lms-plus-avatar">👨‍💼</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="lms-section">
        <div className="lms-container-inner">
          <h2 className="lms-section-title">Frequently asked questions</h2>
          <div className="lms-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="lms-faq-item">
                <button
                  className="lms-faq-question"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span className="lms-faq-icon">{expandedFAQ === index ? '−' : '+'}</span>
                </button>
                {expandedFAQ === index && (
                  <div className="lms-faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
          <a href="#" className="lms-see-all-faq">See all frequently asked questions</a>
        </div>
      </section>

      <LMSFooter />
    </div>
  );
};

export default LMSHome;

