
  

export const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this post?")) return false;

  try {
    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Failed to delete post");
      return false;
    }

    // don't use alert here
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};



  export const handleEdit = (id,router) => router.push(`/edit-post/${id}`);