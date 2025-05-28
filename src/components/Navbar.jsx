import React from 'react';

// Define styles as JavaScript objects
const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem', // Increased padding
        backgroundColor: 'var(--card-background)', // Use white for a clean look
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // Subtle shadow
        borderBottom: '1px solid var(--border-color)',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '600', // Bolder title
        color: 'var(--primary-color)', // Use primary color for title
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem', // Space between email and button
    },
    userEmail: {
        fontSize: '0.9rem',
        color: 'var(--text-color)', // Standard text color
    },
    // Logout button will use global button styles from index.css
    // Can add specific style if needed:
    logoutButton: {
        backgroundColor: 'var(--secondary-color)', // Example: different color for logout
        // padding: '0.5rem 1rem', // Smaller padding for navbar buttons
        // fontSize: '0.9rem',
    }
};

const Navbar = ({ handleLogout, userEmail }) => {
    return (
        <nav style={styles.nav}>
            <span style={styles.title}>My Personal Diary</span>
            {userEmail && (
                <div style={styles.userInfo}>
                    <span style={styles.userEmail}>{userEmail}</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
