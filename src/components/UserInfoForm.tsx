import React, { useState } from 'react';

interface UserInfoFormProps {
  onSubmit: (name: string, email: string) => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!name.trim()) {
      setNameError('Name is required.');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (valid) {
      onSubmit(name, email);
    }
  };

  return (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome
        </h1>
        <p className="text-gray-600">
          Please enter your details to start the Modified Oswestry Disability Index.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${nameError ? 'border-red-500' : 'border-gray-300'}`}
            aria-describedby="name-error"
          />
          {nameError && <p className="mt-1 text-sm text-red-600" id="name-error">{nameError}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
            aria-describedby="email-error"
          />
          {emailError && <p className="mt-1 text-sm text-red-600" id="email-error">{emailError}</p>}
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </form>
       <div className="mt-12 text-center text-sm text-gray-500">
          Comprehensive functional assessment for clinical evaluation
        </div>
    </div>
  );
};
