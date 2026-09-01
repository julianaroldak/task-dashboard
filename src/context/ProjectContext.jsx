import React, { createContext, useState, useContext } from 'react';

// Create the project context
const ProjectContext = createContext();

// Custom hook for using project context
export const useProjectContext = () => useContext(ProjectContext);

// Project provider component
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Add new project
  const addProject = (project) => {
    const id = Math.floor(Math.random() * 100000) + 1;
    const newProject = {
      id,
      createdAt: new Date().toISOString(),
      ...project,
      phases: project.phases || [],
      financials: project.financials || {},
      team: project.team || [],
      timeline: project.timeline || [],
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(id);
    return newProject;
  };

  // Update project
  const updateProject = (id, updates) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Delete project
  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(projects.length > 1 ? projects[0].id : null);
    }
  };

  // Add phase to project
  const addPhase = (projectId, phase) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          phases: [...(p.phases || []), { id: Math.random(), ...phase }],
        };
      }
      return p;
    }));
  };

  // Update phase
  const updatePhase = (projectId, phaseId, updates) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          phases: p.phases.map(ph => ph.id === phaseId ? { ...ph, ...updates } : ph),
        };
      }
      return p;
    }));
  };

  // Delete phase
  const deletePhase = (projectId, phaseId) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          phases: p.phases.filter(ph => ph.id !== phaseId),
        };
      }
      return p;
    }));
  };

  // Add team member
  const addTeamMember = (projectId, member) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          team: [...(p.team || []), { id: Math.random(), ...member }],
        };
      }
      return p;
    }));
  };

  // Update financial data
  const updateFinancials = (projectId, financialData) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          financials: { ...p.financials, ...financialData },
        };
      }
      return p;
    }));
  };

  // Get selected project
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProjectId,
        selectedProject,
        setSelectedProjectId,
        addProject,
        updateProject,
        deleteProject,
        addPhase,
        updatePhase,
        deletePhase,
        addTeamMember,
        updateFinancials,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
