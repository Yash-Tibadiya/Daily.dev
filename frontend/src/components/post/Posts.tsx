"use client";
import React, { useEffect, useCallback } from "react";
import PostCard from "./PostCard";
import { useImmer } from "use-immer";

import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { toast } from "react-toastify";
import ShowPost from "./ShowPost";
import { laraEcho } from "@/lib/echo.config";
import { getPosts } from "@/dataFetch/postFetch";

export default function Posts({
  data,
  user,
}: {
  data: APIResponseType<PostApiType>;
  user: CustomUser;
}) {
  const [posts, setPosts] = useImmer<APIResponseType<PostApiType>>(data);

  const refreshPosts = useCallback(async () => {
    try {
      const refreshedPosts = await getPosts(user.token ?? '');
      setPosts(refreshedPosts);
    } catch (error) {
      console.error("Failed to refresh posts:", error);
    }
  }, [user.token, setPosts]);

  useEffect(() => {
    const intervalId = setInterval(refreshPosts, 1000);

    return () => clearInterval(intervalId);
  }, [refreshPosts]);

  useEffect(() => {
    const channel = laraEcho.channel("post-broadcast");

    channel
      .listen("PostBroadCastEvent", (event: any) => {
        console.log("The event is", event?.post);
        const post: PostApiType = event.post;

        // Update posts state immutably
        setPosts((prevPosts) => ({
          ...prevPosts,
          data: [post, ...prevPosts.data],
        }));

        toast.success("New Post added!!");
      })
      .listen("CommentIncrement", (event: any) => {
        setPosts((prevPosts) => {
          const updatedPosts = prevPosts.data.map((item) => {
            if (item.id === event.post_id) {
              return { ...item, comment_count: item.comment_count + 1 };
            }
            return item;
          });

          return {
            ...prevPosts,
            data: updatedPosts,
          };
        });
      });

    // * Comment channel

    return () => {
      laraEcho.leave("post-broadcast");
    };
  }, []);

  const handleLike = useCallback((postId: number) => {
    // Implement like functionality here
    console.log(`Liked post ${postId}`);
  }, []);

  return (
    <div
      className="pt-4 pl-2 grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-32"
      style={{ height: "90vh" }}
    >
      {posts.data.length > 0 ? (
        posts.data.map((item, index) => (
          <ShowPost post={item} key={index}>
            <PostCard 
              post={{ ...item, is_liked: false }} 
              key={index} 
              onLike={handleLike} 
            />
          </ShowPost>
        ))
      ) : (
        <p className="text-center col-span-full">No posts found matching your search.</p>
      )}
    </div>
  );
}
