import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { BACKEND_URL } from '../config';

const ShareParams = () => {
  const { shareLink } = useParams(); // Extract the dynamic part of the URL
  const [data, setData] = useState<any | null>(null); // Ensure the type includes null
  const [error, setError] = useState<string | null>(null); // Ensure error is a string or null
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const json = await response.json();
      console.log("Fetched data:", json);
      setData(json);
      setError(null); // Clear any previous error
    } catch (err) {
      // console.error("Error fetching data:");
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

  // Check if 'data' is not null before rendering
  if (data) {
    return (
      <div>
        <h2>User: {data.username}</h2>
        <div className="space-y-4">
        <div className="flex flex-wrap gap-4 justify-start pt-3 pl-2">
        {data.content.map(({ title, link, type }: any) => (
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
  }

  return null; // Return null if 'data' is still null (shouldn't be the case if loading is false)
};

export default ShareParams;
