import React, { useState, useEffect } from 'react';
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
  const [isInterpreting, setIsInterpreting] = useState<boolean>(false);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);
  const [isSendingUserEmail, setIsSendingUserEmail] = useState<boolean>(false);
  const [userEmailSentMessage, setUserEmailSentMessage] = useState<string | null>(null);
  const [userEmailError, setUserEmailError] = useState<string | null>(null);
  
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

      fetch('/api/save-assessment', { // Relative path
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
        // Now get AI interpretation
        if (data.totalScore !== undefined && data.maxScore !== undefined && data.severityLevel) {
          setIsInterpreting(true);
          setAiInterpretation(null);
          setInterpretationError(null);
          fetch('/api/interpret-assessment', { // Relative path
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // Send full userDetails and assessmentData
              userDetails: userDetails, // userDetails from App's state
              assessmentData: data,    // full 'data' object received by handleAssessmentComplete
            }),
          })
          .then(interpretResponse => {
            if (!interpretResponse.ok) {
              return interpretResponse.json().then(errData => {
                throw new Error(errData.message || `HTTP error! status: ${interpretResponse.status}`);
              }).catch(() => {
                throw new Error(`HTTP error! status: ${interpretResponse.status}`);
              });
            }
            return interpretResponse.json();
          })
          .then(interpretData => {
            console.log('AI Interpretation received:', interpretData);
            setAiInterpretation(interpretData.interpretation);
          })
          .catch(interpretError => {
            console.error('Error getting AI interpretation:', interpretError);
            setInterpretationError(interpretError.message || 'Failed to load AI interpretation.');
          })
          .finally(() => {
            setIsInterpreting(false);
          });
        }
      })
      .catch(error => {
        console.error('Error saving data to backend:', error);
        // Optionally, inform the user that saving failed
        alert(`Failed to save assessment data to server: ${error.message}`);
      });
    } else {
      console.log('handleAssessmentComplete: userDetails are null, cannot save.');
    }
  };

  // const handleRestart = () => {
  //   setAssessmentData(null); // Reset assessment data
  //   setAiInterpretation(null);
  //   setInterpretationError(null);
  //   setIsInterpreting(false);
  //   setUserEmailSentMessage(null);
  //   setUserEmailError(null);
  //   setIsSendingUserEmail(false);
  //   if (userDetails) {
  //     setCurrentStep('assessment'); // If user details exist, go directly to assessment
  //   } else {
  //     setCurrentStep('userInfo'); // Otherwise, go to user info form
  //   }
  // };
  
  // This function is called when 'Back' is clicked during the assessment
  const handleBackFromAssessment = () => {
    setCurrentStep('userInfo'); // Go back to the info form, data is not saved yet
    // Keep userDetails so they don't have to re-enter, but clear assessment progress
    setAssessmentData(null); 
  };

  const handleEmailResultsToUser = async () => {
    if (!userDetails || !assessmentData || !aiInterpretation) {
      setUserEmailError("Cannot send email: missing user data, assessment data, or AI interpretation.");
      return;
    }

    setIsSendingUserEmail(true);
    setUserEmailSentMessage(null);
    setUserEmailError(null);

    try {
      const response = await fetch('/api/email-results-to-user', { // Relative path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userDetails,
          assessmentData: { // Send summary for user email, backend expects this structure
            totalScore: assessmentData.totalScore,
            maxScore: assessmentData.maxScore,
            severityLevel: assessmentData.severityLevel,
          },
          aiInterpretation,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }
      setUserEmailSentMessage(responseData.message || "Email sent successfully!");
    } catch (error) {
      console.error('Error sending email to user:', error);
      if (error instanceof Error) {
        setUserEmailError(error.message || "Failed to send email.");
      } else {
        setUserEmailError("An unknown error occurred.");
      }
    } finally {
      setIsSendingUserEmail(false);
    }
  };


  if (currentStep === 'userInfo') {
    return (
      <div className="min-h-screen bg-brand-bg-light flex flex-col items-center justify-center p-6 sm:p-8">
        {/* Optional: Placeholder for a logo or clinic name */}
        {/* <div className="mb-8 text-center">
          <img src="/path-to-your-logo.svg" alt="Clinic Logo" className="h-12 mx-auto" />
          <h2 className="mt-2 text-2xl font-semibold text-slate-700">Spine Health Clinic</h2>
        </div> */}
        <UserInfoForm onSubmit={handleUserInfoSubmit} />
      </div>
    );
  }

  if (currentStep === 'assessment') {
    return (
      <div className="min-h-screen bg-brand-bg-light py-6 sm:py-12"> {/* Consistent background */}
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
      <div className="min-h-screen bg-brand-bg-light flex flex-col items-center justify-center p-6 sm:p-8 text-center"> {/* Consistent background */}
        <div className="mx-auto w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mb-6"> {/* Main accent for icon bg */}
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-brand-text-heading mb-2"> {/* Title color */}
          Assessment Complete!
        </h1>
        {userDetails && <p className="text-brand-text-body mb-1">Thank you, {userDetails.name}.</p>} {/* Text color */}
        <p className="text-gray-700 mb-6 text-lg"> {/* Text color and size */}
          Your Modified Oswestry Disability Index results are ready.
        </p>
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 mb-6 text-left w-full max-w-md"> {/* Card style */}
          <h3 className="text-xl font-semibold text-brand-text-heading mb-4">Summary:</h3> {/* Card title color */}
          <p className="text-brand-text-body mb-1.5"><strong>Name:</strong> {userDetails?.name}</p> {/* Text color */}
          <p className="text-brand-text-body mb-1.5"><strong>Email:</strong> {userDetails?.email}</p> {/* Text color */}
          <p className="text-brand-text-body mb-1.5"><strong>Total Score:</strong> {assessmentData.totalScore} / {assessmentData.maxScore} ({Math.round((assessmentData.totalScore / assessmentData.maxScore) * 100)}%)</p> {/* Text color */}
          <p className="text-brand-text-body"><strong>Severity:</strong> {assessmentData.severityLevel}</p> {/* Text color */}
        </div>

        {/* AI Interpretation Section */}
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 mb-6 text-left w-full max-w-md"> {/* Card style */}
          <h3 className="text-xl font-semibold text-brand-text-heading mb-4">AI Observations:</h3> {/* Card title color */}
          {isInterpreting && (
            <div className="flex items-center text-gray-700"> {/* Text color */}
              <Spinner />
              <span className="ml-2">Generating observations...</span>
            </div>
          )}
          {interpretationError && <p className="text-red-600">Error: {interpretationError}</p>}
          {aiInterpretation && !isInterpreting && <p className="text-brand-text-body whitespace-pre-wrap">{aiInterpretation}</p>} {/* Consistent text color */}
        </div>
        
        {userDetails && assessmentData && aiInterpretation && (
          <button
            onClick={handleEmailResultsToUser}
            disabled={isSendingUserEmail || !!userEmailSentMessage} 
            className="w-full max-w-md px-6 py-3 bg-brand-success text-white rounded-md shadow-sm hover:bg-brand-success-dark transition-colors disabled:opacity-60 disabled:bg-green-300 mb-4" // Consistent button, adjusted disabled state
          >
            {isSendingUserEmail ? 'Sending Email...' : (userEmailSentMessage ? 'Email Sent!' : `Email Results to ${userDetails.email}`)}
          </button>
        )}
        {userEmailSentMessage && !isSendingUserEmail && <p className="text-brand-success mb-4 text-sm">{userEmailSentMessage}</p>} {/* Consistent success message */}
        {userEmailError && <p className="text-red-600 mb-4 text-sm">Error: {userEmailError}</p>}

        {/* "Start New Assessment" button is removed from here. 
           If restart functionality is still needed, it could be a smaller link elsewhere or handled differently.
           For now, per request, it's removed from below the email button. 
           The handleRestart function is still available if needed for other UI elements.
        */}

        {/* Spine IQ Evaluation Section */}
        <div className="mt-8 pt-6 border-t border-gray-300 w-full max-w-md text-center">
          <p className="text-gray-700 mb-4 text-sm leading-relaxed"> {/* Text color */}
            Now that you’ve completed the Oswestry Disability Index quiz, consider taking the next step with Prof. Aaron Buckland’s personalised evaluation—it’s designed to explore potential pathways for your spine health and help you understand the options available to you.
          </p>
          <button
            onClick={() => { window.open('https://app.aaronbuckland.com/', '_blank', 'noopener,noreferrer'); }}
            className="w-full max-w-md px-8 py-3 bg-brand-primary text-white rounded-md shadow-sm font-semibold hover:bg-brand-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-dark" // Button style
          >
            Spine IQ Evaluation
          </button>
        </div>
      </div>
    );
  }

  // Fallback / Default view (should ideally not be reached with the new step logic)
  return (
    <div className="min-h-screen bg-brand-bg-light flex items-center justify-center p-6 sm:p-8"> {/* Consistent background */}
      <p className="text-brand-text-body">Loading...</p> {/* Consistent text color */}
    </div>
  );
} // This closes the App function component

// Simple Spinner component
const Spinner: React.FC = () => {
  const [frame, setFrame] = useState(0);
  const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']; // Braille spinner

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % spinnerFrames.length);
    }, 80);
    return () => clearInterval(interval);
  }, [spinnerFrames.length]);

  return <span className="inline-block">{spinnerFrames[frame]}</span>;
};

export default App;
