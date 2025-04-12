import React, { useState, useEffect } from 'react';
import { useForm, Link, Head, router, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Guest from '@/Layouts/GuestLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [showForm, setShowForm] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { company, er, success } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        unique_number: '',
        staff_number: '',
        role_id: 3,
        phone: '',
        password_confirmation: '',
        company_id: company ? company.id : null,
    });

    function sanitizePhone(phone) {
        if (!phone) return '';
        let digits = phone.replace(/\D/g, '');
        if (digits.startsWith('0')) digits = digits.slice(1);
        if (!digits.startsWith('254')) {
            if (digits.startsWith('7') || digits.length === 9) {
                digits = '254' + digits;
            }
        }
        return digits.slice(0, 12);
    }

    const searchCompany = () => {
        if (!data.unique_number) {
            toast.error('Please enter a company number');
            return;
        }
        setIsSearching(true);
        router.get(route('companies.search', data.unique_number), {});
    };

    const submit = (e) => {
        e.preventDefault();
        const sanitizedPhone = sanitizePhone(data.phone);
        setData('phone', sanitizedPhone);
        post(route('register'));
    };

    useEffect(() => {
        if (er) {
            toast.error(er, { duration: 4000, position: 'top-center' });
        }
    }, [er]);

    useEffect(() => {
        if (company) {
            setData('company_id', company.id);
            setShowForm(true);
        }
    }, [company]);

    useEffect(() => {
        if (success) {
            toast.success(success, { position: 'top-right', autoClose: 5000 });
        }
    }, [success]);

    return (
        <Guest>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-16 md:py-28">
                <Head title="Register" />
                <ToastContainer position="top-right" autoClose={3000} />

                <div className="w-full max-w-4xl space-y-8 py-8">
                    {/* Step Indicator */}
                    <ol className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm font-medium text-gray-500">
                        {[
                            { step: 1, label: 'Account', active: true },
                            { step: 2, label: 'KYC', active: false },
                            { step: 3, label: 'Verification', active: false }
                        ].map(({ step, label, active }) => (
                            <li key={step} className={`flex items-center space-x-2 ${active ? 'text-blue-600' : ''}`}>
                                {active && <CheckCircle className="w-6 h-6 text-blue-600" />}
                                <span>{step}.</span>
                                <span>{label}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
                        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6">
                            {!company ? 'Enter your company unique number and search' : 'Proceed to set up your account'}
                        </h2>

                        {!company && (
                            <div className="mb-6">
                                <label htmlFor="unique_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company number
                                </label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        id="unique_number"
                                        type="text"
                                        value={data.unique_number}
                                        onChange={(e) => setData('unique_number', e.target.value)}
                                        placeholder="Enter company unique number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={searchCompany}
                                        disabled={isSearching}
                                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {isSearching ? 'Searching...' : 'Search'}
                                    </button>
                                </div>
                                {errors.unique_number && (
                                    <p className="text-red-500 text-xs mt-1">{errors.unique_number}</p>
                                )}
                            </div>
                        )}

                        {showForm && (
                            <form onSubmit={submit} className="space-y-4">
                                {company && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company <span className="text-red-400">*</span>
                                        </label>
                                        <p className="text-gray-600 text-lg">{company.name}</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your phone number <span className="text-red-400">*</span>
                                    </label>
                                    <PhoneInput
                                        international
                                        defaultCountry="KE"
                                        value={data.phone}
                                        onChange={(value) => setData('phone', value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="staff_number" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your staff number (optional)
                                    </label>
                                    <input
                                        id="staff_number"
                                        type="text"
                                        placeholder="Enter your staff number"
                                        value={data.staff_number}
                                        onChange={(e) => setData('staff_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.staff_number && <p className="text-red-500 text-xs mt-1">{errors.staff_number}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <Link href={route('login')} className="text-sm text-blue-600 hover:underline">
                                        Already registered?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    Register
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Guest>
    );
}
