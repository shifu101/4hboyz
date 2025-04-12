import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import axios from 'axios';

export default function UpdatePhone({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, errors } = useForm({
        phone: user.phone || '',
        otp: '',
    });

    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(0);

    // Countdown logic
    useEffect(() => {
        if (otpSent && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [otpSent, countdown]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const sendOtp = async () => {
        try {
            const res = await axios.post(route('phone.send-otp'), { phone: data.phone });
            setOtpSent(true);
            setCountdown(300); // 5 minutes
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to send OTP.');
        }
    };

    const verifyOtp = async () => {
        try {
            setVerifying(true);
            const res = await axios.post(route('phone.verify-otp'), { otp: data.otp });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Invalid OTP.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Layout>
            <section className='max-w-2xl bg-white p-6 rounded-lg'>
                <header>
                    <h2 className="text-lg font-semibold">Update Phone</h2>
                    <p className="mt-1 text-sm text-gray-600">Receive OTP to verify phone for salary advances</p>
                </header>

                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="phone" className="block font-medium mb-1">Phone</label>
                        <PhoneInput
                            id="phone"
                            placeholder="Enter phone number"
                            value={data.phone}
                            onChange={(value) => setData('phone', value)}
                            className="w-full"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <PrimaryButton onClick={sendOtp} disabled={countdown > 0}>
                        {countdown > 0 ? `Resend in ${formatTime(countdown)}` : 'Send OTP'}
                    </PrimaryButton>

                    {otpSent && countdown > 0 && (
                        <div className="mt-4">
                            <label className="block font-medium mb-1">Enter OTP</label>
                            <input
                                type="text"
                                value={data.otp}
                                onChange={(e) => setData('otp', e.target.value)}
                                className="w-full border-gray-300 rounded"
                            />
                            <PrimaryButton
                                className="mt-2"
                                onClick={verifyOtp}
                                disabled={verifying || !data.otp}
                            >
                                {verifying ? 'Verifying...' : 'Verify OTP'}
                            </PrimaryButton>
                            <p className="text-sm text-gray-500 mt-1">Code expires in: {formatTime(countdown)}</p>
                        </div>
                    )}

                    {countdown === 0 && otpSent && (
                        <p className="text-sm text-red-600 mt-2">OTP expired. Please resend to try again.</p>
                    )}

                    {message && (
                        <p className="text-sm text-green-600 mt-2">{message}</p>
                    )}
                </div>
            </section>
        </Layout>
    );
}
