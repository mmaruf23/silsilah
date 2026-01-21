import { Hono } from 'hono';
import { authRoutes } from './features/auth/auth.handler';
import { userRoutes } from './features/user/user.handler';
import { errorHandler, notFoundHandler } from './features/global/error.handler';
import { personRoute } from './features/person/person.handler';

const app = new Hono()
  .get('/', (c) => {
    return c.text('Hello');
  })
  .route('/auth', authRoutes)
  .route('/user', userRoutes)
  .route('/person', personRoute)
  .onError(errorHandler)
  .notFound(notFoundHandler);

export default app;

export type AppType = typeof app;
