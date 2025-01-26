<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Loan;
use App\Models\Employee;
use App\Models\Company;
use App\Models\LoanProvider;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();
    
        $query = Loan::with(['loanProvider', 'employee.user', 'employee.company']);
    
        // Filter based on role
        if ($user->role_id == 2) {
            $query->whereHas('employee.user', function ($q) use ($user) {
                $q->where('company_id', '=', $user->company_id);
            });
        } elseif ($user->role_id == 3) {
            $query->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
    
        // Search functionality
        if ($request->has('search')) {
            $search = trim($request->input('search'));
    
            $query->where(function ($q) use ($search) {
                // Direct loan fields
                $q->where('amount', 'LIKE', "%$search%")
                  ->orWhere('number', 'LIKE', "%$search%")
                  ->orWhere('status', 'LIKE', "%$search%");
    
                // Search within related loan provider fields
                $q->orWhereHas('loanProvider', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%$search%");
                });
    
                // Search within employee and related fields
                $q->orWhereHas('employee', function ($q) use ($search) {
                    $q->where('loan_limit', 'LIKE', "%$search%")
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('name', 'LIKE', "%$search%")
                            ->orWhere('email', 'LIKE', "%$search%");
                      })
                      ->orWhereHas('company', function ($q) use ($search) {
                          $q->where('name', 'LIKE', "%$search%");
                      });
                });
            });
        }
        
    
        // Paginate results
        $loans = $query->paginate(10);
    
        return Inertia::render('Loans/Index', [
            'loans' => $loans->items(),
            'pagination' => $loans,
            'flash' => session('flash'),
        ]);
    }
    
    

    public function create()
    {
        $employees = Employee::with(['user', 'loans'])->get()
            ->map(function ($employee) {
                return $employee->append('unpaid_loans_count', 'total_loan_balance');
            });
    
        $loanProviders = LoanProvider::all();
        $companies = Company::all();
    
        return Inertia::render('Loans/Create', [
            'employees' => $employees,
            'loanProviders' => $loanProviders,
            'companies' => $companies
        ]);
    }
    

    public function store(StoreLoanRequest $request)
    {

        Loan::create($request->validated());

        return redirect()->route('loans.index')->with('success', 'Loan created successfully.');
    }


    public function show(Loan $loan)
    {
        $loan->load(['employee.user', 'loanProvider']);

        return Inertia::render('Loans/Show', [
            'loan' => $loan,
        ]);
    }

    public function edit(Loan $loan)
    {
        $employees = Employee::with(['user'])->get();
        $loanProviders = LoanProvider::all();

        return Inertia::render('Loans/Edit', [
            'loan' => $loan,
            'employees' => $employees,
            'loanProviders'=> $loanProviders
        ]);
    }

    public function update(UpdateLoanRequest $request, Loan $loan)
    {
        $loan->update($request->validated());

        return redirect()->route('loans.index')->with('success', 'Loan updated successfully.');
    }


    public function destroy(Loan $loan)
    {
        $loan->delete();

        return redirect()->route('loans.index')->with('success', 'Loan deleted successfully.');
    }
}
