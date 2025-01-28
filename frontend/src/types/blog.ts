export interface BlogPost {
  content: string,
  title: string,
  id: string,
  authorId: string,
  publishedDate: string,
  imageUrl: string,
  author?: {
    name: string,
  },
  link?: string
}

export interface BookmarkedPost {
  id: string;
  userId: string;
  postId: string;
  post: {
    content: string,
    title: string,
    id: string,
    authorId: string,
    publishedDate: string,
    imageUrl: string,
    author?: {
      name: string,
    },
  };
}