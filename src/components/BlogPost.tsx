import React, { useState } from 'react';
import blog1 from '../assets/images/blogimage1.jpg';
import { FaUserCircle } from 'react-icons/fa';
import { Pagination } from 'antd';

const BlogPost: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  const blogs = Array.from({ length: 20 }, (_, i) => i + 1); // Mock blog data

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div>
        <h1 style={{ color: '#2B463C' }}>وبلاگ</h1>
      </div>

      {/* Category Filter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {['همه', 'خلاقیت', 'نقاشی', 'معرفی قصه'].map((category, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#f5f5f5bd',
              padding: '2px 20px',
              borderRadius: '20px',
              color: '#345BC0',
              marginLeft: '10px',
              boxShadow: '0px 1px 1px rgb(219, 219, 219)',
            }}
          >
            {category}
          </span>
        ))}
      </div>

      {/* Blog Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginTop: '20px',
          width: '100%',
        }}
      >
        {currentBlogs.map((blog) => (
          <div
            key={blog}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderRadius: '10px',
              width: '100%',
              direction: 'rtl',
              cursor: 'pointer',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '200px' }}>
              <img
                src={blog1}
                alt="blog"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgb(175 175 175 / 32%)',
                  backdropFilter: 'blur(30px)',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px',
                }}
              >
                دسته‌بندی
              </span>
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#888', display: 'flex', gap: '10px' }}>
              <span>۱ دی ۱۴۰۳</span>
              <span>۵ دقیقه مطالعه</span>
            </div>
            <h3 style={{ fontSize: '18px', color: '#2B463C', margin: '10px 0' }}>عنوان وبلاگ</h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '10px', marginTop: '0' }}>
              این یک خلاصه کوتاه از وبلاگ است که اطلاعاتی کلی ارائه می‌دهد.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaUserCircle size={25} color="#2B463C" style={{ borderRadius: '50%' }} />
              <span style={{ fontSize: '14px', color: '#2B463C' }}>علی کلاته</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        current={currentPage}
        total={blogs.length}
        pageSize={blogsPerPage}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default BlogPost;
