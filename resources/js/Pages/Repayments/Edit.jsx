import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";

const EditRepayment = ({ repayment, errors }) => {
  const { data, setData, put, processing } = useForm({
    name: repayment.name,
    industry: repayment.industry,
    address: repayment.address,
    email: repayment.email,
    phone: repayment.phone,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('repayments.update', { repayment: repayment.id }));
  };

  return (
    <Layout>
      <div>
        <h1>Edit Repayment</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <div className="text-sm text-red-500 mt-1">{errors.name}</div>}
          </div>

          {/* Industry Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Industry</label>
            <input
              type="text"
              value={data.industry}
              onChange={(e) => setData('industry', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.industry && <div className="text-sm text-red-500 mt-1">{errors.industry}</div>}
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.address && <div className="text-sm text-red-500 mt-1">{errors.address}</div>}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <div className="text-sm text-red-500 mt-1">{errors.email}</div>}
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.phone && <div className="text-sm text-red-500 mt-1">{errors.phone}</div>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={processing}
          >
            {processing ? 'Saving...' : 'Save'}
          </button>
        </form>
        <Link href={route('repayments.index')} className="mt-4 inline-block text-sm text-blue-600">Back to Repayments</Link>
      </div>
    </Layout>
  );
};

export default EditRepayment;
