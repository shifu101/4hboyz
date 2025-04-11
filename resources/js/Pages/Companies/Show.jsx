import React, { useState } from "react";
import { Link, router, Head, useForm, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/layout/layout.jsx";
import Employees from "./components/Employees";
import Loans from "./components/Loans";
import Users from "./components/Users";
import Remittances from "./components/Remittances";
import Repayments from "./components/Repayments";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import Details from "./components/Details";
import { Check } from 'lucide-react';

const Show = ({ company, employees, loans, remittances, repayments, users }) => {
  const [activeTab, setActiveTab] = useState("Details");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { delete: destroy } = useForm();

  const { auth } = usePage().props; 

  const roleId = auth.user?.role_id;

  const { processing } = useForm({
    status: ''
  });

  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];

  const handleFilter = () => {
    router.get(route("companies.show", company.id), {
      start_date: startDate ? startDate.toISOString().split("T")[0] : "",
      end_date: endDate ? endDate.toISOString().split("T")[0] : "",
    });
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

  const handleActivatedUpdate = (e, id, activated) => {
    e.preventDefault();
    
    // If declining, show the modal with text input for reason
    if (activated === 'Declined') {
      Swal.fire({
        title: 'Enter reason for declining',
        input: 'textarea',
        inputPlaceholder: 'Enter your reason here...',
        inputAttributes: {
          'aria-label': 'Reason for declining',
          'required': 'required'
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Decline',
        preConfirm: (reason) => {
          if (!reason.trim()) {
            Swal.showValidationMessage('Reason is required');
            return false;
          }
          return reason;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = {
            _method: 'PUT',
            status: activated,
            id: id,
            reason: result.value
          };
          
          submitStatusUpdate(id, formData);
        }
      });
    } else {
      // For other status updates, proceed without asking for a reason
      const formData = {
        _method: 'PUT', 
        status: activated,
        id: id
      };
      
      // Create action verbs and proper confirmation messages
      let actionVerb = '';
      let actionPastTense = '';
      
      if (activated === 'Activated') {
        actionVerb = 'activate';
        actionPastTense = 'activated';
      } else if (activated === 'Deactivated') {
        actionVerb = 'suspend';
        actionPastTense = 'suspended';
      }
      
      Swal.fire({
        title: `Are you sure you want to ${actionVerb} this company?`,
        text: 'This action will update the company status.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: activated === 'Activated' ? '#3085d6' : '#d33',
        cancelButtonColor: '#gray',
        confirmButtonText: `Yes, ${actionVerb} it!`,
      }).then((result) => {
        if (result.isConfirmed) {
          submitStatusUpdate(id, formData, actionPastTense);
        }
      });
    }
  };
  
  const submitStatusUpdate = (id, formData, customStatusText = null) => {
    router.post(route('companies.update', id), formData, {
      onSuccess: () => {
        const status = formData.status;
        const statusText = customStatusText || status.toLowerCase();
        
        Swal.fire(
          `${status}!`, 
          `The company has been ${statusText}.`, 
          'success'
        );
      },
      onError: (err) => {
        console.error(`Status update error:`, err);
        Swal.fire('Error', 'There was a problem updating the company status.', 'error');
      }
    });
  };

  return (
    <Layout>
      <Head title={company.name} />
      <div className="max-w-full bg-white shadow-md rounded-lg p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-left mb-6">{company.name} - {company.unique_number}</h1>

        <div className="grid grid-cols-2 gap-4">
          {/* Date Range Filter */}
          <div className="space-y-4 card">
            <h2 className="text-lg font-semibold text-gray-700">Filter by Date Range</h2>
            <div className="flex flex-col items-start justify-start lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="border rounded lg:px-3 lg:py-2"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="End Date"
                className="border rounded lg:px-3 lg:py-2"
              />
              <button
                onClick={handleFilter}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 w-full overflow-x-auto">
          {/* Tabs Navigation */}
          <div className="card flex-1 justify-start items-start">
            <div className="flex justify-start">
              <nav className="flex p-1 overflow-x-auto items-start space-x-1 text-sm text-gray-600 bg-gray-500/5 rounded-xl">
              {["Details", "Employees", "Advances", "Approved Advances", "Pending Advances", "Declined Advances", "Paid Advances","Repayments", "Remittances", "Users"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`h-8 px-5 font-medium rounded-lg outline-none ${
                      activeTab === tab ? "text-yellow-600 shadow bg-black" : "hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tabs Content */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              {activeTab === "Details" && <Details company={company} />}
              {activeTab === "Employees" && <Employees companyId={company.id} employees={employees} />}
              {activeTab === "Advances" && <Loans companyId={company.id} loans={loans} status='All' />}
              {activeTab === "Approved Advances" && <Loans companyId={company.id} loans={loans} status='Approved' />}
              {activeTab === "Pending Advances" && <Loans companyId={company.id} loans={loans} status='Pending' />}
              {activeTab === "Declined Advances" && <Loans companyId={company.id} loans={loans} status='Declined' />}
              {activeTab === "Paid Advances" && <Loans companyId={company.id} loans={loans} status='Paid' />}
              {activeTab === "Repayments" && <Repayments companyId={company.id} repayments={repayments} />}
              {activeTab === "Remittances" && <Remittances companyId={company.id} remittances={remittances} />}
              {activeTab === "Users" && <Users companyId={company.id} users={users} />}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-left flex flex-col lg:flex-row gap-4">
          {userPermission.includes('Index company') &&
          <Link 
            href={route("companies.index")} 
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            <span className="my-auto px-4 py-2 mx-auto">Back to Companies</span>
          </Link>}

          {((roleId === 1 && userPermission.includes('Delete company')) && (company.status === 'Pending Approval' || company.status === 'Deactivated' || company.status === 'Declined')) &&
              <button
                onClick={(e) => handleActivatedUpdate(e, company.id, 'Activated')}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-2" /> Activate
              </button>}
            {((roleId === 1 && company?.status !== 'Deactivated') && userPermission.includes('Delete company') && (company.status !== 'Pending Approval') && company.status !== 'Declined') &&
              <button
                onClick={(e) => handleActivatedUpdate(e, company.id, 'Deactivated')}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-2" /> Suspend
              </button>}

            {((roleId === 1 && userPermission.includes('Delete company')) && company.status === 'Pending Approval') &&
            <button
              onClick={(e) => handleActivatedUpdate(e, company.id, 'Declined')}
              disabled={processing}
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" /> Decline
            </button>}

            {userPermission.includes('Edit company') &&
            <Link 
              href={route('companies.edit', company.id)} 
              className="flex items-center bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600"
            >
              <span className="my-auto px-4 py-2 mx-auto">Edit</span>
            </Link>}

            {userPermission.includes('Delete company') &&
            <button
              onClick={() => handleDelete(company.id)}
              className="flex items-center cursor-pointer bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
            >
              <span className="my-auto px-4 py-2 mx-auto">Delete</span> 
            </button>}
        </div>
      </div>
    </Layout>
  );
};

export default Show;