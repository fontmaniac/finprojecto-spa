/* FM: React Application "root" */

import { useState } from 'react';
import { NavBar } from './views/structural/NavBar';
import { MainView } from './views/structural/MainView';
import { ResizableSplitViewHorizontal } from './views/primitives/ResizableSplitViewHorizontal';
import { Layout } from './views/primitives/Layout';
import { ParabolaInputs } from './views/domain/ParabolaInputs.jsx';
import { ParabolaRender } from './views/domain/ParabolaRender.jsx';
import { makeDefaultInputs, computeParabola, updateCircle } from './models/ParabolaModel.js';
import { CircleProps } from './views/domain/CircleProps.jsx';
import { makeDefaultLoanTerms, computeLoanTerms } from './models/LoanTermsModel.js';
import { LoanTermsProps } from './views/domain/LoanTermsProps.jsx';
import { LoanSimulationPlotlyRender } from './views/domain/LoanSimulationPlotlyRender.jsx';
import { generateLoanSimulation, extractLoanSimulationOutcome } from './models/LoanSimulationModel.js';
import { LoanSimulationOutcomeProps } from './views/domain/LoanSimulationOutcomeProps.jsx';


function App() {

  const [params, setParams] = useState(makeDefaultInputs());
  const [parabola, setParabola] = useState(() => computeParabola(params));
  const [refreshKey, setRefreshKey] = useState(0);
  const [circle, setCircle] = useState(0);
  const [loanTerms, setLoanTerms] = useState(makeDefaultLoanTerms());
  const [loanSimulation, setLoanSimulation] = useState(0);
  const [loanSimulationOutcome, setLoanSimulationOutcome] = useState(0);

  console.log('Default loan terms ', loanTerms);

  const handleInit = (inputParams) => {
    console.log('Init parabola with:', inputParams);
    setParams(inputParams);
    setParabola(computeParabola(inputParams));
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  // const handleCircleSelection = (selectedCircle) => {
  //   console.log('Circle selected', selectedCircle);
  //   setCircle(selectedCircle);
  //   setParabola(updateCircle(parabola, selectedCircle));
  //   setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  // };

  const handleCircleUpdate = (updatedCircle) => {
    console.log('Circle updated', updatedCircle);
    setParabola(updateCircle(parabola, updatedCircle));
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  const handleCalculate = (committedLoanTerms) => {
    console.log('Calculate pressed', committedLoanTerms);
    const computedLoanTerms = computeLoanTerms(committedLoanTerms);
    console.log('Calculated ', computedLoanTerms);
    setLoanTerms(computedLoanTerms);
    const simulation = generateLoanSimulation(computedLoanTerms); 
    setLoanSimulation(simulation);
    setLoanSimulationOutcome(extractLoanSimulationOutcome(simulation, committedLoanTerms.paymentFreqUnit))
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };


  console.log('App returns, with circle ', circle);

  return (
    <ResizableSplitViewHorizontal>
      <Layout.Sidebar width="100%">
        <NavBar>
          <LoanTermsProps 
            initialTerms={loanTerms} 
            onCalculate={handleCalculate}/>
          <LoanSimulationOutcomeProps 
            outcome={loanSimulationOutcome} />
        </NavBar>
      </Layout.Sidebar>
      <Layout.MainArea>
        <MainView trigger={refreshKey} >
          <LoanSimulationPlotlyRender slices={loanSimulation}/>
        </MainView>
      </Layout.MainArea>
    </ResizableSplitViewHorizontal>
  );
}

export default App;
