import React from 'react';
import { UI_CONSTANTS } from '@/constants';

export const Loading: React.FC = () => (
    <div className="loading-container">
        <p>{UI_CONSTANTS.LOADING_MESSAGE}</p>
    </div>
);