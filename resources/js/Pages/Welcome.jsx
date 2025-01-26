import { Link, Head } from '@inertiajs/react';
import {LayoutContext, LayoutProvider} from "@/Layouts/layout/context/layoutcontext.jsx";
import {PrimeReactProvider} from "primereact/api";
import {Button} from "primereact/button";
import React, {useContext} from "react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { layoutConfig} = useContext(LayoutContext);
    return (
        <>
            <PrimeReactProvider>
                <LayoutProvider>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:left-0 p-6">

                    <div className="flex align-items-center container mx-auto">
                        <img src={`/images/logo/logo.png`} width="100.22px" height={'35px'} alt="logo" className="mr-3"/>

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>


                <div className="grid grid-nogutter surface-0 text-800 overflow-hidden">
                    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                        <section>
                            <span className="block text-5xl font-bold mb-1">End month seems far and in need of urgent loans?</span>
                            <div className="text-5xl text-primary font-bold mb-3">You are at the right place!</div>
                            <p className="text-lg text-700 leading-relaxed mb-5">
                                Discover a seamless and reliable way to access loans tailored to your needs. With our platform, you can find the perfect financial solution in no time.
                            </p>
                            <Button label="Learn More" type="button" className="mr-3 p-button-raised text-gray-700 hover:text-white" />
                            <Button label="Get started" type="button" className="p-button-outlined" />
                        </section>
                    </div>
                    <div className="col-12 md:col-6 overflow-hidden">
                        <img src="/images/loan.jpg" alt="hero-1" className="md:ml-auto block object-cover md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                    </div>
                </div>

            </div>
            </LayoutProvider>
            </PrimeReactProvider>
        </>
    );
}
