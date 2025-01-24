<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Company;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;

class EmployeeController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Employee::with('user');
    

        if ($user->role_id == 2) {
            $query->where('company_id', '=', $user->company_id);
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('email', 'LIKE', "%$search%");
            });
        }

        $employees = $query->paginate(10);
    
        return Inertia::render('Employees/Index', [
            'employees' => $employees->items(),
            'pagination' => $employees,
            'flash' => session('flash'),
        ]);
    }
    
    

    public function create()
    {
        $companies = Company::all();
        $users = User::all();
        return Inertia::render('Employees/Create', [
            'companies' => $companies,
            'users'=>$users
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $user = Auth::user();

       $employee = Employee::create($request->validated());

        if($user->role_id == "3") {

            $user->update([
                'company_id'=>$employee->company_id
            ]);

            Auth::login($user);

            return redirect(RouteServiceProvider::HOME);
        }else {
            return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
        }
    }

    public function show(Employee $employee)
    {

        $employee->load('user');

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            'user' => $employee->user, 
            'user' => $employee->user, 
            'company' => $employee->company
        ]);
    }

    public function edit(Employee $employee)
    {
        $companies = Company::all();
        $users = User::all();
        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'companies' => $companies,
            'users'=>$users
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }


    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
