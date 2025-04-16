<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Loan;
use App\Models\User;
use App\Models\Employee;
use App\Models\Remittance;
use App\Models\Repayment;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Fetching basic statistics
        $companyCount = Company::count();

        $pendingApprovalCompanyCount = Company::where('status','=','Pending Approval')->count();

        $currentYear = Carbon::now()->year;

        $companies = Company::all();

        $user = Auth::user();

        if($user->company_id != null){
            $motherCompany = Company::where('id','=', $user->company_id)->first();
        }

        if ($user->role_id == 3 && $user->email_verified_at == null) {
            return Inertia::render('Auth/VerifyEmail', [
                'companies' => $companies,
                'user' => $user
            ]);
        }

        if ($user->password_reset == 0) {
            return Inertia::render('Auth/ChangePassword', [
                'companies' => $companies,
                'user' => $user,
                'email' => $user->email
            ]);
        }


        $activeLoansQuery = Loan::with(['loanProvider', 'employee.user', 'employee.company'])
        ->where('status', '=', 'Approved');
    
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
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


        $pendingLoanQuery = Loan::with(['loanProvider', 'employee.user', 'employee.company'])
        ->where('status', '=', 'Pending');
    
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $pendingLoanQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('company_id', '=', $user->company_id);
            });
        } elseif ($user->role_id == 3) {
            $pendingLoanQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        // Fetch the loans and append the currentBalance
        $pendingLoans = $pendingLoanQuery->get();
        $pendingLoansValue = $pendingLoans->sum(function ($loan) {
            return $loan->currentBalance;
        });
        
        $pendingLoansCount = $pendingLoans->count();
        
    
        $inactiveLoansQuery = Loan::where('status', '=', 'Declined');

           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
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
        
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $repaidLoansQuery->whereHas('loan.employee.user', function ($q) use ($user) {
                $q->where('company_id', '=', $user->company_id);
            });
        } elseif ($user->role_id == 3) {
            $repaidLoansQuery->whereHas('loan.employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        $repaidLoansCount = $repaidLoansQuery->count();
        $repaidLoansValue = $repaidLoansQuery->sum('amount');


        // Pending paid loans counts
        $pendingPaidLoansQuery = Loan::with(['loanProvider', 'employee.user', 'employee.company'])
        ->where('status', '=', 'Pending Paid');
    
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $pendingPaidLoansQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('company_id', '=', $user->company_id);
            });
        } elseif ($user->role_id == 3) {
            $pendingPaidLoansQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        // Fetch the loans and append the currentBalance
        $pendingPaidLoans = $pendingPaidLoansQuery->get();
        $pendingPaidLoansValue = $pendingPaidLoans->sum(function ($loan) {
            return $loan->currentBalance;
        });
        
        $pendingPaidLoansCount = $pendingPaidLoans->count();
        

        $currentYear = Carbon::now()->year;

        // Get loan trends for all months
        $loanTrends = collect(range(1, 12))->map(function ($month) use ($currentYear, $user) {
            $loanQuery = Loan::with(['employee.user', 'employee.company'])
                ->whereYear('created_at', $currentYear)
                ->where('status', '!=', 'Declined')
                ->whereMonth('created_at', $month);

               if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
                $loanQuery->whereHas('employee.user', function ($q) use ($user) {
                    $q->where('company_id', '=', $user->company_id);
                });
            } elseif ($user->role_id == 3) {
                $loanQuery->whereHas('employee.user', function ($q) use ($user) {
                    $q->where('id', '=', $user->id);
                });
            }
        
            // Fetch loans and compute the total of eventualPay
            $loans = $loanQuery->get();
            $eventualPaySum = $loans->sum(function ($loan) {
                return $loan->amount; // Access the computed attribute
            });
        
            return [
                'month' => Carbon::create($currentYear, $month, 1)->format('M'), // Convert to month name
                'loan_count' => $eventualPaySum
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

               if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
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

        if($user->role_id == "3" && $user->kyc == null) {
            $er = '';
            return Inertia::render('Employees/SelectCompany', [
                'user'=>$user,
                'er'=>$er
            ]);

        }elseif($user->role_id == "3" && $user->kyc == 'Incomplete') {
            $er = '';
            return Inertia::render('Employees/UpdateKyc', [
                'user'=>$user->load('employee'),
                'er'=>$er
            ]);

        }
        else {

            $employee = Employee::where('user_id', '=', $user->id)->first();

            if (($employee && $user->role_id != "1" && $user->role_id != "2" && $employee->approved != 'Approved') || $user->status === 'Deactivated') {
                return Inertia::render('Employees/ProcessedRequest', [
                    'companies' => $companies,
                    'user' => $user,
                ]);
            }

            $companyStatus = Company::find($user->company_id);

            if($companyStatus){
                if($companyStatus->status !== 'Activated' && ($user->role_id !== '1' || $user->role_id !== '4')) {
                    return Inertia::render('Employees/CompanyStatus', [
                        'company' => $companyStatus,
                        'user' => $user,
                    ]);
                }
            }

            $employeesCount = 0; 
            $employeesPendingApprovalCount = 0; 
            $usersCount = 0; 
            $remittancesCount = 0; 

            if ($user->role_id == "2" || $user->role_id == "4" || $user->role_id == "6") {
                $employeesCount = Employee::where('company_id', $user->company_id)->count();
                $employeesPendingApprovalCount = Employee::where('company_id', $user->company_id)->where('status','=','Pending Approval')->count();
                $usersCount = User::where('company_id', $user->company_id)->count();
                $remittancesCount = Remittance::where('company_id', $user->company_id)->count();
            }
            
            if ($user->role_id == "1" || $user->role_id == "4") {
                $employeesCount = Employee::count();
                $employeesPendingApprovalCount = Employee::where('status','=','Pending Approval')->count();
                $usersCount = User::whereIn('role_id', [1, 4])->count();
                $remittancesCount = Remittance::count();
            }
            
            return Inertia::render('Dashboard', [
                'pendingApprovalCompanyCount'=> $pendingApprovalCompanyCount,
                'companyCount' => $companyCount,
                'activeLoansCount' => $activeLoansCount,
                'activeLoansValue'=> $activeLoansValue,
                'pendingLoansCount' => $pendingLoansCount,
                'pendingLoansValue'=> $pendingLoansValue,
                'inactiveLoansCount' => $inactiveLoansCount,
                'inactiveLoansValue'=> $inactiveLoansValue,
                'repaidLoansCount'=>$repaidLoansCount,
                'repaidLoansValue' => $repaidLoansValue,
                'loanTrends' => $loanTrends,
                'repaymentTrends' => $repaymentTrends,
                'employeesCount' => $employeesCount,
                'employeesPendingApprovalCount'=> $employeesPendingApprovalCount,
                'employee'=>$employee,
                'motherCompany'=>$motherCompany ?? null,
                'usersCount'=> $usersCount,
                'remittancesCount'=>$remittancesCount,
                'pendingPaidLoansCount'=>$pendingPaidLoansCount,
                'pendingPaidLoansValue'=>$pendingPaidLoansValue
            ]);
            
        }
    }

    public function menuStatsJson(Request $request)
    {
        $user = Auth::user();
    
        $companyCount = Company::count();
        $pendingApprovalCompanyCount = Company::where('status','=','Pending Approval')->count();
    
        $employeesCount = 0; 
        $employeesPendingApprovalCount = 0; 
        $usersCount = 0; 
        $remittancesCount = 0;
    
        // Loan-related counts
        $salaryAdvanceCount = 0;
        $approvedLoansCount = 0;
        $pendingLoansCount = 0;
        $declinedLoansCount = 0;
        $paidLoansCount = 0;
        $pendingPaidLoansCount = 0;
    
        if (in_array($user->role_id, [2, 4, 6])) {
            $employeesCount = Employee::where('company_id', $user->company_id)->count();
            $employeesPendingApprovalCount = Employee::where('company_id', $user->company_id)->where('status','=','Pending Approval')->count();
            $usersCount = User::where('company_id', $user->company_id)->count();
            $remittancesCount = Remittance::where('company_id', $user->company_id)->count();
    
            $salaryAdvanceCount = Loan::where('company_id', $user->company_id)->count();
            $approvedLoansCount = Loan::where('company_id', $user->company_id)->where('status', 'Approved')->count();
            $pendingLoansCount = Loan::where('company_id', $user->company_id)->where('status', 'Pending')->count();
            $declinedLoansCount = Loan::where('company_id', $user->company_id)->where('status', 'Declined')->count();
            $paidLoansCount = Loan::where('company_id', $user->company_id)->where('status', 'Paid')->count();
            $pendingPaidLoansCount = Loan::where('company_id', $user->company_id)->where('status', 'Pending Paid')->count();
        }
    
        if (in_array($user->role_id, [1, 4])) {
            $employeesCount = Employee::count();
            $employeesPendingApprovalCount = Employee::where('status','=','Pending Approval')->count();
            $usersCount = User::whereIn('role_id', [1, 4])->count();
            $remittancesCount = Remittance::count();
    
            $salaryAdvanceCount = Loan::count();
            $approvedLoansCount = Loan::where('status', 'Approved')->count();
            $pendingLoansCount = Loan::where('status', 'Pending')->count();
            $declinedLoansCount = Loan::where('status', 'Declined')->count();
            $paidLoansCount = Loan::where('status', 'Paid')->count();
            $pendingPaidLoansCount = Loan::where('status', 'Pending Paid')->count();
        }
    
        return response()->json([
            'companyCount' => $companyCount,
            'pendingApprovalCompanyCount' => $pendingApprovalCompanyCount,
            'employeesCount' => $employeesCount,
            'employeesPendingApprovalCount' => $employeesPendingApprovalCount,
            'usersCount' => $usersCount,
            'remittancesCount' => $remittancesCount,
    
            // Add new stats here
            'salaryAdvanceCount' => $salaryAdvanceCount,
            'approvedLoansCount' => $approvedLoansCount,
            'pendingLoansCount' => $pendingLoansCount,
            'declinedLoansCount' => $declinedLoansCount,
            'paidLoansCount' => $paidLoansCount,
            'pendingPaidLoansCount' => $pendingPaidLoansCount,
        ]);
    }
    
}