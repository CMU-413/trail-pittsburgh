// src/pages/home/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import trailVolunteers from '../../assets/trail-volunteers-maintenance.jpg';
import { VOLUNTEER_LINK } from '../../constants/config';

export const HomePage: React.FC = () => {
    return (
        <div className="pt-8 md:pt-16">
            {/* Hero Section */}
            <section className="overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-6">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                <span className="block">Pittsburgh Trails</span>
                                <span className="block text-indigo-600 mt-1">Maintained Together</span>
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 max-w-3xl">
                                Help us maintain and improve Pittsburgh's beautiful trail system by reporting issues and tracking progress.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link to="/issues/report">
                                    <Button variant="primary" size="lg" className="shadow-lg transition-all hover:shadow-indigo-200 hover:-translate-y-0.5">
                                        Report an Issue
                                    </Button>
                                </Link>
                                <Link to="/parks">
                                    <Button variant="secondary" size="lg" className="transition-all hover:-translate-y-0.5">
                                        View Parks
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="mt-12 relative lg:mt-0 lg:col-span-6">
                            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                                <div className="relative block w-full bg-indigo-600 rounded-lg overflow-hidden">
                                    <img
                                        className="w-full object-cover h-64 md:h-80 opacity-80 mix-blend-overlay"
                                        src={trailVolunteers}
                                        alt="Volunteers walking through a forest trail with tools, preparing for trail maintenance work."
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-indigo-800/40 mix-blend-multiply"></div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -right-20 -top-20 w-72 h-72 bg-indigo-200 rounded-full opacity-30 mix-blend-multiply blur-2xl animate-blob"></div>
                            <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-purple-200 rounded-full opacity-30 mix-blend-multiply blur-2xl animate-blob animation-delay-2000"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            How It Works
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto">
                            Our platform makes it easy to keep Pittsburgh's trails in great condition.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-3">
                        <div className="relative p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl mb-8 md:mb-0">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 p-4 shadow-lg">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="pt-4 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Report</h3>
                                <p className="text-gray-600">
                                    See an issue on the trail? Report it quickly through our easy-to-use form.
                                </p>
                            </div>
                        </div>

                        <div className="relative p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl mb-8 md:mb-0">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 p-4 shadow-lg">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div className="pt-4 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Track</h3>
                                <p className="text-gray-600">
                                    Follow the progress of reported issues as stewards and volunteers address them.
                                </p>
                            </div>
                        </div>

                        <div className="relative p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl mb-8 md:mb-0">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 p-4 shadow-lg">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="pt-4 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Resolve</h3>
                                <p className="text-gray-600">
                                    Stewards and volunteers work to fix issues, keeping our trails safe and enjoyable.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Volunteer Network Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="px-6 py-12 md:p-16 text-center md:text-left flex flex-col items-center md:items-start">
                            <h2 className="text-3xl font-bold text-white">Join Our Volunteer Network</h2>
                            <p className="mt-4 text-lg text-indigo-100 max-w-2xl">
                                Want to help maintain Pittsburgh's trails? Join our volunteer network and help keep our trail system in top shape.
                            </p>
                            <div className="mt-8">
                                <a href={VOLUNTEER_LINK} target="_blank" rel="noopener noreferrer">
                                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 transition-all hover:-translate-y-0.5 cursor-pointer">
                                        Become a Volunteer
                                    </button>
                                </a>
                            </div>

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-center">
                                <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-white">15+</div>
                                    <div className="text-sm text-indigo-200">Parks</div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-white">100+</div>
                                    <div className="text-sm text-indigo-200">Miles of Trails</div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                                    <div className="text-3xl font-bold text-white">500+</div>
                                    <div className="text-sm text-indigo-200">Volunteers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};
