import React, {useState} from 'react';
import { useForm, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";

const Create = () => {
  const { data, setData, post, errors, processing } = useForm({
    company: {
      name: '',
      industry: '',
      address: '',
      email: '',
      phone: '',
      percentage: '',
      registration_number: '',
      sectors: '',
      county: '',
      sub_county: '',
      location: '',
      unique_number: '',
      certificate_of_incorporation: null,
      kra_pin: null,
      cr12_cr13: null,
      signed_agreement: null,
      additional_documents: []
    },
    user: {
      name: '',
      phone: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  });

  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('register.company.with.user'));
  };

  const handleCompanyChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (name === 'additional_documents') {
        setData('company', {
          ...data.company,
          [name]: files
        });
      } else {
        setData('company', {
          ...data.company,
          [name]: files[0]
        });
      }
    } else {
      setData('company', {
        ...data.company,
        [name]: value
      });
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setData('user', {
      ...data.user,
      [name]: value
    });
  };

  return (
    <Layout>
      <Head title="Register Company with Admin" />
      
      <div className="max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6">Register Company & Admin</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Company Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Company Fields */}

              {step === 1 && 
              <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name*</label>
                <input
                  type="text"
                  name="name"
                  value={data.company.name}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['company.name'] && <div className="text-sm text-red-500 mt-1">{errors['company.name']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry*</label>
                <input
                  type="text"
                  name="industry"
                  value={data.company.industry}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['company.industry'] && <div className="text-sm text-red-500 mt-1">{errors['company.industry']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={data.company.email}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['company.email'] && <div className="text-sm text-red-500 mt-1">{errors['company.email']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone*</label>
                <input
                  type="text"
                  name="phone"
                  value={data.company.phone}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['company.phone'] && <div className="text-sm text-red-500 mt-1">{errors['company.phone']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address*</label>
                <input
                  type="text"
                  name="address"
                  value={data.company.address}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['company.address'] && <div className="text-sm text-red-500 mt-1">{errors['company.address']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Percentage*</label>
                <input
                  type="number"
                  name="percentage"
                  value={data.company.percentage}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['company.percentage'] && <div className="text-sm text-red-500 mt-1">{errors['company.percentage']}</div>}
              </div>
              </>}

              {/* Additional Company Fields */}


              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <input
                  type="text"
                  name="registration_number"
                  value={data.company.registration_number}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.registration_number'] && <div className="text-sm text-red-500 mt-1">{errors['company.registration_number']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Sectors</label>
                <input
                  type="text"
                  name="sectors"
                  value={data.company.sectors}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.sectors'] && <div className="text-sm text-red-500 mt-1">{errors['company.sectors']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">County</label>
                <input
                  type="text"
                  name="county"
                  value={data.company.county}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.county'] && <div className="text-sm text-red-500 mt-1">{errors['company.county']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Sub-County</label>
                <input
                  type="text"
                  name="sub_county"
                  value={data.company.sub_county}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.sub_county'] && <div className="text-sm text-red-500 mt-1">{errors['company.sub_county']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={data.company.location}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.location'] && <div className="text-sm text-red-500 mt-1">{errors['company.location']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Unique Number</label>
                <input
                  type="text"
                  name="unique_number"
                  value={data.company.unique_number}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.unique_number'] && <div className="text-sm text-red-500 mt-1">{errors['company.unique_number']}</div>}
              </div>

            </div>
            
            {/* Document Uploads */}
            {step === 2  && 
              <>
            <h3 className="text-lg font-medium mt-6 mb-3">Company Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Certificate of Incorporation</label>
                <input
                  type="file"
                  name="certificate_of_incorporation"
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.certificate_of_incorporation'] && <div className="text-sm text-red-500 mt-1">{errors['company.certificate_of_incorporation']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">KRA PIN</label>
                <input
                  type="file"
                  name="kra_pin"
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.kra_pin'] && <div className="text-sm text-red-500 mt-1">{errors['company.kra_pin']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">CR12/CR13</label>
                <input
                  type="file"
                  name="cr12_cr13"
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.cr12_cr13'] && <div className="text-sm text-red-500 mt-1">{errors['company.cr12_cr13']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Signed Agreement</label>
                <input
                  type="file"
                  name="signed_agreement"
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors['company.signed_agreement'] && <div className="text-sm text-red-500 mt-1">{errors['company.signed_agreement']}</div>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Additional Documents</label>
                <input
                  type="file"
                  name="additional_documents"
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  multiple
                />
                {errors['company.additional_documents'] && <div className="text-sm text-red-500 mt-1">{errors['company.additional_documents']}</div>}
              </div>
            </div>

            </>}
          </div>
          
          
          {/* Admin User Information Section */}
          {step === 3  && 
          <>
          <div>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Admin User Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={data.user.name}
                  onChange={handleUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['user.name'] && <div className="text-sm text-red-500 mt-1">{errors['user.name']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone*</label>
                <input
                  type="text"
                  name="phone"
                  value={data.user.phone}
                  onChange={handleUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['user.phone'] && <div className="text-sm text-red-500 mt-1">{errors['user.phone']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={data.user.email}
                  onChange={handleUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['user.email'] && <div className="text-sm text-red-500 mt-1">{errors['user.email']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password*</label>
                <input
                  type="password"
                  name="password"
                  value={data.user.password}
                  onChange={handleUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['user.password'] && <div className="text-sm text-red-500 mt-1">{errors['user.password']}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password*</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={data.user.password_confirmation}
                  onChange={handleUserChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {processing ? 'Processing...' : 'Register Company & Admin'}
          </button>

          </>}
        </form>

        <div className="flex justify-between mt-4">
            {step > 1 && <button type="button" onClick={prevStep} className="bg-gray-500 text-white py-2 px-4 rounded">Back</button>}
            {step < 3 && <button type="button" onClick={nextStep} className="bg-blue-500 text-white py-2 px-4 rounded">Next</button>}
        </div>
     
      </div>
    </Layout>
  );
};

export default Create;