'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loginService } from '@/services/loginService';
import { useUser } from '@/contexts/UserContext';
import PasswordInput from '@/components/shared/Form/PasswordInput';
import styles from './LoginPage.module.scss';
import logo from '@/assets/images/logo2.png';
import { toast } from 'react-hot-toast';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [age, setAge] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/';
    const { fetchUser } = useUser();

    useEffect(() => {
        // Check if user is already logged in
        if (loginService.isAuthenticated()) {
            router.push(redirectPath);
        }
    }, [router, redirectPath]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);

            if (isLogin) {
                // Handle login
                await loginService.login(email, password);
                toast.success('با موفقیت وارد شدید');

                // Fetch user data to ensure UserContext is hydrated before redirect
                await fetchUser();

                // Check if there was a pending template selection
                const pendingTemplateString = localStorage.getItem('pendingTemplate');
                if (pendingTemplateString) {
                    // We'll let the template page handle the pending template
                    // Just make sure we're redirecting to the template page
                    router.push(redirectPath);
                } else {
                    router.push(redirectPath);
                }
            } else {
                // Handle signup
                if (password !== confirmPassword) {
                    throw new Error('رمز عبور و تکرار آن مطابقت ندارند');
                }

                if (age < 3) {
                    throw new Error('لطفا سن معتبر وارد کنید');
                }

                await loginService.signup(email, password, confirmPassword, age);
                toast.success('ثبت نام با موفقیت انجام شد');

                // Fetch user data to ensure UserContext is hydrated before redirect
                await fetchUser();

                router.push(redirectPath);
            }
        } catch (err: any) {
            console.error('Authentication error:', err);
            setError(err.message || 'خطا در فرآیند احراز هویت');
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.logoContainer}>
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="درخت"
                            width={180}
                            height={90}
                            className={styles.logo}
                            priority
                        />
                    </Link>
                </div>

                <h1 className={styles.title}>{isLogin ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}</h1>

                {redirectPath !== '/' && isLogin && (
                    <div className={styles.redirectMessage}>
                        برای ادامه، لطفا وارد حساب کاربری خود شوید
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit} method="post">
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>ایمیل</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="example@email.com"
                            required
                            autoComplete="email"
                            dir="ltr"
                        />
                    </div>

                    <PasswordInput
                        label="رمز عبور"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        required
                    />

                    {!isLogin && (
                        <>
                            <PasswordInput
                                label="تکرار رمز عبور"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />

                            <div className={styles.formGroup}>
                                <label htmlFor="age" className={styles.label}>سن</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    value={age || ''}
                                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                                    className={styles.input}
                                    min="3"
                                    max="99"
                                    required
                                    dir="ltr"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading
                            ? 'در حال پردازش...'
                            : isLogin ? 'ورود' : 'ثبت نام'
                        }
                    </button>

                    {error && <p className={styles.error}>{error}</p>}
                </form>

                <div className={styles.toggleText}>
                    {isLogin
                        ? 'حساب کاربری ندارید؟'
                        : 'قبلا ثبت نام کرده‌اید؟'
                    }
                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={toggleAuthMode}
                    >
                        {isLogin ? 'ثبت نام' : 'ورود'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;