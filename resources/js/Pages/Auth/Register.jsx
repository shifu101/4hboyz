import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import {InputText} from "primereact/inputtext";

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
        <GuestLayout>
            <Head title="Register" />

            <div className="flex align-items-center justify-content-center flex-column">
                <img src="/images/logo/logo.png" alt="hyper" height={50} className="mb-3"/>
                <div className="surface-card p-6 sm:p-4 shadow-2 border-round w-full lg:w-4">
                    <div className="text-center mb-5">
                        <div className="text-900 text-3xl font-medium mb-3">Register</div>
                    </div>
                    <form onSubmit={submit}>
                        <div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
                                    <InputText
                                        id="name"
                                        type="text"
                                        placeholder="Name"
                                        className="w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.email} className=""/>
                                </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                                <InputText
                                    id="email"
                                    type="text"
                                    placeholder="Email address"
                                    className="w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className=""/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phone" className="block text-900 font-medium mb-2">Phone</label>
                                <InputText
                                    id="phone"
                                    type="tel"
                                    placeholder="Phone number"
                                    className="w-full"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} className=""/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                                <InputText
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className=""/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password_confirmation" className="block text-900 font-medium mb-2">Confirm Password</label>
                                <InputText
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={errors.password_confirmation} className=""/>
                            </div>

                            <div className="flex align-items-center justify-content-end mb-4">
                                <Link
                                    href={route('login')}
                                    className=""
                                >
                                    Already registered?
                                </Link>

                            </div>

                            <PrimaryButton label="Register" className="w-full" disabled={processing}/>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
