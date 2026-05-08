import axios from 'axios';
import type { OrganizationInput, Organization, SEOReport, ExecutionContent, APIResponse } from '../types/seo.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createOrganization = async (data: OrganizationInput): Promise<Organization> => {
  const response = await apiClient.post<APIResponse<Organization>>('/organizations', data);
  return response.data.data;
};

export const getOrganization = async (id: string): Promise<Organization> => {
  const response = await apiClient.get<APIResponse<Organization>>(`/organizations/${id}`);
  return response.data.data;
};

export const runSEOAnalysis = async (organizationId: string): Promise<SEOReport> => {
  const response = await apiClient.post<APIResponse<SEOReport>>(`/seo/analyze/${organizationId}`);
  return response.data.data;
};

export const getSEOReport = async (reportId: string): Promise<SEOReport> => {
  const response = await apiClient.get<APIResponse<SEOReport>>(`/seo/report/${reportId}`);
  return response.data.data;
};

export const generateExecutionContent = async (organizationId: string): Promise<ExecutionContent> => {
  const response = await apiClient.post<APIResponse<ExecutionContent>>('/execution/generate', { organizationId });
  return response.data.data;
};
