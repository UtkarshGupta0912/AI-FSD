import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import HealthChart from '../components/HealthChart';
import {
  Activity, FileText, Users, Upload, TrendingUp, AlertTriangle,
  CheckCircle, Clock, ArrowUpRight, Heart, Stethoscope, MapPin
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, familyRes] = await Promise.all([
        API.get('/reports'),
        API.get('/family')
      ]);
      setReports(reportsRes.data);
      setFamilyMembers(familyRes.data);

      // Try to get nearby doctors
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const docRes = await API.get(`/doctors?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`);
              setDoctors(docRes.data.slice(0, 3));
            } catch (e) { /* ignore */ }
          },
          () => { /* geolocation denied, skip */ }
        );
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const latestReport = reports[0];
  const latestParams = latestReport?.analysis?.parameters || [];
  const overallStatus = latestReport?.analysis?.overallStatus || 'healthy';

  const getStatusConfig = (status) => {
    switch (status) {
      case 'healthy': return { color: 'text-success-400', bg: 'bg-success-400/10', icon: CheckCircle, label: 'Healthy' };
      case 'attention': return { color: 'text-warning-400', bg: 'bg-warning-400/10', icon: AlertTriangle, label: 'Needs Attention' };
      case 'critical': return { color: 'text-danger-400', bg: 'bg-danger-400/10', icon: AlertTriangle, label: 'Critical' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', icon: Activity, label: 'No Data' };
    }
  };

  const statusConfig = getStatusConfig(overallStatus);
  const StatusIcon = statusConfig.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, <span className="text-primary-400">{user?.name}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's your health overview</p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all text-sm w-fit"
        >
          <Upload className="w-4 h-4" />
          Upload Report
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 ${statusConfig.bg} rounded-xl flex items-center justify-center`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-sm text-gray-400">Health Status</p>
          <p className="text-xl font-bold text-white mt-1">{statusConfig.label}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-primary-400" />
          </div>
          <p className="text-sm text-gray-400">Total Reports</p>
          <p className="text-xl font-bold text-white mt-1">{reports.length}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-accent-400" />
          </div>
          <p className="text-sm text-gray-400">Family Members</p>
          <p className="text-xl font-bold text-white mt-1">{familyMembers.length}</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warning-400/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning-400" />
            </div>
          </div>
          <p className="text-sm text-gray-400">Parameters Tracked</p>
          <p className="text-xl font-bold text-white mt-1">{latestParams.length}</p>
        </div>
      </div>

      {/* Charts & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HealthChart parameters={latestParams} />
        </div>

        {/* Parameter Cards */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-400" />
            Key Parameters
          </h3>
          {latestParams.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {latestParams.map((param, i) => (
                <div key={i} className="glass-card p-4 !rounded-xl animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300 truncate mr-2">{param.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize status-${param.status}`}>
                      {param.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">{param.value}</span>
                    <span className="text-xs text-gray-500">{param.unit}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Normal: {param.normalRange} {param.unit}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No reports yet</p>
              <Link to="/upload" className="text-primary-400 text-sm hover:underline mt-1 inline-block">
                Upload your first report →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reports & Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-400" />
            Recent Reports
          </h3>
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report, i) => (
                <div key={report._id} className="glass-card p-4 !rounded-xl flex items-center justify-between animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      report.analysis?.overallStatus === 'healthy' ? 'bg-success-400/10' :
                      report.analysis?.overallStatus === 'critical' ? 'bg-danger-400/10' : 'bg-warning-400/10'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        report.analysis?.overallStatus === 'healthy' ? 'text-success-400' :
                        report.analysis?.overallStatus === 'critical' ? 'text-danger-400' : 'text-warning-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{report.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {report.familyMemberId && ` • ${report.familyMemberId.name}`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize status-${report.analysis?.overallStatus || 'healthy'}`}>
                    {report.analysis?.overallStatus || 'Analyzed'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No reports uploaded yet</p>
              <Link to="/upload" className="text-primary-400 text-sm hover:underline mt-2 inline-block">
                Upload your first report →
              </Link>
            </div>
          )}
        </div>

        {/* Nearby Doctors */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-accent-400" />
            Nearby Doctors
          </h3>
          {doctors.length > 0 ? (
            <div className="space-y-3">
              {doctors.map((doc, i) => (
                <div key={doc.id} className="glass-card p-4 !rounded-xl animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{doc.name}</p>
                      <p className="text-xs text-primary-400">{doc.specialization}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {doc.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-warning-400 text-sm">
                        ⭐ {doc.rating}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{doc.distance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <Stethoscope className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Enable location to find nearby doctors</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
