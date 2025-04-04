'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogDetails from '@/components/blog/BlogDetails';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import logo from '@/assets/images/logo2.png';
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";

const BlogDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const data = await blogService.getPostById(blogId);
        setBlog(data);
      } catch (err) {
        console.error(err);
        setError('مشکلی در دریافت مقاله رخ داده است.');
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlogDetails();
    }
  }, [blogId]);

  if (loading) return <LoadingSpinner message="در حال بارگذاری سفارش‌ها..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!blog) return <ErrorMessage message="مقاله مورد نظر یافت نشد" />;

  // The issue is here - we need to ensure the blog object matches the expected type
  // TypeScript is complaining because the blog object from the API might not
  // have the exact structure expected by the BlogDetails component

  // Create a properly typed object to pass to BlogDetails
  const blogDetailsData = {
    title: blog.title || '',
    author: {
      first_name: blog.owner?.first_name || 'نویسنده'
    },
    jalali_date: blog.jalali_date,
    content: blog.body || '',
    header_image: blog.header_image ? {
      meta: {
        download_url: blog.header_image.meta?.download_url || ''
      },
      title: blog.header_image.title
    } : undefined
  };

  return <BlogDetails blog={blogDetailsData} logo={logo} />;
};

export default BlogDetailPage;