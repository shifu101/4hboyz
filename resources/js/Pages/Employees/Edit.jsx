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
    loan_limit: 0,
    user_id: employee.user_id,
    company_id: roleId === 2 ? auth.user?.company_id ?? '' : '',
    approved: employee.approved ?? 'Approved',
    reason: ''
  });

  useEffect(() => {
    if (employee.company_id) {
      const defaultCompany = companies.find(c => c.id === employee.company_id);
      setSelectedCompany(defaultCompany);
      if (defaultCompany) {
        const salary = parseFloat(employee.salary) || 0;
        setData('loan_limit', Number((salary * defaultCompany.loan_limit / 100).toFixed(2)));
      }
    }

    if (employee.user_id) {
      const defaultUser = users.find(u => u.id === employee.user_id);
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

    if (selectedOption && data.salary) {
      const newLimit = Number((data.salary * selectedOption.loan_limit / 100).toFixed(2));
      setData('loan_limit', newLimit);
    }
  };

  const handleUserChange = (selectedOption) => {
    setData('user_id', selectedOption ? selectedOption.value : '');
    setSelectedUser(selectedOption);
  };

  const handleApprovalChange = (e) => {
    setData('approved', e.target.value);
    setData('reason', '');
  };

  return (
    <Layout>
      <Head title="Edit employee" />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Employee KYC and Take Action</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Action Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Action</label>
            <div className="mt-2 flex flex-wrap gap-3">
              {['Approved', 'Declined', 'Suspended', 'Terminated'].map((status) => (
                <label key={status} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="approved"
                    value={status}
                    checked={data.approved === status}
                    onChange={handleApprovalChange}
                    className="hidden"
                  />
                  <span
                    className={`px-4 py-2 text-white font-medium rounded-md cursor-pointer ${
                      data.approved === status
                        ? status === 'Approved'
                          ? 'bg-green-600'
                          : status === 'Declined'
                          ? 'bg-red-600'
                          : status === 'Suspended'
                          ? 'bg-yellow-500'
                          : 'bg-gray-800'
                        : 'bg-gray-300'
                    }`}
                    onClick={() => handleApprovalChange({ target: { value: status } })}
                  >
                    {status}
                  </span>
                </label>
              ))}
            </div>
            {errors.approved && <div className="text-sm text-red-500 mt-1">{errors.approved}</div>}
          </div>

          {/* Salary & Loan */}
          {data.approved === "Approved" && (
            <>
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
                      salary,
                      loan_limit: selectedCompany
                        ? Number((salary * selectedCompany.loan_limit / 100).toFixed(2))
                        : 0
                    });
                  }}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
                {errors.salary && <div className="text-sm text-red-500 mt-1">{errors.salary}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Limit (% of salary)</label>
                <input
                  type="number"
                  value={data.loan_limit}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          {/* Company selection */}
          {roleId === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <Select
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  options={companies.map((c) => ({ value: c.id, label: c.name, loan_limit: c.loan_limit }))}
                  placeholder="Select a company"
                  className="mt-1"
                />
                {errors.company_id && <div className="text-sm text-red-500 mt-1">{errors.company_id}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">User</label>
                <Select
                  value={selectedUser}
                  onChange={handleUserChange}
                  options={users.map((u) => ({ value: u.id, label: u.name }))}
                  placeholder="Select a user"
                  className="mt-1"
                />
                {errors.user_id && <div className="text-sm text-red-500 mt-1">{errors.user_id}</div>}
              </div>
            </>
          )}

          {/* Decline/Suspend/Terminate reason */}
          {['Declined', 'Suspended', 'Terminated'].includes(data.approved) && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Reason:</label>
              <Select
                value={data.reason ? { value: data.reason, label: data.reason } : null}
                onChange={(option) => setData('reason', option?.value)}
                options={[
                  { label: 'Incomplete KYC', value: 'Incomplete KYC' },
                  { label: 'Not an Employee', value: 'Not an Employee' },
                  { label: 'Violation of Policy', value: 'Violation of Policy' },
                  { label: 'Disciplinary Action', value: 'Disciplinary Action' },
                  { label: 'Other', value: 'Other' }
                ]}
                placeholder="Select a reason"
              />
              {errors.reason && <div className="text-sm text-red-500 mt-1">{errors.reason}</div>}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Submit Employee Update'}
          </button>
        </form>

        <Link href={route('employees.index')} className="mt-4 inline-block text-sm text-blue-600">
          ← Back to Employees
        </Link>
      </div>
    </Layout>
  );
};

export default EditEmployee;
