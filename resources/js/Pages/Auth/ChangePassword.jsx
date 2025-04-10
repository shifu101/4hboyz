import { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function ChangePassword({ token, email }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'));
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <GuestLayout>
            <Head title="Change Password" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    
                    <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-100 mt-20">
                        <form onSubmit={submit} className="space-y-6">
                            <div className='flex flex-col'>
                                <h2 className="text-3xl font-extrabold text-gray-900">
                                    Change Your Password
                                </h2>
                                <p className="mt-3 text-sm text-gray-600">
                                    Please enter your current password and choose a new secure password
                                </p>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <InputLabel htmlFor="password" value="New Password" className="block text-sm font-medium text-gray-700" />

                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? (
                                          <EyeOffIcon className="h-8 w-8" />
                                        ) : (
                                          <EyeIcon className="h-8 w-8" />
                                        )}
                                    </button>
                                </div>

                                <InputError message={errors.password} className="mt-2" />
                                
                                <div className="mt-1 text-xs text-gray-500">
                                    Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm New Password" className="block text-sm font-medium text-gray-700" />

                                <div className="relative">
                                    <TextInput
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showConfirmPassword ? (
                                           <EyeOffIcon className="h-8 w-8" />
                                        ) : (
                                            <EyeIcon className="h-8 w-8" />
                                        )}
                                    </button>
                                </div>

                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center pt-2">
                                <div className="text-sm">
                                    <Link href={route('logout')} method="post" as="button" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                        Return to login
                                    </Link>
                                </div>
                                
                                <PrimaryButton 
                                    className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors" 
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : 'Update Password'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500">
                            For security reasons, please complete this process within your current session.
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
