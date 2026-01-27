import { useEffect, useState } from 'react';
import { AdminHero } from '../admin/AdminHero';
import { AnalyticsSection } from '../admin/AnalyticsSection';
import { CoursesSection } from '../admin/CoursesSection';
import { ResourcesSection } from '../admin/ResourcesSection';
import { StatsDashboard } from '../admin/StatsDashboard';

function AdminApp() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    resources: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Simulate loading stats
    const loadStats = async () => {
      setStats({
        students: 1250,
        courses: 48,
        resources: 8500,
        completionRate: 87
      });
    };

    setTimeout(loadStats, 1000);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHero scrollToSection={scrollToSection} />
      <StatsDashboard stats={stats} />
      <CoursesSection />
      <ResourcesSection />
      <AnalyticsSection />
    </div>
  );
}

export default AdminApp;
