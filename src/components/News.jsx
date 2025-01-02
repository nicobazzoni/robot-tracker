import React, { useState, useEffect } from "react";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=robotics&language=en&sortBy=publishedAt&apiKey=${apiKey}`
        );
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5 mx-auto px-4 overflow-x-hidden">
        <h4 className="font-mono font-bold tracking-widest">Articles</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <div key={index} className="p-4 border rounded shadow bg-white">
            {/* Image Container */}
            <div className="relative w-full aspect-video overflow-hidden rounded">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-medium mt-2">{article.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 block"
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;