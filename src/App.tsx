import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { FunctionalIndexStep } from './components/FunctionalIndexStep';
import { UserInfoForm } from './components/UserInfoForm'; // Import the new form
import { PrimaryCondition, FunctionalIndexData } from './types/assessment';

type AppStep = 'userInfo' | 'assessment' | 'completed';

interface UserDetails {
  name: string;
  email: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('userInfo');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [assessmentData, setAssessmentData] = useState<FunctionalIndexData | null>(null);
  
  // selectedCondition is always 'Back'
  const selectedCondition: PrimaryCondition = 'Back';

  const handleUserInfoSubmit = (name: string, email: string) => {
    const collectedInfo = { name, email };
    setUserDetails(collectedInfo);
    setCurrentStep('assessment');
    // Placeholder for saving to a file. In a real app, this would be an API call.
    console.log('User Info Collected:', collectedInfo); 
    // We will discuss how to "save to a file" next.
  };

  const handleAssessmentComplete = (data: FunctionalIndexData) => {
    setAssessmentData(data);
    setCurrentStep('completed');
    console.log('Assessment completed:', data);

    if (userDetails) {
      const fullRecord = { userDetails, assessmentData: data };
      console.log('Attempting to save full record:', fullRecord);

      fetch('http://localhost:3001/api/save-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullRecord),
      })
      .then(response => {
        if (!response.ok) {
          // Try to get error message from backend if available
          return response.json().then(errData => {
            throw new Error(errData.message || `HTTP error! status: ${response.status}`);
          }).catch(() => {
            // Fallback if response is not JSON or no message
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(responseData => {
        console.log('Data saved successfully to backend:', responseData);
      })
      .catch(error => {
        console.error('Error saving data to backend:', error);
        // Optionally, inform the user that saving failed
        alert(`Failed to save assessment data to server: ${error.message}`);
      });
    }
  };

  const handleRestart = () => {
    setAssessmentData(null); // Reset assessment data
    if (userDetails) {
      setCurrentStep('assessment'); // If user details exist, go directly to assessment
    } else {
      setCurrentStep('userInfo'); // Otherwise, go to user info form
    }
  };
  
  // This function is called when 'Back' is clicked during the assessment
  const handleBackFromAssessment = () => {
    setCurrentStep('userInfo'); // Go back to the info form, data is not saved yet
    // Keep userDetails so they don't have to re-enter, but clear assessment progress
    setAssessmentData(null); 
  };


  if (currentStep === 'userInfo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <UserInfoForm onSubmit={handleUserInfoSubmit} />
      </div>
    );
  }

  if (currentStep === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <FunctionalIndexStep
          primaryCondition={selectedCondition} // Always 'Back'
          onComplete={handleAssessmentComplete}
          onBack={handleBackFromAssessment} // Go back to user info form
        />
      </div>
    );
  }

  if (currentStep === 'completed' && assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-white" /> {/* Placeholder icon */}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Assessment Complete!
        </h1>
        {userDetails && <p className="text-gray-700 mb-1">Thank you, {userDetails.name}.</p>}
        <p className="text-gray-600 mb-4">
          Your Modified Oswestry Disability Index results are ready.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-left w-full max-w-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Summary:</h3>
          <p className="text-gray-700 mb-1"><strong>Name:</strong> {userDetails?.name}</p>
          <p className="text-gray-700 mb-1"><strong>Email:</strong> {userDetails?.email}</p>
          <p className="text-gray-700 mb-1"><strong>Total Score:</strong> {assessmentData.totalScore} / {assessmentData.maxScore}</p>
          <p className="text-gray-700"><strong>Severity:</strong> {assessmentData.severityLevel.charAt(0).toUpperCase() + assessmentData.severityLevel.slice(1)}</p>
        </div>
        <button
          onClick={handleRestart}
          className="w-full max-w-md px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start New Assessment
        </button>

        {/* Spine IQ Evaluation Section */}
        <div className="mt-8 pt-6 border-t border-gray-300 w-full max-w-md text-center">
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            Now that you’ve completed the Oswestry Disability Index quiz, consider taking the next step with Prof. Aaron Buckland’s personalised evaluation—it’s designed to explore potential pathways for your spine health and help you understand the options available to you.
          </p>
          <button
            onClick={() => { window.open('https://app.aaronbuckland.com/', '_blank', 'noopener,noreferrer'); }}
            className="px-8 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
          >
            Spine IQ Evaluation
          </button>
        </div>
      </div>
    );
  }

  // Fallback / Default view (should ideally not be reached with the new step logic)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <p>Loading...</p>
    </div>
  );
}

export default App;
