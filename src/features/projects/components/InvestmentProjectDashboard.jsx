import React, { useState } from 'react';
import { useProjectContext } from '../../../context/ProjectContext';
import { motion } from 'framer-motion';
import ProjectForm from './ProjectForm';
import ProjectOverview from './ProjectOverview';
import ProjectPhases from './ProjectPhases';
import ProjectFinancials from './ProjectFinancials';
import ProjectTeam from './ProjectTeam';

export default function InvestmentProjectDashboard() {
  const { projects, selectedProjectId, setSelectedProjectId, deleteProject } = useProjectContext();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const tabs = [
    { id: 'overview', label: '📋 Overview' },
    { id: 'phases', label: '📅 Phases' },
    { id: 'financials', label: '💰 Financials' },
    { id: 'team', label: '👥 Team' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                🏢 Investment Projects
              </h1>
              <p className="text-slate-600 mt-2">
                Manage and track real estate investment projects
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              + New Project
            </button>
          </div>
        </motion.div>

        {showForm && (
          <ProjectForm onClose={() => setShowForm(false)} />
        )}

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg p-12 text-center"
          >
            <p className="text-xl text-slate-500 mb-4">
              No projects yet. Create your first investment project!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar - Project List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="col-span-3 space-y-2"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Projects ({projects.length})
              </h2>
              {projects.map(project => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedProjectId === project.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-900 hover:shadow-md'
                  }`}
                >
                  <h3 className="font-semibold truncate">{project.name}</h3>
                  <p className="text-sm opacity-75">
                    {project.phases?.length || 0} phases
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content */}
            {selectedProject ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-9 space-y-6"
              >
                {/* Project Header */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">
                        {selectedProject.name}
                      </h2>
                      <p className="text-slate-600 mt-1">
                        {selectedProject.location}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteProject(selectedProject.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-2 border-b border-slate-200">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 font-semibold transition-colors ${
                          activeTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {activeTab === 'overview' && (
                    <ProjectOverview project={selectedProject} />
                  )}
                  {activeTab === 'phases' && (
                    <ProjectPhases project={selectedProject} />
                  )}
                  {activeTab === 'financials' && (
                    <ProjectFinancials project={selectedProject} />
                  )}
                  {activeTab === 'team' && (
                    <ProjectTeam project={selectedProject} />
                  )}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-9 bg-white rounded-lg p-12 text-center"
              >
                <p className="text-xl text-slate-500">
                  Select a project to view details
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
