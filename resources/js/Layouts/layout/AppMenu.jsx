import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { usePage } from '@inertiajs/react';

const AppMenu = () => {
    const { auth } = usePage().props;

    const [counts, setCounts] = useState({
        companyCount: 0,
        employeesCount: 0,
        activeLoansCount: 0,
        inactiveLoansCount: 0,
        pendingLoansCount: 0,
        pendingPaidLoansCount: 0,
        repaidLoansCount: 0,
        remittancesCount: 0,
        usersCount: 0,
    });

    const getDateParams = () => {
        const today = new Date();
        const startDate = new Date(today.setMonth(today.getMonth() - 1));
        const endDate = new Date();

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        };
    };

    useEffect(() => {
        axios.get(route('menu.counts'), {
            params: {
                ...getDateParams()
            }
        })
        .then(res => {
            const data = res.data;
            setCounts({
                companyCount: data.pendingApprovalCompanyCount || 0,
                employeesCount: data.employeesPendingApprovalCount || 0,
                activeLoansCount: data.approvedLoansCount || 0,
                inactiveLoansCount: data.declinedLoansCount || 0,
                pendingLoansCount: data.pendingLoansCount || 0,
                pendingPaidLoansCount: data.pendingPaidLoansCount || 0,
                repaidLoansCount: data.paidLoansCount || 0,
                remittancesCount: data.remittancesCount || 0,
                usersCount: data.usersCount || 0,
            });
        })
        .catch(error => {
            console.error('Failed to fetch counts:', error);
        });
    }, []);

    const userPermissions = auth.user?.permissions?.map(perm => perm.name) || [];

    const CounterBadge = ({ count }) => {
        if (!count || count <= 0) return null;
        return (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {count > 99 ? '99+' : count}
            </span>
        );
    };

    const model = [
        {
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard') },
                { label: 'Companies', icon: 'pi pi-fw pi-building', to: route('companies.index', { status: 'Activated' }), permissions: ['Index company'] },
                { label: 'Companies Pending Approval', icon: 'pi pi-fw pi-building', to: route('companies.index', { status: 'Pending Approval' }), permissions: ['Index company'], badge: <CounterBadge count={counts.companyCount} /> },
                { label: 'Employees', icon: 'pi pi-fw pi-users', to: route('employees.index', { status: 'Approved' }), permissions: ['Index employee'] },
                { label: 'Employees Pending approval', icon: 'pi pi-fw pi-users', to: route('employees.index', { status: 'Pending Approval' }), permissions: ['Index employee'], badge: <CounterBadge count={counts.employeesCount} /> },
                { label: 'Salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index'), permissions: ['Index loan'] },
                { label: 'Pending salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Pending' }), permissions: ['Index loan'], badge: <CounterBadge count={counts.pendingLoansCount} /> },
                { label: 'Approved salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Approved' }), permissions: ['Index loan'] },
                { label: 'Declined salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Declined' }), permissions: ['Index loan'] },
                { label: 'Pending Paid salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Pending Paid' }), permissions: ['Index loan'], badge: <CounterBadge count={counts.pendingPaidLoansCount} /> },
                { label: 'Paid salary advances', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Paid' }), permissions: ['Index loan'] },
                { label: 'Repayments', icon: 'pi pi-fw pi-dollar', to: route('repayments.index'), permissions: ['Index repayment'] },
                { label: 'Remittances', icon: 'pi pi-wallet', to: route('remittances.index'), permissions: ['Index remittance'] },
                { label: 'Users', icon: 'pi pi-fw pi-user', to: route('users.index'), permissions: ['Index user'] },
                { label: 'Profile', icon: 'pi pi-user', to: route('profile.edit'), permissions: ['Edit profile'] },
            ]
        },
    ];

    const filteredModel = model.map(section => ({
        ...section,
        items: section.items.filter(item =>
            !item.permissions || item.permissions.some(perm => userPermissions.includes(perm))
        ),
    })).filter(section => section.items.length > 0);

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {filteredModel.map((item, i) => {
                    return !item?.separator ?
                        <AppMenuitem item={item} root={true} index={i} key={i} />
                        : <li className="menu-separator" key={`sep-${i}`}></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
