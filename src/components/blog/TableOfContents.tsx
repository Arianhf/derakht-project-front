// src/components/blog/TableOfContents.tsx
'use client';

import React, { useEffect, useState } from 'react';
import styles from './TableOfContents.module.scss';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);

    useEffect(() => {
        // Parse the content to extract headings when the component mounts or content changes
        const extractHeadings = () => {
            if (typeof window === 'undefined' || !content) return [];

            // Parse HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');

            // Get all headings (h1, h2, h3, h4)
            const headings = doc.querySelectorAll('h1, h2, h3, h4');
            const items: TOCItem[] = [];

            // Process each heading
            headings.forEach((heading, index) => {
                // Skip the main title (usually the first h1)
                if (heading.tagName === 'H1' && index === 0) return;

                // Generate a unique ID for this heading if it doesn't have one
                if (!heading.id) {
                    const headingText = heading.textContent || `heading-${index}`;
                    heading.id = headingText
                        .toLowerCase()
                        .replace(/[^\w\s]/g, '')  // Remove special characters
                        .replace(/\s+/g, '-');    // Replace spaces with hyphens
                }

                // Add to our TOC items
                items.push({
                    id: heading.id,
                    text: heading.textContent || `Heading ${index + 1}`,
                    level: parseInt(heading.tagName.substring(1), 10), // Extract the level number from the tag name
                });
            });

            return items;
        };

        const items = extractHeadings();
        setTocItems(items);
    }, [content]);

    // Don't render if no TOC items
    if (tocItems.length === 0) {
        return null;
    }

    // Helper function to get class name based on heading level
    const getLevelClassName = (level: number) => {
        switch(level) {
            case 1: return styles.level1;
            case 2: return styles.level2;
            case 3: return styles.level3;
            case 4: return styles.level4;
            default: return styles.level2;
        }
    };

    return (
        <div className={styles.tocContainer}>
            <h3 className={styles.tocTitle}>فهرست مطالب</h3>
            <ul className={styles.tocList}>
                {tocItems.map((item, index) => (
                    <li
                        key={index}
                        className={`${styles.tocItem} ${getLevelClassName(item.level)}`}
                    >
                        <a
                            href={`#${item.id}`}
                            className={styles.tocLink}
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(item.id);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableOfContents;