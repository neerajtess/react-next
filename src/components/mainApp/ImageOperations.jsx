import { useState, useEffect } from "react";

const ImageOperations = () => {
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);

  // Use useEffect to log the updated image state
  useEffect(() => {
    // console.log("Updated image state:", image); // ✅ Logs after state updates
  }, [image]); // Dependency array: runs whenever `image` changes

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const newImageUrl = reader.result; // Local variable
        // console.log("reader->", newImageUrl); // ✅ Correct URL

        setImage(newImageUrl); // Update state (async)
        setHistory([newImageUrl]); // Use the local variable

        // console.log("image (local variable)", image); // ✅ Correct URL
      };
      reader.readAsDataURL(file);
    }
  };

  // console.log("image is here",image)

  const resetImage = () => {
    setImage(null);
    setHistory([]);
  };

  return { image, handleImageUpload, resetImage, setImage };
};

export default ImageOperations;