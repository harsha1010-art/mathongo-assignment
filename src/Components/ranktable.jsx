import React, { useEffect, useRef } from 'react';
import avtar from '../assets/Avatar1.svg';

function RankTable({ data , onLoadMore, hasMore, loading}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);
  const scrollRef = useRef(null);
  const itemsPerPage = 15;
 React.useEffect(() => {
    const currentDataEnd = currentPage * itemsPerPage;
    const threshold = data.length - 30; // Load more when within 30 items of the end
    
    if (currentDataEnd >= threshold && hasMore && !loading) {
      onLoadMore();
    }
  }, [currentPage, data.length, hasMore, loading, onLoadMore]);
  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const syncScroll = () => {
      const bottomScroll = document.querySelector('.bottom-scroll-sync');
      if (bottomScroll && scrollRef.current) {
        bottomScroll.scrollLeft = scrollRef.current.scrollLeft;
      }
    };

    const handleScroll = () => {
      // Debounce the sync to avoid too many calls
      if (scrollRef.current) {
        requestAnimationFrame(syncScroll);
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll, { passive: true });
      // Initial sync
      syncScroll();
      return () => scrollRef.current?.removeEventListener('scroll', handleScroll);
    }
  }, [currentPage]); // Re-sync on page change

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isDesktop ? 5 : 3; 
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    );
  }

  // Fix splice logic - don't mutate, create copies
  let displayItems = [...currentItems];
if (currentPage === 1 && isDesktop) {
  displayItems = displayItems.slice(3).map((item, index) => ({
    ...item,
    rank: indexOfFirstItem + index + 4,
  }));
} else {
  displayItems = displayItems.map((item, index) => ({
    ...item,
    rank: item.rank || (indexOfFirstItem + index + 1),
  }));
}

  const getRankStyles = (rank) => {
    switch (rank) {
      case 1:
        return {
          rowBg: 'var(--rank1-bg)',
          rowBorder: 'var(--rank1-border)',
          rankBg: 'linear-gradient(180deg, #F54A00 0%, #E17100 100%)',
          rankColor: 'white',
        };
      case 2:
        return {
          rowBg: 'var(--rank2-bg)',
          rowBorder: 'var(--rank2-border)',
          rankBg: 'linear-gradient(180deg, #A9B5C3 0%, #636F7D 100%)',
          rankColor: 'var(--rank2-rank-color)',
        };
      case 3:
        return {
          rowBg: 'var(--rank3-bg)',
          rowBorder: 'var(--rank3-border)',
          rankBg: 'linear-gradient(180deg, #A93410 0%, #CB3E13 100%)',
          rankColor: 'var(--rank3-rank-color)',
        };
      default:
        return {
          rowBg: 'var(--q3-surface-default)',
          rankBg: 'var(--q3-stroke-normal)',
          rankColor: 'var(--q3-neutral-default)',
        };
    }
  };

  // Render row function to avoid duplication
  const renderRow = (item, index) => {
    const globalRank = item.rank || (indexOfFirstItem + index + 1);
    const rankStyles = getRankStyles(globalRank);
    const physicsScore = item.subjects?.find(s => s.subjectId.title === "Physics")?.totalMarkScored || item.phy || item.physics || 0;
    const chemistryScore = item.subjects?.find(s => s.subjectId.title === "Chemistry")?.totalMarkScored || item.chem || item.chemistry || 0;
    const mathsScore = item.subjects?.find(s => s.subjectId.title === "Mathematics")?.totalMarkScored || item.maths || item.mathematics || 0;
    const overallScore = item.totalMarkScored || item.overallScore || `${item.score || 0}/${item.total || 300}`;
    const accuracy = item.accuracy ? `${parseFloat(item.accuracy).toFixed(2)}%` : item.accuracy;
    const studentName = item.userId?.name || item.studentName || item.name;
    const avatarSrc = item.userId?.profilePicture || item.avatar || avtar;



    return (
      <tr 
  key={item._id || item.id || index} 
  className="bg-[var(--q3-surface-default)] border-[var(--q3-stroke-normal)] "
  style={{ backgroundClip: 'padding-box',
     
   }}
>
        <td 
          className=" whitespace-nowrap text-sm font-medium text-[var(--q3-neutral-default)] w-10 h-10 flex items-center justify-center text-center rounded-full mx-4 my-2"
          style={{ 
            background: rankStyles.rankBg,
            color: rankStyles.rankColor,
            
          }}
        >
          {globalRank}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full"
                src={avatarSrc}
                alt=""
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-[var(--q3-neutral-default)]">
                {studentName}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 whitespace-nowrap text-sm text-[var(--q3-neutral-default)] bg-[var(--q3-surface-dim)] w-20 rounded-full flex items-center justify-center  mx-8 my-4 ">
          {overallScore}<span className=" text-[var(--q3-neutral-light)] ">/300</span>
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

  return (
    <div className="bg-[var(--q3-surface-default)] rounded-lg shadow-md overflow-hidden mb-20 mr-4 ml-4 border border-[var(--q3-stroke-light)]">
      {/* Scrollable Table Container with Fixed Height */}
      <div 
        ref={scrollRef}
        className="table-scroll-sync max-h-[800px] md:max-h-[700px] overflow-y-auto overflow-x-auto" 
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitScrollbar: 'none' 
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <table className="min-w-full divide-y divide-gray-200 w-max">
          <thead className="bg-[var(--q3-surface-dim)] sticky top-0 h-15">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-default)] uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--q3-neutral-default)] uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Maths
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accuracy 
              </th>
            </tr>
          </thead>
     
<tbody className="bg-white divide-y divide-gray-200">
  {(currentPage === 1 && isDesktop)
    ? displayItems.map((item, index) => renderRow(item, index))
    : currentItems.map((item, index) => renderRow(item, index))}
</tbody>

        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-[var(--q3-surface-default)] px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2   text-sm font-medium rounded-full text-[var(--q3-neutral-default)] bg-[var(--q3-surface-dim)]  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full w-10 cursor-pointer  ${
                  currentPage === pageNumber
                    ? 'z-10 bg-[var(--q3-accent-normal)] border-none text-white'
                    : 'bg-[var(--q3-surface-default)] border-gray-300 text-[var(--q3-neutral-default)] '
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-[var(--q3-neutral-default)] bg-[var(--q3-surface-dim)]  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="flex justify-center flex-1 hidden sm:flex">
            <div>
              <nav className="relative z-0 inline-flex gap-2 " aria-label="Pagination">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="cursor-pointer w-20 text-center relative inline-flex items-center px-2 py-2 rounded-full border border-gray-300 bg-[var(--q3-surface-default)] text-sm font-medium text-[var(--q3-neutral-default)] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                >
                  Previous
                </button>
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`relative inline-flex items-center flex justify-center text-center  border text-sm font-medium rounded-full w-10 cursor-pointer  ${
                      currentPage === pageNumber
                        ? 'z-10 bg-[var(--q3-accent-normal)] border-none text-white'
                        : 'bg-[var(--q3-surface-default)] border-gray-300 text-[var(--q3-neutral-default)]'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer w-20 justify-center relative inline-flex items-center px-2 py-2 rounded-full border border-gray-300 bg-[var(--q3-surface-default)] text-sm font-medium text-[var(--q3-neutral-default)]  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
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