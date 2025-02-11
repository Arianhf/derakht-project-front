import React from 'react';
import { UI_CONSTANTS } from '../../constants';

interface ErrorMessageProps {
    message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
                                                              message = UI_CONSTANTS.ERROR_MESSAGE
                                                          }) => (
    <div className="error-container">
        <p>{message}</p>
    </div>
);