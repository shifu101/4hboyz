import React from "react";
import { Link } from '@inertiajs/react';

export default function DashboardInfoCard({ title, value, icon = '', iconColor = '', descriptionValue = '', descriptionText = '', to }) {
    const iconClass = `pi pi-${icon} text-${iconColor}-500 text-xl`;
    const iconBackgroundClass = `flex align-items-center justify-content-center bg-${iconColor}-100 border-round`;

    return (
        <Link href={to} className="col-12 lg:col-6 xl:col-3 min-h-full">
            <div className="card mb-0 h-full flex flex-col justify-between">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">{title}</span>
                        <div className="text-900 font-medium text-xl">{value}</div>
                    </div>
                    <div className={iconBackgroundClass}
                        style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className={iconClass} />
                    </div>
                </div>
                <div>
                    <span className="text-green-500 font-medium">{descriptionValue}</span>
                    <span className="text-500"> {descriptionText}</span>
                </div>
            </div>
        </Link>
    );
}
