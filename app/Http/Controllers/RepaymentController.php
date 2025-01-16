<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRepaymentRequest;
use App\Http\Requests\UpdateRepaymentRequest;
use App\Models\Repayment;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RepaymentController extends Controller
{

    public function index()
    {

        $repayments = Repayment::paginate(10);

        return Inertia::render('Employees/Index', [
            'repayments' => $repayments->items(),
            'pagination' => $repayments,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        $repayments = Repayment::all();

        return Inertia::render('Repayments/Create', [
            'repayments' => $repayments,
        ]);
    }

    public function store(StoreRepaymentRequest $request)
    {
        Repayment::create($request->validated());

        return redirect()->route('repayments.index')->with('success', 'Repayment created successfully.');
    }


    public function show(Repayment $repayment)
    {
        $repayment->load('repayment');

        return Inertia::render('Repayments/Show', [
            'repayment' => $repayment,
        ]);
    }

    public function edit(Repayment $repayment)
    {
        $repayments = Repayment::all();

        return Inertia::render('Repayments/Edit', [
            'repayment' => $repayment,
            'repayments' => $repayments,
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
