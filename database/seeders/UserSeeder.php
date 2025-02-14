<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Map role_id to role names for permission assignment
        $roleMap = [
            1 => 'Centiflow Admin',
            2 => 'Company Admin',
            3 => 'HR',
            4 => 'Finance',
            5 => 'Employee'
        ];

        // Create 50 random users
        User::factory(50)->create()->each(function ($user) use ($roleMap) {
            $roleName = $roleMap[$user->role_id];
            $role = Role::where('name', $roleName)->first();
            
            if ($role) {
                $user->assignRole($role);
            }
        });

        // Create one user for each role (for testing)
        foreach ([1, 2, 3, 4, 5] as $roleId) {
            $user = User::factory()->create([
                'role_id' => $roleId,
                'email' => strtolower(str_replace(' ', '', $roleMap[$roleId])) . '@centiflow.com',
                'name' => $roleMap[$roleId] . ' User',
            ]);

            $roleName = $roleMap[$roleId];
            $role = Role::where('name', $roleName)->first();
            
            if ($role) {
                $user->assignRole($role);
            }
        }
    }
}