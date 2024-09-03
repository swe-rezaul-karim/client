import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import Swal from "sweetalert2";
import {server_url} from "../../utils/connection.js";

const PostBox = ({ posts, userData, setPosts }) => {
  const [comments, setComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const handleCommentSubmit = async (postId) => {
    const newComment = {
      content: comments[postId] || "",
      userId: userData._id,
      userName: userData.name,
      userPhoto: userData.photo,
    };

    try {
      await axios.post(
        `${server_url}/posts/${postId}/comments`,
        newComment
      );
      setComments({ ...comments, [postId]: "" });
      fetchPosts();
    } catch (e) {
      console.error("Error adding comment", e);
    }
  };

  const fetchPosts = () => {
    fetch(`${server_url}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${server_url}/posts/${postId}/likes`, {
        userId: userData._id,
      });
      fetchPosts();
    } catch (e) {
      console.error("Error liking post", e);
    }
  };

  const handleDeletePost = async (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${server_url}/posts/${postId}`);

          setPosts(posts.filter((post) => post._id !== postId));

          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        } catch (e) {
          console.error("Error deleting post", e);
          Swal.fire("Error!", "There was a problem deleting your post.", "error");
        }
      }
    });
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
  };

  const handleSaveEdit = async (postId) => {
    console.log("Attempting to update post with ID:", postId);
    try {
      const response = await axios.put(`${server_url}/posts/${postId}`, {
        content: editedContent,
      });
  
      console.log('Response from server:', response.data); // Log server response
  
      // Check if the response indicates success
      if (response.status === 200) {
        // Update the specific post in the state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, content: editedContent } : post
          )
        );
        // Clear the editing state
        setEditingPostId(null); // This will hide the save button
        setEditedContent("");
  
        Swal.fire("Updated!", "Your post has been updated.", "success");
      } else {
        Swal.fire("Error!", "Unexpected server response.", "error");
      }
    } catch (e) {
      console.error("Error updating post:", e.response?.data || e.message);
    }
  };
  

  const hasUserLiked = (post) => {
    return post.likes && post.likes.includes(userData._id);
  };

  const getImageUrl = (relativePath) => {
    if (!relativePath) {
      return null;
    }
    const formattedPath = relativePath.replace(/\\/g, "/");
    return `${server_url}/${formattedPath}`;
  };

  const toggleCommentExpansion = (postId) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  return (
    <div className="my-4 flex justify-center">
      <div className="w-full md:w-3/4 lg:w-1/2">
        {posts
          .slice()
          .reverse()
          .map((p) => (
            <div
              key={p._id}
              className="card bg-white shadow-lg w-full p-6 mb-6 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <img
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                    src={p.photo}
                    alt="User"
                  />
                  <div className="ml-4">
                    <Link
                      to="/messages"
                      state={{
                        providerName: p.name,
                        providerPhoto: p.photo,
                        providerEmail: p.email,
                      }}
                      className="font-bold text-lg text-gray-800 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {format(new Date(p.createdAt), "PPPppp")}
                    </p>
                    <p className="text-sm text-gray-500">{p.role}</p>
                  </div>
                </div>
                {p.email === userData.email && (
  <div>
    <details className="dropdown">
      <summary className="btn m-1"><BsThreeDots /></summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li>
          <button onClick={() => handleEditPost(p)}>Edit</button>
        </li>
        <li>
          <a onClick={() => handleDeletePost(p._id)}>Delete</a>
        </li>
      </ul>
    </details>
  </div>
)}

              </div>
              {editingPostId === p._id ? (
                <div className="mt-4">
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleSaveEdit(p._id)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-base md:text-lg text-gray-800">
                    {p.content}
                  </p>
                  {p.imageUrl && (
                    <img
                      className="mt-4 rounded-lg max-w-full h-auto"
                      src={getImageUrl(p.imageUrl)}
                      alt="Post"
                    />
                  )}
                </div>
              )}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(p._id)}
                    className={`text-2xl transition duration-200 ${
                      hasUserLiked(p) ? "text-red-600" : "text-gray-400"
                    } hover:scale-110 flex items-center`}
                  >
                    {hasUserLiked(p) ? <FaHeart /> : <CiHeart />}
                  </button>
                  <span className="text-lg text-gray-700">
                    {p.likes ? p.likes.length : 0}
                  </span>
                </div>

                <div className="text-right">
                  <label
                    onClick={() => toggleCommentExpansion(p._id)}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {expandedComments[p._id]
                      ? "Hide Comments"
                      : "Show Comments"}
                  </label>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <input
                  id={`comment-${p._id}`}
                  type="text"
                  placeholder="Type your comment..."
                  className="input input-bordered w-full"
                  value={comments[p._id] || ""}
                  onChange={(e) =>
                    setComments({ ...comments, [p._id]: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleCommentSubmit(p._id);
                  }}
                />
                <button
                  className="ml-2 btn btn-primary"
                  onClick={() => handleCommentSubmit(p._id)}
                >
                  <FaPaperPlane />
                </button>
              </div>

              {expandedComments[p._id] && (
                <div className="mt-4">
                  {p.comments &&
                    p.comments.map((comment, index) => (
                      <div key={index} className="mb-4 flex items-start">
                        <img
                          className="w-8 h-8 rounded-full object-cover"
                          src={comment.userPhoto}
                          alt="Comment User"
                        />
                        <div className="ml-3">
                          <p className="font-bold">{comment.userName}</p>
                          <p className="text-sm text-gray-700">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostBox;

