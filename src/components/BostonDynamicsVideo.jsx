import React, { useEffect, useState } from "react";

const BostonDynamicsVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const apiKey = "AIzaSyCivX04cTKWZZg6Mwf98icdLrtbN9TlaEE"; // Your API key
      const channels = [
        "UC7vVhkEfw4nOGp8TyDk7RcQ", // Boston Dynamics
        "UCu8luTDe_Xxd2ahAXsCWX5g", // PRO Robots
      ];

      try {
        // Fetch videos from all channels
        const videoPromises = channels.map((channelId) =>
          fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`
          ).then((response) => response.json())
        );

        const results = await Promise.all(videoPromises);

        // Debugging: Log the results from both channels
        console.log("Results from API:", results);

        // Combine video data from both channels
        const allVideos = results.flatMap((result, index) => {
            if (result.error) {
              console.error(`Error fetching channel ${channels[index]}:`, result.error);
              return [];
            }
            return result.items.map((video) => ({
              title: video.snippet.title,
              videoId: video.id.videoId,
              description: video.snippet.description, // Include description here
            }));
          });

        setVideos(allVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mt-4 mx-auto px-4">
      <h1 className="text-xl font-bold mb-4">Robotics Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div key={index} className="p-4 border rounded shadow">
            {/* Autoplaying YouTube Video */}
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}`}
                title={video.title}
                description={video.description}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded"
              ></iframe>
            </div>
            <h3 className="text-lg font-medium mt-2">{video.title}</h3>
            <h1 className=" font-light mt-2">{video.description}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BostonDynamicsVideos;