'use client';

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./storyDetails.module.scss";
import image from "@/assets/images/story.png"

const stories = [
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

const StoryDetailsPage: React.FC = () => {
    const params = useParams();
    const storyId = Number(params.id);
    const story = stories.find((s) => s.id === storyId);

    if (!story) return <div className={styles.notFound}>داستانی یافت نشد</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{story.title}</h1>
            {story.parts.map((part, index) => (
                <div key={index} className={styles.storyPart}>
                    <Image src={part.illustration} alt={story.title} width={800} height={500} />
                    <p className={styles.storyText}>{part.text}</p>
                </div>
            ))}
        </div>
    );
};

export default StoryDetailsPage;
