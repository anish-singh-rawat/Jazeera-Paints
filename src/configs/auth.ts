export default {
  meEndpoint: "/auth/me",
  loginEndpoint: "users/signin",
  registerEndpoint: "/jwt/register",
  storageTokenKeyName: "accessToken",
  onTokenExpiration: "refreshToken", // logout | refreshToken
};
