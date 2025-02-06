import React from 'react';

const CropperPanel = (props) => {

  let currentWidthValue = props.crop.width;
  if (currentWidthValue === 0) {
    currentWidthValue = "";
  }

  let currentHeightValue = props.crop.height;
  if (currentHeightValue === 0) {
    currentHeightValue = "";
  }


  function percentageToPixels(percentage, containerSize) {
    return (percentage / 100) * containerSize;
  }



  // Aspect ratio handler
  const handleAspectRatio = (ratio) => {
    const { width: imgWidth, height: imgHeight } = props.originalDimensions;
    const imgAspectRatio = imgWidth / imgHeight;

    let newWidth = props.crop.width;
    let newHeight = props.crop.height;

    // If ratio is undefined (Custom mode), allow free resizing
    if (ratio === undefined) {
      props.setCrop({
        ...props.crop,
        aspect: undefined, // Reset aspect ratio
      });
      return; // Exit early, no need to enforce aspect ratio
    }

    // Calculate new dimensions based on selected ratio
    const targetAspect = ratio;

    if (targetAspect > imgAspectRatio) {
      // Limit by width
      newWidth = 100;
      newHeight = (100 * imgAspectRatio) / targetAspect;
    } else {
      // Limit by height
      newHeight = 100;
      newWidth = 100 * targetAspect / imgAspectRatio;
    }

    // Ensure values stay within bounds
    newWidth = Math.min(100, Math.max(0, newWidth));
    newHeight = Math.min(100, Math.max(0, newHeight));

    // Calculate maximum possible position
    const maxX = 100 - newWidth;
    const maxY = 100 - newHeight;

    // Adjust position to keep crop within bounds
    const newX = Math.min(props.crop.x, maxX);
    const newY = Math.min(props.crop.y, maxY);

    props.setCrop({
      ...props.crop,
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY,
      aspect: ratio, // Set the aspect ratio
    });
  };


  return (
    <div className="flex flex-col pr-2 w-1/5">
      <div className="bg-gray-100 w-full p-3 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Cropping Options</h2>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Width:</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
              placeholder="Enter width"
              value={Math.round(currentWidthValue) ? Math.round(currentWidthValue) : ""}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (isNaN(value)) {
                  // If the value is not a number, set the width to 0
                  props.setCrop({ ...props.crop, width: 0 });
                  return;
                }

                // Ensure the width is within the bounds of 0 to 100
                let newWidth = Math.min(value, 100);
                newWidth = Math.max(0, newWidth);

                // Calculate the new width in pixels based on the original image dimensions
                const val1 = percentageToPixels(newWidth, props.originalDimensions.width);

                // Calculate the new position of the crop
                const newPosition = props.crop.x + newWidth;

                // If the new position exceeds 100%, adjust the x position to keep the crop within the image
                if (newPosition > 100) {
                  let overflow = newPosition - 100;
                  let newX = props.crop.x - overflow;

                  // Ensure the new x position doesn't go below 0
                  newX = Math.max(0, newX);

                  props.setCrop({ ...props.crop, x: newX, width: newWidth });
                } else {
                  // If the new position is within bounds, just update the width
                  props.setCrop({ ...props.crop, width: newWidth });
                }
              }}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Height:</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
              placeholder="Enter height"
              value={Math.round(currentHeightValue) ? Math.round(currentHeightValue) : ""}

              onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (isNaN(value)) {
                  // If the value is not a number, set the width to 0
                  props.setCrop({ ...props.crop, height: 0 });
                  return;
                }

                // Ensure the width is within the bounds of 0 to 100
                let newHeight = Math.min(value, 100);
                newHeight = Math.max(0, newHeight);

                // Calculate the new width in pixels based on the original image dimensions
                const val1 = percentageToPixels(newHeight, props.originalDimensions.height);

                // Calculate the new position of the crop
                const newPosition = props.crop.y + newHeight;

                // If the new position exceeds 100%, adjust the x position to keep the crop within the image
                if (newPosition > 100) {
                  let overflow = newPosition - 100;
                  let newY = props.crop.y - overflow;

                  // Ensure the new x position doesn't go below 0
                  newY = Math.max(0, newY);

                  props.setCrop({ ...props.crop, y: newY, height: newHeight });
                } else {
                  // If the new position is within bounds, just update the width
                  props.setCrop({ ...props.crop, height: newHeight });
                }
              }}

            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Crop Option:</label>
        
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
            value={props.crop.aspect || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Convert the selected value to a number (or undefined for custom)
              const ratio = value === "" ? props.setAspect(undefined) : parseFloat(value);
              handleAspectRatio(ratio);
            }}
          >
            <option value="">Custom</option>
            <option value={16 / 9}>16:9</option>
            <option value={4 / 3}>4:3</option>
            <option value={1}>1:1</option>
          </select>
        </div>

        <div className="mb-2">
          <table className="mt-3 w-full">
            <tbody>
              <tr className="flex gap-4">
                <td>
                  <label className="block text-sm font-medium text-gray-700">X - Position</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md outline-none"
                    value={Math.round(props.crop.x)}
                    onChange={(e) => {
                      let newX = parseInt(e.target.value, 10) || 0;

                      // Safely get dimensions and ensure they're numbers
                      const originalWidth = 100;
                      const cropWidth = Number(props.crop?.width) || 0;

                      // Calculate maximum valid X position
                      const maxX = Math.max(0, originalWidth - cropWidth);
                      newX = Math.min(Math.max(newX, 0), maxX);

                      props.setCrop(prev => ({ ...prev, x: newX }));
                    }}
                  />
                </td>
                <td>
                  <label className="block text-sm font-medium text-gray-700">Y - Position</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md outline-none"
                    value={Math.round(props.crop.y)}
                    onChange={(e) => {
                      let newY = parseInt(e.target.value, 10) || 0;
                    
                      // Safely get dimensions and ensure they're numbers
                      const originalHeight = 100;
                      const cropHeight = Number(props.crop?.height) || 0;
                    
                      // Calculate maximum valid Y position
                      const maxY = Math.max(0, originalHeight - cropHeight);
                      newY = Math.min(Math.max(newY, 0), maxY);
                    
                      // Update the y property, not x
                      props.setCrop(prev => ({ ...prev, y: newY }));
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-blue-100 border border-black h-4/5">Ad-1</div>
    </div>
  );
};

export default CropperPanel;
