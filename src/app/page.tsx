// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SimpleLoginScreen from '@/components/mobile/SimpleLoginScreen';
import OnboardingScreen from '@/components/mobile/OnboardingScreen';
import PsychologyQuiz from '@/components/mobile/PsychologyQuiz';
import ResultsPage from '@/components/mobile/ResultsPage';
import RoleDeepDivePage from '@/components/mobile/RoleDeepDivePage';
import SuspenseWrapper from '@/components/SuspenseWrapper';

export default function Home() {
  return (
    <SuspenseWrapper>
      <HomePageContent />
    </SuspenseWrapper>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'login' | 'onboarding' | 'psychologyQuiz' | 'results' | 'roleDeepDive'>('login');
  const [onboardingData, setOnboardingData] = useState<{
    language: string;
    state: string;
    hasGoal: boolean;
    goal: string;
  } | null>(null);
  const [psychologyAnswers, setPsychologyAnswers] = useState<Record<number, string | string[]>>({});
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedRoleName, setSelectedRoleName] = useState<string>('');
  const [personaContext, setPersonaContext] = useState<string>('');
  const [selectedRoleRank, setSelectedRoleRank] = useState<number>(1);

  // Check if user is already logged in on mount
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (userEmail && userName) {
      setIsAuthenticated(true);

      // Check for deep-dive parameters
      const deepDive = searchParams?.get('deepDive');
      if (deepDive === 'true') {
        const roleId = searchParams?.get('roleId') || '';
        const roleName = searchParams?.get('roleName') || '';
        const personaContext = searchParams?.get('personaContext') || '';
        const roleRank = parseInt(searchParams?.get('roleRank') || '1', 10);

        if (roleId && roleName) {
          setSelectedRoleId(roleId);
          setSelectedRoleName(roleName);
          setPersonaContext(personaContext);
          setSelectedRoleRank(roleRank);
          setCurrentStep('roleDeepDive');
          return;
        }
      }

      // Check if we should skip onboarding
      const skipOnboarding = searchParams?.get('skipOnboarding') === 'true';
      if (skipOnboarding) {
        setCurrentStep('psychologyQuiz');
      } else {
        setCurrentStep('onboarding');
      }
    }
  }, [searchParams]);

  const handleLogin = (email: string, name: string) => {
    // Store user information
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    setIsAuthenticated(true);
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = (data: {
    language: string;
    state: string;
    hasGoal: boolean;
    goal: string;
  }) => {
    setOnboardingData(data);
    localStorage.setItem('userLanguage', data.language);
    localStorage.setItem('userState', data.state);

    if (data.hasGoal) {
      localStorage.setItem('userGoal', data.goal);
    }

    // Always show the psychology quiz
    setCurrentStep('psychologyQuiz');
  };

  const handlePsychologyQuizComplete = (answers: Record<number, string | string[]>) => {
    // Save the psychology answers and proceed to results page
    setPsychologyAnswers(answers);
    localStorage.setItem('psychologyAnswers', JSON.stringify(answers));
    setCurrentStep('results');
  };

  const handleRoleSelect = (roleId: string, roleName: string, personaSummary: string, roleRank: number = 1) => {
    // Set the selected role ID and navigate to the role deep dive page
    setSelectedRoleId(roleId);
    setSelectedRoleName(roleName);
    setPersonaContext(personaSummary);
    setSelectedRoleRank(roleRank);
    setCurrentStep('roleDeepDive');
  };

  const handleStartLearning = () => {
    // Navigate to the skill assessment page
    console.log('handleStartLearning called with:', { selectedRoleId, selectedRoleName });
    window.location.href = `/skill-assessment?roleId=${selectedRoleId}&roleName=${encodeURIComponent(selectedRoleName)}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userLanguage');
    localStorage.removeItem('userState');
    localStorage.removeItem('userGoal');
    localStorage.removeItem('psychologyAnswers');
    setIsAuthenticated(false);
    setOnboardingData(null);
    setCurrentStep('login');
  };

  // Show login screen if user is not authenticated
  if (!isAuthenticated || currentStep === 'login') {
    return <SimpleLoginScreen onLogin={handleLogin} />;
  }

  // Show onboarding screen
  if (currentStep === 'onboarding') {
    return (
      <OnboardingScreen
        onContinue={handleOnboardingComplete}
      />
    );
  }

  // Show psychology quiz
  if (currentStep === 'psychologyQuiz') {
    return (
      <PsychologyQuiz
        onComplete={handlePsychologyQuizComplete}
        onBack={() => setCurrentStep('onboarding')}
      />
    );
  }

  // Show results page with AI-generated recommendations
  if (currentStep === 'results') {
    return (
      <ResultsPage
        answers={psychologyAnswers}
        onBack={() => setCurrentStep('psychologyQuiz')}
        onSelectRole={handleRoleSelect}
      />
    );
  }

  // Show role deep dive page
  if (currentStep === 'roleDeepDive') {
    console.log('Rendering RoleDeepDivePage with props:', { selectedRoleId, selectedRoleName, personaContext, selectedRoleRank });
    return (
      <RoleDeepDivePage
        roleId={selectedRoleId}
        roleName={selectedRoleName}
        personaContext={personaContext}
        roleRank={selectedRoleRank}
        onBack={() => setCurrentStep('results')}
        onStartLearning={handleStartLearning}
      />
    );
  }

  return null;
}