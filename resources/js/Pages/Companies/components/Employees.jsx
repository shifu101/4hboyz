import React, { useState } from "react";
import { Link, usePage, router, useForm } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { FileText, FileSpreadsheet, Plus, Filter, X, Check, XCircle } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';

const Employees = ({ companyId, employees, roleId }) => {
  const [search, setSearch] = useState("");

   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
   const { processing } = useForm({
        approved: ''
    });

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("companies.show", companyId), { search }, { preserveState: true });
  };

  const handlePageChange = (url) => {
    if (url) {
      router.get(url, {}, { preserveState: true });
    }
  };

    const handleDelete = (employeeId) => {
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
          router.delete(route('employees.destroy', employeeId));
        }
      });
    };


    const generatePDF = () => {
    const doc = new jsPDF();
    const logoUrl = '/images/logo/logo.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 80, 30);
    doc.setFontSize(14);
    doc.text(`Employees Report`, 14, 50);
    
    const columns = ["Name", "Email", "Phone", "Salary", "Loan Limit","Unpaid loans","Total Loan Balance"];
    
    const rows = employees.data?.map(data => [
        data.user?.name, 
        data.user?.email, 
        data.user?.phone || 'N/A', 
        data.salary,
        data.loan_limit,
        data.unpaid_loans_count,
        data.total_loan_balance
    ]);
    
    doc.autoTable({
        head: [columns],
        body: rows,
        startY: 60,
    });
    
    doc.save("employees_reports.pdf");
    };

    const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employees?.data?.map((data) => ({
        Name: data.user?.name,
        Email: data.user?.email,
        Phone: data.user?.phone || 'N/A',
        Salary: data.salary,
        Loan_Limit: data.loan_limit,
        Unpaid_loans: data.unpaid_loans_count,
        Total_Loan_Balance: data.total_loan_balance,
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'employees_report.xlsx');
    };


    const handleApprovedUpdate = (e, id, approved) => {
        e.preventDefault();
        
        const formData = {
            _method: 'PUT', 
            approved: approved,
            id: id
        };
        
        Swal.fire({
            title: `Are you sure you want to ${approved.toLowerCase()} this employee?`,
            text: 'This action will update the employee approved.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: approved === 'Approved' ? '#3085d6' : '#d33',
            cancelButtonColor: '#gray',
            confirmButtonText: `Yes, ${approved.toLowerCase()} it!`,
        }).then((result) => {
            if (result.isConfirmed) {
            router.post(route('employees.update', id), formData, {
                onSuccess: () => {
                Swal.fire(
                    `${approved}!`, 
                    `The Employee has been ${approved.toLowerCase()}.`, 
                    'success'
                );
                },
                onError: (err) => {
                console.error(`${approved} error:`, err);
                Swal.fire('Error', 'There was a problem updating the employee approval.', 'error');
                }
            });
            }
        });
        };
    

  return (
    <div>
<div className="lg:hidden mb-4">
          <button 
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {mobileFiltersOpen ? (
              <>
                <X className="w-5 h-5 mr-2" /> Close Filters
              </>
            ) : (
              <>
                <Filter className="w-5 h-5 mr-2" /> Open Filters
              </>
            )}
          </button>
        </div>

        {/* Top Section - Responsive */}
        <div className={`
          ${mobileFiltersOpen ? 'block' : 'hidden'} 
          lg:block bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4
        `}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 w-full sm:w-auto my-auto">
              Employees Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              <Link
                href={route('employees.create')}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                Create
                </span>
              </Link>
              <button
                onClick={generatePDF}
                disabled={employees.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>
              <button
                onClick={generateExcel}
                disabled={employees.length === 0}
                className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  Excel
                </span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-4">
          <form onSubmit={handleSearch} className="my-4 flex space-x-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees..."
          className="p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </form>
          </div>
        </div>


      {/* Employees Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Loan Limit</th>
              <th className="px-4 py-2">Unpaid Loans</th>
              <th className="px-4 py-2">Loan Balance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.data.length > 0 ? (
              employees.data.map((employee) => (
                <tr key={employee.id} className="border-t">
                  <td className="px-4 py-4">{employee.user.name}</td>
                  <td className="px-4 py-4">{employee.user.email}</td>
                  <td className="px-4 py-4">{employee.user.phone || 'N/A'}</td>
                  <td className="px-4 py-4">{employee.salary}</td>
                  <td className="px-4 py-4">{employee.loan_limit}</td>
                  <td className="px-4 py-4">{employee.unpaid_loans_count || 0}</td>
                  <td className="px-4 py-4">{employee.total_loan_balance || 0}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Employee */}
                      <Link 
                        href={route('employees.show', employee.id)} 
                        className="bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 flex items-center"
                      >
                        <span className="my-auto px-4 py-2">View</span>
                      </Link>

                      {/* Edit Employee */}
                      <Link 
                        href={route('employees.edit', employee.id)} 
                        className="flex items-center bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600"
                      >
                        <span className="my-auto px-4 py-2">Edit</span>
                      </Link>

                      {/* Delete Employee (Only for roleId === 1) */}
                      {roleId === 1 && (
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="flex items-center cursor-pointer bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
                        >
                          <span className="my-auto px-4 py-2">Delete</span> 
                        </button>
                      )}

                      {/* Approval / Deactivation Buttons */}
                      {employee.salary && (
                        <>
                          {(employee.approved !== 'Approved' && roleId !== 3) && (
                            <button
                              onClick={(e) => handleApprovedUpdate(e, employee.id, 'Approved')}
                              disabled={processing}
                              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4 mr-2" /> Approve
                            </button>
                          )}

                          {(employee?.user?.status !== 'Deactivated' && roleId !== 3) && (
                            <button
                              onClick={(e) => handleApprovedUpdate(e, employee.id, 'Deactivated')}
                              disabled={processing}
                              className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4 mr-2" /> Deactivate
                            </button>
                          )}

                          {(employee.approved !== 'Declined' && roleId !== 1) && (
                            <button
                              onClick={(e) => handleApprovedUpdate(e, employee.id, 'Declined')}
                              disabled={processing}
                              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Decline
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-600">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex space-x-2">
        {employees.links.map((link, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(link.url)}
            className={`px-3 py-1 border rounded ${
              link.active ? "bg-yellow-600 text-white" : "hover:bg-gray-200"
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
            disabled={!link.url}
          />
        ))}
      </div>
    </div>
  );
};

export default Employees;
