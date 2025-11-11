import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return <h1>Hello World MCP React</h1>;
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');
createRoot(rootEl).render(<App />);
