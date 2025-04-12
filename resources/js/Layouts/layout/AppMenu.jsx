import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { usePage } from '@inertiajs/react';

const AppMenu = () => {
    const { auth, companyCount, employeesCount, activeLoansCount, inactiveLoansCount, pendingLoansCount, usersCount, remittancesCount, pendingPaidLoansCount, repaidLoansCount } = usePage().props;

    // Extract user permissions from all assigned roles
    const userPermissions = auth.user?.permissions?.map(perm => perm.name) || [];

    // Define the counter badge component
    const CounterBadge = ({ count }) => {
        if (!count || count <= 0) return null;
        
        return (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {count > 99 ? '99+' : count}
            </span>
        );
    };

    // Define the complete menu model
    const model = [
        {
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard') }, // Always visible
                { 
                    label: 'Companies', 
                    icon: 'pi pi-fw pi-building', 
                    to: route('companies.index'), 
                    permissions: ['Index company'],
                    badge: <CounterBadge count={companyCount} />
                },
                { 
                    label: 'Employees', 
                    icon: 'pi pi-fw pi-users', 
                    to: route('employees.index'), 
                    permissions: ['Index employee'],
                    badge: <CounterBadge count={employeesCount} />
                },
                { 
                    label: 'Pending approval employees', 
                    icon: 'pi pi-fw pi-users', 
                    to: route('employees.index', { status: 'Pending' }), 
                    permissions: ['Index employee'],
                },
                { 
                    label: 'Salary advances', 
                    icon: 'pi pi-fw pi-wallet', 
                    to: route('loans.index'), 
                    permissions: ['Index loan'],
                    badge: <CounterBadge count={activeLoansCount} />
                },
                { 
                    label: 'Pending salary advances', 
                    icon: 'pi pi-fw pi-wallet', 
                    to: route('loans.index', { status: 'Pending' }), 
                    permissions: ['Index loan'],
                    badge: <CounterBadge count={pendingLoansCount} />
                },
                { 
                    label: 'Approved salary advances', 
                    icon: 'pi pi-fw pi-wallet', 
                    to: route('loans.index', { status: 'Approved' }), 
                    permissions: ['Index loan'],
                    badge: <CounterBadge count={activeLoansCount} />
                },
                { 
                    label: 'Declined salary advances', 
                    icon: 'pi pi-fw pi-wallet', 
                    to: route('loans.index', { status: 'Declined' }), 
                    permissions: ['Index loan'],
                    badge: <CounterBadge count={inactiveLoansCount} />
                },
                { 
                    label: 'Pending Paid salary advances', 
                    icon: 'pi pi-fw pi-wallet', 
                    to: route('loans.index', { status: 'Pending Paid' }), 
                    permissions: ['Index loan'],
                    badge: <CounterBadge count={pendingPaidLoansCount} />
                },
                { 
                    label: 'Paid salary advances', 
                    icon: 'pi pi-fw pi-wallet', 
                    to: route('loans.index', { status: 'Paid' }), 
                    permissions: ['Index loan'],
                    badge: <CounterBadge count={repaidLoansCount} />
                },
                { 
                    label: 'Repayments', 
                    icon: 'pi pi-fw pi-dollar', 
                    to: route('repayments.index'), 
                    permissions: ['Index repayment']
                },
                { 
                    label: 'Remittances', 
                    icon: 'pi pi-wallet', 
                    to: route('remittances.index'), 
                    permissions: ['Index remittance'],
                    badge: <CounterBadge count={remittancesCount} />
                },
                { 
                    label: 'Users', 
                    icon: 'pi pi-fw pi-user', 
                    to: route('users.index'), 
                    permissions: ['Index user'],
                    badge: <CounterBadge count={usersCount} />
                },
                { 
                    label: 'Profile', 
                    icon: 'pi pi-user', 
                    to: route('profile.edit'), 
                    permissions: ['Edit profile']
                },
            ]
        },
    ];

    // Filter menu items based on the user's permissions (excluding dashboard)
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
                     : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;