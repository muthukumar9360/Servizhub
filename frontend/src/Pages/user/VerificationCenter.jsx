import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ShieldCheck, Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

const VerificationCenter = () => {
  const { user } = useSelector((state) => state.auth);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [documentType, setDocumentType] = useState("GOVERNMENT_ID");
  const [file, setFile] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/documents/my-documents");
      setDocuments(res.data.data || []);
    } catch (e) {
      console.error("Error fetching docs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a document image or PDF file to upload.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("document", file);

      await axiosInstance.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Document uploaded successfully! Platform admin will review.");
      setFile(null);
      fetchDocs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Identity & KYC Verification</h1>
            <p className="text-sm text-gray-500 mt-1">Upload government ID and address proof to become a verified renter/owner</p>
          </div>
          <div className="text-right">
            {user?.verification?.adminApproved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-xs font-extrabold rounded-full">
                <CheckCircle className="h-4 w-4" /> Account Fully Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full">
                <Clock className="h-4 w-4" /> Verification Pending
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upload Form Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" /> Upload Verification File
            </h3>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="GOVERNMENT_ID">Aadhaar Card / Driving License / Passport</option>
                  <option value="ADDRESS_PROOF">Utility Bill / Rental Agreement</option>
                  <option value="SELFIE">Profile Selfie Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Choose Image or PDF</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <Button type="submit" variant="primary" loading={uploading} className="w-full py-2.5 text-xs font-bold">
                Submit Document
              </Button>
            </form>
          </div>

          {/* Uploaded Documents List */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">My Submitted Documents</h3>

            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-3xl border border-gray-200">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No documents submitted yet. Upload your ID to start renting.</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc._id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{doc.documentType.replace(/_/g, " ")}</h4>
                      <p className="text-xs text-gray-400">Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
                      {doc.status === "REJECTED" && (
                        <p className="text-xs text-red-600 font-bold mt-0.5">Reason: {doc.rejectionReason}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={doc.status} />
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline font-bold"
                    >
                      View File
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCenter;
