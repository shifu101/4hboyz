import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import {Link} from "@inertiajs/react";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: route('dashboard') },
                { label: 'Companies', icon: 'pi pi-fw pi-building', to: route('companies.index') },
                { label: 'Employees', icon: 'pi pi-fw pi-users', to: route('employees.index') },
                { label: 'Loans', icon: 'pi pi-fw pi-wallet', to: route('loans.index') },
                { label: 'Loan Providers', icon: 'pi pi-fw pi-briefcase', to: route('loanProviders.index') },
                { label: 'Notifications', icon: 'pi pi-fw pi-bell', to: route('notifications.index') },
                { label: 'Repayments', icon: 'pi pi-fw pi-dollar', to: route('repayments.index') },
                { label: 'Users', icon: 'pi pi-fw pi-user', to: route('users.index') }
            ]            
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? 
                    <AppMenuitem item={item} root={true} index={i} key={item?.label} />
                     : <li className="menu-separator"></li>;
                })}


            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
