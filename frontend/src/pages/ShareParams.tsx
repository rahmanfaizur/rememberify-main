import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { BACKEND_URL } from '../config';

const ShareParams = () => {
  const { shareLink } = useParams(); // Extract the dynamic part of the URL from the route.
  const [data, setData] = useState<any | null>(null); // State to store fetched data.
  const [error, setError] = useState<string | null>(null); // State to handle errors.
  const [loading, setLoading] = useState(true); // State to manage the loading state.

  // Function to fetch data from the backend API.
  const fetchData = async () => {
    try {
      // Make a GET request to the backend API using the shareLink from the URL.
      const response = await fetch(`${BACKEND_URL}/api/v1/brain/${shareLink}`);

      // Throw an error if the response status is not OK.
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      // Parse the JSON response and update the state with the fetched data.
      const json = await response.json();
      setData(json);
      setError(null); // Clear any existing error when the request is successful.
    } catch (err) {
      // Update the error state with a user-friendly message in case of failure.
      setError('Failed to load data. Please try again later.');
    } finally {
      // Set loading to false after the fetch attempt (success or failure).
      setLoading(false);
    }
  };

  // useEffect hook to handle fetching data and setting up periodic refresh.
  useEffect(() => {
    if (shareLink) {
      fetchData(); // Fetch data when the component mounts or shareLink changes.

      // Set up an interval to refresh the data every 5 minutes.
      const interval = setInterval(fetchData, 5 * 60 * 1000);

      // Clear the interval when the component unmounts to avoid memory leaks.
      return () => clearInterval(interval);
    }
  }, [shareLink]); // Dependency array ensures the effect runs when shareLink changes.

  // Return a loading state while data is being fetched.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  // Return an error state if there was an issue fetching the data.
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Render the content when data is successfully fetched.
  if (data) {
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">
            User: <span className="text-blue-400">{data.username}</span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.content.map(({ title, link, type }: any) => (
              <Card
                key={link} // Provide a unique key for each item to optimize rendering.
                link={link}
                type={type}
                title={title}
                showDelete={false} // Ensure the delete option is not displayed.
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null; // Return null if the data is still not available (edge case).
};

export default ShareParams;
