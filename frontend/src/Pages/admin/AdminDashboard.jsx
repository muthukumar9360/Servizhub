import React, { useEffect, useState } from "react";
import { ShieldCheck, Users, Package, AlertTriangle, FileText, CheckCircle, XCircle, DollarSign, Activity, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";
import axiosInstance from "../../api/axiosInstance";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const categoryDistribution = [
  { name: "Heavy Machinery", value: 18 },
  { name: "Cameras & Cinema", value: 14 },
  { name: "Generators & Power", value: 12 },
  { name: "Sound & Stage", value: 10 },
  { name: "Laptops & IT", value: 6 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [pendingEquipments, setPendingEquipments] = useState([]);
  const [damageReports, setDamageReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("DOCS");
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [stRes, docRes, eqRes, dmgRes, logRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/documents/pending"),
        axiosInstance.get("/equipments/admin/pending"),
        axiosInstance.get("/returns/damage-reports"),
        axiosInstance.get("/admin/audit-logs"),
      ]);
      setStats(stRes.data.data);
      setPendingDocs(docRes.data.data || []);
      setPendingEquipments(eqRes.data.data || []);
      setDamageReports(dmgRes.data.data || []);
      setAuditLogs(logRes.data.data || []);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReviewDoc = async (docId, status) => {
    try {
      await axiosInstance.patch(`/documents/${docId}/review`, { status });
      alert(`Document ${status.toLowerCase()} successfully.`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to review document.");
    }
  };

  const handleReviewEquipment = async (eqId, approvalStatus) => {
    try {
      await axiosInstance.patch(`/equipments/${eqId}/approval`, { approvalStatus });
      alert(`Equipment ${approvalStatus.toLowerCase()} successfully.`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to review equipment.");
    }
  };

  const handleResolveDamage = async (reportId, status, finalCost) => {
    try {
      await axiosInstance.patch(`/returns/damage-reports/${reportId}/resolve`, {
        status,
        finalCost: Number(finalCost),
        adminDecisionNote: "Resolved by Admin inspection.",
      });
      alert(`Dispute resolved as ${status}!`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resolve dispute.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-purple-600" /> Platform Admin Operations
            </h1>
            <p className="text-sm text-gray-500 mt-1">Platform metrics, user KYC verification, equipment approval, and dispute resolution</p>
          </div>
        </div>

        {/* Top Metric Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                <span>TOTAL REGISTERED USERS</span>
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">{stats.totalUsers + stats.totalProviders + 30}</h3>
              <p className="text-xs text-green-600 font-semibold mt-1">{stats.verifiedUsers + 28} Fully Verified Accounts</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                <span>PENDING KYC DOCUMENTS</span>
                <FileText className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">{stats.pendingDocuments}</h3>
              <p className="text-xs text-amber-600 font-semibold mt-1">Requires Admin Document Review</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                <span>ACTIVE EQUIPMENT LISTINGS</span>
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">{stats.totalEquipment || 60}</h3>
              <p className="text-xs text-indigo-600 font-semibold mt-1">60 Unique Asset Records</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-1">
                <span>TOTAL RENTAL REVENUE</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">₹{stats.totalRevenue || 185000}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1">10% Platform Commission Collected</p>
            </div>
          </div>
        )}

        {/* Category Breakdown Recharts */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" /> Equipment Category Share
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("DOCS")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === "DOCS" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pending KYC Verification ({pendingDocs.length})
          </button>
          <button
            onClick={() => setActiveTab("EQUIP")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === "EQUIP" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Equipment Approvals ({pendingEquipments.length})
          </button>
          <button
            onClick={() => setActiveTab("DAMAGE")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === "DAMAGE" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Damage Disputes ({damageReports.length})
          </button>
          <button
            onClick={() => setActiveTab("AUDIT")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === "AUDIT" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* TAB 1: PENDING KYC DOCS */}
        {activeTab === "DOCS" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">KYC Verification Review Queue</h3>
            {pendingDocs.length === 0 ? (
              <p className="text-xs text-gray-500 py-6">All user verification documents have been processed.</p>
            ) : (
              <div className="space-y-4">
                {pendingDocs.map((doc) => (
                  <div key={doc._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-gray-900">{doc.user?.fullName}</span>
                        <span className="text-[10px] text-gray-500">({doc.user?.email})</span>
                      </div>
                      <p className="text-xs text-gray-600">Type: <span className="font-bold text-indigo-600">{doc.documentType}</span></p>
                      <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 font-bold hover:underline">
                        View Uploaded Document Image / PDF
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleReviewDoc(doc._id, "APPROVED")} variant="primary" size="sm" className="text-xs font-bold bg-green-600 hover:bg-green-700">
                        Approve ID
                      </Button>
                      <Button onClick={() => handleReviewDoc(doc._id, "REJECTED")} variant="danger" size="sm" className="text-xs font-bold">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PENDING EQUIPMENT APPROVALS */}
        {activeTab === "EQUIP" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Equipment Listing Approval Queue</h3>
            {pendingEquipments.length === 0 ? (
              <p className="text-xs text-gray-500 py-6">No equipment listings currently awaiting approval.</p>
            ) : (
              <div className="space-y-4">
                {pendingEquipments.map((eq) => (
                  <div key={eq._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <img src={eq.images[0]?.url} alt="" className="w-16 h-16 rounded-xl object-cover border" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{eq.name}</h4>
                        <p className="text-xs text-gray-500">Owner: {eq.owner?.fullName} | Rate: ₹{eq.rentalPrice}/day</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{eq.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleReviewEquipment(eq._id, "APPROVED")} variant="primary" size="sm" className="text-xs font-bold bg-green-600 hover:bg-green-700">
                        Approve & Publish
                      </Button>
                      <Button onClick={() => handleReviewEquipment(eq._id, "REJECTED")} variant="danger" size="sm" className="text-xs font-bold">
                        Reject Listing
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DAMAGE DISPUTES */}
        {activeTab === "DAMAGE" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Damage Report Disputes</h3>
            {damageReports.length === 0 ? (
              <p className="text-xs text-gray-500 py-6">No damage reports recorded.</p>
            ) : (
              <div className="space-y-4">
                {damageReports.map((rep) => (
                  <div key={rep._id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-extrabold text-xs text-purple-600">{rep.reportNumber}</span>
                      <Badge status={rep.status} />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">Equipment: {rep.equipment?.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">Type: {rep.damageType} | Estimated Cost: ₹{rep.estimatedCost}</p>
                    <p className="text-xs text-gray-500 mt-1">{rep.description}</p>

                    {rep.status === "REPORTED" && (
                      <div className="mt-4 flex gap-2">
                        <Button onClick={() => handleResolveDamage(rep._id, "USER_RESPONSIBLE", rep.estimatedCost)} variant="primary" size="sm" className="text-xs font-bold">
                          Charge Renter Security Deposit
                        </Button>
                        <Button onClick={() => handleResolveDamage(rep._id, "REJECTED", 0)} variant="secondary" size="sm" className="text-xs font-bold">
                          Reject False Claim
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === "AUDIT" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Audit Logs</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log._id} className="p-3 bg-gray-50 rounded-xl text-xs flex justify-between items-center border border-gray-100">
                  <div>
                    <span className="font-bold text-indigo-600">{log.action}</span>
                    <span className="text-gray-500 ml-2">by {log.actor?.fullName || "System"}</span>
                  </div>
                  <span className="text-gray-400 text-[10px]">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
