import React from 'react';
import BlogPost from '../components/BlogPost';
import Header from '../components/Header';

const BlogPage: React.FC = () => {
  return (
    <div className="blog-page">
      <Header />
      <div className="blog-content">
        <BlogPost />
      </div>
    </div>
  );
};

export default BlogPage;