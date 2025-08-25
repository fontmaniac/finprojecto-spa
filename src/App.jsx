/* FM: React Application "root" */

import { NavBar } from './views/NavBar';
import { MainView } from './views/MainView';
import { ResizableSplitViewHorizontal } from './components/ResizableSplitViewHorizontal';
import { Layout } from './components/Layout';

function App() {
  const handleInit = (a, b, c) => {
    console.log('Init parabola with:', { a, b, c });
  };

  return (
    <ResizableSplitViewHorizontal>
      <Layout.Sidebar width="100%">
        <NavBar onInit={handleInit} />
      </Layout.Sidebar>
      <Layout.Main>
        <MainView />
      </Layout.Main>
    </ResizableSplitViewHorizontal>
  );
}

export default App;
