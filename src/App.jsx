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


function App() {

  const [params, setParams] = useState(makeDefaultInputs());
  const [parabola, setParabola] = useState(() => computeParabola(params));
  const [refreshKey, setRefreshKey] = useState(0);
  const [circle, setCircle] = useState(0);

  const handleInit = (inputParams) => {
    console.log('Init parabola with:', inputParams);
    setParams(inputParams);
    setParabola(computeParabola(inputParams));
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  const handleCircleSelection = (selectedCircle) => {
    console.log('Circle selected', selectedCircle);
    setCircle(selectedCircle);
    setParabola(updateCircle(parabola, selectedCircle));
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  const handleCircleUpdate = (updatedCircle) => {
    console.log('Circle updated', updatedCircle);
    setParabola(updateCircle(parabola, updatedCircle));
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  console.log('App returns, with circle ', circle);

  return (
    <ResizableSplitViewHorizontal>
      <Layout.Sidebar width="100%">
        <NavBar>
          <ParabolaInputs
            params={params}
            onInit={handleInit}
          />
          {circle ? <CircleProps circleModel={circle} onUpdate={handleCircleUpdate} /> : null}
        </NavBar>
      </Layout.Sidebar>
      <Layout.MainArea>
        <MainView trigger={refreshKey} >
          <ParabolaRender parabola={parabola} onSelect={handleCircleSelection}/>
        </MainView>
      </Layout.MainArea>
    </ResizableSplitViewHorizontal>
  );
}

export default App;
