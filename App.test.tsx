import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Declare Jest globals to resolve TypeScript errors when @types/jest is missing
declare const jest: any;
declare const describe: any;
declare const test: any;
declare const expect: any;

// Mock window.aistudio
Object.defineProperty(window, 'aistudio', {
  value: {
    hasSelectedApiKey: jest.fn().mockResolvedValue(true),
    openSelectKey: jest.fn(),
  },
  writable: true,
});

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

// Mock JSZip
jest.mock('jszip', () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn(),
    folder: jest.fn().mockReturnThis(),
    generateAsync: jest.fn().mockResolvedValue(new Blob()),
  }));
});

describe('PWA Architect Pro Tests', () => {
  test('renders main application after API key check', async () => {
    render(<App />);
    
    // Since we mocked hasSelectedApiKey to true, we expect the main header
    const headerElement = await screen.findByText(/PWA Architect Pro/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('updates manifest name field correctly', async () => {
    render(<App />);
    
    // Find the App Name input
    const nameInput = await screen.findByPlaceholderText('My Awesome PWA');
    
    fireEvent.change(nameInput, { target: { value: 'Tested App Name' } });
    
    expect(nameInput).toHaveValue('Tested App Name');
  });

  test('download button requires validation', async () => {
    render(<App />);
    
    // Mock alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Click download without filling details
    const downloadBtn = await screen.findByText('Download ZIP');
    fireEvent.click(downloadBtn);
    
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Please fill in the essential app details'));
    
    alertMock.mockRestore();
  });
});