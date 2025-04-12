import React, { useEffect, useState, useRef } from 'react';
import { useForm, usePage, router, Link } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

const UpdateKYC = () => {
  const { user, er } = usePage().props;
  const employee = user.employee || {};

  const { data, setData, errors } = useForm({
    passport_number: employee.passport_number || '',
    id_number: employee.id_number || '',
    id_front: null,
    id_back: null,
    passport_front: null,
    passport_back: null,
    user_id: user.id,
    company_id: user.company_id,
    unique_number: '',
  });

  const [previews, setPreviews] = useState({
    id_front: employee.id_front ? `/storage/${employee.id_front}` : null,
    id_back: employee.id_back ? `/storage/${employee.id_back}` : null,
    passport_front: employee.passport_front ? `/storage/${employee.passport_front}` : null,
    passport_back: employee.passport_back ? `/storage/${employee.passport_back}` : null,
  });

  const [cameraActive, setCameraActive] = useState(false);
  const [captureTarget, setCaptureTarget] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error('Camera access denied:', err);
          toast.error('Could not access camera');
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setData(field, file);
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      setData(captureTarget, blob);
      setPreviews(prev => ({ ...prev, [captureTarget]: URL.createObjectURL(blob) }));
      setCameraActive(false);
    }, 'image/jpeg');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    Object.keys(data).forEach((key) => {
      if (key !== 'id_front' && key !== 'id_back' && key !== 'passport_front' && key !== 'passport_back') {
        formData.append(key, data[key]);
      }
    });

    ['id_front', 'id_back', 'passport_front', 'passport_back'].forEach((field) => {
      if (data[field]) {
        formData.append(field, data[field]);
      }
    });
  
    formData.append('_method', 'PUT');
  
    router.post(route('complete-kyc', { id: employee.id }), formData, {
      forceFormData: true,
      preserveScroll: true,
    });
  };
  

  return (
    <div className="max-w-4xl my-4 mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl z-[-1]"></div>

      <div className="flex justify-end mb-4">
        <Link 
            href={route('logout')} 
            method="post" 
            as="button" 
            className="text-sm px-4 py-2 bg-black text-white rounded-md hover:text-red-500 transition-colors"
        >
            Logout
        </Link>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update KYC</h2>

        <ol className="flex flex-col sm:flex-row justify-between text-sm font-medium text-gray-500 mb-6">
            {[
                { step: 1, label: 'Account setup', active: true },
                { step: 2, label: 'KYC submission', active: false },
                { step: 3, label: 'Verification & Approval', active: false }
            ].map(({ step, label, active }) => (
                <li 
                    key={step} 
                    className={`flex items-center space-x-2 ${active ? 'text-blue-600' : ''}`}
                >
                    {active && <CheckCircle className="w-6 h-6" />}
                    <span>{step}. {label}</span>
                </li>
            ))}
        </ol>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ID Number</label>
          <input
            type="text"
            value={data.id_number}
            onChange={e => setData('id_number', e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded border-gray-300"
          />
          {errors.id_number && <p className="text-red-600 text-sm mt-1">{errors.id_number}</p>}
        </div>

        {/* Image Uploads */}
        {['id_front', 'id_back', 'passport_front'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace('_', ' ')}
            </label>
            <div className="mt-1 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, field)}
                className="text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setCaptureTarget(field);
                  setCameraActive(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Use Camera
              </button>
            </div>
            {previews[field] && (
              <img
                src={previews[field]}
                alt={`${field} preview`}
                className="mt-2 w-28 h-28 object-cover border rounded"
              />
            )}
            {errors[field] && (
              <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        {/* Camera Capture UI */}
        {cameraActive && (
          <div className="mt-4">
            <video ref={videoRef} autoPlay className="w-full max-w-sm rounded border" />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={capturePhoto}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={() => setCameraActive(false)}
                className="bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Update KYC
        </button>
      </form>
    </div>
  );
};

export default UpdateKYC;
