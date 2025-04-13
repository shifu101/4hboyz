import React, { useState } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { FileText, FileSpreadsheet, Plus, Filter, X, Calendar } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FiPhone } from 'react-icons/fi';

const Index = () => {
  const { loans, flash, pagination, auth, params } = usePage().props; 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const roleId = auth.user?.role_id;
  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];

  const [selectedLoans, setSelectedLoans] = useState([]);
  const status = params?.status || 'All';
  
  // Date range state
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [dateFilterActive, setDateFilterActive] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);

    router.get(route('loans.index'), { 
      search: e.target.value,
      ...getDateParams()
    }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };

  const getDateParams = () => {
    return {
      start_date: format(dateRange[0].startDate, 'yyyy-MM-dd'),
      end_date: format(dateRange[0].endDate, 'yyyy-MM-dd')
    };
  };

  const applyDateFilter = () => {
    setLoading(true);
    setDateFilterActive(true);
    setDatePickerOpen(false);
    
    router.get(route('loans.index'), {
      search: searchTerm,
      ...getDateParams()
    }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };

  const clearDateFilter = () => {
    setDateFilterActive(false);
    setLoading(true);
    
    router.get(route('loans.index'), {
      search: searchTerm
    }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const logoUrl = '/images/logo-dark.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 80, 30);
    doc.setFontSize(14);
    
    let title = `Loans Report`;
    if (dateFilterActive) {
      title += ` (${format(dateRange[0].startDate, 'MMM dd, yyyy')} - ${format(dateRange[0].endDate, 'MMM dd, yyyy')})`;
    }
    
    doc.text(title, 14, 50);
    
    const columns = ["Loan number", "Employee name", "Principle","Charges","Loan due","Current balance", "Status"];
    
    const rows = loans.map(data => [
      data.number, 
      data.employee?.user?.name, 
      new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.amount - data.charges), 
      new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.charges),
      new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.amount),
      new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.currentBalance),
      data.status
    ]);
    
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 60,
    });
    
    doc.save("loans_reports.pdf");
  };
  
  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(loans.map((data) => ({
      Loan_Number: data.number, 
      Employee_Name: data.employee?.user?.name, 
      Principle: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.amount - data.charges), 
      Charges: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.charges), 
      Loan_due: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.amount),
      Current_balance: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data.currentBalance), 
      Status: data.status
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Loans');
    XLSX.writeFile(wb, 'loans_report.xlsx');
  };

  const handleSelectLoan = (id) => {
    setSelectedLoans((prev) =>
      prev.includes(id) ? prev.filter((loanId) => loanId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLoans.length === loans.length) {
      setSelectedLoans([]);
    } else {
      setSelectedLoans(loans.map((loan) => loan.id));
    }
  };

  const handleBulkAction = () => {
    if (selectedLoans.length === 0) {
      Swal.fire('No loans selected', 'Please select at least one loan.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `This will mark ${selectedLoans.length} loan(s) as Paid and create repayment records.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as Paid!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('loans.bulkUpdate'), { loanIds: selectedLoans }, {
          onSuccess: () => {
            Swal.fire('Success', 'Loans marked as Paid successfully!', 'success');
            setSelectedLoans([]);
          },
          onError: (err) => {
            console.error('Bulk update error:', err);
            Swal.fire('Error', 'Failed to update loans.', 'error');
          },
        });
      }
    });
  };

  return (
    <Layout>
      <Head title="List loans" />
      <div className="w-full">
        {/* Mobile Filters Toggle */}
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
              {status} Salary Advances Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              {(userPermission.includes('Create loan') && auth?.user?.phone_verified_at !== null) ?
                <Link
                  href={route('loans.create')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-2 my-auto" />
                  <span className='my-auto flex items-center'>
                    Request for an advance
                  </span>
                </Link>
              :
                (roleId === 3 &&
                <Link href={route('update-phone')} className="ml-2 text-blue-300 hover:text-blue-500 flex items-center gap-2">
                  <FiPhone className="inline-block" /> Confirm phone in order to request advance
                </Link>)
              }
              {userPermission.includes('Export loan') &&
              <button
                onClick={generatePDF}
                disabled={loans.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>}
              {userPermission.includes('Export loan') && 
              <button
                onClick={generateExcel}
                disabled={loans.length === 0}
                className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  Excel
                </span>
              </button>}
              {(userPermission.includes('Edit loan') && status === 'Approved') &&
              <button
                onClick={handleBulkAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark as Paid
              </button>}
            </div>
          </div>

          {/* Search and Date Range Controls */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search loans..."
              />
              {loading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                <span>
                  {dateFilterActive 
                    ? `${format(dateRange[0].startDate, 'MMM dd, yyyy')} - ${format(dateRange[0].endDate, 'MMM dd, yyyy')}`
                    : 'Date Range Filter'
                  }
                </span>
                <Calendar className="w-5 h-5 text-gray-500" />
              </button>
              
              {dateFilterActive && (
                <button
                  onClick={clearDateFilter}
                  className="absolute right-10 top-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              
              {datePickerOpen && (
                <div className="absolute right-0 mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                  <DateRange
                    editableDateInputs={true}
                    onChange={item => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    rangeColors={['#3b82f6']}
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      onClick={() => setDatePickerOpen(false)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyDateFilter}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      
        {/* Flash Message */}
        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
            <strong className="font-semibold">Success: </strong>
            {flash.success}
          </div>
        )}

        {/* Date Filter Indicator */}
        {dateFilterActive && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 flex items-center justify-between">
            <span>
              <strong className="font-semibold">Date Filter: </strong>
              {format(dateRange[0].startDate, 'MMMM dd, yyyy')} to {format(dateRange[0].endDate, 'MMMM dd, yyyy')}
            </span>
            <button 
              onClick={clearDateFilter}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Loans Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                {userPermission.includes('Edit loan') &&
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedLoans.length === loans.length}
                    onChange={handleSelectAll}
                  />
                </th>}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Salary advance number</th>
                {roleId !== 3 &&
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Employee Name</th>}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Principle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Salary advance due</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Current balance</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <tr key={loan.id}>
                    {userPermission.includes('Edit loan') &&
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLoans.includes(loan.id)}
                        onChange={() => handleSelectLoan(loan.id)}
                      />
                    </td>}
                    <td className="px-6 py-4 whitespace-nowrap">{loan.number}</td>
                    {roleId !== 3 &&
                    <td className="px-6 py-4 whitespace-nowrap">{loan.employee?.user?.name}</td>}
                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.amount - loan.charges)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(loan.currentBalance)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{loan.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        {userPermission.includes('View loan') &&
                        <Link
                          href={route('loans.show', loan.id)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          View
                        </Link>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">No loans found.</td>
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