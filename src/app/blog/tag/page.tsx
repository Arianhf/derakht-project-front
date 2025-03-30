'use client';
import React, { Suspense } from 'react';
import { Loading } from '@/components/shared/Loading';

const BlogTagClient = React.lazy(() =>
    import('@/components/blog/TagPage')
);


export default function BlogTagPage() {
    return (
        <Suspense fallback={<Loading />}>
            <BlogTagClient />
        </Suspense>
    );
}