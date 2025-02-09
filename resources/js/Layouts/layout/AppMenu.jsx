import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { usePage } from '@inertiajs/react';

const AppMenu = () => {
    const { auth } = usePage().props;

    const roleId = auth.user?.role_id;

    // Define the complete menu model
    const model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard'), roles: [1, 2, 3, 4] },
                { label: 'Companies', icon: 'pi pi-fw pi-building', to: route('companies.index'), roles: [1, 4] },
                { label: 'Employees', icon: 'pi pi-fw pi-users', to: route('employees.index'), roles: [1, 2] },
                { label: 'Loans', icon: 'pi pi-fw pi-wallet', to: route('loans.index'), roles: [1, 2, 3] },
                { label: 'Pending loans', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Pending' }), roles: [1, 2, 3] },
                { label: 'Approved loans', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Approved' }), roles: [1, 2, 3] },
                { label: 'Declined loans', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Declined' }), roles: [1, 2, 3] },    
                { label: 'Paid loans', icon: 'pi pi-fw pi-wallet', to: route('loans.index', { status: 'Paid' }), roles: [1, 2, 3] },              
                { label: 'Loan Providers', icon: 'pi pi-fw pi-briefcase', to: route('loanProviders.index'), roles: [1] },
                { label: 'Notifications', icon: 'pi pi-fw pi-bell', to: route('notifications.index'), roles: [1, 2, 3] },
                { label: 'Repayments', icon: 'pi pi-fw pi-dollar', to: route('repayments.index'), roles: [1, 2] },
                { label: 'Remittances', icon: 'pi pi-wallet', to: route('remittances.index'), roles: [1, 2] },
                { label: 'Users', icon: 'pi pi-fw pi-user', to: route('users.index'), roles: [1, 4] },
                { label: 'Profile', icon: 'pi pi-user', to: route('profile.edit'), roles: [1, 2, 3, 4] },
            ]
        },
    ];

    // Filter menu items based on the user's role
    const filteredModel = model.map(section => ({
        ...section,
        items: section.items.filter(item => item.roles.includes(roleId)),
    })).filter(section => section.items.length > 0); // Remove sections with no items

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {filteredModel.map((item, i) => {
                    return !item?.separator ? 
                        <AppMenuitem item={item} root={true} index={i} key={item?.label} />
                     : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
