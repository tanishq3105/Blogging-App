import { string, z } from "zod";

export const  signupInput=z.object({
    email:z.string().email(),
    name:z.string().optional(),
    password:z.string()
})

export type SignupType=z.infer<typeof signupInput>;

export const  signinInput=z.object({
    email:z.string().email(),
    password:z.string()
})

export type SigninType=z.infer<typeof signinInput>;

export const createPostInput=z.object({
    title:string(),
    content:string(),
})

export type CreatePostType=z.infer<typeof createPostInput>;

export const updatePostInput=z.object({
    title:string(),
    content:string()
})

export type UpdatePostType=z.infer<typeof updatePostInput>;

