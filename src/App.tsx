import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './style.css';
import { DropArea } from './DropArea';
import { DragLayer } from './DragLayer';
import { ContextProvider } from './Context';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ContextProvider>
        <DropArea />
        <DragLayer />
      </ContextProvider>
    </DndProvider>
  );
}

export default App;
