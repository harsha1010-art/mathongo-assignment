import React, { useEffect, useRef } from 'react';
import avtar from '../assets/Avatar1.svg';

function BottomRankStyle({ data }) {
  const bottomScrollRef = useRef(null);
  const rank73 = data?.find(item => item.rank === 73);

  useEffect(() => {
    const syncScroll = () => {
      const tableScroll = document.querySelector('.table-scroll-sync');
      if (tableScroll && bottomScrollRef.current) {
        tableScroll.scrollLeft = bottomScrollRef.current.scrollLeft;
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(syncScroll);
    };

    if (bottomScrollRef.current) {
      bottomScrollRef.current.addEventListener('scroll', handleScroll, { passive: true });
      syncScroll();
      return () => bottomScrollRef.current?.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!rank73) return null;

  const physics = rank73.subjects?.find(s => s.subjectId.title === "Physics")?.totalMarkScored ?? 0;
  const chemistry = rank73.subjects?.find(s => s.subjectId.title === "Chemistry")?.totalMarkScored ?? 0;
  const maths = rank73.subjects?.find(s => s.subjectId.title === "Mathematics")?.totalMarkScored ?? 0;

  const userData = {
    rank: rank73.rank,
    name: rank73.userId?.name || rank73.name,
    isYou: true,
    overallScore: `${rank73.totalMarkScored}/300`,
    physics,
    chemistry,
    maths,
    accuracy: `${Number(rank73.accuracy).toFixed(2)}%`,
    profileImage: rank73.userId?.profilePicture,
  };

  return (
    <div 
      ref={bottomScrollRef} 
      className="bottom-scroll-sync fixed bottom-0 bg-[var(--q3-surface-dimmest)] xl:rounded-t-3xl mt-6 border border-[var(--q3-stroke-light)] z-50 xl:w-[85vw] xl:mx-auto lg:mx-auto left-0 right-0 overflow-x-auto blur-[var(--q3-glass-light)] backdrop-blur-sm max-w-7xl mx-auto z-0 position-relative"
    >
      <style jsx>{`
        .bottom-scroll-sync::-webkit-scrollbar {
          display: none;
        }
        .bottom-scroll-sync {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <table className="min-w-full divide-y divide-gray-200 w-max">
        <tbody className="bg-[var(--q3-surface-dimmest)]">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-16">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-800 ">
                {userData.rank}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap  md:w-70 lg:w-40">
              <div className="flex items-center gap-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={userData.profileImage || avtar}
                  alt={userData.name}
                />
                <div>
                  <p className="text-sm font-medium text-[var(--q3-neutral-default)]">
                    {userData.name}
                    {userData.isYou && <span className="">(You)</span>}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-32 ">
              <div className="bg-white px-3 py-1 rounded-full  text-sm font-medium text-gray-800 inline-block">
                {userData.overallScore}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-20 ">
              <div className=" px-2 py-1 rounded  text-md text-[var(--q3-neutral-default)] inline-block">
                {userData.physics}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-20 ">
              <div className=" px-2 py-1 rounded  text-md text-[var(--q3-neutral-default)] inline-block">
                {userData.chemistry}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-20 ">
              <div className=" px-2 py-1 rounded  text-md text-[var(--q3-neutral-default)] inline-block">
                {userData.maths}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-24">
              <div className="text-sm font-semibold text-[var(--q3-neutral-default)]">
                {userData.accuracy}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BottomRankStyle;