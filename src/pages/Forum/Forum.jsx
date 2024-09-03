import { useContext, useEffect, useState } from "react";
import PostBox from "../../components/PostBox/PostBox"
import TypePost from "../../components/TypePost/TypePost"
import { AuthContext } from "../../providers/AuthProvider";
import {server_url} from "../../utils/connection.js";

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if(user){
    fetch(`${server_url}/users`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const matchedUser = data.find(
          (userData) => userData.email === user.email
        );
        console.log(matchedUser);
        if (matchedUser) {
          setUserData(matchedUser);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
    }
  }, [user]);

  useEffect(() => {
    fetch(`${server_url}/posts`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPosts(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="mt-4">
      <TypePost userData={userData} addPost={addPost}/>
      <PostBox posts={posts} userData={userData} setPosts={setPosts}/>
    </div>
  )
}

export default Forum