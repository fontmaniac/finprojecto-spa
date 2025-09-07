/* FM: React Application "root" */

import React, { useState, useCallback } from 'react';
import { NavBar } from './views/structural/NavBar';
import { NavRaft } from './views/structural/NavRaft';
import { MainView } from './views/structural/MainView';
import { ResizableSplitViewHorizontal } from './views/primitives/ResizableSplitViewHorizontal';
import { Layout } from './views/primitives/Layout';
import { makeDefaultLoanTerms, computeLoanTerms } from './models/LoanTermsModel.js';
import { LoanTermsProps } from './views/domain/LoanTermsProps.jsx';
import { LoanSimulationPlotlyRender } from './views/domain/LoanSimulationPlotlyRender.jsx';
import { LoanSimulationTabularRender } from './views/domain/LoanSimulationTabularRender.jsx';
import { 
  generateLoanSimulation, 
  updateLoanSimulation,
  extractLoanSimulationOutcome, 
  completeSlice as completeSliceWithTerms,
  toCsv
} from './models/LoanSimulationModel.js';
import { LoanSimulationOutcomeProps } from './views/domain/LoanSimulationOutcomeProps.jsx';
import { LoanSliceProps } from './views/domain/LoanSliceProps.jsx';
import { FiSun, FiMoon, FiBarChart2, FiTable, FiSave } from 'react-icons/fi';

function App() {

  const [refreshKey, setRefreshKey] = useState(0);
  const [loanTerms, setLoanTerms] = useState(makeDefaultLoanTerms());
  const [loanSimulation, setLoanSimulation] = useState(0);
  const [loanSimulationOutcome, setLoanSimulationOutcome] = useState(0);
  const [loanSlice, setLoanSlice] = useState(undefined);

  const [currentView, setCurrentView] = useState('chart');
  const [currentTheme, setCurrentTheme] = useState('light');

  console.log('Default loan terms ', loanTerms);

  const handleCalculate = (committedLoanTerms) => {
    console.log('Calculate pressed', committedLoanTerms);
    const computedLoanTerms = computeLoanTerms(committedLoanTerms);
    console.log('Calculated ', computedLoanTerms);
    setLoanTerms(computedLoanTerms);
    const simulation = generateLoanSimulation(computedLoanTerms); 
    setLoanSimulation(simulation);
    setLoanSimulationOutcome(extractLoanSimulationOutcome(simulation, committedLoanTerms.paymentFreqUnit))
    setLoanSlice(undefined);
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  const handleSliceSelect = useCallback((sliceIndex) => {
    if (sliceIndex < 0 || sliceIndex >= loanSimulation.length) return;
    const slice = loanSimulation[sliceIndex];
    console.log('Captured slice selection w/idx ', sliceIndex, slice);
    setLoanSlice(slice);
  }, [loanSimulation]);

  const completeSlice = (slice) => completeSliceWithTerms(slice, loanTerms);

  const handleSliceUpdate = (sliceIdx, sliceProps) => {
    console.log('Loan Slice ', sliceIdx, ' updated w/props ', sliceProps);
    const originalSlice = loanSimulation[sliceIdx]; 
    const updatedSlice = { ...originalSlice, ...sliceProps };
    const simulation = updateLoanSimulation(loanTerms, loanSimulation, updatedSlice);
    setLoanSimulation(simulation);
    setLoanSimulationOutcome(extractLoanSimulationOutcome(simulation, loanTerms.paymentFreqUnit))
    setLoanSlice(simulation[sliceIdx]);
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  const setTheme = (theme) => {
    console.log('Theme set ->', theme);
    setCurrentTheme(theme);
  };

  const setViewMode = (viewMode) => {
    console.log('View Mode set ->', viewMode);
    setCurrentView(viewMode);
  };

  function downloadCsv() {
    const slices = loanSimulation;
    const csv = toCsv(slices);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'loan_simulation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const navItems = [
    { icon: <FiSave />,       label: 'Save To CSV', isActive: false,                         onClick: () => downloadCsv() },
    { icon: <FiBarChart2 />,  label: 'Chart View',  isActive: currentView === 'chart',       onClick: () => setViewMode('chart') },
    { icon: <FiTable />,      label: 'Table View',  isActive: currentView === 'table',       onClick: () => setViewMode('table') },
    { icon: <FiSun />,        label: 'Light Mode',  isActive: currentTheme === 'light',      onClick: () => setTheme('light') },
    { icon: <FiMoon />,       label: 'Dark Mode',   isActive: currentTheme === 'dark',       onClick: () => setTheme('dark') },
  ];

  const renderMainView = () => (
    <>
      <div style={{ display: currentView === 'chart' ? 'block' : 'none', width: '100%', height: '100%' }}>
        <LoanSimulationPlotlyRender
          slices={loanSimulation}
          selectedSliceIdx={loanSlice?.sliceIndex}
          onSliceSelect={handleSliceSelect}
        />
      </div>
      <div style={{ display: currentView === 'table' ? 'block' : 'none', width: '100%', height: '100%' }}>
        <LoanSimulationTabularRender
          slices={loanSimulation}
          selectedSliceIdx={loanSlice?.sliceIndex}
          onSliceSelect={handleSliceSelect}
        />
      </div>
    </>
  );

  
  return (
    <ResizableSplitViewHorizontal>
      <Layout.Sidebar width="100%">
        <NavBar>
          <LoanTermsProps 
            initialTerms={loanTerms} 
            onCalculate={handleCalculate}/>
          <LoanSimulationOutcomeProps 
            outcome={loanSimulationOutcome} />
          {loanSlice && (
            <LoanSliceProps
              slice={loanSlice}
              onUpdate={handleSliceUpdate}
              onIndexChange={handleSliceSelect}
              completeSlice={completeSlice}
            />
          )}
        </NavBar>
      </Layout.Sidebar>
      <Layout.MainArea>
        <MainView trigger={refreshKey} >
          {renderMainView()}
        </MainView>
        <NavRaft items={navItems} />        
      </Layout.MainArea>
    </ResizableSplitViewHorizontal>
  );
}

export default App;
