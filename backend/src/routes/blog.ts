import { Hono } from 'hono'
// import { blogRouter } from './routes/blog';

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt';// Replace with your actual JWT verification import
import { createPostInput, updatePostInput } from '@basicdev04/common-app';


export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

blogRouter.use('/*', async (c, next) => {
  const jwt = c.req.header('Authorization') || "";
  if (!jwt) {
    c.status(401);
    return c.json({ error: "JWT not found" });
  }

  const token = jwt.split(' ')[1];
  const secret =  c.env.JWT_SECRET;
  if (!secret) {
    c.status(500);
    return c.json({ error: "JWT_SECRET is not defined" });
  }

  try {
    const payload = await verify(token, secret);
    if (!payload) {
      c.status(401);
      return c.json({ error: "JWT verification failed" });
    }

    if (typeof payload.id !== 'string') {
      c.status(400); // Bad request
      return c.json({ error: "Invalid token payload" });
    }

    c.set('userId', payload.id);
    await next();
  } catch (error) {
    console.error('Error during JWT verification:', error);
    c.status(500);
    return c.json({ error: "Internal server error during JWT verification" });
  }
});


blogRouter.post('/create', async (c) => {
  try {
    const userId = c.get('userId');

    // Initialize PrismaClient
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: c.env?.DATABASE_URL,
        },
      },
    }).$extends(withAccelerate());

    // Parse request body
    const body = await c.req.json();

    // Validate input
    const { success, error } = createPostInput.safeParse(body);
    if (!success) {
      return c.json({ msg: 'Wrong inputs' }, 400);
    }

    // Get current date dynamically
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const publishedDate = `${day} ${months[month]} ${year}`;

    // Create post
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
        publishedDate: publishedDate, 
        imageUrl:body.imageUrl // Set the dynamically calculated date
      },
    });

    // Return success response
    return c.json({
      msg: 'Blog created successfully',
      id: post.id,
    }, 200);
  } catch (error) {
    // Return error response
    console.error('Error during post creation:', error);
    return c.json({
      msg: 'Internal server error',
      error: (error as Error).message,
    }, 500);
  }
});



blogRouter.get('/post/:id', async (c) => {
  const id = c.req.param('id');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({
    where: {
      id
    },
    select: {
      content: true,
      title: true,
      id: true,
      publishedDate:true,
      authorId:true,
      imageUrl:true,
      author: {
        select: {
          name:true
        }
      },
      bookmark:{
        select:{
          id:true,
          userId:true,
          postId:true,
        }
      }
    }
  });

  return c.json(post);
})


blogRouter.get('/myblogs/:id', async (c) => {
  const authorId = c.req.param('id');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.findMany({
    where: {
      authorId
    },
    select: {
      content: true,
      title: true,
      id: true,
      publishedDate:true,
      imageUrl:true,
      author: {
        select: {
          name:true
        }
      }
    }
  });

  return c.json(post);
})

blogRouter.put('/update', async (c) => {
  const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    return c.json({
      msg: "wrong inputs"
    }, 400)
  }
  await prisma.post.update({
    where: {
      id: body.id,
      authorId: userId
    },
    data: {
      title: body.title,
      content: body.content
    }
  });

  return c.text('updated post');
});
blogRouter.get('/bulk', async (c) => {
  try {
    const filter=c.req.query('filter') || "";
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({
      where:{
          title:{
            contains:filter,
            mode:'insensitive'
          }
      },
      select: {
        content: true,
        title: true,
        id: true,
        authorId: true,
        publishedDate: true,
        imageUrl: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    // Return the posts if the query is successful
    return c.json({ success: true, posts });

  } catch (error) {
    // Handle the error gracefully and return an appropriate response
    console.error('Error fetching posts:', error);
    return c.json({ success: false, message: 'Failed to fetch posts.' }, 500);
  }
});


blogRouter.delete('/delete',async(c)=>{
  const prisma= new PrismaClient({
    datasourceUrl:c.env?.DATABASE_URL
  }).$extends(withAccelerate());
  const body=await c.req.json();
  await prisma.post.delete({
    where:{
      id:body.id
    }
  })

  return c.text('post deleted');

})
