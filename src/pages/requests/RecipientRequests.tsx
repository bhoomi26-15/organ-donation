import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { uploadFile } from '../../services/storageService';
import { UploadCloud, File, Eye } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export function RecipientRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipientId, setRecipientId] = useState('');
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      
      const { data: rec } = await supabase.from('recipients').select('id').eq('user_id', user.id).single();
      if (rec) {
        setRecipientId(rec.id);
        
        // Fetch requests
        const { data: reqData } = await supabase
          .from('requests')
          .select('*')
          .eq('recipient_id', rec.id)
          .order('created_at', { ascending: false });
          
        if (reqData) setRequests(reqData);

        // Fetch uploaded reports
        const { data: fileData } = await supabase
          .from('files')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (fileData) setFiles(fileData);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user || !recipientId) return;
    setUploading(true);

    try {
      const fileRecord = await uploadFile(selectedFile, 'documents', user.id, 'recipients', recipientId);
      setFiles([fileRecord, ...files]);
      setUploadModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      alert("Upload failed. Disallow large files or check connection.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Requests & Medical Reports</h1>
        <p className="text-slate-500">View your organ request history and upload necessary medical reports.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
              <CardDescription>Your past and present organ requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <div className="text-center py-4">Loading requests...</div>
              ) : requests.length === 0 ? (
                 <div className="text-center py-4 text-slate-500">No requests found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organ</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map(req => (
                      <TableRow key={req.id}>
                        <TableCell className="font-semibold">{req.required_organ}</TableCell>
                        <TableCell>
                          <Badge variant={req.urgency_level === 'critical' ? 'danger' : 'warning'} className="capitalize">{req.urgency_level}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={req.status === 'approved' ? 'success' : 'default'} className="capitalize">{req.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">{format(new Date(req.created_at), 'MMM dd, yyyy')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Medical Files</CardTitle>
                <CardDescription>Upload test results</CardDescription>
              </div>
              <Button size="sm" onClick={() => setUploadModalOpen(true)}>
                 <UploadCloud className="w-4 h-4 mr-2" /> Upload
              </Button>
            </CardHeader>
            <CardContent>
               {files.length === 0 ? (
                 <div className="text-center py-6 text-sm text-slate-500">No files uploaded yet.</div>
               ) : (
                 <div className="space-y-3 mt-4">
                   {files.map(file => (
                     <div key={file.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                       <div className="flex items-center overflow-hidden mr-3">
                         <File className="w-4 h-4 text-primary-500 mr-2 shrink-0" />
                         <span className="text-sm font-medium text-slate-800 truncate">{file.file_name}</span>
                       </div>
                       <a 
                         href={file.file_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="p-1.5 bg-slate-100 text-slate-600 hover:text-primary-600 rounded-md transition-colors shrink-0"
                         title="View File"
                       >
                         <Eye className="w-4 h-4" />
                       </a>
                     </div>
                   ))}
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal isOpen={uploadModalOpen} onClose={() => !uploading && setUploadModalOpen(false)} title="Upload Medical Report">
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer">
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-2" />
            <label className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium text-sm">
              <span>Browse for file</span>
              <input 
                type="file" 
                className="sr-only" 
                onChange={e => e.target.files && setSelectedFile(e.target.files[0])}
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </label>
            <p className="text-xs text-slate-500 mt-1">PDF or Images up to 10MB</p>
          </div>
          {selectedFile && (
            <div className="text-sm text-slate-700 bg-slate-100 p-2 rounded-md">
              Selected: {selectedFile.name}
            </div>
          )}
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setUploadModalOpen(false)} disabled={uploading}>Cancel</Button>
            <Button type="submit" disabled={!selectedFile || uploading} isLoading={uploading}>Upload File</Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
}
