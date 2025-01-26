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
    
        // Base query with eager loading
        $query = Employee::with('user', 'loans', 'company');
    
        // Filter by company if the user has role_id 2
        if ($user->role_id == 2) {
            $query->where('company_id', '=', $user->company_id);
        }
    
        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                  ->orWhere('email', 'LIKE', "%$search%");
            });
        }
    
        // Paginate the results
        $employees = $query->paginate(10);
    
        // Append computed attributes to each employee
        $employees->getCollection()->transform(function ($employee) {
            $employee->append('unpaid_loans_count', 'total_loan_balance');
            return $employee;
        });
    
        // Return to Inertia view
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
       $validatedData = $request->validated();
    
       $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
       
       foreach ($fileFields as $field) {
           if ($request->hasFile($field)) {
               $file = $request->file($field);
               $path = $file->store('employee_documents', 'public');
               $validatedData[$field] = $path;
           }
       }
    
       $employee = Employee::create($validatedData);
    
       if ($user->role_id == "3") {
           $user->update([
               'company_id' => $employee->company_id
           ]);
    
           Auth::login($user);
    
           return redirect(RouteServiceProvider::HOME);
       } else {
           return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
       }
    }

    public function show(Employee $employee)
    {
        // Load related data
        $employee->load('user', 'company', 'loans');
    
        // Return data to the Inertia view
        return Inertia::render('Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'salary' => $employee->salary,
                'loan_limit' => $employee->loan_limit,
                'unpaid_loans_count' => $employee->unpaid_loans_count, 
                'total_loan_balance' => $employee->total_loan_balance,
            ],
            'user' => $employee->user,
            'company' => $employee->company,
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
        $validatedData = $request->validated();
        $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
        
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if it exists
                if ($employee->$field) {
                    \Storage::disk('public')->delete($employee->$field);
                }
                // Store new file
                $file = $request->file($field);
                $path = $file->store('employee_documents', 'public');
                $validatedData[$field] = $path;
            }
        }
    
        $employee->update($validatedData);
    
        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }


    public function destroy(Employee $employee)
    {
        $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
    
        // Delete associated files
        foreach ($fileFields as $field) {
            if ($employee->$field) {
                \Storage::disk('public')->delete($employee->$field);
            }
        }
    
        $employee->delete();
    
        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
