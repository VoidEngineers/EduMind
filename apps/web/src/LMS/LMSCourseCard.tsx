import './LMS.css';

interface Course {
  id: number;
  badge: string;
  title: string;
  provider: string;
  rating: number;
  reviews: number;
  level: string;
  duration: string;
  image: string;
}

interface LMSCourseCardProps {
  course: Course;
}

const LMSCourseCard = ({ course }: LMSCourseCardProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="lms-rating">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={i} className="lms-star">★</span>
        ))}
        {hasHalfStar && <span className="lms-star half">★</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={i} className="lms-star empty">☆</span>
        ))}
        <span className="lms-rating-value">{rating}</span>
      </div>
    );
  };

  return (
    <div className="lms-course-card">
      <div className="lms-course-badge">{course.badge}</div>
      <div className="lms-course-image">{course.image}</div>
      <div className="lms-course-content">
        <h3 className="lms-course-title">{course.title}</h3>
        <p className="lms-course-provider">{course.provider}</p>
        {renderStars(course.rating)}
        <p className="lms-course-reviews">({course.reviews.toLocaleString()} reviews)</p>
        <div className="lms-course-meta">
          <span className="lms-course-level">{course.level}</span>
          <span className="lms-course-duration">{course.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default LMSCourseCard;

