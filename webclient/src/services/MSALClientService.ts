import { PublicClientApplication, InteractionRequiredAuthError, BrowserCacheLocation } from '@azure/msal-browser';

const { VITE_ACTIVE_DIRECTORY_TENANT_ID, VITE_ACTIVE_DIRECTORY_CLIENT_ID, VITE_ACTIVE_DIRECTORY_REDIRECT_URI } =
  import.meta.env;

const config = {
  auth: {
    clientId: VITE_ACTIVE_DIRECTORY_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${VITE_ACTIVE_DIRECTORY_TENANT_ID}`,
    redirectUri: VITE_ACTIVE_DIRECTORY_REDIRECT_URI,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
};

class MSALClientService {
  pca;

  constructor() {
    this.pca = new PublicClientApplication(config);
  }

  async getAccessToken() {
    try {
      const account = this.pca.getActiveAccount();
      if (!account) {
        throw new Error("No active account found");
      }

      const request = {
        scopes: ['User.Read'],
        account
      };

      const { accessToken } = await this.pca.acquireTokenSilent(request);
      return accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        this.redirectToLogin();
        return null;
      } else {
        console.error(error);
        throw error;
      }
    }
  }

  redirectToLogin(scopes = ['User.Read']) {
    this.pca.loginRedirect({
      scopes: scopes
    });
  }
}

export default new MSALClientService();
