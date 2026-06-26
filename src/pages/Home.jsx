import { useEffect } from 'react';
import { Hero, SectorsGrid, CategoriesGrid, WhyMarkketero, HowItWorks, FinalCTA } from '../components/HomeSections';

export default function Home() {
  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-enter">
      <Hero />
      <SectorsGrid />
      <CategoriesGrid />
      <WhyMarkketero />
      <HowItWorks />
      <FinalCTA />
    </div>
  );
}
