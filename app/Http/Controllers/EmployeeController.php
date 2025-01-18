<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Company;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{

    public function index()
    {

        $employees = Employee::with('user')->paginate(10);

        return Inertia::render('Employees/Index', [
            'employees' => $employees->items(),
            'pagination' => $employees,
            'flash' => session('flash'),
        ]);
    }

    public function create()
    {
        $companies = Company::all();
        $users = User::all();
        return Inertia::render('Employees/Create', [
            'companies' => $companies,
            'users'=>$users
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        Employee::create($request->validated());

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }


    public function show(Employee $employee)
    {

        $employee->load('user');

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            'user' => $employee->user, 
            'user' => $employee->user, 
            'company' => $employee->company
        ]);
    }

    public function edit(Employee $employee)
    {
        $companies = Company::all();
        $users = User::all();
        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'companies' => $companies,
            'users'=>$users
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }


    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
