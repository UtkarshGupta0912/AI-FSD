import { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Plus, Edit3, Trash2, X, Save, User, Calendar, UserPlus } from 'lucide-react';

const FamilyMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', relation: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try { const res = await API.get('/family'); setMembers(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm({ name: '', age: '', gender: 'Male', relation: '' }); setShowModal(true); };
  const openEdit = (m) => { setEditing(m); setForm({ name: m.name, age: m.age, gender: m.gender, relation: m.relation }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await API.put(`/family/${editing._id}`, { ...form, age: Number(form.age) });
      else await API.post('/family', { ...form, age: Number(form.age) });
      setShowModal(false); fetchMembers();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this family member?')) return;
    try { await API.delete(`/family/${id}`); fetchMembers(); } catch { alert('Failed to delete'); }
  };

  const getColor = (g) => g === 'Male' ? 'from-blue-500 to-indigo-600' : g === 'Female' ? 'from-pink-500 to-rose-600' : 'from-purple-500 to-violet-600';

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">👨‍👩‍👧 Family Members</h1>
          <p className="text-gray-400 mt-1">Manage your family health profiles</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 transition-all text-sm w-fit">
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No family members yet</h3>
          <p className="text-gray-400 text-sm mb-4">Add family members to track their health reports</p>
          <button onClick={openAdd} className="text-primary-400 hover:text-primary-300 text-sm font-medium">+ Add first member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <div key={m._id} className="glass-card p-5 !rounded-xl animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getColor(m.gender)} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>{m.name.charAt(0).toUpperCase()}</div>
                  <div><h3 className="font-semibold text-white">{m.name}</h3><p className="text-xs text-gray-400">👤 {m.relation}</p></div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(m._id)} className="p-2 text-gray-400 hover:text-danger-400 hover:bg-danger-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-gray-400"><Calendar className="w-3.5 h-3.5" />{m.age} years</span>
                <span className="flex items-center gap-1.5 text-gray-400"><User className="w-3.5 h-3.5" />{m.gender}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-card p-6 !rounded-2xl w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Member' : 'Add Family Member'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all" placeholder="Full name" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Age</label>
                  <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all" placeholder="25" min="0" max="150" required /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Gender</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-primary-500 transition-all">
                    <option value="Male" className="bg-dark-900">Male</option><option value="Female" className="bg-dark-900">Female</option><option value="Other" className="bg-dark-900">Other</option>
                  </select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Relation</label>
                <input type="text" value={form.relation} onChange={e => setForm({...form, relation: e.target.value})} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all" placeholder="e.g. Father, Mother" required /></div>
              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50">
                {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> {editing ? 'Update' : 'Add Member'}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyMembers;
