<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Loan;
use App\Models\Employee;
use App\Models\Company;
use App\Models\Repayment;
use App\Models\LoanProvider;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Mail\LoanRequestMail;

use App\Mail\LoanApprovalMail;
use App\Mail\LoanDeclinedMail;
use Illuminate\Support\Facades\Mail;

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
    
        // Filter by status
        if ($request->has('status')) {
            $status = $request->input('status');
            $query->where('status', $status);
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
            'params' => $request->all(), 
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
        $loan = Loan::create($request->validated());
    
        if ($loan->status === 'Pending') {
            $employee = Employee::find($loan->employee_id); 
    
            if ($employee) {
                Mail::to($employee->user->email)->send(new LoanRequestMail($employee));
            }
        }

        return redirect()->route('loans.index')->with('success', 'Loan created successfully.');
    }

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'loanIds' => 'required|array',
            'loanIds.*' => 'exists:loans,id',
        ]);
    
        $loanIds = $validated['loanIds'];
    
        DB::transaction(function () use ($loanIds) {
            $loans = Loan::whereIn('id', $loanIds)->get();
    
            foreach ($loans as $loan) {
                $loan->status = ($loan->currentBalance > 0 && $loan->currentBalance < $loan->eventualPay)
                    ? 'Partially Paid'
                    : 'Paid';
                $loan->save();

                if ($loan->currentBalance > 0) {
                    Repayment::create([
                        'loan_id' => $loan->id,
                        'amount' => $loan->currentBalance,
                        'status' => 'Paid',
                    ]);
                }
            }
        });

        return redirect()->route('loans.index')->with('success', 'Loan paid successfully.');
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
        $oldStatus = $loan->status;
    
        $loan->load(['loanProvider', 'employee.user', 'employee.company']);

        $loan->update($request->validated());
    
        if ($loan->status !== $oldStatus) {
            if ($loan->status === 'Approved') {
                Mail::to($loan->employee->user->email)->send(new LoanApprovalMail($loan));
            } elseif ($loan->status === 'Declined') {
                Mail::to($loan->employee->user->email)->send(new LoanDeclinedMail($loan));
            }
        }
    
        return redirect()->route('loans.index')->with('success', 'Loan updated successfully.');
    }
    


    public function destroy(Loan $loan)
    {
        $loan->delete();

        return redirect()->route('loans.index')->with('success', 'Loan deleted successfully.');
    }
}
