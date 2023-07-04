import { env } from './environment'

const { private_key } = JSON.parse(env.GOOGLE_CREDENTIALS_PRIVATE_KEY)

export const firebaseCredentials = {
    type: env.GOOGLE_CREDENTIALS_TYPE,
    project_id: env.GOOGLE_CREDENTIALS_PROJECT_ID,
    private_key_id: env.GOOGLE_CREDENTIALS_PRIVATE_KEY_ID,
    private_key,
    client_email: env.GOOGLE_CREDENTIALS_CLIENT_EMAIL,
    client_id: env.GOOGLE_CREDENTIALS_CLIENT_ID,
    auth_uri: env.GOOGLE_CREDENTIALS_AUTH_URI,
    token_uri: env.GOOGLE_CREDENTIALS_TOKEN_URL,
    auth_provider_x509_cert_url: env.GOOGLE_CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: env.GOOGLE_CREDENTIALS_CLIENT_X509_CERT_URL,
    universe_domain: env.GOOGLE_CREDENTIALS_UNIVERSE_DOMAIN,
}
