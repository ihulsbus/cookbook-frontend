export const environment = {
  baseURL: 'http://localhost:4200',
  backend: 'http://localhost:8080',
  cdn: 'https://cbhbe.ams3.cdn.digitaloceanspaces.com',
  production: false,
  auth0: {
    domain: 'cbhbe-dev.eu.auth0.com',
    clientId: 'c7eQwqHQJRjdkX0QXjEav5XP6ILGhuIy',
    redirectUri: window.location.origin,
    audience: 'cbbhbeapi',
  },
};
