import React from "react";
import { getServerSession } from "next-auth";
import {
  CustomSession,
  authOptions,
} from "../../api/auth/[...nextauth]/authOptions";
import { getPosts } from "@/dataFetch/postFetch";
import Posts from "@/components/post/Posts";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  const query = searchParams.q;

  const searchResults: APIResponseType<PostApiType> = await getPosts(
    session.user?.token!,
    undefined,
    query
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search Results for: {query}</h1>
      <Posts data={searchResults} user={session.user!} />
    </div>
  );
}
