import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase, getDiaryEntries, createDiaryEntry } from './supabaseClient'; // Import the actual supabase and functions

// Mock the global supabase client that is imported and used by the functions
vi.mock('@supabase/supabase-js', async (importOriginal) => {
    const original = await importOriginal(); // Get the original module
    const mockSupabaseClient = {
        auth: {
            getUser: vi.fn(),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                order: vi.fn(),
                insert: vi.fn(() => ({ // For createDiaryEntry
                    select: vi.fn(() => ({
                        single: vi.fn()
                    }))
                })), 
                single: vi.fn(), // For createDiaryEntry if it uses .single()
            })),
        })),
        // Add other Supabase client methods if needed for more function tests
    };
    return {
        ...original, // Spread original exports
        createClient: vi.fn(() => mockSupabaseClient), // Mock createClient to return our mock client
    };
});


// Since supabaseClient.js initializes 'supabase' on import using createClient,
// we need to ensure that the mocked createClient is used.
// We also need a way to access the mocked 'from', 'select', 'order' etc.
// This can be tricky because the 'supabase' instance is created within supabaseClient.js.

// A common approach is to export the client and mock its methods,
// OR mock the underlying @supabase/supabase-js library as done above.

// Let's re-import the functions to ensure they use the mocked client
// This might not be strictly necessary with vi.mock hoisting, but can be safer.
// import { getDiaryEntries, createDiaryEntry } from './supabaseClient';


describe('Supabase Client Functions', () => {
    // Access the mocked supabase instance for setting up expectations
    // This is a bit indirect because we mocked createClient
    let mockSupabaseInstance;

    beforeEach(async () => {
        vi.clearAllMocks();

        // Dynamically import supabaseClient to get the instance that uses the mock
        // This is a workaround to get the supabase instance that was created with the mocked createClient
        const clientModule = await import('./supabaseClient');
        mockSupabaseInstance = clientModule.supabase; 
    });

    describe('getDiaryEntries', () => {
        it('should call supabase.from("diary_entries").select().order() and return data', async () => {
            const mockUser = { id: 'user-123' };
            const mockData = [{ id: 'entry-1', content: 'Test Entry' }];

            // Setup mocks for this specific test
            mockSupabaseInstance.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
            
            const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });
            const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
            mockSupabaseInstance.from.mockReturnValue({ select: mockSelect });


            const { data, error } = await getDiaryEntries();

            expect(mockSupabaseInstance.auth.getUser).toHaveBeenCalledTimes(1);
            expect(mockSupabaseInstance.from).toHaveBeenCalledWith('diary_entries');
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
            expect(data).toEqual(mockData);
            expect(error).toBeNull();
        });

        it('should return an error if user is not found', async () => {
            mockSupabaseInstance.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

            const { data, error } = await getDiaryEntries();

            expect(data).toBeNull();
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('User not found. Please log in.');
        });

        it('should return an error if supabase call fails', async () => {
            const mockUser = { id: 'user-123' };
            const mockError = new Error('Supabase fetch failed');
            mockSupabaseInstance.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

            const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });
            const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
            mockSupabaseInstance.from.mockReturnValue({ select: mockSelect });
            
            const { data, error } = await getDiaryEntries();

            expect(data).toBeNull();
            expect(error).toEqual(mockError);
        });
    });

    describe('createDiaryEntry', () => {
        it('should call insert with content and user_id and return the new entry', async () => {
            const mockUser = { id: 'user-123' };
            const newEntryContent = 'This is a new entry.';
            const mockNewEntry = { id: 'entry-new', content: newEntryContent, user_id: mockUser.id };

            mockSupabaseInstance.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
            
            const mockSingle = vi.fn().mockResolvedValue({ data: mockNewEntry, error: null });
            const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
            const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });
            mockSupabaseInstance.from.mockReturnValue({ insert: mockInsert });


            const { data, error } = await createDiaryEntry(newEntryContent);

            expect(mockSupabaseInstance.auth.getUser).toHaveBeenCalledTimes(1);
            expect(mockSupabaseInstance.from).toHaveBeenCalledWith('diary_entries');
            expect(mockInsert).toHaveBeenCalledWith([{ content: newEntryContent, user_id: mockUser.id }]);
            expect(mockSelectInsert).toHaveBeenCalledTimes(1); // .select() after insert
            expect(mockSingle).toHaveBeenCalledTimes(1); // .single() after select()
            expect(data).toEqual(mockNewEntry);
            expect(error).toBeNull();
        });
    });
});
