import React from 'react';
import avtar from '../assets/Avatar1.svg';
import checkicon from '../assets/Checks.svg';
import phyicon from '../assets/subjecticon.svg'
import chemicon from '../assets/subjecticon-1.svg'
import mathicon from '../assets/subjecticon-2.svg'
import acuracy from '../assets/Target.svg'


function Card({ data }) {
  const getRankStyles = (rank) => {
    if (rank === 1) {
      return {
        gradient: 'var(--rank1-bg)',
        border: 'var(--rank1-border)',
        badgeBg: 'var(--rank1-rank-bg)',
        badgeColor: 'var(--rank1-rank-color)',
        medal: '🥇',
       
      };
    } else if (rank === 2) {
      return {
        gradient: 'var(--rank2-bg)',
        border: 'var(--rank2-border)',
        badgeBg: 'var(--q3-surface-dimmest)',
        badgeColor: 'var(--q3-neutral-default)',
        medal: '🥈',
       
      };
    } else if (rank === 3) {
      return {
        gradient: 'var(--rank3-bg)',
        border: 'var(--rank3-border)',
        badgeBg: 'var(--rank3-rank-bg)',
        badgeColor: 'var(--rank3-rank-color)',
        medal: '🥉',
       
      };
    }else if (rank === 73) {
    return {
      gradient: 'var(--q3-surface-default)',
      border: 'var(--q3-stroke-light)',
      badgeBg: 'var(--q3-surface-dimmer)',
      badgeColor: 'var(--q3-neutral-default)',
      medal: null,
    };
  }
  };

 const getRankSuffix = (rank) => {
  const j = rank % 10,
        k = rank % 100;
  if (k === 11 || k === 12 || k === 13) return 'th';
  if (j === 1) return 'st';
  if (j === 2) return 'nd';
  if (j === 3) return 'rd';
  return 'th';
};


 const mappedData = data.slice(0, 3).map(item => {
    const phyScore = item.subjects?.find(s => s.subjectId.title === "Physics")?.totalMarkScored ?? 0;
    const chemScore = item.subjects?.find(s => s.subjectId.title === "Chemistry")?.totalMarkScored ?? 0;
    const mathsScore = item.subjects?.find(s => s.subjectId.title === "Mathematics")?.totalMarkScored ?? 0;
    return {
      name: item.userId?.name || item.name,
      rank: item.rank,
      overallScore: item.totalMarkScored,
      phyScore,
      chemScore,
      mathsScore,
      accuracy: item.accuracy,
      profileImage: item.userId?.profilePicture,
    };
  });

 const rank73 = data.find(item => item.rank === 73);
if (rank73) {
  const phyScore = rank73.subjects?.find(s => s.subjectId.title === "Physics")?.totalMarkScored ?? 0;
  const chemScore = rank73.subjects?.find(s => s.subjectId.title === "Chemistry")?.totalMarkScored ?? 0;
  const mathsScore = rank73.subjects?.find(s => s.subjectId.title === "Mathematics")?.totalMarkScored ?? 0;
  mappedData.push({
    name: rank73.userId?.name || rank73.name,
    isCurrentUser: true,
    rank: rank73.rank,
    overallScore: rank73.totalMarkScored,
    phyScore,
    chemScore,
    mathsScore,
    accuracy: rank73.accuracy,
    profileImage: rank73.userId?.profilePicture,
  });
}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {mappedData.map((item, index) => {
        const rankStyles = getRankStyles(item.rank);

        return (
        <div
  key={index}
  className="relative rounded-3xl p-[2px]" 
  style={{
    background: rankStyles.border, 
    borderRadius: rankStyles.borderRadius,
  }}
>
    
     <div
  key={index}
  className="p-6 relative overflow-hidden transition-all duration-300 hover:scale-105 rounded-3xl"
  style={{
    background: rankStyles.gradient,
    borderRadius: rankStyles.borderRadius,
  }}
>
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden  border-none dark:border-[var(--q3-surface-default)]">
                  {item.profileImage ? (
                    <img
                      src={item.profileImage}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--q3-neutral-light)]">
                      <img src={avtar} alt="Default Avatar" className="w-[64px] h-[64px]" />
                    </div>
                  )}
                </div>
                {rankStyles.medal && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-2xl flex items-center border-none justify-center border-2 dark:border-[var(--q3-surface-default)] rounded-full w-8 h-8">
                    {rankStyles.medal}
                  </div>
                )}
              </div>

             <h3 className="mt-3 text-lg font-bold text-[var(--q3-neutral-default)] text-center">
  {item.name || item.userId?.name} {item.isCurrentUser && '(You)'}
</h3>

              <div
                className="mt-2 px-4 py-1.5 rounded-full text-sm font-semibold "
                style={{
                  backgroundColor: rankStyles.badgeBg,
                  color: rankStyles.badgeColor,}}
              >
                {item.rank}
                <sup>{getRankSuffix(item.rank)}</sup> Rank
              </div>
            </div>

            {/* Scores Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={checkicon} alt="" />
                  <span className="text-[var(--q3-neutral-light)] text-sm">Overall Score</span>
                </div>
                <span className="text-[var(--q3-neutral-default)] font-bold">
                  {item.overallScore}<span className="text-[var(--q3-neutral-light)] font-normal">/300</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={phyicon} alt="phy" className="w-4 h-4"/>
                  <span className="text-[var(--q3-neutral-light)] text-sm">Phy Score</span>
                </div>
                <span className="text-[var(--q3-neutral-default)] font-semibold">{item.phyScore}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={chemicon} alt="chem" className="w-4 h-4"/>
                  <span className="text-[var(--q3-neutral-light)] text-sm">Chem Score</span>
                </div>
                <span className="text-[var(--q3-neutral-default)] font-semibold">{item.chemScore}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={mathicon} alt="math" className="w-4 h-4"/>
                  <span className="text-[var(--q3-neutral-light)] text-sm">Maths Score</span>
                </div>
                <span className="text-[var(--q3-neutral-default)] font-semibold">{item.mathsScore}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[var(--q3-stroke-light)]">
                <div className="flex items-center gap-2">
                  <img src={acuracy} alt="accuracy" />
                  <span className="text-[var(--q3-neutral-light)] text-sm">Accuracy</span>
                </div>
<span className="text-[var(--q3-neutral-default)] font-semibold">
  {item.accuracy.toFixed(2)}%
</span>              </div>
            </div>
          </div>
          </div>
        );
      })}
    </div>
  );
}

export default Card;
