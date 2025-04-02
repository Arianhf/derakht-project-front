import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '../Navbar.module.scss';

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality here
        console.log('Searching for:', searchTerm);
        // You could redirect to search results page or trigger a search action
    };

    return (
        <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
            <input
                type="text"
                placeholder="جستجو"
                className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <FaSearch color="#555" className={styles.searchIcon} />
        </form>
    );
};

export default SearchBar;