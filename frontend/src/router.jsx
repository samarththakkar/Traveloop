import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center"></div>;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
    <h1 className="text-2xl font-bold">{title}</h1>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><Placeholder title="Trip Details" /></ProtectedRoute>} />
        <Route path="/trips/:id/build" element={<ProtectedRoute><Placeholder title="Trip Build" /></ProtectedRoute>} />
        <Route path="/trips/:id/view" element={<ProtectedRoute><Placeholder title="Trip View" /></ProtectedRoute>} />
        <Route path="/trips/:id/budget" element={<ProtectedRoute><Placeholder title="Trip Budget" /></ProtectedRoute>} />
        <Route path="/trips/:id/checklist" element={<ProtectedRoute><Placeholder title="Trip Checklist" /></ProtectedRoute>} />
        <Route path="/trips/:id/notes" element={<ProtectedRoute><Placeholder title="Trip Notes" /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Placeholder title="Explore" /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Placeholder title="Budget" /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Placeholder title="Profile" /></ProtectedRoute>} />
        <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Placeholder title="Admin" /></ProtectedRoute>} />
        
        {/* Public Route */}
        <Route path="/share/:id" element={<Placeholder title="Shared Trip" />} />
      </Routes>
    </BrowserRouter>
  );
}
