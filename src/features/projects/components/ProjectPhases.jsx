import React, { useState } from 'react';
import { useProjectContext } from '../../../context/ProjectContext';
import { motion } from 'framer-motion';

export default function ProjectPhases({ project }) {
  const { addPhase, updatePhase, deletePhase } = useProjectContext();
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    budget: '',
    spentAmount: '',
    description: '',
  });

  const defaultPhases = [
    {
      name: '1. Land Acquisition',
      description: 'Acquire and secure the land in Beato, Lisbon',
      duration: '2-3 months',
      budget: 'Variable (25% can be financed)',
      status: 'planning',
    },
    {
      name: '2. Project Development',
      description: 'Architectural design, permits, and approvals',
      duration: '3-4 months',
      budget: 'Included in indirect costs (~€1.7M)',
      status: 'planning',
    },
    {
      name: '3. Construction Phase',
      description: 'Build 40 apartments (6,500 m² above ground + 2,000 m² below)',
      duration: '18-24 months',
      budget: '€11,583,000 (50% can be financed)',
      status: 'pending',
    },
    {
      name: '4. Sales & Commercialization',
      description: 'Marketing and pre-sales during construction',
      duration: 'During construction + 6 months',
      budget: '7.38% of total sales value',
      status: 'pending',
    },
    {
      name: '5. Unit Delivery & Handover',
      description: 'Deliver completed apartments to buyers',
      duration: '2-3 months',
      budget: 'Closing costs and fees',
      status: 'pending',
    },
  ];

  const allPhases = project.phases && project.phases.length > 0 
    ? project.phases 
    : defaultPhases;

  const handleAddPhase = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      addPhase(project.id, {
        ...formData,
        status: 'planning',
      });
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        status: 'pending',
        budget: '',
        spentAmount: '',
        description: '',
      });
      setShowAddPhase(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'planning':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'pending':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: '✓ Completed',
      'in-progress': '⏳ In Progress',
      planning: '📋 Planning',
      pending: '⭕ Pending',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Project Timeline & Phases
          </h3>
          <button
            onClick={() => setShowAddPhase(!showAddPhase)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Add Phase
          </button>
        </div>

        {showAddPhase && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleAddPhase}
            className="bg-slate-50 p-4 rounded-lg mb-6 space-y-3 border border-slate-200"
          >
            <input
              type="text"
              placeholder="Phase name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows="2"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                placeholder="Budget (€)"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Save Phase
              </button>
              <button
                type="button"
                onClick={() => setShowAddPhase(false)}
                className="border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        <div className="space-y-4">
          {allPhases.map((phase, idx) => (
            <motion.div
              key={phase.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-lg">
                    {phase.name}
                  </h4>
                  {phase.description && (
                    <p className="text-slate-600 text-sm mt-1">
                      {phase.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      phase.status
                    )}`}
                  >
                    {getStatusLabel(phase.status)}
                  </span>
                  {phase.id && (
                    <button
                      onClick={() => deletePhase(project.id, phase.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                {phase.duration && (
                  <div>
                    <p className="text-slate-600">Duration</p>
                    <p className="font-semibold text-slate-900">{phase.duration}</p>
                  </div>
                )}
                {phase.budget && (
                  <div>
                    <p className="text-slate-600">Budget</p>
                    <p className="font-semibold text-slate-900">{phase.budget}</p>
                  </div>
                )}
                {phase.startDate && (
                  <div>
                    <p className="text-slate-600">Start Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(phase.startDate).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                )}
                {phase.endDate && (
                  <div>
                    <p className="text-slate-600">End Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(phase.endDate).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
      >
        <h3 className="font-bold text-slate-900 mb-4">Project Timeline Summary</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Total Duration:</span> Approximately
            27-34 months from land acquisition to final handover
          </p>
          <p>
            <span className="font-semibold">Critical Path:</span> Land Acquisition
            → Project Development → Construction → Sales & Handover
          </p>
          <p>
            <span className="font-semibold">Parallel Activities:</span>{' '}
            Commercialization begins during construction phase
          </p>
        </div>
      </motion.div>
    </div>
  );
}
