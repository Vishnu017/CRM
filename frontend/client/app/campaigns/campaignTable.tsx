'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Campaign {
  campaign_id: number;
  segment_id: number;
  message: string;
  created_at: string;
}

const CampaignTable = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchSegmentId, setSearchSegmentId] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchAllCampaigns();
  }, []);

  const fetchAllCampaigns = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/campaigns');
      const sortedCampaigns = response.data.sort(
        (a: Campaign, b: Campaign) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setCampaigns(sortedCampaigns);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCampaign = async () => {
    if (!searchSegmentId) return;
    setLoading(true);
    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/campaigns/segment/${searchSegmentId}`
      );
      setCampaigns(response.data); // Display campaigns filtered by segment_id
    } catch (err) {
      console.error('Error searching campaigns:', err);
      setError('Campaigns not found');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setIsSearching(false);
    setSearchSegmentId('');
    fetchAllCampaigns();
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCampaigns = campaigns.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-white rounded shadow-lg mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter Segment ID"
            value={searchSegmentId}
            onChange={(e) => setSearchSegmentId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <button
            onClick={handleSearchCampaign}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Search
          </button>
          {isSearching && (
            <button
              onClick={handleResetSearch}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <table className="min-w-full bg-white border rounded-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Campaign ID</th>
            <th className="px-4 py-2 text-left">Segment ID</th>
            <th className="px-4 py-2 text-left">Message</th>
            <th className="px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentCampaigns.map((campaign) => (
            <tr key={campaign.campaign_id} className="border-b">
              <td className="px-4 py-2">{campaign.campaign_id}</td>
              <td className="px-4 py-2">{campaign.segment_id}</td>
              <td className="px-4 py-2">{campaign.message}</td>
              <td className="px-4 py-2">{campaign.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!isSearching && (
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-l disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(Math.ceil(campaigns.length / itemsPerPage))].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border ${
                i + 1 === currentPage ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(campaigns.length / itemsPerPage)}
            className="px-3 py-1 border rounded-r disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignTable;
