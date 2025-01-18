import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { usePage } from '@inertiajs/react';

const Dashboard = ({ auth }) => {
    // Get data from the page props
    const { companyCount, activeLoansCount, inactiveLoansCount, repaidLoansValue, loanTrends, repaymentTrends } = usePage().props;
    
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    // Ensure data is available before rendering
    if (!loanTrends || !repaymentTrends) {
        return <div>Loading...</div>;
    }

    const lineData = {
        labels: loanTrends.map(trend => trend.month),
        datasets: [
            {
                label: 'Loans',
                data: loanTrends.map(trend => trend.loan_count),
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            },
            {
                label: 'Repayments',
                data: repaymentTrends.map(trend => trend.repayment_value),
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e',
                tension: 0.4
            }
        ]
    };

    return (
        <Layout>
            <div className="grid">
                <DashboardInfoCard
                    title="Companies"
                    value={companyCount}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="Total Companies"
                    descriptionText="in the system"
                />
                <DashboardInfoCard
                    title="Active Loans"
                    value={activeLoansCount}
                    icon="map-marker"
                    iconColor="orange"
                    descriptionValue="Active Loans"
                    descriptionText="currently active"
                />
                <DashboardInfoCard
                    title="Inactive Loans"
                    value={inactiveLoansCount}
                    icon="inbox"
                    iconColor="cyan"
                    descriptionValue="Inactive Loans"
                    descriptionText="currently inactive"
                />
                <DashboardInfoCard
                    title="Repaid Loans"
                    value={`${repaidLoansValue.toFixed(2)}`}
                    icon="comment"
                    iconColor="purple"
                    descriptionValue="Total Repaid"
                    descriptionText="loan repayments"
                />

                <div className="col-12 xl:col-6">
                    <div className="card">
                        <h5>Loan and Repayment Trends</h5>
                        <Chart type="line" data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
