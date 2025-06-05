import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import CreatePost from "@/components/CreatePost";
import { currentUser } from "@clerk/nextjs/server";
import WhoToFollow from "@/components/WhoToFollow";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";

export default async function Home() {
  const user= await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();
  
  if (!user) {
    return null;
  }

  return ( 
<div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
  <div className="lg:col-span-6">
   {user ? <CreatePost /> : null} 
   <div className="space-y-6">
    { posts.map((post) => (
      <PostCard key={post.id} post={post} getDbUserId={dbUserId} />

    )


   ) }

   </div>


  </div>
  <div className="hidden lg:block lg:col-span-4 sticky top-20">
<WhoToFollow/>
  </div>

</div>

  );
}
