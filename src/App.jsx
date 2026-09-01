import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

import { TaskProvider } from './context/TaskContext';
import { TagProvider } from './context/TagContext';
import { ListProvider } from './context/ListContext';
import { ProjectProvider } from './context/ProjectContext';

import GlobalTaskForm from './features/tasks/components/GlobalTaskForm';
import TaskBoard from './features/lists/components/TaskBoard';
import InvestmentProjectDashboard from './features/projects/components/InvestmentProjectDashboard';

function App() {
  const [showInput, setShowInput] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'projects'

  return (
    <TaskProvider>
      <TagProvider>
        <ListProvider>
          <ProjectProvider>
            <div className="App min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col" data-testid="app">
              {/* Navigation Tabs */}
              <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 flex">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                      activeTab === 'tasks'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-600 border-transparent hover:text-slate-900'
                    }`}
                  >
                    📋 Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                      activeTab === 'projects'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-600 border-transparent hover:text-slate-900'
                    }`}
                  >
                    🏢 Investment Projects
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 py-12 px-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'tasks' ? (
                    <motion.div
                      key="tasks"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full max-w-6xl mx-auto"
                    >
                      <motion.div 
                        className="mb-6 bg-white rounded-2xl shadow-soft p-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        data-testid="app-header"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">Task Dashboard</h1>
                          {/* Stats will be displayed from TaskContext */}
                        </div>
                        
                        <AnimatePresence>
                          {showInput ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                              data-testid="task-form-container"
                            >
                              <GlobalTaskForm onCancel={() => setShowInput(false)} />
                            </motion.div>
                          ) : (
                            <motion.button
                              className="flex items-center justify-center w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
                              onClick={() => setShowInput(true)}
                              whileTap={{ scale: 0.97 }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              data-testid="show-task-form-button"
                            >
                              <PlusIcon className="h-5 w-5 mr-2" />
                              Add New Task
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      
                      {/* The TaskBoard component now manages all task lists */}
                      <TaskBoard />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <InvestmentProjectDashboard />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ProjectProvider>
        </ListProvider>
      </TagProvider>
    </TaskProvider>
  );
}

export default App;
