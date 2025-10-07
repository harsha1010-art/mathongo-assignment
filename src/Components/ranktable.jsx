import React, { useEffect, useRef, useState } from 'react';
import avtar from '../assets/Avatar1.svg';

function RankTable({ data, onLoadMore, hasMore, loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const scrollRef = useRef(null);
  
  const ITEMS_PER_PAGE = 15;
  const LOAD_THRESHOLD = 30;

  // Prefetch more data when approaching end
  useEffect(() => {
    const currentDataEnd = currentPage * ITEMS_PER_PAGE;
    const threshold = data.length - LOAD_THRESHOLD;
    
    if (currentDataEnd >= threshold && hasMore && !loading) {
      onLoadMore();
    }
  }, [currentPage, data.length, hasMore, loading, onLoadMore]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync horizontal scroll between table and bottom row
  useEffect(() => {
    const syncScroll = () => {
      const bottomScroll = document.querySelector('.bottom-scroll-sync');
      if (bottomScroll && scrollRef.current) {
        bottomScroll.scrollLeft = scrollRef.current.scrollLeft;
      }
    };

    const handleScroll = () => {
      if (scrollRef.current) {
        requestAnimationFrame(syncScroll);
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll, { passive: true });
      syncScroll();
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage]);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Get display items (skip first 3 on desktop page 1)
  const getDisplayItems = () => {
    if (currentPage === 1 && isDesktop) {
      return currentItems.slice(3).map((item, index) => ({
        ...item,
        rank: indexOfFirstItem + index + 4,
      }));
    }
    return currentItems.map((item, index) => ({
      ...item,
      rank: item.rank || (indexOfFirstItem + index + 1),
    }));
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const maxVisiblePages = isDesktop ? 5 : 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Get rank-specific styles
  const getRankStyles = (rank) => {
    const styles = {
      1: {
        rankBg: 'linear-gradient(180deg, #F54A00 0%, #E17100 100%)',
        rankColor: 'white',
      },
      2: {
        rankBg: 'linear-gradient(180deg, #A9B5C3 0%, #636F7D 100%)',
        rankColor: 'var(--rank2-rank-color)',
      },
      3: {
        rankBg: 'linear-gradient(180deg, #A93410 0%, #CB3E13 100%)',
        rankColor: 'var(--rank3-rank-color)',
      },
    };

    return styles[rank] || {
      rankBg: 'var(--q3-stroke-normal)',
      rankColor: 'var(--q3-neutral-default)',
    };
  };

  // Extract subject scores
  const getSubjectScore = (item, subjectTitle, fallbackKeys) => {
    const subjectScore = item.subjects?.find(s => s.subjectId.title === subjectTitle)?.totalMarkScored;
    if (subjectScore !== undefined) return subjectScore;
    
    for (const key of fallbackKeys) {
      if (item[key] !== undefined) return item[key];
    }
    return 0;
  };

  // Render table row
  const renderRow = (item, index) => {
    const globalRank = item.rank || (indexOfFirstItem + index + 1);
    const rankStyles = getRankStyles(globalRank);
    
    const physicsScore = getSubjectScore(item, "Physics", ['phy', 'physics']);
    const chemistryScore = getSubjectScore(item, "Chemistry", ['chem', 'chemistry']);
    const mathsScore = getSubjectScore(item, "Mathematics", ['maths', 'mathematics']);
    const overallScore = item.totalMarkScored || item.overallScore || item.score || 0;
    const accuracy = item.accuracy ? `${parseFloat(item.accuracy).toFixed(2)}%` : '-';
    const studentName = item.userId?.name || item.studentName || item.name || 'Unknown';
    const avatarSrc = item.userId?.profilePicture || item.avatar || avtar;

    return (
      <tr 
        key={item._id || item.id || `row-${index}`}
        className="border-b border-[var(--q3-stroke-light)]"
      >
        <td className="px-6 py-4">
          <div 
            className="w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium"
            style={{ 
              background: rankStyles.rankBg,
              color: rankStyles.rankColor,
            }}
          >
            {globalRank}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-4">
            <img
              className="h-10 w-10 rounded-full flex-shrink-0"
              src={avatarSrc}
              alt={studentName}
              onError={(e) => { e.target.src = avtar; }}
            />
            <div className="text-sm font-medium text-[var(--q3-neutral-default)]">
              {studentName}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="inline-flex items-center px-4 py-2 bg-[var(--q3-surface-dim)] rounded-full text-sm">
            <span className="text-[var(--q3-neutral-default)]">{overallScore}</span>
            <span className="text-[var(--q3-neutral-light)]">/300</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--q3-neutral-default)]">
          {physicsScore}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--q3-neutral-default)]">
          {chemistryScore}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--q3-neutral-default)]">
          {mathsScore}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--q3-neutral-default)]">
          {accuracy}
        </td>
      </tr>
    );
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Empty state
  if (data.length === 0) {
    return (
      <div className="bg-[var(--q3-surface-default)] rounded-lg shadow-md p-6 m-4 border border-[var(--q3-stroke-light)]">
        <p className="text-[var(--q3-neutral-light)] text-center">No data available</p>
      </div>
    );
  }

  const displayItems = getDisplayItems();
  const itemsToRender = (currentPage === 1 && isDesktop) ? displayItems : currentItems;

  return (
    <div className="bg-[var(--q3-surface-default)] rounded-lg shadow-md m-4 border border-[var(--q3-stroke-light)] overflow-hidden mb-20">
      {/* Scrollable Table */}
      <div 
        ref={scrollRef}
        className="table-scroll-sync max-h-[800px] md:max-h-[700px] overflow-auto"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <table className="min-w-full w-max ">
          <thead className="bg-[var(--q3-surface-dim)] sticky top-0 z-10 h-15">
            <tr className="border-b border-[var(--q3-stroke-light)]">
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-default)] uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-default)] uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-light)] uppercase tracking-wider">
                Overall Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-light)] uppercase tracking-wider">
                Phy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-light)] uppercase tracking-wider">
                Chem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-light)] uppercase tracking-wider">
                Maths
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-light)] uppercase tracking-wider">
                Accuracy 
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--q3-surface-default)]">
            {itemsToRender.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-[var(--q3-surface-default)] px-4 py-3 border-t border-[var(--q3-stroke-light)] flex items-center justify-between sm:px-6">
          {/* Mobile Pagination */}
          <div className="flex-1 flex justify-between items-center sm:hidden gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium rounded-full text-[var(--q3-neutral-default)] bg-[var(--q3-surface-dim)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full ${
                  currentPage === pageNumber
                    ? 'bg-[var(--q3-accent-normal)] text-white'
                    : 'bg-[var(--q3-surface-default)] border border-[var(--q3-stroke-normal)] text-[var(--q3-neutral-default)]'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium rounded-full text-[var(--q3-neutral-default)] bg-[var(--q3-surface-dim)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex flex-col items-center gap-2">
              <nav className="flex gap-2" aria-label="Pagination">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="w-20 px-2 py-2 rounded-full border border-[var(--q3-stroke-normal)] bg-[var(--q3-surface-default)] text-sm font-medium text-[var(--q3-neutral-default)] hover:bg-[var(--q3-surface-dim)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full ${
                      currentPage === pageNumber
                        ? 'bg-[var(--q3-accent-normal)] text-white'
                        : 'bg-[var(--q3-surface-default)] border border-[var(--q3-stroke-normal)] text-[var(--q3-neutral-default)] hover:bg-[var(--q3-surface-dim)]'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="w-20 px-2 py-2 rounded-full border border-[var(--q3-stroke-normal)] bg-[var(--q3-surface-default)] text-sm font-medium text-[var(--q3-neutral-default)] hover:bg-[var(--q3-surface-dim)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
              
              {/* Loading/Status Messages */}
              {loading && hasMore && (
                <div className="text-[var(--q3-neutral-light)] text-sm">
                  Loading more...
                </div>
              )}
              {!hasMore && data.length > 0 && (
                <div className="text-[var(--q3-neutral-light)] text-sm">
                  All data loaded ({data.length} students)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RankTable;