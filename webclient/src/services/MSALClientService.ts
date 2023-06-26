import { PublicClientApplication } from '@azure/msal-browser';

const { VITE_ACTIVE_DIRECTORY_TENANT_ID, VITE_ACTIVE_DIRECTORY_CLIENT_ID } = import.meta.env;

const config = {
  auth: {
    clientId: VITE_ACTIVE_DIRECTORY_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${VITE_ACTIVE_DIRECTORY_TENANT_ID}`,
    redirectUri: 'http://localhost:3000/',
  },
};

class MSALClientService {
  pca;

  constructor() {
    this.pca = new PublicClientApplication(config);
  }

  async getAccessToken() {
    const account = this.pca.getActiveAccount();
    const request = {
      scopes: ['User.Read'],
      accounts: account,
    };
    const { accessToken } = await this.pca.acquireTokenSilent(request);
    return accessToken;
  }
}

export default new MSALClientService();
