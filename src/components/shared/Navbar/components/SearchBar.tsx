'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import searchService from '@/services/searchService';
import { GlobalSearchResponse } from '@/types/search';
import SearchDropdown from './SearchDropdown';
import styles from '../Navbar.module.scss';

const SearchBar: React.FC = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<GlobalSearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounced search function
    const performSearch = async (query: string) => {
        if (!query.trim() || query.trim().length < 2) {
            setSearchResults(null);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        setShowDropdown(true);

        try {
            const data = await searchService.globalSearch({
                query: query.trim(),
                threshold: 0.1,
            });
            setSearchResults(data);
        } catch (error) {
            console.error('Live search error:', error);
            setSearchResults(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer for debounced search
        debounceTimerRef.current = setTimeout(() => {
            performSearch(value);
        }, 300); // 300ms debounce
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

        // Close dropdown and reset
        setShowDropdown(false);
        setSearchResults(null);
    };

    const handleCloseDropdown = () => {
        setShowDropdown(false);
        setSearchResults(null);
        setSearchTerm('');
    };

    return (
        <div ref={searchBarRef} className={styles.searchBarContainer}>
            <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="جستجو در مقالات و محصولات"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => {
                        if (searchResults && searchTerm.trim()) {
                            setShowDropdown(true);
                        }
                    }}
                />
                <button type="submit" className={styles.searchButton} aria-label="جستجو">
                    <FaSearch color="#555" className={styles.searchIcon} />
                </button>
            </form>

            {showDropdown && (
                <SearchDropdown
                    results={searchResults?.results?.results || []}
                    loading={loading}
                    query={searchTerm}
                    onClose={handleCloseDropdown}
                />
            )}
        </div>
    );
};

export default SearchBar;