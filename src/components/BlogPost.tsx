import React from 'react';

const BlogPost: React.FC = () => {
  return (
    <div className="blog-post">
      <h1>Exploring the Wonders of Hiking</h1>
      <p className="author">Theodore Reginald</p>
      <p className="date">24 Jan 2024 - 10 mins read</p>
      <p className="content">
        An iconic landmark, this post unveils the secrets that make this destination a traveler's paradise.
      </p>
      <div className="categories">
        <span>Destination</span>
        <span>Culinary</span>
        <span>Lifestyle</span>
        <span>Tips & Hacks</span>
      </div>
    </div>
  );
};

export default BlogPost;