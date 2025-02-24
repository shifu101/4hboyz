<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Centiflow Admin (Full access to everything)
        $centiflowAdminRole = Role::create(['name' => 'Centiflow Admin', 'guard_name' => 'web']);
        $centiflowAdminRole->givePermissionTo(Permission::all());

        // Company Admin
        $companyAdminRole = Role::create(['name' => 'Company Admin', 'guard_name' => 'web']);
        $companyAdminPermissions = [
            'View user', 'Create user', 'Edit user', 'Delete user', 'Export user',
            'View employee', 'Create employee', 'Edit employee', 'Delete employee', 'Export employee',
            'View loan', 'Create loan', 'Edit loan', 'Delete loan', 'Export loan',
            'View notification', 'Create notification', 'Edit notification', 'Delete notification', 'Export notification',
            'View remittance', 'Create remittance', 'Edit remittance', 'Delete remittance', 'Export remittance',
            'View repayments', 'Create repayments', 'Edit repayments', 'Delete repayments', 'Export repayments'
        ];
        $companyAdminRole->syncPermissions($companyAdminPermissions);

        // HR Role
        $hrRole = Role::create(['name' => 'HR', 'guard_name' => 'web']);
        $hrPermissions = [
            'View user',
            'View employee', 'Create employee', 'Edit employee', 'Export employee',
            'View loan', 'Create loan', 'Edit loan', 'Export loan',
            'View notification', 'Create notification',
            'View remittance', 'Export remittance',
            'View repayments', 'Export repayments'
        ];
        $hrRole->syncPermissions($hrPermissions);

        // Finance Role
        $financeRole = Role::create(['name' => 'Finance', 'guard_name' => 'web']);
        $financePermissions = [
            'View user',
            'View loan', 'Create loan', 'Edit loan', 'Export loan',
            'View loan provider', 'Create loan provider', 'Edit loan provider', 'Export loan provider',
            'View remittance', 'Create remittance', 'Edit remittance', 'Export remittance',
            'View repayments', 'Create repayments', 'Edit repayments', 'Export repayments',
            'View notification', 'Create notification'
        ];
        $financeRole->syncPermissions($financePermissions);

        // Employee Role (Limited access)
        $employeeRole = Role::create(['name' => 'Employee', 'guard_name' => 'web']);
        $employeePermissions = [
            'View user',
            'View loan',
            'View notification',
            'View remittance',
            'View repayments'
        ];
        $employeeRole->syncPermissions($employeePermissions);
    }
}