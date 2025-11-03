'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import styles from '../Navbar.module.scss';

const SearchBar: React.FC = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Only search if there's a search term
        const trimmedTerm = searchTerm.trim();
        if (!trimmedTerm) {
            return;
        }

        // Navigate to search results page with query parameter
        router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);

        // Clear search input (optional - you can remove this line if you want to keep the search term)
        // setSearchTerm('');
    };

    return (
        <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
            <input
                type="text"
                placeholder="جستجو در مقالات و محصولات"
                className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <button type="submit" className={styles.searchButton} aria-label="جستجو">
                <FaSearch color="#555" className={styles.searchIcon} />
            </button>
        </form>
    );
};

export default SearchBar;