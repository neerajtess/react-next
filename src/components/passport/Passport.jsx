import React, { useState, useEffect } from 'react';

function Passport(props) {
    const [unit, setUnit] = useState("px");
    const { crop, setCrop, originalDimensions } = props;

    const [pixelValue, setPixelValue] = useState({ width: 0, height: 0 });
    const [inchValue, setInchValue] = useState({ width: 0, height: 0 });
    const [cmValue, setCmValue] = useState({ width: 0, height: 0 });
    const [mmValue, setMmValue] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const ppi = 72;
        const incheWidth = originalDimensions.width / ppi;
        const incheHeight = originalDimensions.height / ppi;
        setInchValue({ width: incheWidth, height: incheHeight });
        setPixelValue({ width: originalDimensions.width, height: originalDimensions.height });
    }, [originalDimensions]);

    // Function to handle preset size selection
    const handlePresetChange = (e) => {
        const preset = e.target.value;

        // Define preset sizes in inches
        const presetSizes = {
            "2x2 in": { width: 2, height: 2 },
            "3.5x4.5 cm": { width: 3.5 / 2.54, height: 4.5 / 2.54 },
            "5x7 cm": { width: 5 / 2.54, height: 7 / 2.54 },
            "4x6 cm": { width: 4 / 2.54, height: 6 / 2.54 },
            "35x45 mm": { width: 35 / 25.4, height: 45 / 25.4 },
            "50x70 mm": { width: 50 / 25.4, height: 70 / 25.4 },
        };

        const selectedSize = presetSizes[preset] || { width: 0, height: 0 };

        // Convert the selected size to the current unit and update values
        if (unit === "in") {
            setInchValue({ width: selectedSize.width, height: selectedSize.height });
        } else if (unit === "cm") {
            setCmValue({ width: selectedSize.width * 2.54, height: selectedSize.height * 2.54 });
        } else if (unit === "mm") {
            setMmValue({ width: selectedSize.width * 25.4, height: selectedSize.height * 25.4 });
        } else if (unit === "px") {
            const widthPx = Math.min(selectedSize.width * 72, originalDimensions.width);
            const heightPx = Math.min(selectedSize.height * 72, originalDimensions.height);
            setPixelValue({ width: widthPx, height: heightPx });
        }

        // Update crop area
        const widthPercent = (selectedSize.width * 72 / originalDimensions.width) * 100;
        const heightPercent = (selectedSize.height * 72 / originalDimensions.height) * 100;
        setCrop({ 
            ...crop, 
            width: Math.min(widthPercent, 100), 
            height: Math.min(heightPercent, 100), 
            x: 0, 
            y: 0 
        });
    };

    // Function to get the width value based on the selected unit
    const imgValueWidth = (unit) => {
        if (unit === "px") return pixelValue.width || 0;
        if (unit === "in") return inchValue.width || 0;
        if (unit === "cm") return cmValue.width || 0;
        if (unit === "mm") return mmValue.width || 0;
        return 0;
    };

    // Function to get the height value based on the selected unit
    const imgValueHeight = (unit) => {
        if (unit === "px") return pixelValue.height || 0;
        if (unit === "in") return inchValue.height || 0;
        if (unit === "cm") return cmValue.height || 0;
        if (unit === "mm") return mmValue.height || 0;
        return 0;
    };

    const handleDimensionChange = (dimension, value) => {
        if (!/^\d*\.?\d*$/.test(value)) return;
        const numValue = parseFloat(value) || 0;

        let updatedCrop = { ...crop };
        
        switch(unit) {
            case "px":
                const maxPixels = dimension === 'width' ? originalDimensions.width : originalDimensions.height;
                const finalPixelValue = Math.min(maxPixels, numValue);
                const pixelPercent = (finalPixelValue / maxPixels) * 100;
                
                setPixelValue(prev => ({
                    ...prev,
                    [dimension]: finalPixelValue
                }));
                
                updatedCrop = {
                    ...crop,
                    [dimension]: pixelPercent,
                    x: 0,
                    y: 0
                };
                break;

            case "in":
                const totalInches = dimension === 'width' ? 
                    originalDimensions.width / 72 : 
                    originalDimensions.height / 72;
                const finalInchValue = Math.min(totalInches, numValue);
                const inputValPx = finalInchValue * 72;
                const onePercentPx = dimension === 'width' ? 
                    originalDimensions.width / 100 : 
                    originalDimensions.height / 100;
                const inputPerVal = inputValPx / onePercentPx;
                
                setInchValue(prev => ({
                    ...prev,
                    [dimension]: finalInchValue
                }));
                
                updatedCrop = {
                    ...crop,
                    [dimension]: inputPerVal,
                    x: 0,
                    y: 0
                };
                break;

            case "cm":
                const maxCm = (dimension === 'width' ? originalDimensions.width : originalDimensions.height) * 2.54 / 72;
                const finalCmValue = Math.min(maxCm, numValue);
                const cmPercent = (finalCmValue / maxCm) * 100;
                
                setCmValue(prev => ({
                    ...prev,
                    [dimension]: finalCmValue
                }));
                
                updatedCrop = {
                    ...crop,
                    [dimension]: cmPercent,
                    x: 0,
                    y: 0
                };
                break;

            case "mm":
                const maxMm = (dimension === 'width' ? originalDimensions.width : originalDimensions.height) * 25.4 / 72;
                const finalMmValue = Math.min(maxMm, numValue);
                const mmPercent = (finalMmValue / maxMm) * 100;
                
                setMmValue(prev => ({
                    ...prev,
                    [dimension]: finalMmValue
                }));
                
                updatedCrop = {
                    ...crop,
                    [dimension]: mmPercent,
                    x: 0,
                    y: 0
                };
                break;
        }

        setCrop(updatedCrop);
    };

    return (
        <div className="flex flex-col pr-2 w-1/5">
            <div className="bg-gray-100 w-full p-3 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Passport Size Options</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Unit:</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    >
                        <option value="px">Pixels</option>
                        <option value="mm">Millimeters</option>
                        <option value="in">Inches</option>
                        <option value="cm">Centimeters</option>
                    </select>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Width - {unit}</label>
                        <input
                            type="number"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                            value={Math.round(imgValueWidth(unit))?Math.round(imgValueWidth(unit)):""}
                            onChange={(e) => handleDimensionChange('width', e.target.value)}
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Height - {unit}</label>
                        <input
                            type="number"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                            value={Math.round(imgValueHeight(unit))?Math.round(imgValueHeight(unit)):""}
                            onChange={(e) => handleDimensionChange('height', e.target.value)}
                        />
                    </div>
                    
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Passport Photo Sizes:</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                        onChange={handlePresetChange}
                    >
                        <option value="Custom">Custom</option>
                        <option value="2x2 in">2x2 in</option>
                        <option value="3.5x4.5 cm">3.5x4.5 cm</option>
                        <option value="5x7 cm">5x7 cm</option>
                        <option value="4x6 cm">4x6 cm</option>
                        <option value="35x45 mm">35x45 mm</option>
                        <option value="50x70 mm">50x70 mm</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Save Image As:</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
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
    );
}

export default Passport;