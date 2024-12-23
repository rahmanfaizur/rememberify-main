import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const ShareParams = () => {
  const { shareLink } = useParams(); // Extract the dynamic part of the URL
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      console.log(`Fetching data from: http://localhost:3000/api/v1/brain/${shareLink}`);
      const response = await fetch(`http://localhost:3000/api/v1/brain/${shareLink}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const json = await response.json();
      console.log("Fetched data:", json);
      setData(json);
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shareLink) {
      fetchData();

      // Set up interval to refresh data every 5 minutes
      const interval = setInterval(fetchData, 5 * 60 * 1000);

      // Clear interval on component unmount
      return () => clearInterval(interval);
    }
  }, [shareLink]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User: {data.username}</h2>
      <div className="space-y-4">
        <div className="flex space-x-4 flex-wrap">
          {data.content.map(({ title, link, type }) => (
            <Card
              key={link} // Ensure unique keys
              link={link}
              type={type}
              title={title}
              showDelete={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareParams;
