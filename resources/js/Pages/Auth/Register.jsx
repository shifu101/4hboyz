import React, { useEffect } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: 3,
        phone: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Head title="Register" />

            <div className="w-full max-w-lg space-y-8">
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
                            {active && <CheckCircle className="w-5 h-5" />}
                            <span className='flex items-center'>{step}.</span>
                            <span className='flex items-center'>{label}</span>
                        </li>
                    ))}
                </ol>

                <div className="bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-center text-3xl font-bold mb-6">Set up your account</h2>
                    
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
                </div>
            </div>
        </div>
    );
}