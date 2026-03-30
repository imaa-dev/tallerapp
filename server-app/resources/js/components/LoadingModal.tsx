// src/components/LoadingModal.tsx
import React from 'react';
import { useLoading } from '@/context/LoadingContext';
import '../../css/app.css';

const LoadingModal = () => {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div className="loading-overlay">
            <div className="spinner" />
        </div>
    );
};

export default LoadingModal;
