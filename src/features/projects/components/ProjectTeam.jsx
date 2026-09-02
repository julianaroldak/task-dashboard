import React, { useState } from 'react';
import { useProjectContext } from '../../../context/ProjectContext';
import { motion } from 'framer-motion';

export default function ProjectTeam({ project }) {
  const { addTeamMember } = useProjectContext();
  const [showAddMember, setShowAddMember] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    responsibility: '',
  });

  const defaultTeamMembers = [
    {
      name: 'Investor/Developer',
      role: 'Project Owner',
      responsibility: 'Capital provision, strategic decisions, project oversight',
      email: 'investor@example.com',
      initials: 'ID',
      color: 'bg-blue-500',
    },
    {
      name: 'Architect/Designer',
      role: 'Design Lead',
      responsibility: 'Building design, technical specifications, compliance',
      email: 'architect@example.com',
      initials: 'AD',
      color: 'bg-purple-500',
    },
    {
      name: 'Construction Manager',
      role: 'Project Manager',
      responsibility: 'Construction execution, timeline management, cost control',
      email: 'manager@example.com',
      initials: 'CM',
      color: 'bg-orange-500',
    },
    {
      name: 'Real Estate Agent',
      role: 'Sales & Marketing',
      responsibility: 'Commercialization, pre-sales, buyer relations',
      email: 'sales@example.com',
      initials: 'RA',
      color: 'bg-green-500',
    },
    {
      name: 'Financial Advisor',
      role: 'Finance',
      responsibility: 'Financing structure, cash flow management, financial reporting',
      email: 'finance@example.com',
      initials: 'FA',
      color: 'bg-red-500',
    },
    {
      name: 'Legal Counsel',
      role: 'Legal',
      responsibility: 'Contracts, permits, regulatory compliance, documentation',
      email: 'legal@example.com',
      initials: 'LC',
      color: 'bg-indigo-500',
    },
  ];

  const allMembers = project.team && project.team.length > 0 
    ? project.team 
    : defaultTeamMembers;

  const handleAddMember = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.role.trim()) {
      addTeamMember(project.id, {
        ...formData,
        initials: formData.name.split(' ').map(n => n[0]).join(''),
        color: `bg-${['blue', 'purple', 'orange', 'green', 'red', 'indigo', 'cyan', 'pink'][Math.floor(Math.random() * 8)]}-500`,
      });
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        responsibility: '',
      });
      setShowAddMember(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Project Team ({allMembers.length} Members)
          </h3>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add Member
          </button>
        </div>

        {showAddMember && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleAddMember}
            className="bg-slate-50 p-4 rounded-lg mb-6 space-y-3 border border-slate-200"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <textarea
              placeholder="Responsibility/Description"
              value={formData.responsibility}
              onChange={(e) => setFormData({ ...formData, responsibility: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows="2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Add Member
              </button>
              <button
                type="button"
                onClick={() => setShowAddMember(false)}
                className="border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allMembers.map((member, idx) => (
            <motion.div
              key={member.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`${member.color || 'bg-slate-500'} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm flex-shrink-0`}
                >
                  {member.initials || member.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900">{member.name}</h4>
                  <p className="text-sm font-semibold text-blue-600">{member.role}</p>

                  {member.responsibility && (
                    <p className="text-sm text-slate-600 mt-2">{member.responsibility}</p>
                  )}

                  <div className="flex flex-col gap-1 mt-3 text-xs text-slate-600">
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <span>✉️</span>
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <span>📞</span>
                        <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                          {member.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Organizational Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">🏗️ Project Organization</h3>

        <div className="bg-gradient-to-b from-blue-50 to-slate-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="text-center">
            <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold mb-6">
              Investor / Project Owner
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 my-8">
            <div className="text-center">
              <div className="bg-purple-100 border-2 border-purple-500 px-4 py-2 rounded-lg font-semibold text-sm mb-2">
                Design & Planning
              </div>
              <p className="text-xs text-slate-600">Architect, Engineers</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 border-2 border-orange-500 px-4 py-2 rounded-lg font-semibold text-sm mb-2">
                Execution
              </div>
              <p className="text-xs text-slate-600">Construction Manager</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 border-2 border-green-500 px-4 py-2 rounded-lg font-semibold text-sm mb-2">
                Sales & Marketing
              </div>
              <p className="text-xs text-slate-600">Real Estate Agent</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="bg-red-100 border-2 border-red-500 px-4 py-2 rounded-lg font-semibold text-sm mb-2">
                Finance & Reporting
              </div>
              <p className="text-xs text-slate-600">Financial Advisor</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 border-2 border-indigo-500 px-4 py-2 rounded-lg font-semibold text-sm mb-2">
                Legal & Compliance
              </div>
              <p className="text-xs text-slate-600">Legal Counsel</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Responsibilities Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">📋 RACI Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300">
                <th className="text-left px-4 py-3 font-bold text-slate-900">
                  Activity
                </th>
                <th className="text-center px-3 py-3 font-bold text-slate-600">
                  Owner
                </th>
                <th className="text-center px-3 py-3 font-bold text-slate-600">
                  Lead
                </th>
                <th className="text-center px-3 py-3 font-bold text-slate-600">
                  Support
                </th>
                <th className="text-center px-3 py-3 font-bold text-slate-600">
                  Inform
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { activity: 'Land Acquisition', owner: 'Investor', lead: 'Legal', support: 'Finance', inform: 'All' },
                { activity: 'Project Design', owner: 'Architect', lead: 'Designer', support: 'Investor', inform: 'Team' },
                { activity: 'Permits & Approvals', owner: 'Legal', lead: 'Architect', support: 'Finance', inform: 'Manager' },
                { activity: 'Construction Execution', owner: 'Manager', lead: 'Contractor', support: 'Architect', inform: 'Investor' },
                { activity: 'Quality Assurance', owner: 'Manager', lead: 'Inspector', support: 'Architect', inform: 'All' },
                { activity: 'Commercialization', owner: 'Agent', lead: 'Marketing', support: 'Manager', inform: 'Investor' },
                { activity: 'Financial Reporting', owner: 'Finance', lead: 'Accountant', support: 'Manager', inform: 'Investor' },
                { activity: 'Contract Management', owner: 'Legal', lead: 'Legal', support: 'All', inform: 'Investor' },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-semibold text-slate-900 border-b border-slate-200">
                    {row.activity}
                  </td>
                  <td className="text-center px-3 py-3 border-b border-slate-200">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                      R
                    </span>
                  </td>
                  <td className="text-center px-3 py-3 border-b border-slate-200">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                      A
                    </span>
                  </td>
                  <td className="text-center px-3 py-3 border-b border-slate-200">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                      C
                    </span>
                  </td>
                  <td className="text-center px-3 py-3 border-b border-slate-200">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      I
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-600 mt-4">
          <strong>R:</strong> Responsible • <strong>A:</strong> Accountable •{' '}
          <strong>C:</strong> Consulted • <strong>I:</strong> Informed
        </p>
      </motion.div>
    </div>
  );
}
