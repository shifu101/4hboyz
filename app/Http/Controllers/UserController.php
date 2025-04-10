<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\Permission;
use App\Models\Company;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Mail\ActivatedMail;
use App\Mail\DeactivateMail;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Services\SmsService;
use App\Mail\WelcomeMail;
use Illuminate\Support\Str;

use App\Notifications\CustomVerifyEmail;

class UserController extends Controller
{

    protected $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }


    public function index(Request $request)
    {
        // Start the query with eager loading
        $query = User::with(['company']); 

        $user = Auth::user();

        // Filter users based on role and company
        $query->where(function ($q) use ($user) {
            if (!in_array($user->role_id, [1, 4])) {
                $q->whereIn('role_id', [2, 5, 6])->where('company_id', '=', $user->company_id);
            } else {
                $q->whereIn('role_id', [1, 4])
                ->orWhereNull('company_id');
            }
        });

        // If search parameter is provided, apply it to the query
        if ($request->has('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                ->orWhere('email', 'LIKE', "%$search%");
            });
        }

        // Order by created_at
        $query->orderBy('created_at', 'desc');

        // Paginate the query
        $users = $query->paginate(10);

        return Inertia::render('Users/Index', [
            'users' => $users->items(),
            'pagination' => $users,
            'flash' => session('flash'),
        ]);
    }

    


    public function create()
    {
        $users = User::all();

        $companies = Company::all();
        return Inertia::render('Users/Create', [
            'users' => $users,
            'companies' => $companies,
        ]);
    }

    public function store(StoreUserRequest $request)
    {

        $validatedData = $request->validated();
        $validatedData['password'] = Str::random(6);
        $validatedData['remember_token'] = Str::random(10);
        $validatedData['email_verified_at'] = now();

        $user = User::create($validatedData);

        $validated = $request->validated();

        if ($user->role_id) {
            $role = Role::find($user->role_id);


            if ($role) {
                $user->assignRole($role);
                
                DB::table('model_has_roles')->where('model_id', $user->id)->update([
                    'model_type' => User::class
                ]);
            
                $user->syncPermissions($role->permissions);
            
                DB::table('model_has_permissions')->where('model_id', $user->id)->update([
                    'model_type' => User::class
                ]);
            }
            
        }

        $pass = $validatedData['password'];

        $user->notify(new CustomVerifyEmail($pass));
    
        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }


    public function show(User $user)
    {
        $permissions = Permission::all();

        $user->load('role', 'company'); 
        $user->append('simple_permissions');        

        return Inertia::render('Users/Show', [
            'user' => $user,
            'permissions'=> $permissions
        ]);
    }

    public function edit(User $user)
    {
        $users = User::all();
        $companies = Company::all();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'users' => $users,
            'companies' => $companies,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $oldStatus = $user->status;

        $newStatus = $request->input('status');

        $user->update($request->validated());

        if ($oldStatus !== $newStatus) {
            if ($oldStatus === 'Activated') {
                // Send approval email
                Mail::to($user->email)->send(new ActivatedMail($user));
            } elseif ($oldStatus === 'Deactivated') {
                Mail::to($user->email)->send(new DeactivateMail($user));
            } 
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }


    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
