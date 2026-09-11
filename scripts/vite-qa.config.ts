// Opt-in LOCAL test configuration. Never used by the production build.
import original from '../vite.config';
import type { ConfigEnv } from 'vite';
export default (env: ConfigEnv) => {
  const config = original(env);
  return { ...config, server: { ...config.server, proxy: {
    '/rest/v1': 'http://127.0.0.1:54321',
    '/auth/v1': 'http://127.0.0.1:54321',
  } } };
};
