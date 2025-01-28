export const getReadTime=(Blog:string)=>{
    const totalWords = Blog.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const time=Math.ceil(totalWords/150);
    return time as number;
}