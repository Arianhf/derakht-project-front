'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import styles from "./stories.module.scss";
import image from "@/assets/images/story.png"

interface Story {
    id: number;
    title: string;
    parts: { illustration: string | StaticImageData; text: string }[];
}

const stories: Story[] = [
    {
        id: 1,
        title: "داستان اول",
        parts: [
            { illustration: image, text: "این داستان درباره..." },
            { illustration: image, text: "قسمت دوم داستان..." },
        ],
    },
    {
        id: 2,
        title: "داستان دوم",
        parts: [
            { illustration: image, text: "یک داستان جذاب..." },
            { illustration: image, text: "ادامه داستان..." },
        ],
    },
];

const StoriesPage: React.FC = () => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>داستان‌های شما</h1>
            <div className={styles.grid}>
                {stories.map((story) => (
                    <div key={story.id} className={styles.storyCard} onClick={() => router.push(`/stories/${story.id}`)}>
                        <Image 
                            src={story.parts[0].illustration} 
                            alt={story.title} 
                            width={300} 
                            height={200} 
                            className={styles.storyImage}
                        />
                        <h2 className={styles.storyTitle}>{story.title}</h2>
                        <p className={styles.storyExcerpt}>{story.parts[0].text.substring(0, 50)}...</p>
                        <button className={styles.readMoreButton}>ادامه مطلب</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoriesPage;
