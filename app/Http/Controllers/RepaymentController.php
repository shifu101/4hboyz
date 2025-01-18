<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRepaymentRequest;
use App\Http\Requests\UpdateRepaymentRequest;
use App\Models\Repayment;
use App\Models\Loan;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RepaymentController extends Controller
{

    public function index()
    {

        $repayments = Repayment::with([
            'loan',
            'loan.loanProvider',
            'loan.employee.user',
            'loan.employee.company'
        ])->paginate(10);
        

        return Inertia::render('Repayments/Index', [
            'repayments' => $repayments->items(),
            'pagination' => $repayments,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        $loans = Loan::all();

        return Inertia::render('Repayments/Create', [
            'loans' => $loans,
        ]);
    }

    public function store(StoreRepaymentRequest $request)
    {
        Repayment::create($request->validated());

        return redirect()->route('repayments.index')->with('success', 'Repayment created successfully.');
    }


    public function show(Repayment $repayment)
    {
        $repayment->load([
            'loan',
            'loan.loanProvider',
            'loan.employee.user',
            'loan.employee.company'
        ]);

        return Inertia::render('Repayments/Show', [
            'repayment' => $repayment,
        ]);
    }

    public function edit(Repayment $repayment)
    {
        $loans = Loan::all();

        return Inertia::render('Repayments/Edit', [
            'repayment' => $repayment,
            'loans' => $loans,
        ]);
    }

    public function update(UpdateRepaymentRequest $request, Repayment $repayment)
    {
        $repayment->update($request->validated());

        return redirect()->route('repayments.index')->with('success', 'Repayment updated successfully.');
    }


    public function destroy(Repayment $repayment)
    {
        $repayment->delete();

        return redirect()->route('repayments.index')->with('success', 'Repayment deleted successfully.');
    }
}
