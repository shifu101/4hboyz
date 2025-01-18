import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia'; // Import Inertia
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';
import { useForm } from '@inertiajs/react';
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from 'xlsx';
import { FileText, FileSpreadsheet, Plus } from 'lucide-react';

const Index = () => {
  const { companies, flash, pagination } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState(null);

  const { delete: destroy } = useForm();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (companyId) => {
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
        destroy(route('companies.destroy', companyId), {
          onSuccess: () => {
            console.log('Deleted successfully');
          },
          onError: (err) => {
            console.error('Delete error:', err);
          },
        });
      }
    });
  };

  const filteredCompanies = companies.filter((company) =>
    company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (range) => {
    setDateRange(range);

    const startDate = range.start.format("YYYY-MM-DD");
    const endDate = range.end.format("YYYY-MM-DD");

    Inertia.get(route('companies.index'), {
      start_date: startDate,
      end_date: endDate,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  

  const generatePDF = () => {
    const doc = new jsPDF();
  
      const logoUrl = '/images/logo.png';
      doc.addImage(logoUrl, 'PNG', 10, 10, 120, 30);

      doc.setFontSize(14);
    
      // Add title text
      doc.text(`All Companies Report`, 14, 50);
      // Define columns for the table
      const columns = [
          "Name", 
          "Industry", 
          "Address", 
          "Email", 
          "Phone"
      ];
    
      // Prepare rows by looping through the agents and their accounts
      const rows = filteredCompanies.map(data => [
          data.name, 
          data.industry, 
          data.address, 
          data.email,
          data.phone
      ]); 
    
      // Create table with the agent and account data
      doc.autoTable({
          head: [columns],
          body: rows,
          startY: 60,
      });
    
      doc.save("companies_reports.pdf");
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCompanies.map((data) => ({
      Name: data.name,
      Industry: data.industry,
      Address: data.address,
      Email: data.email,
      Phone: data.phone
    })));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Companies');

    XLSX.writeFile(wb, 'companies_report.xlsx');
  };
  

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Date Range Picker Section */}
            <div className="lg:col-span-1">
              <DateRangePicker
                value={dateRange}
                onSelect={handleSelect}
                singleDateRange={true}
                numberOfCalendars={2}
                selectionType="range"
                className="w-full"
              />
            </div>

            {/* Actions Section */}
            <div className="lg:flex-row flex lg:items-center flex-col gap-3">
              <div className="lg:col-span-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Companies Directory
                </h1>
                <p className="text-sm text-gray-600 mt-1 mb-4">
                  Manage and overview all registered companies
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-2 h-fit py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Search companies..."
                />
              </div>
              <Link
                href={route('companies.create')}
                className="inline-flex items-center w-fit h-fit justify-center px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Company
              </Link>

              <button
                onClick={generatePDF}
                disabled={filteredCompanies.length === 0}
                className="inline-flex items-center justify-center px-4 w-fit h-fit py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4 mr-2" />
                Download PDF
              </button>

              <button
                onClick={generateExcel}
                disabled={filteredCompanies.length === 0}
                className="inline-flex items-center w-fit h-fit justify-center px-4 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Excel
              </button>
            </div>
          </div>
        </div>

        {flash?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
            <strong className="font-semibold">Success: </strong>
            {flash.success}
          </div>
        )}

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Industry</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Phone</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td className="px-6 py-4">{company.name}</td>
                    <td className="px-6 py-4">{company.industry}</td>
                    <td className="px-6 py-4">{company.address}</td>
                    <td className="px-6 py-4">{company.email}</td>
                    <td className="px-6 py-4">{company.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-3">
                        <Link href={route('companies.show', company.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">View</Link>
                        <Link href={route('companies.edit', company.id)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">Edit</Link>
                        <form onSubmit={(e) => { e.preventDefault(); handleDelete(company.id); }}>
                          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > pagination.per_page && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex gap-2">
              {pagination.prev_page_url && (
                <Link href={pagination.prev_page_url} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Previous</Link>
              )}
              {pagination.next_page_url && (
                <Link href={pagination.next_page_url} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
