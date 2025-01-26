<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Loan;
use App\Models\Employee;
use App\Models\Repayment;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Fetching basic statistics
        $companyCount = Company::count();

        $currentYear = Carbon::now()->year;

        $user = Auth::user();


        $activeLoansQuery = Loan::with(['loanProvider', 'employee.user', 'employee.company'])
        ->where('status', '!=', 'Paid');
    
        if ($user->role_id == 2) {
            $activeLoansQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('company_id', '=', $user->company_id);
            });
        } elseif ($user->role_id == 3) {
            $activeLoansQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        // Fetch the loans and append the currentBalance
        $activeLoans = $activeLoansQuery->get();
        $activeLoansValue = $activeLoans->sum(function ($loan) {
            return $loan->currentBalance;
        });
        
        $activeLoansCount = $activeLoans->count();
    
        $inactiveLoansQuery = Loan::where('status', '=', 'Declined');

        if ($user->role_id == 2) {
            $inactiveLoansQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('company_id', '=', $user->company_id);
            });
        } elseif ($user->role_id == 3) {
            $inactiveLoansQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        // Fetch the declined loans and append the currentBalance
        $inactiveLoans = $inactiveLoansQuery->get();
        $inactiveLoansCount = $inactiveLoans->count();
        
        $inactiveLoansValue = $inactiveLoans->sum(function ($loan) {
            return $loan->currentBalance;
        });
        
        
        $repaidLoansQuery = Repayment::with([
            'loan',
            'loan.loanProvider',
            'loan.employee.user',
            'loan.employee.company',
        ]);
        
        if ($user->role_id == 2) {
            $repaidLoansQuery->whereHas('loan.employee.user', function ($q) use ($user) {
                $q->where('company_id', '=', $user->company_id);
            });
        } elseif ($user->role_id == 3) {
            $repaidLoansQuery->whereHas('loan.employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        $repaidLoansValue = $repaidLoansQuery->sum('amount');
        

        $currentYear = Carbon::now()->year;

        // Get loan trends for all months
        $loanTrends = collect(range(1, 12))->map(function ($month) use ($currentYear, $user) {
            $loanQuery = Loan::with(['loanProvider', 'employee.user', 'employee.company'])->whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $month);

            if ($user->role_id == 2) {
                $loanQuery->whereHas('employee.user', function ($q) use ($user) {
                    $q->where('company_id', '=', $user->company_id);
                });
            } elseif ($user->role_id == 3) {
                $loanQuery->whereHas('employee.user', function ($q) use ($user) {
                    $q->where('id', '=', $user->id);
                });
            }

            $count = $loanQuery->count();

            return [
                'month' => Carbon::create($currentYear, $month, 1)->format('M'), // Convert to month name
                'loan_count' => $count
            ];
        });

        // Get repayment trends for all months
        $repaymentTrends = collect(range(1, 12))->map(function ($month) use ($currentYear, $user) {
            $repaymentQuery = Repayment::with([
                'loan',
                'loan.loanProvider',
                'loan.employee.user',
                'loan.employee.company',
            ])->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $month);

            if ($user->role_id == 2) {
                $repaymentQuery->whereHas('loan.employee.user', function ($q) use ($user) {
                    $q->where('company_id', '=', $user->company_id);
                });
            } elseif ($user->role_id == 3) {
                $repaymentQuery->whereHas('loan.employee.user', function ($q) use ($user) {
                    $q->where('id', '=', $user->id);
                });
            }

            $amount = $repaymentQuery->sum('amount');

            return [
                'month' => Carbon::create($currentYear, $month, 1)->format('M'), // Convert to month name
                'repayment_value' => $amount
            ];
        });

        if($user->role_id == "3" && $user->company == null) {
            return Inertia::render('Employees/SelectCompany', [
                'companies' => $companies,
                'user'=>$user
            ]);

        }else {

            $employee = Employee::where('user_id', '=', $user->id)->first();

            if ($employee && $employee->approved != 'Yes') {
                return Inertia::render('Employees/ProcessedRequest', [
                    'companies' => $companies,
                    'user' => $user,
                ]);
            }

            $employeesCount = 0; 

            if ($user->role_id == "2") {
                $employeesCount = Employee::where('company_id', $user->company_id)->count();
            }
            
            if ($user->role_id == "1") {
                $employeesCount = Employee::count();
            }
            
            return Inertia::render('Dashboard', [
                'companyCount' => $companyCount,
                'activeLoansCount' => $activeLoansCount,
                'activeLoansValue'=> $activeLoansValue,
                'inactiveLoansCount' => $inactiveLoansCount,
                'inactiveLoansValue'=> $inactiveLoansValue,
                'repaidLoansValue' => $repaidLoansValue,
                'loanTrends' => $loanTrends,
                'repaymentTrends' => $repaymentTrends,
                'employeesCount' => $employeesCount,
                'employee'=>$employee
            ]);
            
        }
    }
}