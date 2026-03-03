import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

// react-snap pre-renders pages to static HTML at build time.
// When a pre-rendered page loads, we hydrate instead of creating a new root
// so React attaches to the existing HTML without a flash of empty content.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootElement,
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
