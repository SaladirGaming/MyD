import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a new diary entry
export const createDiaryEntry = async (content) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('User not found. Please log in.');

        const { data, error } = await supabase
            .from('diary_entries')
            .insert([{ content, user_id: user.id }])
            .select() // Returns an array with the inserted row
            .single(); // Ensures we get a single object or null

        if (error) throw error;
        if (!data) throw new Error('Failed to create diary entry, no data returned.');
        
        return { data, error: null };
    } catch (error) {
        console.error('Error creating diary entry:', error.message);
        return { data: null, error };
    }
};

// Get all diary entries for the current user
export const getDiaryEntries = async () => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('User not found. Please log in.');

        const { data, error } = await supabase
            .from('diary_entries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching diary entries:', error.message);
        return { data: null, error };
    }
};

// Update an existing diary entry
export const updateDiaryEntry = async (id, content) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('User not found. Please log in.');

        const { data, error } = await supabase
            .from('diary_entries')
            .update({ content }) // Only update content initially
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new Error('Entry not found or user not authorized to update.');
        return { data, error: null };
    } catch (error) {
        console.error('Error updating diary entry:', error.message);
        return { data: null, error };
    }
};

// Delete a diary entry
export const deleteDiaryEntry = async (id) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('User not found. Please log in.');

        const { error } = await supabase
            .from('diary_entries')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { data: null, error: null };
    } catch (error) {
        console.error('Error deleting diary entry:', error.message);
        return { data: null, error };
    }
};

// Trigger sentiment analysis and update the entry
export const triggerAnalysisAndUpdateEntry = async (entryId, entryContent) => {
    if (!entryId || !entryContent) {
        console.error('Entry ID and content are required for analysis.');
        return;
    }

    console.log(`Invoking analysis for entryId: ${entryId}`);
    try {
        const { data: analysisData, error: functionError } = await supabase.functions.invoke(
            'analyze-entry',
            { body: { entryContent } }
        );

        if (functionError) {
            throw functionError;
        }

        if (analysisData && analysisData.sentiment) {
            console.log(`Analysis successful for entry ${entryId}. Sentiment:`, analysisData.sentiment);
            const { error: updateError } = await supabase
                .from('diary_entries')
                .update({ analysis_result: analysisData }) // analysisData should be { sentiment: "Positive" }
                .eq('id', entryId);

            if (updateError) {
                console.error(`Error updating entry ${entryId} with analysis:`, updateError.message);
            } else {
                console.log(`Entry ${entryId} successfully updated with analysis result.`);
            }
        } else {
            console.warn(`No sentiment data returned from function for entry ${entryId}. Response:`, analysisData);
        }
    } catch (error) {
        console.error(`Error triggering analysis or updating entry ${entryId}:`, error.message);
    }
};
