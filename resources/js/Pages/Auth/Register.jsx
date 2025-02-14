import React, { useState, useEffect } from 'react';
import { useForm, Link, Head, router, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import Guest from '@/Layouts/GuestLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [showForm, setShowForm] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        unique_number: '',
        role_id: 3,
        phone: '',
        password_confirmation: '',
        company_id: null
    });

      const { company, er } = usePage().props; 

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const searchCompany = () => {
        if (!data.unique_number) {
            toast.error('Please enter a company number');
            return;
        }

        setIsSearching(true);
        router.get(
            route('companies.search', data.unique_number),
            {}
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    useEffect(() => {
        if (er) {
            toast.error(er, {
                duration: 4000,
                position: 'top-center',
            });
        }
    }, [er]);

    useEffect(() => {
        if (company) {
            setData('company_id', company.id);
            setShowForm(true)
        }
    }, [company]);

    return (
        <Guest>
            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-48">
                <Head title="Register" />

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />

                <div className="w-full max-w-4xl space-y-8">
                    <ol className="flex justify-between text-sm font-medium text-gray-500">
                        {[
                            { step: 1, label: 'Account', active: true },
                            { step: 2, label: 'KYC', active: false },
                            { step: 3, label: 'Verification', active: false }
                        ].map(({ step, label, active }) => (
                            <li 
                                key={step} 
                                className={`flex items-center space-x-2 ${active ? 'text-blue-600' : ''}`}
                            >
                                {active && <span className="flex items-center"><CheckCircle className="w-10 h-10" /></span>}
                                <span className="flex items-center">{step}.</span>
                                <span className="flex items-center">{label}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="bg-white shadow-md rounded-lg p-8">
                        <h2 className="text-center text-3xl font-bold mb-6">Set up your account</h2>
                        
                        <div className="mb-6">
                            <label htmlFor="unique_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Company number
                            </label>
                            <div className="flex gap-4">
                                <input
                                    id="unique_number"
                                    type="text"
                                    value={data.unique_number}
                                    onChange={(e) => setData('unique_number', e.target.value)}
                                    placeholder="Enter company unique number"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={searchCompany}
                                    disabled={isSearching}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isSearching ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                            {errors.unique_number && (
                                <p className="text-red-500 text-xs mt-1">{errors.unique_number}</p>
                            )}
                        </div>

                        {showForm && (
                            <form onSubmit={submit} className="space-y-4">
                                {[
                                    { 
                                        name: 'name', 
                                        label: 'Name', 
                                        type: 'text', 
                                        placeholder: 'Enter your name'
                                    },
                                    { 
                                        name: 'email', 
                                        label: 'Email', 
                                        type: 'email', 
                                        placeholder: 'Enter your email'
                                    },
                                    { 
                                        name: 'phone', 
                                        label: 'Phone', 
                                        type: 'tel', 
                                        placeholder: 'Enter your phone number'
                                    },
                                    { 
                                        name: 'password', 
                                        label: 'Password', 
                                        type: 'password', 
                                        placeholder: 'Enter your password'
                                    },
                                    { 
                                        name: 'password_confirmation', 
                                        label: 'Confirm Password', 
                                        type: 'password', 
                                        placeholder: 'Confirm your password'
                                    }
                                ].map(({ name, label, type, placeholder }) => (
                                    <div key={name}>
                                        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                                            {label}
                                        </label>
                                        <input
                                            id={name}
                                            name={name}
                                            type={type}
                                            placeholder={placeholder}
                                            value={data[name]}
                                            onChange={(e) => setData(name, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors[name] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                                        )}
                                    </div>
                                ))}

                                <div className="flex justify-end mb-4">
                                    <Link 
                                        href={route('login')} 
                                        className="text-sm text-blue-600 hover:underline"
                                    >
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