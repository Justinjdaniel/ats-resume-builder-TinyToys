import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Integration', () => {
  it('renders application header and title', () => {
    render(<App />);
    expect(screen.getByText('ATS Resumaster')).toBeInTheDocument();
  });

  it('opens BYOK modal when clicking Add API Key button', () => {
    render(<App />);
    const keyBtn = screen.getByText(/Add API Key/i);
    fireEvent.click(keyBtn);
    expect(screen.getByText('Bring Your Own Key (BYOK)')).toBeInTheDocument();
  });

  it('renders layout selector and allows switching templates', () => {
    render(<App />);
    expect(screen.getByText('Design & Layout Gallery')).toBeInTheDocument();
    const executiveBtn = screen.getByText('Executive Classic');
    fireEvent.click(executiveBtn);
    expect(executiveBtn).toBeInTheDocument();
  });

  it('renders ATS compatibility score card', () => {
    render(<App />);
    expect(screen.getByText('ATS Compatibility Score')).toBeInTheDocument();
    expect(screen.getByText('MATCHED KEYWORDS', { exact: false })).toBeInTheDocument();
  });
});
