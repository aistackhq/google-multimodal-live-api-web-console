import React, { useState } from 'react';
import './settings.scss';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

export function SettingsModal({ isOpen, onClose, onSubmit }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-description">API Key is stored within your browser's local storage.</p>
        <form onSubmit={handleSubmit}>
          <div className="settings-form-group">
            <label htmlFor="apiKey" className="settings-label">
              API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="settings-input"
              placeholder="Enter your API key"
              required
            />
          </div>
          <div className="settings-actions">
            <button
              type="button"
              onClick={onClose}
              className="settings-button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="settings-button-save"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}