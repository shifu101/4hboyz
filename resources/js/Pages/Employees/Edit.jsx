import React, { useState, useEffect } from 'react';
import { useForm, usePage, Link, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Select from 'react-select';

const EditEmployee = ({ errors }) => {
  const { companies, employee, users, auth } = usePage().props; 
  const roleId = auth.user?.role_id;

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, setData, put, processing } = useForm({
    salary: employee.salary,
    loan_limit: selectedCompany 
      ? Number((employee.salary * selectedCompany.loan_limit / 100).toFixed(2)) 
      : 0, 
    user_id: employee.user_id,
    company_id: roleId === 2 ? auth.user?.company_id ?? '' : '',
    approved: employee.approved ?? 'Approved', 
    reason: ''
  });
  

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

  const handleApprovalChange = (e) => {
    setData('approved', e.target.value);
  };

  return (
    <Layout>
      <Head title="Edit employee" />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Edit Employee Details And Approved</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label className="block text-sm font-medium text-gray-700">Net Salary</label>
              <input
                  type="number"
                  step="any"
                  value={data.salary}
                  onChange={(e) => {
                      const salary = parseFloat(e.target.value) || 0;
                      setData({
                          ...data,
                          salary: salary,
                          loan_limit: selectedCompany 
                          ? Number((salary * selectedCompany.loan_limit / 100).toFixed(2)) 
                          : 0, 
                      });
                  }}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.salary && <div className="text-sm text-red-500 mt-1">{errors.salary}</div>}
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">Loan Limit (% of net salary)</label>
              <input
                  type="number"
                  value={data.loan_limit}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none"
              />
          </div>

          {roleId === 1 &&
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <Select
              value={selectedCompany}
              onChange={handleCompanyChange}
              className='outline-none'
              options={companies.map((company) => ({
                value: company.id,
                label: company.name
              }))}
              placeholder="Select a company"
            />
            {errors.company_id && <div className="text-sm text-red-500 mt-1">{errors.company_id}</div>}
          </div>}

          {roleId === 1 &&
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
          </div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Approved</label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="approved"
                  value="Approved"
                  checked={data.approved === "Approved"}
                  onChange={handleApprovalChange}
                  className="hidden"
                />
                <span
                  className={`px-4 py-2 text-white font-medium rounded-md cursor-pointer ${
                    data.approved === "Approved" ? "bg-green-600" : "bg-gray-300"
                  }`}
                  onClick={() => handleApprovalChange({ target: { value: "Approved" } })}
                >
                  Approve
                </span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="approved"
                  value="Declined"
                  checked={data.approved === "Declined"}
                  onChange={handleApprovalChange}
                  className="hidden"
                />
                <span
                  className={`px-4 py-2 text-white font-medium rounded-md cursor-pointer ${
                    data.approved === "Declined" ? "bg-red-600" : "bg-gray-300"
                  }`}
                  onClick={() => handleApprovalChange({ target: { value: "Declined" } })}
                >
                  Decline
                </span>
              </label>
            </div>
            {errors.approved && <div className="text-sm text-red-500 mt-1">{errors.approved}</div>}
          </div>

          {data.approved === "Declined" &&
          <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Reason for Declining:</label>
              <textarea
                  value={data.reason}
                  onChange={(e) => setData('reason', e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400"
                  placeholder="Provide reason for declining employee approval"
              ></textarea>
          </div>}


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
