import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import AuthPage from './components/AuthPage';
import DiaryList from './components/DiaryList';
import Navbar from './components/Navbar';

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const isAuthenticated = !!session; // Derive from session

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session ? session.user : null);
        console.log("Auth state changed. Current session:", session);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session ? session.user : null);
      console.log("Initial session:", session);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      console.log('Logged out successfully');
      // Session will be set to null by onAuthStateChange
    }
  };

  return (
    <div className="App">
      {isAuthenticated && user ? (
        <>
          <Navbar handleLogout={handleLogout} userEmail={user.email} />
          <main>
            <DiaryList />
            {/* DiaryEntry and EntryEditor will be integrated later */}
          </main>
        </>
      ) : (
        <AuthPage />
      )}
    </div>
  );
}

export default App;
