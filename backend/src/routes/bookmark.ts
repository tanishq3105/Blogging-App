import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const bookmarkRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();

bookmarkRouter.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization') || "";
    if (!jwt) {
        c.status(401);
        return c.json({ error: "JWT not found" });
    }

    const token = jwt.split(' ')[1];
    const secret = c.env.JWT_SECRET;
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
bookmarkRouter.post('/create', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const { postId } = await c.req.json();
    const userId = c.get("userId");
    try {

        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: postId,
                },
            },
        });

        if (existingBookmark) {
            return c.json({ message: 'This post is already bookmarked by the user.' }, 400);
        }

        // Save the bookmark if it doesn't already exist
        const bookmark = await prisma.bookmark.create({
            data: {
                userId: userId,
                postId: postId,
            },
        });

        return c.json({ message: 'Post bookmarked successfully!', bookmark }, 200);
    } catch (error) {
        console.error('Error bookmarking the post:', error);
        return c.json({ error: 'Failed to bookmark the post' }, 500);
    }
});

bookmarkRouter.delete('/delete', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const body = await c.req.json();
    await prisma.bookmark.delete({
        where: {
            id: body.id
        }
    })
    return c.json({ success: 'bookmark deleted' }, 200);

})

bookmarkRouter.get('/get', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId: userId
            },
            include: {
                post: {
                    select: {
                        content: true,
                        title: true,
                        id: true,
                        publishedDate: true,
                        authorId: true,
                        imageUrl: true,
                        author: {
                            select: {
                                name: true
                            }
                        }
                    }
                }  // This includes the related post data
            }
        });

        return c.json({
            message: 'Bookmarks retrieved successfully',
            bookmarks
        });
    } catch (error) {
        console.error('Error retrieving bookmarks:', error);
        return c.json({ error: 'Failed to retrieve bookmarks' }, 500);
    }
});
