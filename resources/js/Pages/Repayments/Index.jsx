import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { useForm } from '@inertiajs/react';

const Index = () => {
  const { repayments, flash, pagination } = usePage().props; // Assuming pagination data is passed
  const [searchTerm, setSearchTerm] = useState('');

  const {
    delete: destroy,
  } = useForm();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle delete confirmation
  const handleDelete = (repaymentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Use Inertia.delete for making the delete request
        destroy(route('repayments.destroy', repaymentId), {
          onSuccess: () => {
            // Optionally you can handle success actions here
          },
          onError: (err) => {
            // Optionally handle errors
            console.error('Delete error:', err);
          },
        });
      }
    });
  };

  // Filtered repayments based on search term
  const filteredRepayments = repayments.filter((repayment) =>
    repayment?.loan?.employee?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Repayments Directory</h1>
            <p className="text-lg text-gray-600 mt-2">Manage and overview all registered repayments</p>
          </div>
          <Link
            href={route('repayments.create')}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 gap-2 text-sm font-medium"
          >
            <span className='my-auto'>Create New Repayment</span>
          </Link>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Search repayments..."
          />
        </div>

        {/* Flash Message */}
        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
            <strong className="font-semibold">Success: </strong>
            {flash.success}
          </div>
        )}

        {/* Repayments Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Repayment Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Loan amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRepayments.length > 0 ? (
                filteredRepayments.map((repayment) => (
                  <tr key={repayment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{repayment.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repayment?.loan?.employee?.user?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repayment?.loan?.employee?.company?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repayment?.loan?.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{repayment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={route('repayments.show', repayment.id)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          View
                        </Link>
                        <Link
                          href={route('repayments.edit', repayment.id)}
                          className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                        >
                          Edit
                        </Link>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleDelete(repayment.id); // Call SweetAlert2 on delete
                          }}
                          className="inline"
                        >
                          <button type="submit" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No repayments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total > pagination.per_page && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex gap-2">
              {pagination.prev_page_url && (
                <Link
                  href={pagination.prev_page_url}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Previous
                </Link>
              )}
              {pagination.next_page_url && (
                <Link
                  href={pagination.next_page_url}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
