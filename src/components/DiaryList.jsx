import React, { useState, useEffect } from 'react';
import { 
    getDiaryEntries, 
    createDiaryEntry, 
    updateDiaryEntry, 
    deleteDiaryEntry,
    triggerAnalysisAndUpdateEntry
} from '../supabaseClient';
import DiaryEntry from './DiaryEntry';
import EntryEditor from './EntryEditor';

// Define styles as JavaScript objects
const styles = {
    container: {
        padding: '1.5rem', // Using var(--container-padding) or similar from index.css would be ideal if not inline
        maxWidth: '900px', // Limit width for better readability on large screens
        margin: '0 auto', // Center the list container
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    title: {
        // Uses h2 global styles from index.css
    },
    // Create New Entry button uses global button styles from index.css
    loadingMessage: { // Using global .loading-message class is preferred
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--secondary-color)',
        fontStyle: 'italic',
    },
    errorMessage: { // Using global .error-message class is preferred
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--error-color)',
        border: '1px solid var(--error-color)',
        borderRadius: '4px',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
    },
    noEntriesMessage: {
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--secondary-color)',
        border: '1px dashed var(--border-color)',
        borderRadius: '4px',
        backgroundColor: 'var(--card-background)',
    },
    entriesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Responsive grid
        gap: '1.5rem',
    }
};

const DiaryList = () => {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [currentEntryForEditor, setCurrentEntryForEditor] = useState(null);

    const fetchEntries = async () => {
        setIsLoading(true);
        setError(null);
        const { data, error: fetchError } = await getDiaryEntries();
        if (fetchError) {
            console.error('Error fetching entries:', fetchError);
            setError(fetchError.message || 'Failed to fetch entries.');
        } else {
            setEntries(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleOpenEditor = (entry = null) => {
        setCurrentEntryForEditor(entry);
        setShowEditor(true);
    };

    const handleCloseEditor = () => {
        setShowEditor(false);
        setCurrentEntryForEditor(null);
    };

    const handleSaveEntry = async (id, content) => {
        setIsLoading(true);
        let savedEntryData;
        let operationError;

        if (id) {
            const { data, error: updateError } = await updateDiaryEntry(id, content);
            savedEntryData = data;
            operationError = updateError;
        } else {
            const { data, error: createError } = await createDiaryEntry(content);
            savedEntryData = data;
            operationError = createError;
        }
        
        // No longer setting loading to false here, will be handled by fetchEntries

        if (operationError) {
            console.error('Error saving entry:', operationError);
            setError(operationError.message || 'Failed to save entry.');
            setIsLoading(false); // Set loading false only on error
        } else {
            await fetchEntries(); // Refresh list, this will set isLoading to false eventually
            handleCloseEditor();

            if (savedEntryData && savedEntryData.id && content) {
                triggerAnalysisAndUpdateEntry(savedEntryData.id, content)
                    .then(() => {
                        console.log(`Analysis triggered for entry ${savedEntryData.id}.`);
                        // Consider a small delay or a more robust solution for refreshing after analysis
                        setTimeout(fetchEntries, 3000); // Refresh again after 3s
                    })
                    .catch(err => {
                        console.error(`Client-side error triggering analysis for ${savedEntryData.id}:`, err);
                    });
            } else {
                console.warn('Could not trigger analysis: Missing entry ID or content after save.', savedEntryData);
            }
        }
    };

    const handleDeleteEntry = async (id) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }
        setIsLoading(true);
        const { error: deleteError } = await deleteDiaryEntry(id);
        if (deleteError) {
            console.error('Error deleting entry:', deleteError);
            setError(deleteError.message || 'Failed to delete entry.');
            setIsLoading(false);
        } else {
            await fetchEntries(); // Refresh list, this will set isLoading to false
        }
    };

    return (
        <div style={styles.container} className="container"> {/* Added global container class */}
            <div style={styles.header}>
                <h2 style={styles.title}>My Diary Entries</h2>
                <button onClick={() => handleOpenEditor()}>
                    Create New Entry
                </button>
            </div>

            {isLoading && entries.length === 0 && <p style={styles.loadingMessage} className="loading-message">Loading entries...</p>}
            {error && <p style={styles.errorMessage} className="error-message">Error: {error}</p>}

            {!isLoading && !error && entries.length === 0 && (
                <p style={styles.noEntriesMessage}>No entries yet. Click "Create New Entry" to add one!</p>
            )}

            <div style={styles.entriesGrid}>
                {entries.map((entry) => (
                    <DiaryEntry
                        key={entry.id}
                        entry={entry}
                        onEdit={handleOpenEditor}
                        onDelete={handleDeleteEntry}
                    />
                ))}
            </div>

            {showEditor && (
                <EntryEditor
                    currentEntry={currentEntryForEditor}
                    onSave={handleSaveEntry}
                    onCancel={handleCloseEditor}
                />
            )}
        </div>
    );
};

export default DiaryList;
