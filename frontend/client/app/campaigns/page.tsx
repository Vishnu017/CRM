'use client'
import React from 'react';
import CampaignTable from './campaignTable';


const App = () => {
  return (
    
    <div className="container mx-auto p-6">
      <CampaignTable />
      <div className="mt-4">
        <button
          onClick={() => window.location.href = "http://localhost:3000"}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default App;
