import React, { useState, useEffect } from 'react';

// Define styles as JavaScript objects
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, // Ensure it's above other content
    },
    modal: {
        backgroundColor: 'var(--card-background)',
        padding: '2rem', // Generous padding
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)', // More pronounced shadow for modal
        width: '90%',
        maxWidth: '600px', // Max width for the editor
        zIndex: 1001, // Above overlay
    },
    title: {
        // Uses h3 global styles from index.css
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    // Textarea uses global styles from index.css
    textarea: {
        minHeight: '200px', // Taller textarea for better editing
        fontSize: '1rem', // Ensure readable font size
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end', // Align buttons to the right
        gap: '1rem', // Space between buttons
        marginTop: '1.5rem',
    },
    // Save and Cancel buttons use global styles from index.css
    // Specific styles can be added if needed:
    saveButton: {
        // Default primary button style
    },
    cancelButton: {
        backgroundColor: 'var(--secondary-color)', // Secondary color for cancel
    }
};

const EntryEditor = ({ currentEntry, onSave, onCancel }) => {
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        setEditedContent(currentEntry?.content || '');
    }, [currentEntry]);

    const handleSave = () => {
        if (!editedContent.trim()) {
            alert('Entry content cannot be empty.');
            return;
        }
        onSave(currentEntry?.id, editedContent);
    };

    // Prevent clicks on the modal content from closing it (if overlay click closes)
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div style={styles.overlay} onClick={onCancel}> {/* onClick on overlay can close modal */}
            <div style={styles.modal} onClick={handleModalClick}>
                <h3 style={styles.title}>
                    {currentEntry ? 'Edit Diary Entry' : 'Create New Diary Entry'}
                </h3>
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Write your diary entry here..."
                    style={styles.textarea} // Apply specific textarea styles
                />
                <div style={styles.actions}>
                    <button onClick={onCancel} style={styles.cancelButton}>
                        Cancel
                    </button>
                    <button onClick={handleSave} style={styles.saveButton}>
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EntryEditor;
