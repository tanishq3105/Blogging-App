import { userRouter } from './routes/user';
import { Hono } from 'hono';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';
import { bookmarkRouter } from './routes/bookmark';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

app.use('*',cors({
  origin:'*',
  allowMethods:['GET','POST','PUT','DELETE'],
  allowHeaders:['Content-Type','Authorization']
}));

app.route('/api/v1/user',userRouter);
app.route('api/v1/blog',blogRouter);
app.route('api/v1/bookmark',bookmarkRouter)

export default app;