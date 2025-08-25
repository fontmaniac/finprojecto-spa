/* FM: React Application "root" */

import { useState } from 'react';
import { NavBar } from './views/NavBar';
import { MainView } from './views/MainView';
import { ResizableSplitViewHorizontal } from './components/ResizableSplitViewHorizontal';
import { Layout } from './components/Layout';

function App() {
  const [params, setParams] = useState({ a: 1, b: 0, c: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInit = (a, b, c) => {
    console.log('Init parabola with:', { a, b, c });
    setParams({ a, b, c });
    setRefreshKey(prev => prev + 1); // triggers re-render in MainView
  };

  return (
    <ResizableSplitViewHorizontal>
      <Layout.Sidebar width="100%">
        <NavBar onInit={handleInit} />
      </Layout.Sidebar>
      <Layout.Main>
        <MainView a={params.a} b={params.b} c={params.c} trigger={refreshKey} />
      </Layout.Main>
    </ResizableSplitViewHorizontal>
  );
}

export default App;
