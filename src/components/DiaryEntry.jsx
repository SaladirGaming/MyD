import React from 'react';

// Define styles as JavaScript objects
const styles = {
    card: {
        backgroundColor: 'var(--card-background)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px', // More pronounced rounding
        padding: '1.5rem', // Increased padding
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', // Subtle shadow for depth
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // Ensure cards in a grid take equal height if possible
    },
    content: {
        flexGrow: 1, // Allows content to expand and push actions to bottom
        marginBottom: '1rem',
        fontSize: '1rem',
        lineHeight: '1.7', // Improved readability for entry content
        color: 'var(--text-color)',
    },
    meta: {
        fontSize: '0.8rem', // Smaller text for date
        color: 'var(--secondary-color)', // Use secondary color for less emphasis
        marginBottom: '0.5rem',
    },
    sentiment: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        marginBottom: '1rem', // Space before action buttons
    },
    actions: {
        display: 'flex',
        gap: '0.75rem', // Space between buttons
        marginTop: 'auto', // Pushes actions to the bottom of the card
    },
    // Edit and Delete buttons will use global styles from index.css
    // Specific styles can be added if needed:
    editButton: {
        backgroundColor: 'var(--secondary-color)', // Example: secondary color for edit
        // To make buttons smaller:
        // padding: '0.4rem 0.8rem',
        // fontSize: '0.8rem',
    },
    deleteButton: {
        backgroundColor: 'var(--error-color)', // Error color for delete
        // padding: '0.4rem 0.8rem',
        // fontSize: '0.8rem',
    }
};

const DiaryEntry = ({ entry, onEdit, onDelete }) => {
    if (!entry) {
        return <div style={styles.card}>No entry data.</div>;
    }

    const sentimentText = entry.analysis_result?.sentiment || 'Analysis pending...';
    let sentimentColor = 'var(--secondary-color)'; // Default color for pending or undetermined

    if (entry.analysis_result?.sentiment) {
        switch (entry.analysis_result.sentiment.toLowerCase()) {
            case 'positive':
                sentimentColor = 'var(--success-color)'; // Use success color from palette
                break;
            case 'negative':
                sentimentColor = 'var(--error-color)'; // Use error color from palette
                break;
            case 'neutral':
                sentimentColor = '#ffc107'; // Example: A distinct yellow/orange for neutral
                break;
        }
    }

    return (
        <div style={styles.card}>
            <p style={styles.content}>{entry.content}</p>
            <small style={styles.meta}>
                Created: {new Date(entry.created_at).toLocaleString()}
            </small>
            <p style={{ ...styles.sentiment, color: sentimentColor }}>
                Sentiment: {sentimentText}
            </p>
            <div style={styles.actions}>
                <button onClick={() => onEdit(entry)} style={styles.editButton}>
                    Edit
                </button>
                <button onClick={() => onDelete(entry.id)} style={styles.deleteButton}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DiaryEntry;
