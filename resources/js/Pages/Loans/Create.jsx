import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';  

const Create = () => {
    const { loanProviders, employees } = usePage().props; 

    const loanProviderOptions = loanProviders.map(loanProvider => ({
        value: loanProvider.id,
        label: loanProvider.name
    }));

    const employeeOptions = employees.map(employee => ({
      value: employee.id,
      label: employee.user?.name
    }));

    const { data, setData, post, errors } = useForm({
      amount: '',
      status: 'Active',
      disbursed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      employee_id: '',
      loan_provider_id: 1
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('loans.store'));
    };

    const handleLoanProviderChange = (selectedOption) => {
        setData('loan_provider_id', selectedOption ? selectedOption.value : ''); 
    };

    const handleEmployeeChange = (selectedOption) => {
        setData('employee_id', selectedOption ? selectedOption.value : ''); 
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold mb-6">Create Loan</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            step="any"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.amount && <div className="text-sm text-red-500 mt-1">{errors.amount}</div>}
                    </div>


                    {/* loanProvider Select (React Select) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loan Provider</label>
                        <Select
                            options={loanProviderOptions}
                            value={loanProviderOptions.find(option => option.value === data.loan_provider_id)}  // Set selected option
                            onChange={handleLoanProviderChange}
                            className="mt-1 block w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Select a loanProvider"
                        />
                        {errors.loan_provider_id && <div className="text-sm text-red-500 mt-1">{errors.loan_provider_id}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee</label>
                        <Select
                            options={employeeOptions}
                            value={employeeOptions.find(option => option.value === data.employee_id)} 
                            onChange={handleEmployeeChange}
                            className="mt-1 block w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Select a employee"
                        />
                        {errors.employee_id && <div className="text-sm text-red-500 mt-1">{errors.employee_id}</div>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Create Loan
                    </button>
                </form>

                {/* Link to Go Back */}
                <div className="mt-6 text-center">
                    <Link href={route('loans.index')} className="text-indigo-600 hover:text-indigo-800">
                        Back to Loans
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Create;
