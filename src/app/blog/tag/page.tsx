'use client';
import React, { Suspense } from 'react';
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const BlogTagClient = React.lazy(() =>
    import('@/components/blog/TagPage')
);


export default function BlogTagPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <BlogTagClient />
        </Suspense>
    );
}