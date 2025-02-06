"use client";
import { React, useState, useEffect } from "react";
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
  // console.log(url)
  const initialCrop = {
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  };

  const { image, handleImageUpload, resetImage, setImage } = ImageOperations();
  const [crop, setCrop] = useState(initialCrop);
  const [activePanel, setActivePanel] = useState("croper");
  const [completedCrop, setCompletedCrop] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [originalDimentionsPercent, setOriginalDimentionsPercent] = useState({ unit: "%", x: 0, y: 0, width: 0, height: 0 });
  const [aspect, setAspect] = useState(undefined);
  const [history, setHistory] = useState([initialCrop]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [filter, setFilter] = useState("none");

  const [saveFormat, setSaveFormat] = useState("original");
  const [unit, setUnit] = useState("px")


  useEffect(() => {
    setActivePanel(url)
  }, []);


  useEffect(() => {
    if (isUndoRedo) {
      setIsUndoRedo(false);
      return;
    }

    const newHistory = [...history.slice(0, currentStep + 1), crop];
    setHistory(newHistory.slice(-50));
    setCurrentStep(newHistory.length - 1);
  }, [crop]);

  const handleUndo = () => {
    if (currentStep > 0) {
      setIsUndoRedo(true);
      setCurrentStep(prev => prev - 1);
      setCrop(history[currentStep - 1]);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      setIsUndoRedo(true);
      setCurrentStep(prev => prev + 1);
      setCrop(history[currentStep + 1]);
    }
  };

  const handleReset = () => {
    // setIsUndoRedo(true);
    // setCrop(initialCrop);
    // setHistory([initialCrop]);
    // setCurrentStep(0);
  };

  const handleDelete = () => {
    setCrop({ width: 0, height: 0 })
    resetImage();
    setOriginalDimensions({ width: 0, height: 0 });
    handleReset();
    setAspect(undefined);
  };



  const handleSave = () => {
    if (!image || !completedCrop) {
      alert('Please upload and crop an image first');
      return;
    }

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;

    img.onload = () => {
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      // Convert to data URL and trigger download
      const link = document.createElement('a');
      link.download = `image.${saveFormat}`;
      link.href = canvas.toDataURL();
      link.click();
    };
  };



  const handleResetImage = () => {
    if (!image) {
      alert('Please upload an image first');
      return;
    }

    // Reset all states to initial values
    setCrop(initialCrop);
    setAspect(undefined);
    setHistory([initialCrop]);
    setCurrentStep(0);
    setCompletedCrop(null);

    // If you want to force image reload
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setOriginalDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
  };




  const handleApplyCrop = () => {
    if (!image || !completedCrop || !completedCrop.width || !completedCrop.height) {
      alert('Please select a crop area first');
      return;
    }

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;

    img.onload = () => {
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      // Calculate actual pixel coordinates
      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      // Set canvas dimensions to match the crop
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');

      // Draw cropped image onto canvas
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Convert to data URL and update image state
      const croppedImageURL = canvas.toDataURL('image/png');
      setImage(croppedImageURL);

      // Update original dimensions to new cropped size
      setOriginalDimensions({ width: cropWidth, height: cropHeight });

      // Reset crop state
      setCrop(initialCrop);
      setCompletedCrop(null);

      // Reset history for new image
      setHistory([initialCrop]);
      setCurrentStep(0);
    };
  };





  const controls = [
    // { label: "Apply Crop", icon: FiCheck, action: handleApplyCrop },
    { label: "Croper", icon: LuCrop, panel: "croper", path: "/croper" },
    { label: "Resizer", icon: IoMdResize, panel: "resizer", path: "/resizer" },
    { label: "Rotate", icon: MdCropRotate, panel: "rotate", path: "/rotate" },
    { label: "Fliper", icon: PiFlipHorizontalFill, panel: "flip", path: "/flip" },
    { label: "Passport", icon: TbPhotoCheck, panel: "passport", path: "/passport" },
    { label: "Black & White", icon: IoInvertModeOutline, panel: "BlackWhite", path: "/BlackWhite" },
    { label: "Invert", icon: MdOutlineInvertColors, panel: "invert", path: "/invert" },
    { label: "Watermark", icon: BsTextareaT, panel: "watermark", path: "/watermark" },
    { label: "Undo", icon: TbArrowBackUp, action: handleUndo },
    { label: "Redo", icon: TbArrowForwardUp, action: handleRedo },
    { label: "Reset", icon: IoReload, action: handleResetImage },
    { label: "Save", icon: FiSave, action: handleSave },
    { label: "Delete", icon: MdDeleteForever, action: handleDelete },
  ];


  const handleImageLoad = (e) => {
    setSaveFormat(e.currentTarget.src.split('/')[1].split(";")[0])
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setOriginalDimensions({ width: naturalWidth, height: naturalHeight });
  };


  const infoHandler = (currentPer, totalPx) => {
    if (!totalPx || !currentPer) return 0;
    const onePercent = totalPx / 100;
    return onePercent * currentPer;
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
        />}

        {activePanel === "BlackWhite" && <BlackWhite
          crop={crop}
          filter={filter}
          setCrop={setCrop}
          setFilter={setFilter}
          originalDimensions={originalDimensions}
        />}




        {activePanel === "rotate" && <Rotate
          rotation={rotation}
          setRotation={setRotation}
          flipX={flipX}
          setFlipX={setFlipX}
          flipY={flipY}
          setFlipY={setFlipY}
        />}

        {activePanel === "flip" && <Flip
          rotation={rotation}
          setRotation={setRotation}
          flipX={flipX}
          setFlipX={setFlipX}
          flipY={flipY}
          setFlipY={setFlipY}

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
            crop={crop}
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
          <div className="p-1 border-2 border-dashed border-gray-500 rounded-lg bg-gray-50">
            <div className="w-full h-[500px] flex justify-center items-center overflow-hidden relative">


              {image ? (
                <ReactCrop
                  crop={crop}
                  // onChange={setCrop}
                  onChange={(pxVal, percentVal) => {
                    setCrop(percentVal)
                    setOriginalDimentionsPercent(percentVal)
                    console.log(pxVal)
                    console.log(originalDimensions.width, originalDimensions.height)
                  }}
                  onComplete={setCompletedCrop}
                  aspect={aspect}
                >
                  <img
                    alt="Uploaded"
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