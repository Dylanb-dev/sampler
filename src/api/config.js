export const CLIENT_ID =
  process.env.NODE_ENV === 'production'
    ? '19f34a5a747e4fc2808bb6a082a9fa53'
    : '9676bf75d6304a6da92f201566ac377d'

export const REDIRECT_URI =
  process.env.NODE_ENV === 'production'
    ? 'https://d27li4hngmqekl.cloudfront.net'
    : 'http://localhost:3000'

export const AUTH_TYPE = 'Bearer'
