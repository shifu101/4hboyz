import React, { useState, useEffect } from 'react';
import { Link, usePage, Head, router } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import Swal from 'sweetalert2';

const Show = ({ loan, totalOutstanding }) => {
  const { auth } = usePage().props;
  const userPermission = auth.user?.permissions?.map(perm => perm.name) || [];

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // seconds

  const handleDelete = (loanId) => {
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
        router.delete(route('loans.destroy', loanId));
      }
    });
  };

  const sendOtp = () => {
    setLoading(true);
    router.post(route('loans.sendOtp', loan.id), {}, {
      onSuccess: () => {
        setOtpSent(true);
        setTimeLeft(300); // 5 minutes
        Swal.fire('OTP Sent!', 'Please check your phone/email.', 'success');
      },
      onError: () => {
        Swal.fire('Error', 'Failed to send OTP.', 'error');
      },
      onFinish: () => setLoading(false)
    });
  };

  const verifyOtp = () => {
    setLoading(true);
    router.post(route('loans.verifyOtp', loan.id), { otp: enteredOtp }, {
      onSuccess: () => {
        Swal.fire('Success', 'OTP Verified. Proceeding...', 'success');
        router.visit(route('loans.index'));
      },
      onError: () => {
        Swal.fire('Failed', 'Incorrect OTP. Please try again.', 'error');
      },
      onFinish: () => setLoading(false)
    });
  };

  useEffect(() => {
    if (!otpSent || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Layout>
      <Head title={`Loan #${loan.number}`} />
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-6 space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Salary Advance Details</h1>

        {/* Loan Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Loan Number:</strong> {loan.number}</div>
          <div><strong>Employee Name:</strong> {loan.employee?.user?.name}</div>
          <div><strong>Email:</strong> {loan.employee?.user?.email}</div>
          <div><strong>Phone:</strong> {loan.employee?.user?.phone}</div>
          <div><strong>Company:</strong> {loan.employee?.company?.name}</div>
          <div><strong>Principal (without charges):</strong> KES {(loan.amount - loan.charges).toLocaleString()}</div>
          <div><strong>Total Due:</strong> KES {loan.amount.toLocaleString()}</div>
          <div><strong>Current Balance:</strong> KES {loan.currentBalance.toLocaleString()}</div>
          <div><strong>Total Outstanding:</strong> KES {totalOutstanding.toLocaleString()}</div>
          <div><strong>Status:</strong> <span className="font-semibold">{loan.status}</span></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {userPermission.includes('Index loan') && (
            <Link href={route('loans.index')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Back
            </Link>
          )}
          {userPermission.includes('View employee') && (
            <Link href={route('employees.show', loan?.employee?.id)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              View Profile
            </Link>
          )}
          {userPermission.includes('Edit loan') && (
            <Link href={route('loans.edit', loan.id)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Edit
            </Link>
          )}
          {userPermission.includes('Delete loan') && (
            <form onSubmit={(e) => { e.preventDefault(); handleDelete(loan.id); }}>
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </form>
          )}
        </div>

        {/* OTP Section */}
        {(loan.status === 'Pending' || loan.status === 'Declined') && userPermission.includes('Edit loan') && (
          <div className="border-t border-gray-200 pt-6 mt-8">
            <h2 className="text-lg font-semibold mb-4">Process Advance</h2>
            {!otpSent ? (
              <button
                onClick={sendOtp}
                disabled={loading}
                className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                {loading ? 'Sending OTP...' : 'Send OTP to Proceed'}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-red-500 font-medium">
                  OTP expires in: {formatTime(timeLeft)}
                </p>
                {timeLeft <= 0 ? (
                  <button
                    onClick={sendOtp}
                    className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2 w-full"
                      placeholder="Enter OTP"
                    />
                    <button
                      onClick={verifyOtp}
                      disabled={loading}
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Show;
