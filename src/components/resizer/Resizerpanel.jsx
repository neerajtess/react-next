import React, { useState } from 'react'

function Resizerpanel(props) {
    // const { setUnit, unit } = props
  
    const { saveFormat, setSaveFormat, originalDimentionsPercent,
         setOriginalDimentionsPercent, originalDimensions,
          setOriginalDimensions, crop, setCrop, setAspect, aspect, unit, setUnit } = props;
    // let unit = "%"


    // Convert percentage to the selected unit (px, in, cm)
function percentageToUnit(percentage, originalSize, unit) {
    const pixels = (percentage / 100) * originalSize;
    switch (unit) {
      case "px":
        return Math.round(pixels);
      case "in":
        return (pixels / 73).toFixed(2); // 73 PPI
      case "cm":
        return ((pixels / 73) * 2.54).toFixed(2); // Convert inches to cm
      case "%":
        return Math.round(percentage);
      default:
        return 0;
    }
  }
  
  // Convert unit value (px, in, cm) back to percentage
  function unitToPercentage(value, originalSize, unit) {
    let pixels;
    switch (unit) {
      case "px":
        pixels = value;
        break;
      case "in":
        pixels = value * 73; // 73 PPI
        break;
      case "cm":
        const inches = value / 2.54;
        pixels = inches * 73;
        break;
      default:
        pixels = 0;
    }
    return (pixels / originalSize) * 100;
  }


    function pixelsToPercentage(pixels, containerSize) {
        return (pixels / containerSize) * 100;
    }

    // Convert percentage to pixels
    function percentageToPixels(percentage, containerSize) {
        return (percentage / 100) * containerSize;
    }


    function inchesToPercentage(inches, totalPixels, ppi = 73) {
        // Convert inches to pixels
        
        let pixels = inches * ppi;

        // Convert pixels to percentage of the total size
        let percentage = (pixels / totalPixels) * 100;

        // Round to the nearest whole number
        if (percentage > 100){
            return 100
        }
        return Math.round(percentage);
    }




    function percentageToInches(percentage, totalPixels, ppi = 73) {
        // Validate input
        if (percentage < 0 || percentage > 100) {
            throw new Error("Percentage must be between 0 and 100.");
        }
        if (totalPixels <= 0 || ppi <= 0) {
            throw new Error("totalPixels and ppi must be greater than 0.");
        }

        // Convert percentage to pixels
        let pixels = (percentage / 100) * totalPixels;

        // Convert pixels to inches
        let inches = pixels / ppi;

        // Round to 2 decimal places
        return Math.min(100, inches.toFixed(2));
    }


    const valueManager = () =>{
        if (unit === "px"){

            return Math.round(percentageToPixels(crop.width, originalDimensions.width))
        }
        else if( unit === "in"){
            console.log("before in", crop.width)
            const val = percentageToInches(crop.width, originalDimensions.width)
            console.log("after in", val)
        }
        }
    


        const handlePresetChange = (e) => {
            if (e.target.value === "custom") {
              setAspect(undefined);
              return;
            }
          
            const [width, height] = e.target.value.split("x").map(Number);
            if (!width || !height) return;
          
            // Convert preset dimensions to percentages
            const widthPercentage = (width / originalDimensions.width) * 100;
            const heightPercentage = (height / originalDimensions.height) * 100;
          
            setAspect(widthPercentage / heightPercentage);
            setCrop({ ...crop, width: widthPercentage, height: heightPercentage, x: 0, y: 0 });
          };




    return (
        <div className="flex flex-col pr-2  w-1/5">
            <div className="bg-gray-100 w-full p-3 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Resizing Options</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Unit:</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                        value={unit}
                        onChange={(e) => {setUnit(e.target.value)
                          console.log(unit)
                        }}>

                        <option value="px">Pixels</option>
                        <option value="%">Percent</option>
                        <option value="in">Inches</option>
                        <option value="cm">Centimeters</option>
                    </select>
                </div>

                <div className="flex gap-4 mb-4">
                    {unit === '%' ? (
                        <div className="flex-1 ">
                            <div className='flex items-center justify-between'>
                            <label className="block text-sm font-medium text-gray-700">Size:</label>
                            <p  className="text-gray-700">{Math.round(crop.width)} %</p>
                            </div>
                            <div className="flex  items-center gap-2 mt-1">
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={crop.width}
                                    onChange={(e) => {
                                        const newSize = Math.max(0, parseInt(e.target.value, 10) || 0); 
                                        
                                        // Ensure newSize is >= 0
                                        // console.log("crop value", crop)

                                        // if (newSize+crop.x > 100) {
                                        //     const value = (newSize+crop.x) - 100
                                        //     const newX = crop.x - value
                                        //     setCrop({...crop, x:newX})
                                        //     console.log( "new x", newX)
                                        // }
                                        // console.log("crop original", originalDimensions)
                                        // console.log("crop original %", originalDimentionsPercent)

                                        // const newWidth = (newSize/100)*originalDimensions.width
                                        // const newHeight = (newSize/100)*originalDimensions.height
                                        // console.log("new width", newWidth)
                                        // console.log("new height", newHeight)
                                        setCrop({ ...crop, unit: '%', x: 0, y: 0, width: newSize, height: newSize });

                                    }}

                                    //     if (imgRef.current && naturalDimensions) {
                                    //         const scale = newSize / 100;
                                    //         const newCrop = {
                                    //             ...crop,
                                    //             x: 0,
                                    //             y: 0,
                                    //             width: 100 * scale,
                                    //             height: 100 * scale,
                                    //         };
                                    //         console.log("new crop", newCrop);
                                    //         setCrop(newCrop);
                                    //         console.log("crop", crop);
                                    //         setCompletedCrop(newCrop);
                                    //         console.log("new crop", newCrop)
                                    //         console.log(completedCrop)
                                    //     }
                                    // }}

                                    className="flex-1"
                                />
                                {/* <span className="text-sm">{originalDimentionsPercent}%</span> */}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Width: {unit}</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                                    placeholder="Enter width"
                                    value={percentageToUnit(crop.width, originalDimensions.width, unit)?percentageToUnit(crop.width, originalDimensions.width, unit):""}
                                    onChange={(e) => {
                                        const rawValue = e.target.value;
                                        let newPercentage;
                                        if (unit === "px") {
                                          newPercentage = unitToPercentage(rawValue, originalDimensions.width, "px");
                                        } else if (unit === "in") {
                                          newPercentage = unitToPercentage(rawValue, originalDimensions.width, "in");
                                        } else if (unit === "cm") {
                                          newPercentage = unitToPercentage(rawValue, originalDimensions.width, "cm");
                                        }                                     
                                        newPercentage = Math.min(newPercentage, 100);
                                        setCrop({ ...crop, width: newPercentage, x: 0 });
                                      }}
                                />
                            </div>


                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Height:{unit} </label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                                    placeholder="Enter height"

                                    value={percentageToUnit(crop.height, originalDimensions.height, unit)?percentageToUnit(crop.height, originalDimensions.height, unit): ""}
                                    onChange={(e) => {
                                        const rawValue = e.target.value;
                                        let newPercentage;
                                      
                                        if (unit === "px") {
                                          newPercentage = unitToPercentage(rawValue, originalDimensions.height, "px");
                                        } else if (unit === "in") {
                                          newPercentage = unitToPercentage(rawValue, originalDimensions.height, "in");
                                        } else if (unit === "cm") {
                                          newPercentage = unitToPercentage(rawValue, originalDimensions.height, "cm");
                                        }
                                      
                                        newPercentage = Math.min(newPercentage, 100);
                                        setCrop({ ...crop, height: newPercentage, y: 0 });
                                      }}    
                                />
                            </div>
                        </>
                    )}
                    
                </div>






                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Crop Option:</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                    onChange={handlePresetChange}
                    >
                        <option value={"custom"}>Custom</option>
                        <option value={"336 x 280"}>AD - GDN Size 1</option>
                        <option value={"300 x 250"}>AD - GDN Size 2</option>
                        <option value={"300 x 600"}>AD - GDN Size 3</option>
                        <option value={"250 x 250"}>AD - GDN Size 4</option>
                        <option value={"970 x 90"}>AD - Large Leaderboard</option>
                        <option value={"728 x 90"}>AD - Leaderboard Banner</option>
                        <option value={"120 x 600"}>AD - Skyscraper 120</option>
                        <option value={"970 x 250"}>Billboard Banner</option>
                        <option value={"1200 x 160"}>Etsy Banner</option>
                        <option value={"1200 x 628"}>Facebook Ad / Link</option>
                        <option value={"820 x 312"}>Facebook Cover</option>
                        <option value={"940 x 788"}>Facebook Post</option>
                        <option value={"1080 x 1350"}>Instagram Portrait</option>
                        <option value={"1080 x 1080"}>Instagram Post</option>
                        <option value={"1080 x 1920"}>Instagram Story</option>
                        <option value={"1280 x 720"}>OBS Stream Overlay</option>
                        <option value={"600 x 900"}>Pinterest Pin</option>
                        <option value={"4000 x 4000"}>T-Shirt Design</option>
                        <option value={"1080 x 1920"}>TikTok</option>
                        <option value={"1200 x 380"}>Twitch Banner</option>
                        <option value={"1920 x 1080"}>Twitch Offline Banner</option>
                        <option value={"1280 x 720"}>Twitch Overlay</option>
                        <option value={"320 x 100"}>Twitch Panel</option>
                        <option value={"1500 x 500"}>X (formerly Twitter) Header</option>
                        <option value={"4000 x 4000"}>X (formerly Twitter) Post</option>
                        <option value={"1280 x 720"}>Webcam Frame</option>
                        <option value={"2560 x 1440"}>YouTube Banner</option>
                        <option value={"4000 x 4000"}>YouTube Profile Picture</option>
                        <option value={"1280 x 720"}>YouTube Thumbnail</option>
                    </select>
                </div>



                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Save Image As:</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                    value={saveFormat}
                    onChange={(e) => {
                        if (e.target.value !== saveFormat) {
                            setSaveFormat(e.target.value);
                        }
                    }}
                    >
                        <option value="">Original</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="svg">SVG</option>
                        <option value="gif">GIF</option>
                        <option value="webp">WEBP</option>


                    </select>
                </div>



            </div>
            <div className="bg-blue-100 border border-black h-4/5">Ad-1</div>
        </div>

    )
}

export default Resizerpanel