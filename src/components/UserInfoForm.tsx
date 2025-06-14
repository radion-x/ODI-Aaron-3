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
    <div className="max-w-lg w-full bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-200"> {/* Subtle border */}
      <div className="text-center mb-8">
        {/* Optional: Placeholder for a logo icon if you have one from lucide-react or an SVG */}
        {/* <div className="inline-block p-3 bg-brand-primary/10 rounded-full mb-4">
          <YourLogoIcon className="w-8 h-8 text-brand-primary" />
        </div> */}
        <h1 className="text-3xl font-bold text-brand-text-heading mb-2">
          Patient Information
        </h1>
        <p className="text-brand-text-body text-base">
          Please provide your details to begin the Modified Oswestry Disability Index.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-text-body mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${nameError ? 'border-red-500' : 'border-gray-300'}`}
            aria-describedby="name-error"
            placeholder="e.g., Jane Doe"
          />
          {nameError && <p className="mt-1.5 text-xs text-red-600" id="name-error">{nameError}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-text-body mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${emailError ? 'border-red-500' : 'border-gray-300'}`}
            aria-describedby="email-error"
            placeholder="e.g., you@example.com"
          />
          {emailError && <p className="mt-1.5 text-xs text-red-600" id="email-error">{emailError}</p>}
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-dark transition-colors duration-150"
          >
            Start Assessment
          </button>
        </div>
      </form>
       <div className="mt-10 text-center text-xs text-gray-600"> {/* Consistent muted text */}
          This information is used solely for the purpose of this assessment and will be handled with confidentiality.
        </div>
    </div>
  );
};
