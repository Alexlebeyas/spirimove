import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { MsalProvider } from '@azure/msal-react';
import MSALClientService from '@/services/MSALClientService.ts';
import { AuthenticationResult, EventMessage, EventType } from '@azure/msal-browser';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const pca = MSALClientService.pca;

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = pca.getAllAccounts();
if (accounts.length > 0) {
  pca.setActiveAccount(accounts[0]);
}

pca.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const { account } = payload;
    pca.setActiveAccount(account);
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MsalProvider instance={pca}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <App />
        </LocalizationProvider>
      </MsalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
