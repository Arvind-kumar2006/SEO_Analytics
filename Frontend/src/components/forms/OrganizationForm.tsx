import React, { useState } from 'react';
import type { OrganizationInput } from '../../types/seo.types';

interface OrganizationFormProps {
  onSubmit: (data: OrganizationInput) => void;
  isLoading: boolean;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<OrganizationInput>({
    name: '',
    website: '',
    industry: '',
    targetAudience: '',
    targetGeography: '',
    services: [],
    competitors: [],
    currentKeywords: []
  });

  const [tempListItems, setTempListItems] = useState({
    services: '',
    competitors: '',
    currentKeywords: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempListItems(prev => ({ ...prev, [name]: value }));
  };

  const processListItems = (key: keyof typeof tempListItems) => {
    if (!tempListItems[key].trim()) return [];
    return tempListItems[key].split(',').map(item => item.trim()).filter(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData: OrganizationInput = {
      ...formData,
      services: processListItems('services'),
      competitors: processListItems('competitors'),
      currentKeywords: processListItems('currentKeywords')
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            placeholder="e.g. Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL *</label>
          <input
            type="url"
            name="website"
            required
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
          <input
            type="text"
            name="industry"
            required
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            placeholder="e.g. B2B SaaS"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience *</label>
          <input
            type="text"
            name="targetAudience"
            required
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            placeholder="e.g. Marketing Managers"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Geography *</label>
        <input
          type="text"
          name="targetGeography"
          required
          value={formData.targetGeography}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
          placeholder="e.g. Global, North America, UK"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Services (Comma separated) *</label>
        <input
          type="text"
          name="services"
          required
          value={tempListItems.services}
          onChange={handleListChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
          placeholder="e.g. Web Design, SEO, Content Marketing"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Competitor URLs (Comma separated)</label>
          <input
            type="text"
            name="competitors"
            value={tempListItems.competitors}
            onChange={handleListChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            placeholder="e.g. https://comp1.com, https://comp2.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Keywords (Comma separated)</label>
          <input
            type="text"
            name="currentKeywords"
            value={tempListItems.currentKeywords}
            onChange={handleListChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            placeholder="e.g. digital agency, seo services"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Run SEO Analysis'}
        </button>
      </div>
    </form>
  );
};

export default OrganizationForm;
