import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle, Upload, X, Camera, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../Components/ui/dialog';

const FileUploadPreview = ({
  field,
  label,
  allowSelfie = false,
  allowBackCamera = false,
  previews,
  errors,
  handleFileChange,
  removePreview,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraFacing, setCameraFacing] = useState('user');
  const videoRef = useRef(null);

  const startCamera = async (facing = 'user') => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
      });
      setStream(mediaStream);
      setCameraFacing(facing);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsOpen(true);
    } catch (err) {
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], `${field}-capture.jpg`, { type: 'image/jpeg' });
      handleFileChange({ target: { files: [file] } }, field);
    }, 'image/jpeg');
    stopCamera();
  };

  const switchCamera = () => {
    stopCamera();
    startCamera(cameraFacing === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="mb-6 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {!previews[field] ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, field)}
                className="hidden"
                id={`${field}-upload`}
              />
              <label
                htmlFor={`${field}-upload`}
                className="cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Upload className="mr-2 h-5 w-5" />
                Choose File
              </label>

              {(allowSelfie || allowBackCamera) && (
                <button
                  type="button"
                  onClick={() => startCamera(allowBackCamera ? 'environment' : 'user')}
                  className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  {allowSelfie ? 'Take Selfie' : 'Take Photo'}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center">
              {allowSelfie ? 'Upload a file or take a selfie' : 'Upload a file or take a photo'}
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              src={previews[field]}
              alt="Preview"
              className="w-full h-48 object-contain rounded-md"
            />
            <button
              onClick={() => removePreview(field)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="h-6 w-6 m-auto" />
            </button>
          </div>
        )}
      </div>

      {errors[field] && <div className="text-sm text-red-500 mt-1">{errors[field]}</div>}

      <Dialog open={isOpen} onOpenChange={() => stopCamera()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{allowSelfie ? 'Take a Selfie' : 'Take a Photo'}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-96 object-cover rounded-lg" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={capturePhoto}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                <Camera className="h-6 w-6" />
              </button>
              {allowBackCamera && (
                <button
                  onClick={switchCamera}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <RefreshCw className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SelectCompany = () => {
  const { user, er } = usePage().props;

  const { data, setData, post, errors } = useForm({
    passport_number: '',
    id_number: '',
    id_front: null,
    id_back: null,
    passport_front: null,
    passport_back: null,
    user_id: user.id,
    company_id: user.company_id,
    unique_number: '',
  });

  const [previews, setPreviews] = useState({
    id_front: null,
    id_back: null,
    passport_front: null,
    passport_back: null,
  });

  useEffect(() => {
    if (er) toast.error(er, { position: 'top-center', duration: 4000 });
  }, [er]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setData(field, file);
      setPreviews((prev) => ({ ...prev, [field]: previewUrl }));
    }
  };

  const removePreview = (field) => {
    if (previews[field]) URL.revokeObjectURL(previews[field]);
    setData(field, null);
    setPreviews((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File || value) {
        formData.append(key, value);
      }
    });

    post(route('employees.store'), {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Head title="KYC Submission" />
      <ToastContainer />

      <div className="max-w-3xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>

        <div className="relative bg-white shadow-lg rounded-2xl p-6 sm:p-8 z-10">
          <div className="flex justify-end mb-4">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="text-sm bg-black text-white px-4 py-2 rounded hover:text-red-500"
            >
              Logout
            </Link>
          </div>

          <ol className="flex flex-col sm:flex-row justify-between text-sm font-medium text-gray-500 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
            {[
              { step: 1, label: 'Account setup', active: true },
              { step: 2, label: 'KYC submission', active: true },
              { step: 3, label: 'Verification & Approval', active: false },
            ].map(({ step, label, active }) => (
              <li
                key={step}
                className={`flex items-center space-x-2 ${active ? 'text-blue-600' : ''}`}
              >
                {active && <CheckCircle className="w-5 h-5" />}
                <span>{step}. {label}</span>
              </li>
            ))}
          </ol>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID number</label>
              <input
                type="number"
                value={data.id_number}
                onChange={(e) => setData('id_number', e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.id_number && (
                <div className="text-sm text-red-500 mt-1">{errors.id_number}</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadPreview
                field="id_front"
                label="ID Front Side"
                allowBackCamera
                previews={previews}
                errors={errors}
                handleFileChange={handleFileChange}
                removePreview={removePreview}
              />
              <FileUploadPreview
                field="id_back"
                label="ID Back Side"
                allowBackCamera
                previews={previews}
                errors={errors}
                handleFileChange={handleFileChange}
                removePreview={removePreview}
              />
              <FileUploadPreview
                field="passport_front"
                label="Passport Photo"
                allowSelfie
                previews={previews}
                errors={errors}
                handleFileChange={handleFileChange}
                removePreview={removePreview}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Submit KYC
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelectCompany;
