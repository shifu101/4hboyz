import React, { useState } from 'react';
import { Link, usePage, router, useForm, Head } from '@inertiajs/react';
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
  const { remittances, flash, pagination, auth } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const roleId = auth.user?.role_id;

  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];

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


  const { delete: destroy } = useForm();

  const handleDelete = (remittanceId) => {
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
        destroy(route('remittances.destroy', remittanceId));
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);
    
    router.get(route('remittances.index'), { 
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
    
    router.get(route('remittances.index'), {
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
    
    router.get(route('remittances.index'), {
      search: searchTerm
    }, {
      preserveState: true,
      onFinish: () => setLoading(false),
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Remittances Report`, 14, 20);
    
    const columns = ["Remittance Number", "Company Name"];
    const rows = remittances.map(data => [
      data.remittance_number, 
      data.company?.name
    ]);
    
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
    });
    
    doc.save("remittances_report.pdf");
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(remittances.map((data) => ({
      Remittance_Number: data.remittance_number,
      Company_Name: data.company?.name
    })));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Remittances');
    XLSX.writeFile(wb, 'remittances_report.xlsx');
  };

  return (
    <Layout>
      <Head title="List remittance" />
      <div className="w-full">
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
              Remittance Directory
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              {(userPermission.includes('Create remittance') && auth?.user?.phone_verified_at !== null) ?
                <Link
                  href={route('remittances.create')}
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
              {userPermission.includes('Export remittance') &&
              <button
                onClick={generatePDF}
                disabled={remittances.length === 0}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  PDF
                </span>
              </button>}
              {userPermission.includes('Export remittance') && 
              <button
                onClick={generateExcel}
                disabled={remittances.length === 0}
                className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 my-auto" />
                <span className='my-auto'>
                  Excel
                </span>
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
                placeholder="Search by company name..."
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

        {loading && <p className="text-sm text-gray-500">Searching...</p>}
        
        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
            <strong>Success: </strong>{flash.success}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Remittance Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Company Name</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {remittances.length > 0 ? (
                remittances.map((remittance) => (
                  <tr key={remittance.id}>
                    <td className="px-6 py-4">{remittance.remittance_number}</td>
                    <td className="px-6 py-4">{remittance.company?.name}</td>
                    <td className="px-6 py-4 text-right">
                      {userPermission.includes('View remittance') &&
                      <Link href={route('remittances.show', remittance.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View</Link>}
                      {userPermission.includes('Edit remittance') &&
                      <Link href={route('remittances.edit', remittance.id)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ml-2">Edit</Link>}
                      {userPermission.includes('Delete remittance') &&
                      <button onClick={() => handleDelete(remittance.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2">Delete</button>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">No remittances found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
