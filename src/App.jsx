/* FM: React Application "root" */

import { useState } from 'react';
import { NavBar } from './views/structural/NavBar';
import { MainView } from './views/structural/MainView';
import { ResizableSplitViewHorizontal } from './views/primitives/ResizableSplitViewHorizontal';
import { Layout } from './views/primitives/Layout';
import { ParabolaInputs } from './views/domain/ParabolaInputs.jsx';
import { ParabolaRender } from './views/domain/ParabolaRender.jsx';
import { makeDefaultInputs, computeParabola } from './models/ParabolaModel.js';


function App() {

  const [params, setParams] = useState(makeDefaultInputs());
  const [parabola, setParabola] = useState(() => computeParabola(params));
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInit = (inputParams) => {
    console.log('Init parabola with:', inputParams);
    setParabola(computeParabola(inputParams));
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  return (
    <ResizableSplitViewHorizontal>
      <Layout.Sidebar width="100%">
        <NavBar>
          <ParabolaInputs
            params={params}
            setParams={setParams}
            onInit={handleInit}
          />
        </NavBar>
      </Layout.Sidebar>
      <Layout.MainArea>
        <MainView trigger={refreshKey} >
          <ParabolaRender parabola={parabola} />
        </MainView>
      </Layout.MainArea>
    </ResizableSplitViewHorizontal>
  );
}

export default App;
