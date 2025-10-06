import React from "react";
import useApiFetch from "../Services/apifetch";
import LeaderBoardNav from "../Components/leaderboardnav";
import Card from "../Components/card";
import RankTable from "../Components/ranktable";
import BottomRankStyle from "../Components/bottomrankstyle";

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-lg my-6"></div>
    </div>
  );
}

function LandingPage() {
  const [allData, setAllData] = React.useState([]);
  const [apiPage, setApiPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [error, setError] = React.useState(null);
  const apiurl = import.meta.env.VITE_API;

  // Fetch data function
  const fetchData = async (page) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${apiurl}/leaderboard?page=${page}&limit=100`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      const results = data?.data?.results || [];
      
      // Check if there's more data
      if (results.length < 100) {
        setHasMore(false);
      }
      
      return results;
    } catch (err) {
      setError(err.message);
      setHasMore(false);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  React.useEffect(() => {
    fetchData(1).then(data => {
      setAllData(data);
    });
  }, []);

  // Load more data when apiPage changes
  React.useEffect(() => {
    if (apiPage > 1) {
      fetchData(apiPage).then(data => {
        setAllData(prev => [...prev, ...data]);
      });
    }
  }, [apiPage]);

  // Handler to load more data
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setApiPage(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto z-0 position-relative">
      <LeaderBoardNav />
      {loading && allData.length === 0 ? (
        <Skeleton />
      ) : (
        <>
          <div className="hidden lg:block">
            <Card data={allData} />
          </div>
          <RankTable 
            data={allData} 
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loading}
          />
          <BottomRankStyle data={allData} />
        </>
      )}
      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg m-4">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default LandingPage;