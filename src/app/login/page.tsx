"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation"; 
import styles from "./login.module.css";
import logo from "@/assets/images/logo2.png";
import { loginService } from "@/services/loginService";

export default function AuthPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return "رمز عبور باید حداقل ۸ کاراکتر داشته باشد.";
        }

        const commonPasswords = ["password", "123456", "qwerty", "111111", "12345678", "abc123", "password1", "123123"];
        if (commonPasswords.includes(password)) {
            return "رمز عبور شما بسیار رایج است. لطفاً رمز قوی‌تری انتخاب کنید.";
        }

        return "";
    };

    const validateAge = (age: string) => {
        const ageNumber = Number(age);
        if (!ageNumber || ageNumber < 1) {
            return "لطفاً سن معتبر وارد کنید.";
        }
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isSignup) {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("رمز عبور و تأیید رمز عبور مطابقت ندارند");
                }

                const passwordError = validatePassword(formData.password);
                if (passwordError) {
                    throw new Error(passwordError);
                }

                const ageError = validateAge(formData.age);
                if (ageError) {
                    throw new Error(ageError);
                }

                await loginService.signup(
                    formData.email,
                    formData.password,
                    formData.confirmPassword,
                    Number(formData.age)
                );

            } else {
                await loginService.login(formData.email, formData.password);
            }

            setFormData({ email: "", password: "", confirmPassword: "", age: "" });

            router.push("/blog");

        } catch (err: any) {
            setError(err.message || "خطایی رخ داده است");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Image src={logo} alt="Logo" width={120} height={60} className={styles.logo} />
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                {isSignup && (
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        className={styles.input}
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                )}

                <div className={styles.passwordContainer}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className={styles.input}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeButton}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {isSignup && (
                    <div className={styles.passwordContainer}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className={styles.input}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
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

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "در حال پردازش..." : isSignup ? "ثبت نام" : "ورود"}
                </button>
            </form>

            <p className={styles.toggleText}>
                {isSignup ? "قبلاً ثبت نام کرده‌اید؟" : "حساب ندارید؟"}
                <button type="button" className={styles.toggleButton} onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? "ورود" : "ثبت نام"}
                </button>
            </p>
        </div>
    );
}
