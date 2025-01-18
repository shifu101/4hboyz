<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Loan;
use App\Models\Employee;
use App\Models\LoanProvider;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LoanController extends Controller
{

    public function index()
    {

         $loans = Loan::with(['loanProvider', 'employee.user'])->paginate(10);

        return Inertia::render('Loans/Index', [
            'loans' => $loans->items(),
            'pagination' => $loans,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        $employees = Employee::with(['user'])->get();
        $loanProviders = LoanProvider::all();

        return Inertia::render('Loans/Create', [
            'employees' => $employees,
            'loanProviders'=> $loanProviders
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
