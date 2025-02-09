<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRemittanceRequest;
use App\Http\Requests\UpdateRemittanceRequest;
use App\Models\Remittance;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RemittanceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Remittance::with('company');

        // Filter based on user role
        if ($user->role_id == 2) {
            $query->whereHas('company', fn($q) => $q->where('id', $user->company_id));
        }

        // Search by company name only
        if ($request->has('search')) {
            $search = trim($request->input('search'));
            $query->whereHas('company', fn($q) => $q->where('name', 'LIKE', "%$search%"));
        }

        $remittances = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Remittances/Index', [
            'remittances' => $remittances->items(),
            'pagination' => $remittances,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Remittances/Create');
    }

    public function store(StoreRemittanceRequest $request)
    {
        Remittance::create($request->validated());

        return redirect()->route('remittances.index')->with('success', 'Remittance created successfully.');
    }

    public function show(Remittance $remittance)
    {
        $remittance->load([
            'company', 
            'repayments.loan.employee.user'
        ]);
        
        $totalRepayments = $remittance->repayments->sum('amount');
    
        return Inertia::render('Remittances/Show', [
            'remittance' => $remittance,
            'totalRepayments' => $totalRepayments,
        ]);
    }
    
    
    public function edit(Remittance $remittance)
    {
        return Inertia::render('Remittances/Edit', [
            'remittance' => $remittance,
        ]);
    }

    public function update(UpdateRemittanceRequest $request, Remittance $remittance)
    {
        $remittance->update($request->validated());

        return redirect()->route('remittances.index')->with('success', 'Remittance updated successfully.');
    }

    public function destroy(Remittance $remittance)
    {
        $remittance->delete();

        return redirect()->route('remittances.index')->with('success', 'Remittance deleted successfully.');
    }
}
