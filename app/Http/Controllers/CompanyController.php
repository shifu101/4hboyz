<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Loan;
use App\Models\Employee;
use App\Models\Repayment;
use App\Models\Remittance;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::query();
    
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'LIKE', "%$search%");
        }

        $query->orderBy('created_at', 'desc');
    
        $companies = $query->paginate(10);
    
        return Inertia::render('Companies/Index', [
            'companies' => $companies->items(),
            'pagination' => $companies,
            'flash' => session('flash'),
        ]);
    }
    

    public function create()
    {
        return Inertia::render('Companies/Create');
    }
    

    public function store(StoreCompanyRequest $request)
    {
        Company::create($request->validated());

        return redirect()->route('companies.index')->with('success', 'Company created successfully.');
    }

    public function show(Request $request, Company $company)
    {
        $search = $request->query('search');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Ensure both dates are not null and not empty
        $filterByDate = !empty($startDate) && !empty($endDate);

        // Employees Filter
        $employees = Employee::with(['user', 'loans', 'company'])
            ->where('company_id', $company->id)
            ->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                ->orWhere('email', 'LIKE', "%$search%");
            })
            ->when($filterByDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc') // Order by latest
            ->paginate(5)
            ->withQueryString();

        // Loans Filter
        $loans = Loan::with(['loanProvider', 'employee.user', 'employee.company'])
            ->whereHas('employee', function ($q) use ($search, $company) {
                $q->where('company_id', $company->id)
                ->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%$search%")
                        ->orWhere('email', 'LIKE', "%$search%")
                        ->orWhere('phone', 'LIKE', "%$search%");
                });
            })
            ->when($filterByDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc') // Order by latest
            ->paginate(5)
            ->withQueryString();

        // Remittances Filter
        $remittances = Remittance::with(['company'])
            ->where('company_id', $company->id)
            ->where('remittance_number', 'LIKE', "%$search%")
            ->when($filterByDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc') // Order by latest
            ->paginate(5)
            ->withQueryString();

        // Repayments Filter
        $repayments = Repayment::with([
            'loan',
            'loan.loanProvider',
            'loan.employee.user',
            'loan.employee.company',
        ])
        ->whereHas('loan.employee.user', function ($q) use ($search, $company) {
            $q->where('company_id', $company->id);
        })
        ->when($filterByDate, function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        })
        ->orderBy('created_at', 'desc') // Order by latest
        ->paginate(5)
        ->withQueryString();

        return Inertia::render('Companies/Show', [
            'company' => $company,
            'employees' => $employees,
            'loans' => $loans,
            'remittances' => $remittances,
            'repayments' => $repayments
        ]);
    }

    
    
    public function edit(Company $company)
    {
        return Inertia::render('Companies/Edit', [
            'company' => $company,
        ]);
    }


    public function update(UpdateCompanyRequest $request, Company $company)
    {
        $company->update($request->validated());

        return redirect()->route('companies.index')->with('success', 'Company updated successfully.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
    }
}
