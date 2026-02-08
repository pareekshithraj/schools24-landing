import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { uploadFile } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';

const Uploads: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !user) return;
    setIsUploading(true);
    const url = await uploadFile(user.uid, file);
    setUploadedUrl(url);
    setIsUploading(false);
  };

  return (
    <DashboardShell title="Document Vault" role="Admin" homePath="/dashboard/admin">
      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Upload Files</h2>
        <p className="text-sm text-[var(--dash-muted)] mt-2">Store student records, receipts, and documents securely.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
          />
          <button
            type="button"
            disabled={isUploading || !file}
            onClick={handleUpload}
            className="rounded-lg bg-[var(--dash-accent)] py-2.5 text-sm font-semibold text-black"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
        {uploadedUrl && (
          <div className="mt-6 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4 text-sm">
            Uploaded: <a href={uploadedUrl} className="text-[var(--dash-accent)]" target="_blank" rel="noreferrer">View file</a>
          </div>
        )}
      </section>
    </DashboardShell>
  );
};

export default Uploads;
