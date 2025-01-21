import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';  

const SelectCompany = () => {
    const { companies, user } = usePage().props; 

    const companyOptions = companies.map(company => ({
        value: company.id,
        label: company.name
    }));

    const { data, setData, post, errors } = useForm({
      salary: '',
      loan_limit: 0,
      user_id: user.id,
      company_id: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    const handleCompanyChange = (selectedOption) => {
        setData('company_id', selectedOption ? selectedOption.value : ''); 
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold mb-6">Fill In Your Employee Details</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Select (React Select) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <Select
                            options={companyOptions}
                            value={companyOptions.find(option => option.value === data.company_id)}  // Set selected option
                            onChange={handleCompanyChange}
                            className="mt-1 block w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Select a company"
                        />
                        {errors.company_id && <div className="text-sm text-red-500 mt-1">{errors.company_id}</div>}
                    </div>

                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary</label>
                        <input
                            type="number"
                            step="any"
                            value={data.salary}
                            onChange={(e) => setData('salary', e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.salary && <div className="text-sm text-red-500 mt-1">{errors.salary}</div>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Send
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default SelectCompany;
