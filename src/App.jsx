/* FM: React Application "root" */

import { useState } from 'react';
import { NavBar } from './views/structural/NavBar';
import { MainView } from './views/structural/MainView';
import { ResizableSplitViewHorizontal } from './views/primitives/ResizableSplitViewHorizontal';
import { Layout } from './views/primitives/Layout';
import { ParabolaInputs } from './views/domain/ParabolaInputs.jsx';

function App() {
  const [params, setParams] = useState({ a: 1, b: 0, c: 0 });
  const [committedParams, setCommittedParams] = useState({ a: 1, b: 0, c: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInit = (inputParams) => {
    console.log('Init parabola with:', inputParams);
    setCommittedParams(inputParams);
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
        <MainView a={committedParams.a} b={committedParams.b} c={committedParams.c} trigger={refreshKey} />
      </Layout.MainArea>
    </ResizableSplitViewHorizontal>
  );
}

export default App;
