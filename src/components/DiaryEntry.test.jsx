import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DiaryEntry from './DiaryEntry';

describe('DiaryEntry Component', () => {
    const mockEntry = {
        id: '1',
        content: 'Test content for diary entry.',
        created_at: new Date().toISOString(),
        analysis_result: { sentiment: 'Positive' },
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it('renders entry content, formatted date, and sentiment', () => {
        render(<DiaryEntry entry={mockEntry} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        // Check for content
        expect(screen.getByText(mockEntry.content)).toBeInTheDocument();

        // Check for formatted date (simplified check: just that "Created:" is there)
        // A more robust check might involve date-fns or similar to format and compare
        expect(screen.getByText(/Created:/i)).toBeInTheDocument();
        expect(screen.getByText(new Date(mockEntry.created_at).toLocaleString())).toBeInTheDocument();


        // Check for sentiment
        expect(screen.getByText(/Sentiment: Positive/i)).toBeInTheDocument();
    });

    it('renders "Edit" and "Delete" buttons', () => {
        render(<DiaryEntry entry={mockEntry} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    });

    it('calls onEdit when Edit button is clicked', () => {
        render(<DiaryEntry entry={mockEntry} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        
        const editButton = screen.getByRole('button', { name: /Edit/i });
        fireEvent.click(editButton);
        
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnEdit).toHaveBeenCalledWith(mockEntry);
    });

    it('calls onDelete when Delete button is clicked', () => {
        render(<DiaryEntry entry={mockEntry} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        
        const deleteButton = screen.getByRole('button', { name: /Delete/i });
        fireEvent.click(deleteButton);
        
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(mockEntry.id);
    });

    it('renders correctly when entry is null or undefined', () => {
        const { rerender } = render(<DiaryEntry entry={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        expect(screen.getByText(/No entry data/i)).toBeInTheDocument();

        rerender(<DiaryEntry entry={undefined} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        expect(screen.getByText(/No entry data/i)).toBeInTheDocument();
    });
    
    it('displays "Analysis pending..." if analysis_result is missing or sentiment is missing', () => {
        const entryWithoutAnalysis = { ...mockEntry, analysis_result: null };
        render(<DiaryEntry entry={entryWithoutAnalysis} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        expect(screen.getByText(/Sentiment: Analysis pending.../i)).toBeInTheDocument();

        const entryWithEmptyAnalysis = { ...mockEntry, analysis_result: {} };
        render(<DiaryEntry entry={entryWithEmptyAnalysis} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
        expect(screen.getByText(/Sentiment: Analysis pending.../i)).toBeInTheDocument();
    });
});
