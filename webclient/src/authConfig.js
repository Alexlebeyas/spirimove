export const msalConfig = {
    auth: {
        clientId: "4ee21c53-459e-4105-94a9-1107e10da8cc",
        authority: "https://login.microsoftonline.com/0bd1f0c2-5f54-4772-b6de-b820cafef534",
        redirectUri: "http://localhost:3000/"
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};