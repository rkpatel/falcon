import apolloClientProvider from './apolloClientProvider';
import ssr from './ssrMiddleware';
import helmet from './helmetMiddleware';
import appShell from './appShellMiddleware';
import i18next from './i18nextMiddleware';

/**
 * @typedef {object} RenderAppShell
 * @property {object} config Initial configuration
 * @property {object} webpackAssets webpack assets
 */

/**
 * Configure App Shell rendering middlewares
 * @param {RenderAppShell} params params
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderAppShell({ config, webpackAssets }) {
  const configSchema = {
    defaults: {
      config
    }
  };

  return [apolloClientProvider({ clientStates: { configSchema } }), helmet(), appShell({ webpackAssets })];
}

/**
 * @typedef {object} RenderApp
 * @property {function} App React Component
 * @property {object} config Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 * @property {object} webpackAssets webpack assets
 */

/**
 * Configure App rendering middlewares
 * @param {RenderApp} params params
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderApp({ config, clientApolloSchema, App, webpackAssets }) {
  const { i18n, serverSideRendering } = config;
  const configSchema = { defaults: { config } };

  return [
    apolloClientProvider({
      clientStates: {
        configSchema,
        clientApolloSchema
      }
    }),
    i18next({ ...i18n }),
    serverSideRendering ? ssr({ App }) : helmet(),
    appShell({ webpackAssets })
  ].filter(x => x);
}
