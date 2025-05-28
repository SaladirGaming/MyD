import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// Define styles as JavaScript objects
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh', // Make sure it takes good portion of viewport height
        padding: '2rem',
    },
    formContainer: {
        backgroundColor: 'var(--card-background)',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '420px',
    },
    title: {
        textAlign: 'center',
        color: 'var(--text-color)',
        marginBottom: '1.5rem',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        color: 'var(--text-color)',
        fontWeight: '500',
    },
    // Input styles are now handled by global styles in index.css
    // Button styles are now handled by global styles in index.css
    buttonContainer: {
        display: 'flex',
        gap: '1rem', // Adds space between buttons
        marginTop: '1.5rem',
    },
    // Specific button styles can still be added if needed to override global
    loginButton: {
      flex: 1, // Example if you want buttons to take equal width
    },
    signUpButton: {
      flex: 1,
      backgroundColor: 'var(--secondary-color)', // Example of a different color
    },
    errorMessage: { // Using the global .error-message class is preferred
        color: 'var(--error-color)',
        textAlign: 'center',
        marginBottom: '1rem',
    }
};

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            console.log('Login successful');
            // App.jsx handles navigation
        } catch (error) {
            console.error('Error logging in:', error.message);
            setError(error.message);
        }
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            console.log('Sign up successful, please check your email for confirmation.');
            alert('Sign up successful, please check your email for confirmation.');
        } catch (error) {
            console.error('Error signing up:', error.message);
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Diary Login</h2>
                {error && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}
                <form>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <div style={styles.buttonContainer}>
                        <button type="submit" onClick={handleLogin} disabled={loading} style={styles.loginButton}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <button type="submit" onClick={handleSignUp} disabled={loading} style={{...styles.signUpButton, backgroundColor: loading ? 'var(--secondary-color)' : 'var(--secondary-color)'}}>
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
