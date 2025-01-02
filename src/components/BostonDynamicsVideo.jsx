import React, { useEffect, useState } from "react";

const BostonDynamicsVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY; // Use the environment variable for the API key
      const channels = [
        "UC7vVhkEfw4nOGp8TyDk7RcQ", // Boston Dynamics
        "UCu8luTDe_Xxd2ahAXsCWX5g", // PRO Robots
      ];

      const cacheKey = "roboticsVideosCache";
      const cacheExpiryKey = "roboticsVideosExpiry";
      const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const now = Date.now();

      try {
        // Check for cached data
        const cachedVideos = JSON.parse(localStorage.getItem(cacheKey));
        const cacheExpiry = localStorage.getItem(cacheExpiryKey);

        if (cachedVideos && cacheExpiry && now < parseInt(cacheExpiry, 10)) {
          console.log("Using cached videos.");
          setVideos(cachedVideos);
          setLoading(false);
          return;
        }

        // Fetch data from the YouTube API
        const videoPromises = channels.map((channelId) =>
          fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`
          ).then((response) => {
            if (!response.ok) {
              throw new Error(`Error fetching channel ${channelId}: ${response.status}`);
            }
            return response.json();
          })
        );

        const results = await Promise.all(videoPromises);

        // Process video data
        const allVideos = results.flatMap((result) =>
          result.items.map((video) => ({
            title: video.snippet.title,
            videoId: video.id.videoId,
            description: video.snippet.description,
          }))
        );

        // Cache videos
        localStorage.setItem(cacheKey, JSON.stringify(allVideos));
        localStorage.setItem(cacheExpiryKey, (now + cacheDuration).toString());

        setVideos(allVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mt-4 mx-auto px-4">
      <h1 className="text-xl font-bold mb-4">Robotics Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div key={index} className="p-4 border rounded shadow">
            {/* YouTube Video */}
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded"
              ></iframe>
            </div>
            <h3 className="text-lg font-medium mt-2">{video.title}</h3>
            <p className="text-sm font-light mt-2">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BostonDynamicsVideos;