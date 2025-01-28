import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt';
import { signinInput,signupInput } from '@basicdev04/common-app';


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

userRouter.use('/user-details', async (c, next) => {
  const jwt = c.req.header('Authorization') || "";
  if (!jwt) {
    c.status(401);
    return c.json({ error: "jwt not found please recheck it" });
  }
  const token = jwt.split(' ')[1];
  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "not verified" });
  }

  if (typeof payload.id !== 'string') {
    c.status(400); // Bad request
    return c.json({ error: "Invalid token payload" });
  }

  c.set('userId', payload.id);
  await next();
});


userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const {success}=signupInput.safeParse(body);
    if(!success)
      {
        return c.json({
          msg:'invalid input'
        },400)
      }
    try {
      const checkUser = await prisma.user.findUnique({
        where: {
          email: body.email
        }
      });
  
      if (checkUser) {
        return c.json({
          error: "User already exists"
        }, 401);
      }
  
      const user = await prisma.user.create({
        data: {
          name:body.name,
          email: body.email,
          password: body.password
        }
      });
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      console.log(jwt);
  
      return c.json({
        msg: "Logged in successfully",
        jwt: jwt
      });
  
    } catch (e) {
      console.error(e);
      return c.json({ error: "Error creating user" }, 403);
    }
  });
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const {success}=signinInput.safeParse(body);
    if(!success)
      {
        return c.json({
          msg:"wrong input"
        },400)
      }
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: body.email
        }
      })
      if (!user) {
  
        return c.json({
          error: "user not found"
        }, 404)
      }
      if (user.password === body.password)
      //jwt here
      {
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({
          msg: "signed in successfully",
          jwt: jwt
        });
      }
      return c.json({
        error: "Wrong password"
      })
  
  
    } catch (e) {
      return c.status(403);
    }
  })

  userRouter.get('/user-details',async(c)=>{

      const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
      }).$extends(withAccelerate());
      const userId=c.get('userId');
      const name=await prisma.user.findMany({
        where:{
          id:userId
        },
        select:{
          id:true,
          name:true,
          email:true
        }
      })
      if(!userId)
      {
        return c.json({msg:'userId not found'},404);
      }
      return c.json({
        name
      })
    })
