import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Counties from '@/Components/Counties';
import Select from 'react-select';  

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
  const totalSteps = 3;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('register.company?.with.user'));
  };

  const handleCompanyChange = (e) => {
    const { name, value, type, files } = e.target;
  
    setData(prevData => {
      let updatedCompany = { ...prevData.company };
    
      if (type === 'file') {
        if (name === 'additional_documents') {
          updatedCompany[name] = files;
        } else {
          updatedCompany[name] = files[0];
        }
      } else {
        updatedCompany[name] = value;
      }
    
      return {
        ...prevData,
        company: updatedCompany
      };
    });
  };
  

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      user: {
        ...prevData.user,
        [name]: value
      }
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setData(prevData => ({
      ...prevData,
      company: {
        ...prevData.company,
        [name]: selectedOption ? selectedOption.value : ""
      }
    }));
  };

  const countyOptions = Object.keys(Counties)?.map((county) => ({
    value: county,
    label: county,
  }));  

  const subCountyOptions = data?.company?.county
    ? Counties[data?.company?.county]?.map((sub) => ({ value: sub, label: sub }))
    : [];

  // Progress indicator
  const ProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${step >= stepNumber ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}
              >
                {stepNumber}
              </div>
              <span className={`text-xs mt-2 ${step >= stepNumber ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {stepNumber === 1 ? "Company Info" : stepNumber === 2 ? "Documents" : "Admin User"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
          <div 
            className="absolute top-0 h-1 bg-blue-600 rounded transition-all duration-300" 
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };


  const InputField = ({ 
    label, 
    name, 
    type = "text", 
    value, 
    onChange, 
    required = false, 
    error, 
    parentObject = "company", 
    multiple = false,
    options = [] 
  }) => {
    const fieldName = `${parentObject}.${name}`;
    
    return (
      <div className="mb-4 flex-1 flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {type === "select" && 
          <Select
            name={name}
            value={options.find(option => option.value === value) || null}
            onChange={(selectedOption) => {
              if (parentObject === "company") {
                handleSelectChange(name, selectedOption);
              }
            }}
            options={options}
            className={`w-full min-w-[250px] lg:min-w-[300px] ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            placeholder={`Select ${label}`}
            isClearable
          />
        }

        {(type !== "select" && type !== "textarea") && 
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`min-w-full px-4 py-2 rounded-md border ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'} 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            required={required}
            multiple={multiple}
          />
        }

        {type === "textarea" && 
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 rounded-md border ${errors[fieldName] ? 'border-red-500' : 'border-gray-300'} 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            required={required}
          ></textarea>
        }
        
        {errors[fieldName] && <div className="text-sm text-red-500 mt-1">{errors[fieldName]}</div>}
      </div>
    );
  };

  return (
    <Layout>
      <Head title="Register Company with Admin" />
      
      <div className="max-w-4xl mb-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Register Company & Admin</h1>
            <p className="text-blue-100 mt-1">Please fill out the form to create a new company account</p>
          </div>
          
          <div className="p-8">
            <ProgressBar />
            
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              {/* Step 1: Company Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-3xl font-medium text-gray-800 pb-2 border-b border-gray-200">
                    <span>Company Information</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6">
                    <InputField 
                      label="Company Name" 
                      name="name" 
                      type="text" 
                      value={data.company?.name} 
                      onChange={handleCompanyChange} 
                      required={true} 
                      error={errors['company?.name']} 
                    />
                    
                    <InputField 
                      label="Industry" 
                      name="industry" 
                      value={data.company?.industry} 
                      onChange={handleCompanyChange} 
                      required={true} 
                      error={errors['company?.industry']} 
                    />
                    
                    <InputField 
                      label="Email" 
                      name="email" 
                      type="email" 
                      value={data.company?.email} 
                      onChange={handleCompanyChange} 
                      required={true} 
                      error={errors['company?.email']} 
                    />
                    
                    <InputField 
                      label="Phone" 
                      name="phone" 
                      type="tel" 
                      value={data.company?.phone} 
                      onChange={handleCompanyChange} 
                      required={true} 
                      error={errors['company?.phone']} 
                    />
                    
                    <InputField 
                      label="Address" 
                      name="address" 
                      type="text" 
                      value={data.company?.address} 
                      onChange={handleCompanyChange} 
                      required={true} 
                      error={errors['company?.address']} 
                    />
                    
                    <InputField 
                      label="Loan Percentage" 
                      name="percentage" 
                      type="number" 
                      value={data.company?.percentage} 
                      onChange={handleCompanyChange} 
                      required={true} 
                      error={errors['company?.percentage']} 
                    />
                    
                    <InputField 
                      label="Registration Number" 
                      name="registration_number" 
                      type="text" 
                      value={data.company?.registration_number} 
                      onChange={handleCompanyChange} 
                      error={errors['company?.registration_number']} 
                    />
                    
                    <InputField 
                      label="Sectors" 
                      name="sectors" 
                      type="text" 
                      value={data.company?.sectors} 
                      onChange={handleCompanyChange} 
                      error={errors['company?.sectors']} 
                    />
                    
                    <InputField 
                      label="County" 
                      name="county" 
                      type="select"
                      value={data.company?.county} 
                      onChange={handleCompanyChange} 
                      error={errors['company?.county']}
                      options={countyOptions}
                    />

                    <InputField 
                      label="SubCounty" 
                      name="sub_county" 
                      type="select"
                      value={data.company?.sub_county} 
                      onChange={handleCompanyChange} 
                      error={errors['company?.sub_county']}
                      options={subCountyOptions}
                    />

                    <InputField 
                      label="Location address" 
                      name="location" 
                      type="textarea"
                      value={data.company?.location} 
                      onChange={handleCompanyChange} 
                      error={errors['company?.location']} 
                    />
                    
                  </div>
                </div>
              )}
              
              {/* Step 2: Documents */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-3xl font-medium text-gray-800 pb-2 border-b border-gray-200">
                    <span>Company Documents</span>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="bg-blue-50 rounded-lg p-4 text-blue-800 text-sm">
                      <div className="flex">
                        <div>
                          <p className="font-medium">Document Guidelines</p>
                          <ul className="list-disc list-inside mt-1 text-blue-700 text-xs">
                            <li>All documents should be in PDF format</li>
                            <li>Maximum file size: 5MB per document</li>
                            <li>Ensure all documents are clear and legible</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Certificate of Incorporation</label>
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                            <input
                              type="file"
                              name="certificate_of_incorporation"
                              onChange={handleCompanyChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                        {errors['company?.certificate_of_incorporation'] && 
                          <div className="text-sm text-red-500 mt-1">{errors['company?.certificate_of_incorporation']}</div>
                        }
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">KRA PIN</label>
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                            <input
                              type="file"
                              name="kra_pin"
                              onChange={handleCompanyChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                        {errors['company?.kra_pin'] && 
                          <div className="text-sm text-red-500 mt-1">{errors['company?.kra_pin']}</div>
                        }
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">CR12/CR13</label>
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                            <input
                              type="file"
                              name="cr12_cr13"
                              onChange={handleCompanyChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                        {errors['company?.cr12_cr13'] && 
                          <div className="text-sm text-red-500 mt-1">{errors['company?.cr12_cr13']}</div>
                        }
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Signed Agreement</label>
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                            <input
                              type="file"
                              name="signed_agreement"
                              onChange={handleCompanyChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                        {errors['company?.signed_agreement'] && 
                          <div className="text-sm text-red-500 mt-1">{errors['company?.signed_agreement']}</div>
                        }
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Documents</label>
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">You can select multiple files</p>
                            <input
                              type="file"
                              name="additional_documents"
                              onChange={handleCompanyChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              multiple
                            />
                          </div>
                        </div>
                        {errors['company?.additional_documents'] && 
                          <div className="text-sm text-red-500 mt-1">{errors['company?.additional_documents']}</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Admin User */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-3xl font-medium text-gray-800 pb-2 border-b border-gray-200">
                    <span>Admin User Information</span>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 text-yellow-800 text-sm mb-6">
                    <div className="flex">
                      <div>
                        <p className="font-medium">Important Note</p>
                        <p className="mt-1">This user will have administrator access to manage your company account.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InputField 
                      label="Full Name" 
                      name="name" 
                      type="text" 
                      value={data.user.name} 
                      onChange={handleUserChange} 
                      required={true} 
                      error={errors['user.name']} 
                      parentObject="user"
                    />
                    
                    <InputField 
                      label="Phone" 
                      name="phone" 
                      type="tel" 
                      value={data.user.phone} 
                      onChange={handleUserChange} 
                      required={true} 
                      error={errors['user.phone']} 
                      parentObject="user"
                    />
                    
                    <InputField 
                      label="Email" 
                      name="email" 
                      type="email" 
                      value={data.user.email} 
                      onChange={handleUserChange} 
                      required={true} 
                      error={errors['user.email']} 
                      parentObject="user"
                    />
                    
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      <InputField 
                        label="Password" 
                        name="password" 
                        type="password" 
                        value={data.user.password} 
                        onChange={handleUserChange} 
                        required={true} 
                        error={errors['user.password']} 
                        parentObject="user"
                      />
                      
                      <InputField 
                        label="Confirm Password" 
                        name="password_confirmation" 
                        type="password" 
                        value={data.user.password_confirmation} 
                        onChange={handleUserChange} 
                        required={true} 
                        parentObject="user"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-lg font-medium 
                      hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : "Register Company & Admin"}
                  </button>
                </div>
              )}
            </form>
            
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className='flex min-w-[90px]'>Previous Step</span>
                </button>
              )}
              
              {step < 3 && (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="ml-auto w-fit flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors"
                >
                  <span className='flex min-w-[70px]'>Next Step</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;