// src/app/admin/feature-flags/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import FeatureProtectedRoute from '@/components/shared/FeatureProtectedRoute';
import logo from '@/assets/images/logo2.png';
import styles from './page.module.scss';
import { featureFlagService, FeatureFlag } from '@/services/featureFlagService';

const FeatureFlagsPage = () => {
    const [flags, setFlags] = useState<FeatureFlag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlags = async () => {
            try {
                setLoading(true);
                const featureFlags = await featureFlagService.getAllFlags();
                setFlags(featureFlags);
            } catch (error) {
                console.error('Error fetching feature flags:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlags();
    }, []);

    const toggleFlag = (flagName: string, currentValue: boolean) => {
        // Update localStorage for development
        localStorage.setItem(`feature_${flagName}`, (!currentValue).toString());

        // Update state
        setFlags(prevFlags =>
            prevFlags.map(flag =>
                flag.name === flagName ? { ...flag, enabled: !currentValue } : flag
            )
        );
    };

    return (
        <FeatureProtectedRoute featureName="admin_dashboard">
            <div className={styles.container}>
                <Navbar logo={logo} />

                <div className={styles.content}>
                    <h1 className={styles.title}>مدیریت ویژگی‌ها</h1>

                    {loading ? (
                        <p className={styles.loading}>در حال بارگذاری...</p>
                    ) : (
                        <div className={styles.flagsGrid}>
                            {flags.map(flag => (
                                <div key={flag.name} className={styles.flagCard}>
                                    <div className={styles.flagInfo}>
                                        <h3 className={styles.flagName}>{flag.name}</h3>
                                        <p className={styles.flagDescription}>{flag.description || 'بدون توضیحات'}</p>
                                    </div>

                                    <div className={styles.flagToggle}>
                                        <label className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                checked={flag.enabled}
                                                onChange={() => toggleFlag(flag.name, flag.enabled)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                        <span className={styles.status}>
                      {flag.enabled ? 'فعال' : 'غیرفعال'}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.note}>
                        <p>توجه: تغییرات فقط روی مرورگر فعلی شما اعمال می‌شود و برای توسعه محلی است.</p>
                    </div>
                </div>

                <Footer />
            </div>
        </FeatureProtectedRoute>
    );
};

export default FeatureFlagsPage;