/* FM: React Application "root" */

import { useState, memo } from 'react';
import { NavBar } from './views/structural/NavBar';
import { MainView } from './views/structural/MainView';
import { ResizableSplitViewHorizontal } from './views/primitives/ResizableSplitViewHorizontal';
import { Layout } from './views/primitives/Layout';
import { ParabolaInputs } from './views/domain/ParabolaInputs.jsx';
import { ParabolaRender } from './views/domain/ParabolaRender.jsx';
import { makeDefaultInputs, makeDefaultCircle, computeParabola } from './models/ParabolaModel.js';
import { CircleProps } from './views/domain/CircleProps.jsx';


function App() {

  const [params, setParams] = useState(makeDefaultInputs());
  const [parabola, setParabola] = useState(() => computeParabola(params));
  const [refreshKey, setRefreshKey] = useState(0);
  const [dummyCircle, setDummyCircle] = useState(() => makeDefaultCircle());

  const handleInit = (inputParams) => {
    console.log('Init parabola with:', inputParams);
    setParabola(computeParabola(inputParams));
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  const MemoizedParabolaRender = memo(ParabolaRender);  

  return (
    <ResizableSplitViewHorizontal>
      <Layout.Sidebar width="100%">
        <NavBar 
          topChild={
            <ParabolaInputs
              params={params}
              setParams={setParams}
              onInit={handleInit}
            />
          }
          bottomChild={<CircleProps 
            circleModel={dummyCircle} 
            setCircleModel={setDummyCircle} 
            onUpdate={() => console.log('done nothing') }
            />
          }>
        </NavBar>
      </Layout.Sidebar>
      <Layout.MainArea>
        <MainView trigger={refreshKey} >
          <MemoizedParabolaRender parabola={parabola} />
        </MainView>
      </Layout.MainArea>
    </ResizableSplitViewHorizontal>
  );
}

export default App;
