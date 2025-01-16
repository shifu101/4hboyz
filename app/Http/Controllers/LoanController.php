<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Loan;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LoanController extends Controller
{

    public function index()
    {

        $loans = Loan::paginate(10);

        return Inertia::render('Employees/Index', [
            'loans' => $loans->items(),
            'pagination' => $loans,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        $loans = Loan::all();

        return Inertia::render('Loans/Create', [
            'loans' => $loans,
        ]);
    }

    public function store(StoreLoanRequest $request)
    {
        Loan::create($request->validated());

        return redirect()->route('loans.index')->with('success', 'Loan created successfully.');
    }


    public function show(Loan $loan)
    {
        $loan->load('loan');

        return Inertia::render('Loans/Show', [
            'loan' => $loan,
        ]);
    }

    public function edit(Loan $loan)
    {
        $loans = Loan::all();

        return Inertia::render('Loans/Edit', [
            'loan' => $loan,
            'loans' => $loans,
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
