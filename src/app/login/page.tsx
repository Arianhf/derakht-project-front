"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./login.module.css";
import logo from "@/assets/images/logo2.png";

export default function AuthPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false); 

    return (
        <div className={styles.container}>
            <Image src={logo} alt="Logo" width={120} height={60} className={styles.logo} />
            <form className={styles.form}>
                {isSignup && (
                    <input type="text" placeholder="Full Name" className={styles.input} />
                )}

                <input type="text" placeholder="Username" className={styles.input} />
                
                {isSignup && (
                    <input type="email" placeholder="Email" className={styles.input} />
                )}

                <div className={styles.passwordContainer}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={styles.input}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeButton}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {isSignup && (
                    <div className={styles.passwordContainer}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className={styles.input}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={styles.eyeButton}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                )}

                <button type="submit" className={styles.button}>
                    {isSignup ? "ثبت نام" : "ورود"}
                </button>
            </form>

            <p className={styles.toggleText}>
                {isSignup ? "قبلاً ثبت نام کرده‌اید؟" : "حساب ندارید؟"}
                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={() => setIsSignup(!isSignup)}
                >
                    {isSignup ? "ورود" : "ثبت نام"}
                </button>
            </p>
        </div>
    );
}
