import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { InputText } from "primereact/inputtext";
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import Layout from "@/Layouts/layout/layout.jsx";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function UpdatePhone({ mustVerifyEmail, status, className = '', employee }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone
    });

    const [previews] = useState({
        passport_front: employee?.passport_front ? `/storage/${employee?.passport_front}` : null
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <Layout>
            <section className='max-w-5xl bg-white p-4 rounded-lg'>
                <header>
                    <h2 className="text-lg font-medium">Update phone</h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Update your account's phone number that will be receiving the salary advance.
                    </p>
                </header>

                <form onSubmit={submit} className="mt-4 space-y-6">

                    <div className="mb-3">
                        <label htmlFor="phone" className="block text-900 font-medium mb-2">Phone</label>
                        <PhoneInput
                            id="phone"
                            placeholder="Enter phone number"
                            value={data?.phone}
                            onChange={(value) => setData('phone', value)}
                            className="w-full"
                        />
                        <InputError message={errors.phone} className="" />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="text-sm mt-2 text-gray-800">
                                Your email address is unverified.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Click here to re-send the verification email.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 font-medium text-sm text-green-600">
                                    A new verification link has been sent to your email address.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Update phone number</PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600">Saved.</p>
                        </Transition>
                    </div>
                </form>
            </section>
        </Layout>
    );
}
