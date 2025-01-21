<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Loan;
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
        $activeLoansCount = Loan::where('status', 'Active')->count();
        $inactiveLoansCount = Loan::where('status', '!=', 'Active')->count();
        $repaidLoansValue = Repayment::sum('amount');

        $currentYear = Carbon::now()->year;

        $user = Auth::user();

        // Get loan trends for all months
        $loanTrends = collect(range(1, 12))->map(function ($month) use ($currentYear) {
            $count = Loan::whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $month)
                ->count();

            return [
                'month' => Carbon::create($currentYear, $month, 1)->format('M'), // Convert to month name
                'loan_count' => $count
            ];
        });

        // Get repayment trends for all months
        $repaymentTrends = collect(range(1, 12))->map(function ($month) use ($currentYear) {
            $amount = Repayment::whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $month)
                ->sum('amount');

            return [
                'month' => Carbon::create($currentYear, $month, 1)->format('M'), // Convert to month name
                'repayment_value' => $amount
            ];
        });

        if($user->role_id == "3" && $user->company == null) {
            $companies = Company::all();
            return Inertia::render('Employees/SelectCompany', [
                'companies' => $companies,
                'user'=>$user
            ]);

        }else {
            return Inertia::render('Dashboard', [
                'companyCount' => $companyCount,
                'activeLoansCount' => $activeLoansCount,
                'inactiveLoansCount' => $inactiveLoansCount,
                'repaidLoansValue' => $repaidLoansValue,
                'loanTrends' => $loanTrends,
                'repaymentTrends' => $repaymentTrends,
            ]);
        }
    }
}