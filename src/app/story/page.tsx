'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./stories.module.scss";
import { storyService } from "@/services/storyService";
import { Story } from "@/types/story";
import placeholderImage from "@/assets/images/story.png";

const StoriesPage: React.FC = () => {
    const router = useRouter();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await storyService.getApiStories();
                setStories(response.results);
            } catch (err) {
                setError("مشکلی در دریافت داستان‌ها رخ داده است.");
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (loading) return <p className={styles.loading}>در حال بارگذاری...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>داستان‌های شما</h1>
            <div className={styles.grid}>
                {stories.length === 0 ? (
                    <p className={styles.noStories}>هنوز داستانی ثبت نشده است.</p>
                ) : (
                    stories.map((story) => (
                        <div key={story.id} className={styles.storyCard} onClick={() => router.push(`/story/${story.id}`)}>
                            <Image 
                                src={story.parts[0]?.illustration || placeholderImage} 
                                alt={story.title} 
                                width={300} 
                                height={200} 
                                className={styles.storyImage}
                            />
                            <h2 className={styles.storyTitle}>{story.title}</h2>
                            <p className={styles.storyExcerpt}>{story.parts[0]?.text.substring(0, 50) || "بدون متن"}...</p>
                            <button className={styles.readMoreButton}>ادامه مطلب</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StoriesPage;
