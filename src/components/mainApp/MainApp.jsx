"use client";
import { useLocation } from "react-router-dom"; // Import useLocation hook

import React, { useState, useEffect, useRef } from "react";
import { LuCrop, LuMenu } from "react-icons/lu";
import { MdOutlineInvertColors, MdRotate90DegreesCw } from "react-icons/md";
import { TbArrowBackUp, TbArrowForwardUp } from "react-icons/tb";
import { MdCropRotate } from "react-icons/md";
import { IoInvertModeOutline } from "react-icons/io5";
import { IoReload } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { IoMdResize } from "react-icons/io";
import { TbPhotoCheck } from "react-icons/tb";
import { BsTextareaT } from "react-icons/bs";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import WatermarkPanel from "./watermark/WatermarkPanel";
import CropperPanel from "./imageCropper/CropperPanel";
import ImageOperations from "./ImageOperations";
import { FiCheck } from "react-icons/fi";
import Resizerpanel from "../resizer/Resizerpanel";
import Rotate from "../rotate/Rotate";
import Passport from "../passport/Passport"
import InvertPanel from "../invert/InvertPanel"
import { PiFlipHorizontalFill } from "react-icons/pi";
import Flip from "../flip/Flip"
import BlackWhite from "../BlackWhite/BlackWhite"


const MainApp = (props) => {


  
  const { url } = props;
  const location = useLocation(); // Get current location
  const initialCrop = {
    unit: "%",
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };



  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "My App"; // Example: Only runs on client-side
    }
  }, []);
  


  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
          let width = img.width;
          let height = img.height;
  
          // Calculate the new dimensions while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }
  
          canvas.width = width;
          canvas.height = height;
  
          // Draw the resized image on the canvas
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert the canvas to a data URL
          canvas.toBlob((blob) => {
            resolve(blob);
          }, file.type || 'image/jpeg');
        };
      };
  
      reader.readAsDataURL(file);
    });
  };




  const [image, setImage] = useState(null);
  // const [history, setHistory] = useState([]);

  // Use useEffect to log the updated image state
  useEffect(() => {
    // console.log("Updated image state:", image); // ✅ Logs after state updates
  }, [image]); // Dependency array: runs whenever `image` changes



  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Resize the image to a maximum of 2000x2000 pixels
      const resizedImage = await resizeImage(file, 2000, 2000);
  
      const reader = new FileReader();
      reader.onload = () => {
        const newImageUrl = reader.result;
        setImage(newImageUrl);
        setHistory([newImageUrl]);
      };
      reader.readAsDataURL(resizedImage);
    }
  };


 const resetImage = () => {
    setImage(null);
    setHistory([]);
  };









  // const { image, handleImageUpload, resetImage, setImage } = ImageOperations();
  const [crop, setCrop] = useState(initialCrop);
  const [activePanel, setActivePanel] = useState("croper");
  const [completedCrop, setCompletedCrop] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [originalDimentionsPercent, setOriginalDimentionsPercent] = useState({ unit: "%", x: 0, y: 0, width: 0, height: 0 });
  const [aspect, setAspect] = useState(undefined);
  const [history, setHistory] = useState([{
    crop: initialCrop,
    rotation: 0,
    flipX: false,
    flipY: false,
    filter: "none"
  }]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [filter, setFilter] = useState("none");

  const [saveFormat, setSaveFormat] = useState("original");
  const [unit, setUnit] = useState("px")
  const imgRef = useRef(null);

  useEffect(() => {
    setActivePanel(url)
    if (activePanel === "BlackWhite"){
      setFilter("grayscale(100%)");
    }
  }, []);


// --------------------------


useEffect(() => {
  if (isUndoRedo) return;
  
  const newState = {
    crop: completedCrop || crop,
    rotation,
    flipX,
    flipY,
    filter
  };

  const newHistory = [...history.slice(0, currentStep + 1), newState];
  setHistory(newHistory.slice(-50));
  setCurrentStep(newHistory.length - 1);
}, [completedCrop, rotation, flipX, flipY, filter]);



// Update undo/redo handlers to restore all states
const handleUndo = () => {
  if (currentStep > 1) {
    setIsUndoRedo(true);
    const prevStep = currentStep - 1;
    const state = history[prevStep];
    
    setCrop(state.crop);
    setRotation(state.rotation);
    setFlipX(state.flipX);
    setFlipY(state.flipY);
    setFilter(state.filter);
    setCurrentStep(prevStep);
  }
};

const handleRedo = () => {
  if (currentStep < history.length - 1) {
    setIsUndoRedo(true);
    const nextStep = currentStep + 1;
    const state = history[nextStep];
    
    setCrop(state.crop);
    setRotation(state.rotation);
    setFlipX(state.flipX);
    setFlipY(state.flipY);
    setFilter(state.filter);
    setCurrentStep(nextStep);
  }
};

  const handleReset = () => {
    setFlipX(false);
    setFlipY(false);
    setRotation(0);
    setFilter("none");
  };

  const handleDelete = () => {
    setCrop(initialCrop);
    resetImage();
    setOriginalDimensions({ width: 0, height: 0 });
    setAspect(undefined);
  };


  const handleSave = () => {
    if (!image || !completedCrop) {
      alert("Please upload and crop an image first");
      return;
    }

    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    // Limit the canvas size to prevent memory issues
    const maxCanvasSize = 2000;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;
    const ratio = Math.min(maxCanvasSize / cropWidth, maxCanvasSize / cropHeight);

    const canvas = document.createElement("canvas");
    canvas.width = cropWidth * ratio;
    canvas.height = cropHeight * ratio;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Apply filter
    ctx.filter = filter;

    // Draw the image with transformations
    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert to data URL and trigger download
    const link = document.createElement("a");
    link.download = `image.${saveFormat}`;
    link.href = canvas.toDataURL(`image/${saveFormat}`, 0.9); // Adjust quality (0.9 = 90%)
    link.click();
  };


// Update reset handler
// Update reset handler
const handleResetImage = () => {
  setCrop(initialCrop);
  setRotation(0);
  setFlipX(false);
  setFlipY(false);
  setFilter("none");
  setHistory([{
    crop: initialCrop,
    rotation: 0,
    flipX: false,
    flipY: false,
    filter: "none"
  }]);
  setCurrentStep(0);
};

  const controls = [
    { label: "Croper", icon: LuCrop, panel: "croper", path: "/croper" },
    { label: "Resizer", icon: IoMdResize, panel: "resizer", path: "/resizer" },
    { label: "Rotate", icon: MdCropRotate, panel: "rotate", path: "/rotate" },
    { label: "Fliper", icon: PiFlipHorizontalFill, panel: "flip", path: "/flip" },
    { label: "Passport", icon: TbPhotoCheck, panel: "passport", path: "/passport" },
    { label: "Black/White", icon: IoInvertModeOutline, panel: "BlackWhite", path: "/BlackWhite" },
    { label: "Invert", icon: MdOutlineInvertColors, panel: "invert", path: "/invert" },
    { label: "Watermark", icon: BsTextareaT, panel: "watermark", path: "/watermark" },
    { label: "Undo", icon: TbArrowBackUp, action: handleUndo },
    { label: "Redo", icon: TbArrowForwardUp, action: handleRedo },
    { label: "Reset", icon: IoReload, action: handleResetImage },
    { label: "Save", icon: FiSave, action: handleSave },
    { label: "Delete", icon: MdDeleteForever, action: handleDelete },
  ];

  const handleImageLoad = (e) => {
    setCrop({
      unit: "%",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
    setSaveFormat(e.currentTarget.src.split("/")[1].split(";")[0]);
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setOriginalDimensions({ width: naturalWidth, height: naturalHeight });
  };

  const infoHandler = (currentPer, totalPx) => {
    if (!totalPx || !currentPer) return 0;
    const onePercent = totalPx / 100;
    return onePercent * currentPer;
  };


  const handleRotationComplete = (newRotation) => {
    setRotation(newRotation);
  };
  
  const handleFlipComplete = (newFlipX, newFlipY) => {
    setFlipX(newFlipX);
    setFlipY(newFlipY);
  };
  
  const handleFilterComplete = (newFilter) => {
    setFilter(newFilter);
  };


  
  return (
    <div className="p-2">
      <div className="flex gap-1">
        {activePanel === "watermark" && <WatermarkPanel />}

        {activePanel === "invert" && <InvertPanel
          crop={crop}
          filter={filter}
          setCrop={setCrop}
          setFilter={setFilter}
          originalDimensions={originalDimensions}
          onComplete={handleFilterComplete}
        />}

        {activePanel === "BlackWhite" && <BlackWhite
          crop={crop}
          filter={filter}
          setCrop={setCrop}
          setFilter={setFilter}
          originalDimensions={originalDimensions}
          
          onComplete={handleFilterComplete}
        />}




        {activePanel === "rotate" && <Rotate
          rotation={rotation}
          setRotation={setRotation}
          flipX={flipX}
          setFlipX={setFlipX}
          flipY={flipY}
          setFlipY={setFlipY}
          onComplete={handleRotationComplete}
        />}

        {activePanel === "flip" && <Flip
          rotation={rotation}
          setRotation={setRotation}
          flipX={flipX}
          setFlipX={setFlipX}
          flipY={flipY}
          setFlipY={setFlipY}
          onComplete={handleFlipComplete}

        />}
        {activePanel === "resizer" && <Resizerpanel
          unit={unit}
          setUnit={setUnit}
          crop={crop}
          aspect={aspect}
          setCrop={setCrop}
          setAspect={setAspect}
          saveFormat={saveFormat}
          setSaveFormat={setSaveFormat}
          originalDimensions={originalDimensions}
          setOriginalDimensions={setOriginalDimensions}
          originalDimentionsPercent={originalDimentionsPercent}
          setOriginalDimentionsPercent={setOriginalDimentionsPercent}
        />}


        {activePanel === "croper" && (
          <CropperPanel
          crop={crop || initialCrop} // Handle undefined case
            setCrop={setCrop}
            originalDimensions={originalDimensions}
            aspect={aspect}
            setAspect={setAspect}
          />
        )}

        {activePanel === "passport" && <Passport
          crop={crop}
          setCrop={setCrop}
          originalDimensions={originalDimensions}
          setOriginalDimensions={setOriginalDimensions}
        />}


        <div className="flex-1">
          <button onClick={handleSave}>Save</button>
          <div className="p-1 border-2 border-dashed border-gray-500 rounded-lg bg-gray-50">
            <div className="w-full h-[500px] flex justify-center items-center overflow-hidden relative">


              {image ? (
                <ReactCrop
                  crop={crop}
                 
                  onChange={(pxVal, percentVal) => {
                    setCrop(percentVal)
                    setOriginalDimentionsPercent(percentVal)
                   
                  }}
                  onComplete={setCompletedCrop}
                  aspect={aspect}
                >
                  <img
                    alt="Uploaded"
                    ref={imgRef}
                    src={image}
                    onLoad={handleImageLoad}
                    style={{
                      filter: `${filter}`,
                      transform: `rotate(${rotation}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
                      maxWidth: "100%",
                      maxHeight: "500px",
                      objectFit: "contain",
                    }}
                  />
                </ReactCrop>

              ) : (

                <div className="text-center">
                  <label className="cursor-pointer">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Choose an image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="px-4 py-2 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-100">
                      Choose File
                    </div>
                  </label>
                </div>
              )}


            </div>
          </div>

          <div className="flex items-center w-full mt-0">
            <div className="px-10 flex flex-col justify-center  items-start text-zinc-500 w-2/6">
              <p>
                current : {originalDimensions ?
                  `${Math.round(infoHandler(crop.width, originalDimensions.width))} x ${Math.round(infoHandler(crop.height, originalDimensions.height))}` :
                  '0 x 0'
                }
              </p>
              <p>Original : {originalDimensions.width} x {originalDimensions.height} </p>
            </div>
            <div className="flex items-center w-full justify-center">
            {controls.map(({ label, icon: Icon, panel, action }, index) => (
                <div className="group flex flex-col items-center m-2 w-18  cursor-pointer hover:scale-125 transition-transform select-none active:scale-75"
                  key={index}
                  onClick={() => {
                    panel ? setActivePanel(panel) : action?.();
                  }}
                >
                  <span className="text-sm opacity-0 group-hover:opacity-100 ">
                    {label}
                  </span>
                  <Icon size={25} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
