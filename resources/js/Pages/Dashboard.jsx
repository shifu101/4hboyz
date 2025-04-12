
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/Layouts/layout/context/layoutcontext';
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { usePage, Link, Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FiPhone } from 'react-icons/fi'

const Dashboard = ({ auth }) => {
    // Get data from the page props
    const { companyCount, activeLoansCount, inactiveLoansCount, pendingLoansCount, pendingLoansValue, repaidLoansValue,activeLoansValue, inactiveLoansValue, loanTrends, repaymentTrends, employee, motherCompany, pendingPaidLoansCount, pendingPaidLoansValue } = usePage().props;
    
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);
    const roleId = auth.user?.role_id;
    const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];

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
                label: 'Salary advances',
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
            <Head title="Dashboard" />
             {roleId === 2 && 
            <div className='flex gap-8 items-center'>
                <h4 className='font-bold flex items-center my-auto text-white'>Company: {motherCompany?.name} - {motherCompany?.unique_number}</h4>
            </div>}

            {roleId === 3 && 
            <div className='flex lg:flex-row flex-col gap-8 items-center'>
                <h4 className="font-bold flex items-center my-auto text-white">
                    Phone number: {auth.user?.phone}
                </h4>
                {(userPermission.includes('Create loan') && auth?.user?.phone_verified_at !== null) ?
                <Link
                  href={route('loans.create')}
                  className="flex items-center mt-auto justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm min-w-fit"
                >
                  <Plus className="w-4 h-4 mr-2 my-auto" />
                  <span className='my-auto flex items-center'>
                  Request for an advance
                  </span>
                </Link>
                :
                <Link href={route('update-phone')} className="ml-2 text-blue-100 hover:text-blue-500 flex items-center gap-2">
                    <FiPhone className="inline-block" /> Confirm phone in order to request advance
                </Link>
                }
            </div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch pt-4">
                {roleId === 1 && 
                <DashboardInfoCard
                    title="Companies"
                    value={companyCount}
                    icon="map-marker"
                    iconColor="blue"
                    descriptionValue="Total Companies"
                    descriptionText="in the system"
                    to={route('companies.index')}
                />}
                 {roleId === 3 && 
                <DashboardInfoCard
                    title="Salary"
                    value={new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(employee?.salary)}
                    icon="credit-card"
                    iconColor="blue"
                    descriptionValue="The salary"
                    descriptionText="you earn"
                    to={route('dashboard')}
                />}
                {roleId === 3 && 
                <DashboardInfoCard
                    title="Salary advance limit"
                    value={new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(employee?.loan_limit)}
                    icon="credit-card"
                    iconColor="blue"
                    descriptionValue="The maximum amount"
                    descriptionText="you can borrow"
                    to={route('dashboard')}
                />}
                <DashboardInfoCard
                    title="Approved and active salary advances"
                    value={`${activeLoansCount} (${activeLoansValue})`}
                    icon="check-circle"
                    iconColor="orange"
                    descriptionValue="Active salary advances"
                    descriptionText="currently active"
                    to={route('loans.index', { status: 'Approved' })}
                />
                <DashboardInfoCard
                    title="Pending salary advances"
                    value={`${pendingLoansCount} (${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(pendingLoansValue)})`}
                    icon="clock"
                    iconColor="orange"
                    descriptionValue="Active salary advances"
                    descriptionText="currently active"
                    to={route('loans.index', { status: 'Pending Paid' })}
                />
                <DashboardInfoCard
                    title="Declined salary advances"
                    value={`${inactiveLoansCount} (${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(inactiveLoansValue)})`}
                    icon="times-circle"
                    iconColor="cyan"
                    descriptionValue="Inactive salary advances"
                    descriptionText="currently inactive"
                    to={route('loans.index', { status: 'Declined' })}
                />
                  <DashboardInfoCard
                    title="Repaid salary advances"
                    value={`${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(repaidLoansValue)}`}
                    icon="check-circle"
                    iconColor="purple"
                    descriptionValue="Total Repaid"
                    descriptionText="salary advance repayments"
                    to={route('loans.index', { status: 'Paid' })}
                />
                <DashboardInfoCard
                    title="Pending paid salary advances"
                    value={`${pendingPaidLoansCount} (${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(pendingPaidLoansValue)})`}
                    icon="clock"
                    iconColor="purple"
                    descriptionValue="Total pending paid"
                    descriptionText="salary advance repayments"
                    to={route('loans.index', { status: 'Pending Paid' })}
                />
            </div>

            <div className="grid my-4">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <h5>Salary advances and Repayment Trends</h5>
                        <Chart type="line" data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default Dashboard;
