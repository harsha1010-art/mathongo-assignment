import React, { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun } from 'phosphor-react';

function LeaderBoardNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const breadcrumbs = [
    'JEE Main Test series',
    'Quizrr Part Test',
    'Quizrr Part Test (QPT) - 1 (Old)',
    'Analysis',
    'Leaderboard'
  ];

  useEffect(() => {
    const handleScroll = () => {
      // 🔹 Increase scroll threshold to 150 (was 100)
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        className={`leaderboardnav sticky top-0 z-50 
        bg-[var(--q3-surface-glass-normal)] border-b border-[var(--q3-stroke-light)] 
        backdrop-blur-sm rounded-b-lg 
        ${isScrolled ? 'transition-none' : 'transition-all duration-300'}`} // 🔹 Remove transition when scrolled
      >
        <div
          className={`gap-4 p-4 items-center ${
            isScrolled ? 'flex' : 'block transition-all duration-300'
          }`}
        >
          <div className="arrowleft cursor-pointer bg-[var(--q3-surface-dimmer)] w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 hover:bg-[var(--q3-surface-dimmest)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--q3-neutral-default)]" />
          </div>
          <div
            className={`text-2xl font-bold text-[var(--q3-neutral-default)] ${
              isScrolled ? 'inline-block' : 'block mt-2'
            }`}
          >
            Leaderboard
          </div>
        </div>

        {/* 🔹 Hide breadcrumb with no transition after threshold */}
        <div
          className="flex gap-2 px-4 overflow-x-auto overflow-y-hidden"
          style={{
            height: isScrolled ? 0 : 40,
            opacity: isScrolled ? 0 : 1,
            visibility: isScrolled ? 'hidden' : 'visible',
            paddingBottom: isScrolled ? 0 : 16,
            transition: isScrolled
              ? 'none' // 🔹 Remove transition after scroll threshold
              : 'height 0.3s, opacity 0.3s, visibility 0.3s, padding-bottom 0.3s',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <button className="px-3 py-1.5 text-[var(--q3-neutral-light)] rounded-md text-sm whitespace-nowrap transition-colors active:scale-95">
                {item}
              </button>
              {index < breadcrumbs.length - 1 && (
                <span className="text-[var(--q3-neutral-light)] flex items-center select-none">
                  /
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="togglecontainer fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="bg-[var(--q3-surface-dimmer)] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--q3-surface-dimmest)] transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={20} className="text-[var(--q3-neutral-default)]" />
          ) : (
            <Moon size={20} className="text-[var(--q3-neutral-default)]" />
          )}
        </button>
      </div>
    </>
  );
}

export default LeaderBoardNav;
