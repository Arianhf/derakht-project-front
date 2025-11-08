import React, { useState } from 'react';
import styles from './PaymentMethod.module.scss';
import { FaMoneyBillWave, FaCreditCard, FaArrowRight, FaExchangeAlt } from 'react-icons/fa';

interface PaymentMethodProps {
    selectedMethod: 'online' | 'cash' | 'card_to_card';
    onSubmit: (method: 'online' | 'cash' | 'card_to_card') => void;
    onBack: () => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
                                                                selectedMethod,
                                                                onSubmit,
                                                                onBack
                                                            }) => {
    const [method, setMethod] = useState<'online' | 'cash' | 'card_to_card'>(selectedMethod);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(method);
    };

    return (
        <div className={styles.paymentMethodContainer}>
            <h2 className={styles.sectionTitle}>انتخاب روش پرداخت</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.paymentOptions}>
                    <label
                        className={`${styles.paymentOption} ${method === 'card_to_card' ? styles.selected : ''}`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="card_to_card"
                            checked={method === 'card_to_card'}
                            onChange={() => setMethod('card_to_card')}
                            className={styles.radioInput}
                        />
                        <div className={styles.optionContent}>
                            <div className={styles.optionIcon}>
                                <FaExchangeAlt />
                            </div>
                            <div className={styles.optionDetails}>
                                <h3>کارت به کارت</h3>
                                <p>انتقال وجه به شماره کارت</p>
                            </div>
                        </div>
                    </label>

                    {/*<label*/}
                    {/*    className={`${styles.paymentOption} ${method === 'online' ? styles.selected : ''}`}*/}
                    {/*>*/}
                    {/*    <input*/}
                    {/*        type="radio"*/}
                    {/*        name="paymentMethod"*/}
                    {/*        value="online"*/}
                    {/*        checked={method === 'online'}*/}
                    {/*        onChange={() => setMethod('online')}*/}
                    {/*        className={styles.radioInput}*/}
                    {/*    />*/}
                    {/*    <div className={styles.optionContent}>*/}
                    {/*        <div className={styles.optionIcon}>*/}
                    {/*            <FaCreditCard />*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.optionDetails}>*/}
                    {/*            <h3>پرداخت آنلاین</h3>*/}
                    {/*            <p>پرداخت از طریق درگاه بانکی</p>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</label>*/}

                    {/*<label*/}
                    {/*    className={`${styles.paymentOption} ${method === 'cash' ? styles.selected : ''}`}*/}
                    {/*>*/}
                    {/*    <input*/}
                    {/*        type="radio"*/}
                    {/*        name="paymentMethod"*/}
                    {/*        value="cash"*/}
                    {/*        checked={method === 'cash'}*/}
                    {/*        onChange={() => setMethod('cash')}*/}
                    {/*        className={styles.radioInput}*/}
                    {/*    />*/}
                    {/*    <div className={styles.optionContent}>*/}
                    {/*        <div className={styles.optionIcon}>*/}
                    {/*            <FaMoneyBillWave />*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.optionDetails}>*/}
                    {/*            <h3>پرداخت در محل</h3>*/}
                    {/*            <p>پرداخت هنگام تحویل سفارش</p>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</label>*/}
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={onBack}
                    >
                        <FaArrowRight /> بازگشت
                    </button>
                    <button type="submit" className={styles.continueButton}>
                        ادامه
                    </button>
                </div>
            </form>
        </div>
    );
};