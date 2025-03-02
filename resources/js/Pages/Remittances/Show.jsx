import React, { useState } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { FileText, FileSpreadsheet, Plus, Filter, X } from 'lucide-react';
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";

const Show = ({ remittance }) => {
    const [selectedLoans, setSelectedLoans] = useState([]);

    const { flash, pagination, auth, totalRepayments } = usePage().props; 

    const roleId = auth.user?.role_id;

  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];


    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const handleSelectAll = () => {
        if (selectedLoans.length === remittance?.repayments?.length) {
            setSelectedLoans([]);
        } else {
            setSelectedLoans(remittance?.repayments?.map((data) => data?.loan?.id));
        }
    };

    const handleSelectLoan = (id) => {
        setSelectedLoans((prev) =>
            prev.includes(id) ? prev.filter((loanId) => loanId !== id) : [...prev, id]
        );
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
              router.post(route('loans.bulkRepayment'), { loanIds: selectedLoans }, {
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
    
        const generatePDF = () => {
          const doc = new jsPDF();
          const logoUrl = '/images/logo-dark.png';
          doc.addImage(logoUrl, 'PNG', 10, 10, 80, 30);
          doc.setFontSize(14);
          doc.text(`Repayment Remittance Report`, 14, 50);
          
          const columns = ["Loan number", "Employee name", "Loan amount"];
          
          const rows = remittance?.repayments.map(data => [
            data?.loan?.number, 
            data.loan?.employee?.user?.name,
            data?.loan?.amount
          ]);
          
          doc.autoTable({
            head: [columns],
            body: rows,
            startY: 60,
          });
          
          doc.save("loans_reports.pdf");
        };
      
        const generateExcel = () => {
          const ws = XLSX.utils.json_to_sheet(remittance?.repayments.map((data) => ({
            Loan_Number:data?.loan?.number, 
            Employee_Name:data.loan?.employee?.user?.name,
            Loan_Amount:data?.loan?.amount
          })));
        
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Repayment Remittance Report');
          XLSX.writeFile(wb, 'remittance_report.xlsx');
        };

    return (
        <Layout>
            <Head title={remittance.remittance_number} />
            <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">Remittance Details</h1>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Remittance Number:</strong>
                        <span className="text-gray-800">{remittance?.remittance_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong className="text-gray-600">Company:</strong>
                        <span className="text-gray-800">{remittance?.company?.name || 'N/A'}</span>
                    </div>
                </div>

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
                  lg:block bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 mt-4
                `}>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-semibold text-gray-900 w-full sm:w-auto my-auto">
                    {status} Loans Directory
                    </h1>
                    
                    <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
                      {userPermission.includes('Export remittance') && 
                      <button
                        onClick={generatePDF}
                        disabled={remittance?.repayments.length === 0}
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
                        disabled={remittance?.repayments.length === 0}
                        className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2 my-auto" />
                        <span className='my-auto'>
                          Excel
                        </span>
                      </button>}
                      {userPermission.includes('Edit remittance') &&
                      <button
                        onClick={handleBulkAction}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark as Paid
                      </button>}
                    </div>
                </div>
              </div>

                {/* Loans Table */}
                <div className="relative flex flex-col w-full h-full mt-4 text-slate-300 bg-slate-800 shadow-md rounded-lg bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead>
                            <tr>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={selectedLoans.length === remittance?.repayments?.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">Employee</th>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">Loan number</th>
                                <th className="p-4 border-b border-slate-600 bg-slate-700">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {remittance?.repayments?.length > 0 ? (
                                remittance.repayments.map((data, index) => (
                                    <tr key={index} className="even:bg-slate-900 hover:bg-slate-700">
                                        <td className="p-4 border-b border-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={selectedLoans.includes(data?.loan?.id)}
                                                onChange={() => handleSelectLoan(data?.loan?.id)}
                                            />
                                        </td>
                                        <td className="p-4 border-b border-slate-700">
                                            <p className="text-sm text-slate-100 font-semibold">
                                                {data?.loan?.employee?.user?.name || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-slate-700">
                                            <p className="text-sm text-slate-300">{data?.loan?.number || 'N/A'}</p>
                                        </td>
                                        <td className="p-4 border-b border-slate-700">
                                            <p className="text-sm text-slate-300">
                                                {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(data?.loan?.amount)}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No loans found.</td>
                                </tr>
                            )} 
                        </tbody>
                    </table>
                    <p className='ml-auto mt-4 px-4 pb-4 flex items-center space-x-2'><span className='my-auto'>=</span> <span className='text-2xl font-bold'>{new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(totalRepayments)}</span></p>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-left">
                    {userPermission.includes('Index remittance') &&
                    <Link 
                        href={route('remittances.index')} 
                        className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        Back to Remittances
                    </Link>}
                </div>
            </div>
        </Layout>
    );
};

export default Show;
