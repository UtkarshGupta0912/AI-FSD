import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import API from '../services/api';
import HealthChart from '../components/HealthChart';
import {
  Upload, FileText, Loader2, CheckCircle, AlertTriangle, X,
  Pill, Salad, Dumbbell, Home, ChevronDown, User
} from 'lucide-react';

const UploadReport = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/family').then(res => setFamilyMembers(res.data)).catch(() => {});
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
      setReport(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setProgress('Uploading file...');

    const formData = new FormData();
    formData.append('report', file);
    if (selectedMember) formData.append('familyMemberId', selectedMember);

    try {
      setProgress('Extracting text with OCR...');
      // Slight delay to show progress
      await new Promise(r => setTimeout(r, 500));
      setProgress('Analyzing report with AI...');

      const res = await API.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000
      });

      setReport(res.data);
      setProgress('');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload and analyze report');
      setProgress('');
    } finally {
      setUploading(false);
    }
  };

  const analysis = report?.analysis;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">📄 Upload Medical Report</h1>
        <p className="text-gray-400 mt-1">Upload a PDF or image of your medical report for AI analysis</p>
      </div>

      {!report && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Family Member Selector */}
            <div className="glass-card p-4 !rounded-xl">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Select Family Member (optional)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-primary-500 transition-all"
                >
                  <option value="" className="bg-dark-900">Myself</option>
                  {familyMembers.map(m => (
                    <option key={m._id} value={m._id} className="bg-dark-900">{m.name} ({m.relation})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`glass-card p-12 !rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center ${
                isDragActive
                  ? 'border-primary-400 bg-primary-500/10'
                  : file
                  ? 'border-success-400/50 bg-success-400/5'
                  : 'border-white/10 hover:border-primary-400/50 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="space-y-3">
                  <CheckCircle className="w-12 h-12 text-success-400 mx-auto" />
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-danger-400 text-sm hover:underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {isDragActive ? 'Drop your file here' : 'Drag & drop your medical report'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">or click to browse • PDF, JPG, PNG • Max 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-danger-500/10 border border-danger-500/20 rounded-xl p-3 text-danger-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {progress}
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Analyze Report
                </>
              )}
            </button>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <div className="glass-card p-5 !rounded-xl">
              <h3 className="font-semibold text-white mb-3">How it works</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <p>Upload your medical report (PDF or image)</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <p>Our OCR extracts text from the document</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <p>AI analyzes the values and provides insights</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <p>Get suggestions for diet, exercise, and remedies</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 !rounded-xl">
              <h3 className="font-semibold text-white mb-2">🔒 Privacy</h3>
              <p className="text-sm text-gray-400">
                Your files are processed securely and deleted from our servers after analysis. We do not store your original documents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {report && analysis && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">✅ Analysis Results</h2>
            <button
              onClick={() => { setReport(null); setFile(null); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-white glass-card !rounded-xl"
            >
              <Upload className="w-4 h-4" />
              New Upload
            </button>
          </div>

          {/* Summary */}
          <div className={`glass-card p-5 !rounded-xl border-l-4 ${
            analysis.overallStatus === 'healthy' ? 'border-l-success-400' :
            analysis.overallStatus === 'critical' ? 'border-l-danger-400' : 'border-l-warning-400'
          }`}>
            <p className="text-white">{analysis.summary}</p>
          </div>

          {/* Chart */}
          <HealthChart parameters={analysis.parameters} />

          {/* Parameters Detail */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">📋 Detailed Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.parameters?.map((param, i) => (
                <div key={i} className="glass-card p-4 !rounded-xl animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{param.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize status-${param.status}`}>{param.status}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-xl font-bold text-white">{param.value}</span>
                    <span className="text-xs text-gray-500">{param.unit}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Normal: {param.normalRange} {param.unit}</p>
                  <p className="text-xs text-gray-400">{param.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">💡 Recommendations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SuggestionCard icon={Pill} title="OTC Medicines" items={analysis.suggestions.medicines} color="primary" />
                <SuggestionCard icon={Salad} title="Diet Tips" items={analysis.suggestions.diet} color="success" />
                <SuggestionCard icon={Dumbbell} title="Exercise" items={analysis.suggestions.exercise} color="accent" />
                <SuggestionCard icon={Home} title="Home Remedies" items={analysis.suggestions.homeRemedies} color="warning" />
              </div>
            </div>
          )}

          <div className="glass-card p-4 !rounded-xl text-center text-xs text-gray-500">
            ⚕️ This analysis is for informational purposes only. Please consult a qualified healthcare provider for medical advice.
          </div>
        </div>
      )}
    </div>
  );
};

const SuggestionCard = ({ icon: Icon, title, items, color }) => {
  if (!items || items.length === 0) return null;
  const colorClasses = {
    primary: 'bg-primary-500/10 text-primary-400',
    success: 'bg-success-400/10 text-success-400',
    accent: 'bg-accent-500/10 text-accent-400',
    warning: 'bg-warning-400/10 text-warning-400',
  };
  return (
    <div className="glass-card p-5 !rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h4 className="font-semibold text-white text-sm">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
            <span className="text-primary-400 mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadReport;
