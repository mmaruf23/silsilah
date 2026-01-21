import { Hono } from 'hono';
import { authRoutes } from './features/auth/auth.handler';
import { userRoutes } from './features/user/user.handler';
import { errorHandler, notFoundHandler } from './features/global/error.handler';
import { personRoute } from './features/person/person.handler';
import { cors } from 'hono/cors';

const app = new Hono()
  .use(
    '/*',
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  )
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
