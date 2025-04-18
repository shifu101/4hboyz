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
use App\Mail\EmployeeApprovalMail;
use App\Mail\EmployeeDeclinedMail;
use App\Mail\DeactivatedMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\RedirectResponse;

class EmployeeController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Index employee')) {
            return Inertia::render('Auth/Forbidden');
        }

        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $filterByDate = !empty($startDate) && !empty($endDate);
    
        // Base query with eager loading
        $query = Employee::with('user', 'loans', 'company');
    
        // Filter by company if the user has role_id 2
        if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
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

        if ($request->has('status')) {
            $status = $request->input('status');
            $query->where('status','=', $status);
        }

        $query->when($filterByDate, function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        });
    
        $query->orderBy('created_at', 'desc');

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
    

    public function getEmployeesByCompany(Request $request, $companyId)
    {
        $user = Auth::user();

        // Ensure the user is authorized to view this data
        if ($user->role_id == 2 && $user->company_id != $companyId) {
            abort(403, 'Unauthorized action.');
        }

        // Query employees belonging to the given company ID
        $query = Employee::with('user', 'loans', 'company')
                        ->where('company_id', $companyId);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                ->orWhere('email', 'LIKE', "%$search%");
            });
        }

        $query->orderBy('created_at', 'desc');

        // Paginate the results
        $employees = $query->paginate(10);

        // Append computed attributes to each employee
        $employees->getCollection()->transform(function ($employee) {
            $employee->append('unpaid_loans_count', 'total_loan_balance');
            return $employee;
        });

        // Return to Inertia view
        return Inertia::render('Companies/Show', [
            'employees' => $employees->items(),
            'pagination' => $employees,
            'flash' => session('flash'),
        ]);
    }

    
    

    public function create()
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Create employee')) {
            return Inertia::render('Auth/Forbidden');
        }

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

        if (!$user->hasPermissionTo('Create employee')) {
            return Inertia::render('Auth/Forbidden');
        }

       $validatedData = $request->validated();
    
       $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
       
       foreach ($fileFields as $field) {
           if ($request->hasFile($field)) {
               $file = $request->file($field);
               $path = $file->store('employee_documents', 'public');
               $validatedData[$field] = $path;
           }
       }

       $validatedData['status'] = 'Pending Approval';
    
       $employee = Employee::create($validatedData);
    
       if ($user->role_id == "3") {
           $user->update([
               'company_id' => $employee->company_id,
               'kyc'=> 'Added'
           ]);
    
           $adminUser = Auth::user();

           if ($adminUser->role_id == "1") {
            return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
           }else {
            Auth::login($user);
    
            return redirect(RouteServiceProvider::HOME);
           }
       } else {
           return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
       }
    }

    public function show(Employee $employee)
    {

        $user = Auth::user();

        if (!$user->hasPermissionTo('View employee')) {
            return Inertia::render('Auth/Forbidden');
        }

        // Load related data
        $employee->load('user', 'company', 'loans');
    
        // Return data to the Inertia view
        return Inertia::render('Employees/Show', [
            'employee' => [
                'id' => $employee->id,
                'approved' => $employee->approved,
                'id_number'=>$employee->id_number,
                'id_front'=>$employee->id_front,
                'id_back'=>$employee->id_back,
                'passport_front'=>$employee->passport_front,
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
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit employee')) {
            return Inertia::render('Auth/Forbidden');
        }

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
        $user = Auth::user();

        if (!$user->hasPermissionTo('Edit employee')) {
            return Inertia::render('Auth/Forbidden');
        }

        $validatedData = $request->validated();
        $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];
    
        $oldApprovedStatus = $employee->approved;
        $newApprovedStatus = $request->input('approved');
    
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                if ($employee->$field) {
                    \Storage::disk('public')->delete($employee->$field);
                }
                $file = $request->file($field);
                $path = $file->store('employee_documents', 'public');
                $validatedData[$field] = $path;
            }
        }
    
        $employee->update($validatedData);

        if($validatedData['reason'] == 'Incomplete KYC'){
            $incompleteUser = User::find($employee->user_id);

            $incompleteUser->update([
                'kyc'=>'Incomplete'
            ]);
        }
    
        if ($oldApprovedStatus !== $newApprovedStatus) {
            if ($newApprovedStatus === 'Approved') {
                $employee->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send approval email
                Mail::to($employee->user->email)->send(new EmployeeApprovalMail($employee));
            } elseif ($newApprovedStatus === 'Declined') {
                $employee->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send declined email
                Mail::to($employee->user->email)->send(new EmployeeDeclinedMail($employee, $validatedData['reason']));
            } elseif ($newApprovedStatus === 'Deactivated') {
                $employee->user->update([
                    'status'=>$validatedData['approved']
                ]);
                // Send declined email
                Mail::to($employee->user->email)->send(new DeactivatedMail($employee));
            }
        }
    
        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }


    public function updateKyc(Request $request, Employee $employee): RedirectResponse
    {
        $user = Auth::user();
    
        $validatedData = $request->all();
    
        $fileFields = ['id_front', 'id_back', 'passport_front', 'passport_back'];

        // Handle id_front
        if ($request->hasFile('id_front')) {
            if (!empty($employee->id_front)) {
                \Storage::disk('public')->delete($employee->id_front);
            }
            $path = $request->file('id_front')->store('employee_documents', 'public');
            $validatedData['id_front'] = $path;
        } else {
            unset($validatedData['id_front']);
        }
        
        // Handle id_back
        if ($request->hasFile('id_back')) {
            if (!empty($employee->id_back)) {
                \Storage::disk('public')->delete($employee->id_back);
            }
            $path = $request->file('id_back')->store('employee_documents', 'public');
            $validatedData['id_back'] = $path;
        } else {
            unset($validatedData['id_back']);
        }
        
        // Handle passport_front
        if ($request->hasFile('passport_front')) {
            if (!empty($employee->passport_front)) {
                \Storage::disk('public')->delete($employee->passport_front);
            }
            $path = $request->file('passport_front')->store('employee_documents', 'public');
            $validatedData['passport_front'] = $path;
        } else {
            unset($validatedData['passport_front']);
        }
        
        // Handle passport_back
        if ($request->hasFile('passport_back')) {
            if (!empty($employee->passport_back)) {
                \Storage::disk('public')->delete($employee->passport_back);
            }
            $path = $request->file('passport_back')->store('employee_documents', 'public');
            $validatedData['passport_back'] = $path;
        } else {
            unset($validatedData['passport_back']);
        }
        
    
        $employee->update($validatedData);
    
        if ($user) {
            $user->update([
                'kyc' => 'Added',
                'status'=> 'Pending'
            ]);
        }
    
        return redirect(RouteServiceProvider::HOME);
    }
    
    


    public function destroy(Employee $employee)
    {
        $user = Auth::user();

        if (!$user->hasPermissionTo('Delete employee')) {
            return Inertia::render('Auth/Forbidden');
        }

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
