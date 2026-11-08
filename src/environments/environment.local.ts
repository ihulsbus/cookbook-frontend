// Used by `ng serve --configuration=local` (see angular.json and
// package.json's "start:local" script) to run this app against the
// backend started by cookbook/docker-compose.yml instead of the real
// production API.
export const environment = {
  baseURL: 'http://localhost:4200',
  // Traefik's entrypoint in docker-compose.yml - routes /api/v2/* to
  // each backend service by path (see docker-compose.yml's traefik.*
  // labels).
  backend: 'http://localhost',
  // Static app assets (logo, splash backgrounds) - not served by this
  // compose file, so this stays pointed at the real CDN rather than an
  // empty local MinIO bucket.
  cdn: 'https://s3.gourmedy.com/cbhbe',
  production: false,
  oidc: {
    // Authentik runs separately from docker-compose.yml (see
    // cookbook/DOCKER_SETUP.md) - the backend services validate tokens
    // against this same real instance, so the frontend must request
    // them from it too.
    domain: 'https://auth.gourmedy.com/application/o/cookbook-web/',
    clientId: 'cookbook-web',
  },
};
