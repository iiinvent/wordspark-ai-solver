
import React from "react";

const ResultSkeleton = () => {
  return (
    <div className="puzzle-card p-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="skeleton h-7 w-24"></div>
        <div className="skeleton h-7 w-7 rounded-full"></div>
      </div>
      
      <div className="mt-2 flex items-center">
        <div className="skeleton h-4 w-16"></div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-3/4"></div>
      </div>
    </div>
  );
};

export default ResultSkeleton;
