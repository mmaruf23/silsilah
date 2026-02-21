import { Hono } from 'hono';
import { authRoutes } from './features/auth/auth.handler';
import { userRoutes } from './features/user/user.handler';
import { errorHandler, notFoundHandler } from './features/global/error.handler';
import { personRoute } from './features/person/person.handler';
import { cors } from 'hono/cors';
import { mariageRoute } from './features/mariage/mariage.handler';
import { descendantRoute } from './features/descendant/descendant.handler';
import { env } from 'cloudflare:workers';

const app = new Hono()
  .use(
    '/*',
    cors({
      origin: env.CORS_ORIGINS.split(',').map((s) => s.trim()),
      credentials: true,
    }),
  )
  .get('/', (c) => {
    return c.text('Hello');
  })
  .route('/auth', authRoutes)
  .route('/user', userRoutes)
  .route('/person', personRoute)
  .route('/mariage', mariageRoute)
  .route('/descendant', descendantRoute)
  .onError(errorHandler)
  .notFound(notFoundHandler);

export default app;

export type AppType = typeof app;
