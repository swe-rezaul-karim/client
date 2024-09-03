import { useState } from "react";
import axios from 'axios';
import {server_url} from "../../utils/connection.js";

const TypePost = ({ userData, addPost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // State to store image preview URL

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Generate a preview URL for the image
        } else {
            setImagePreview(null); // Reset the image preview if no file is selected
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        formData.append('image', image);
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('photo', userData.photo);
        formData.append('role', userData.role);

        try {
            const res = await axios.post(`${server_url}/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            addPost(res.data);

            // Clear the input fields after successful submission
            setContent(''); // Clear the text area content
            setImage(null); // Clear the image file
            setImagePreview(null); // Clear the image preview
            document.getElementById('fileInput').value = ''; // Clear the file input field
        } catch (e) {
            console.error("Error creating post", e);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="card card-compact bg-white w-full md:w-3/4 lg:w-1/2 shadow-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div>
                        <div className="flex items-center">
                            <img
                                className="w-16 md:w-20 h-16 md:h-20 rounded-full object-cover"
                                src={userData.photo}
                                alt={userData.name}
                            />
                            <div className="ml-4 w-full">
                                <textarea
                                    required
                                    onChange={(e) => setContent(e.target.value)}
                                    value={content} // Bind the text area value to the state
                                    placeholder="Share your thoughts..."
                                    className="textarea textarea-bordered w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                ></textarea>
                            </div>
                        </div>

                        {imagePreview && (
                            <div className="mt-4 text-center">
                                <img
                                    src={imagePreview}
                                    alt="Selected"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-4 file-input file-input-bordered w-full"
                        />
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button type="submit" className="btn btn-primary w-full md:w-1/2 lg:w-1/3 hover:bg-primary-focus">
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TypePost;
