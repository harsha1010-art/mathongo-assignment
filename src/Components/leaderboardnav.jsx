import React from 'react';
import { ArrowLeft } from 'phosphor-react';
import { useState,  } from 'react';
import { Moon, Sun } from 'phosphor-react';
function LeaderBoardNav() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isDark, setIsDark] = useState(false);

 

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const breadcrumbs = [
    'JEE Main Test series',
    'Quizrr Part Test',
    'Quizrr Part Test (QPT) - 1 (Old)',
    'Analysis',
    'Leaderboard'
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
   
    
    <><div className="leaderboardnav sticky top-0 z-50 bg-[var(--q3-surface-glass-normal)] border-b border-[var(--q3-stroke-light)] backdrop-blur-sm transition-all duration-300 rounded-b-lg">
      <div className={`gap-4 p-4 items-center transition-all duration-300 ${isScrolled ? 'flex' : 'block'}`}>
        <div className="arrowleft cursor-pointer bg-[var(--q3-surface-dimmer)] w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 hover:bg-[var(--q3-surface-dimmest)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--q3-neutral-default)]" />
        </div>
        <div className={`text-2xl font-bold text-[var(--q3-neutral-default)] ${isScrolled ? 'inline-block' : 'block mt-2'}`}>
          Leaderboard
        </div>
      </div>
      <div
        className={`flex gap-2 px-4 overflow-x-auto overflow-y-hidden transition-all duration-300 ease-in-out ${isScrolled ? 'max-h-0 pb-0 opacity-0 invisible' : 'max-h-20 pb-4 opacity-100 visible'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <button className="px-3 py-1.5 text-[var(--q3-neutral-light)] rounded-md text-sm whitespace-nowrap  transition-colors active:scale-95">
              {item}
            </button>
            {index < breadcrumbs.length - 1 && (
              <span className="text-[var(--q3-neutral-light)] flex items-center select-none">/</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div><div className="togllecontainer fixed top-4 right-4 z-50">

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
      </div></>
  );
}

export default LeaderBoardNav;