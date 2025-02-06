import { useState } from "react";

const ImageOperations = () => {
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        // console.log("image", image)
        setHistory([reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };


  const resetImage = () => {
    setImage(null);
    setHistory([]);
  };
  

  return { image, handleImageUpload, resetImage, setImage };
};

export default ImageOperations;