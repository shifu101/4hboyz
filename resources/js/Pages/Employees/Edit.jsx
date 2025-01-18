import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';

const EditEmployee = ({ errors }) => {
  const { companies, employee, users } = usePage().props; 

  const { data, setData, put, processing } = useForm({
    salary: employee.salary,
    loan_limit: employee.loan_limit,
    user_id: employee.user_id,
    company_id: employee.company_id, 
  });

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (employee.company_id) {
      const defaultCompany = companies.find((c) => c.id === employee?.company_id);
      setSelectedCompany(defaultCompany);
    }

    if (employee.user_id) {
      const defaultUser = users.find((c) => c.id === employee?.user_id);
      setSelectedUser(defaultUser);
    }
  }, [employee, companies, users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('employees.update', { employee: employee.id })); 
  };

  const handleCompanyChange = (selectedOption) => {
    setData('company_id', selectedOption ? selectedOption.value : '');
    setSelectedCompany(selectedOption);
  };

  const handleUserChange = (selectedOption) => {
    setData('user_id', selectedOption ? selectedOption.value : '');
    setSelectedUser(selectedOption);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Edit Employee</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Phone Input */}
          <div>
              <label className="block text-sm font-medium text-gray-700">Loan limit</label>
              <input
                  type="number"
                  step="any"
                  value={data.loan_limit}
                  onChange={(e) => setData('loan_limit', e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.loan_limit && <div className="text-sm text-red-500 mt-1">{errors.loan_limit}</div>}
          </div>

          {/* Company Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <Select
              value={selectedCompany}
              onChange={handleCompanyChange}
              options={companies.map((company) => ({
                value: company.id,
                label: company.name
              }))}
              placeholder="Select a company"
            />
            {errors.company_id && <div className="text-sm text-red-500 mt-1">{errors.company_id}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <Select
              value={selectedUser}
              onChange={handleUserChange}
              options={users.map((user) => ({
                value: user.id,
                label: user.name
              }))}
              placeholder="Select a user"
            />
            {errors.user_id && <div className="text-sm text-red-500 mt-1">{errors.user_id}</div>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Save'}
          </button>
        </form>
        <Link href={route('employees.index')} className="mt-4 inline-block text-sm text-blue-600">Back to Employees</Link>
      </div>
    </Layout>
  );
};

export default EditEmployee;
