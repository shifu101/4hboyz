<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        $roleMap = [
            1 => 'Centiflow Admin',
            2 => 'Company Admin',
            3 => 'HR',
            4 => 'Finance',
            5 => 'Employee'
        ];

        // Create 50 random users and assign roles + permissions
        User::factory(50)->create()->each(function ($user) use ($roleMap) {
            $roleName = $roleMap[$user->role_id] ?? null;
            if ($roleName) {
                $role = Role::where('name', $roleName)->first();
                if ($role) {
                    $user->assignRole($role);
                    $user->syncPermissions($role->permissions);
                }
            }
        });

        // Create one user for each role (for testing)
        foreach ($roleMap as $roleId => $roleName) {
            $user = User::factory()->create([
                'role_id' => $roleId,
                'email' => strtolower(str_replace(' ', '', $roleName)) . '@centiflow.com',
                'name' => $roleName . ' User',
            ]);

            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $user->assignRole($role);
                $user->syncPermissions($role->permissions);
            }
        }
    }
}

