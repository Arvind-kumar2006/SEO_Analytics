import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  website: string;
  industry: string;
  targetAudience: string;
  targetGeography: string;
  services: string[];
  competitors: string[];
  currentKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
    industry: { type: String, required: true },
    targetAudience: { type: String, required: true },
    targetGeography: { type: String, required: true },
    services: [{ type: String, required: true }],
    competitors: [{ type: String }],
    currentKeywords: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
