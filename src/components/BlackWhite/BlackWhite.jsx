import React, { useState, useEffect } from 'react';

function BlackWhite({ filter, setFilter, crop, setCrop, originalDimensions }) {
    const [unit, setUnit] = useState("px");
    const [dimensionValues, setDimensionValues] = useState({
        px: { width: 0, height: 0 },
        in: { width: 0, height: 0 },
        cm: { width: 0, height: 0 },
        mm: { width: 0, height: 0 },
    });

    // Conversion constants
    const PPI = 72;
    const INCH_TO_CM = 2.54;
    const INCH_TO_MM = 25.4;

    // 1. Apply grayscale filter by default
    useEffect(() => {
        setFilter("grayscale(100%)");
    }, [setFilter]);

    // 2. Initialize dimensions with original image size
    useEffect(() => {
        const updateDimensions = () => {
            const inchWidth = originalDimensions.width / PPI;
            const inchHeight = originalDimensions.height / PPI;

            setDimensionValues({
                px: { 
                    width: originalDimensions.width, 
                    height: originalDimensions.height 
                },
                in: { 
                    width: inchWidth, 
                    height: inchHeight 
                },
                cm: { 
                    width: inchWidth * INCH_TO_CM, 
                    height: inchHeight * INCH_TO_CM 
                },
                mm: { 
                    width: inchWidth * INCH_TO_MM, 
                    height: inchHeight * INCH_TO_MM 
                },
            });
        };

        if (originalDimensions.width > 0 && originalDimensions.height > 0) {
            updateDimensions();
        }
    }, [originalDimensions]);

    // 3. Handle dimension changes with bounds checking
    const handleDimensionChange = (dimension, value) => {
        if (!/^\d*\.?\d*$/.test(value)) return;
        const numValue = parseFloat(value) || 0;

        let convertedPx, maxPixels;
        const isWidth = dimension === 'width';
        const axis = isWidth ? 'width' : 'height';
        
        // Get maximum allowed pixels for this dimension
        maxPixels = originalDimensions[axis];

        // Convert input value to pixels based on unit
        switch(unit) {
            case "px":
                convertedPx = Math.min(numValue, maxPixels);
                break;
            case "in":
                convertedPx = Math.min(numValue * PPI, maxPixels);
                break;
            case "cm":
                convertedPx = Math.min((numValue / INCH_TO_CM) * PPI, maxPixels);
                break;
            case "mm":
                convertedPx = Math.min((numValue / INCH_TO_MM) * PPI, maxPixels);
                break;
            default:
                convertedPx = 0;
        }

        // Calculate new crop percentage
        const newPercentage = (convertedPx / maxPixels) * 100;
        
        // Calculate maximum allowed position
        const maxPosition = 100 - newPercentage;
        
        // Preserve existing position but clamp to new bounds
        const newPosition = {
            x: Math.min(Math.max(crop.x, 0), maxPosition),
            y: Math.min(Math.max(crop.y, 0), maxPosition)
        };

        // Update crop state
        setCrop({
            ...crop,
            [dimension]: newPercentage,
            ...(isWidth ? { x: newPosition.x } : { y: newPosition.y })
        });

        // Update displayed values
        const newValues = { ...dimensionValues };
        const updateConvertedValues = () => {
            switch(unit) {
                case "px":
                    newValues.px[dimension] = convertedPx;
                    break;
                case "in":
                    newValues.in[dimension] = convertedPx / PPI;
                    break;
                case "cm":
                    newValues.cm[dimension] = (convertedPx / PPI) * INCH_TO_CM;
                    break;
                case "mm":
                    newValues.mm[dimension] = (convertedPx / PPI) * INCH_TO_MM;
                    break;
            }
        };
        updateConvertedValues();
        setDimensionValues(newValues);
    };

    // Helper to get display values
    const getDimensionValue = (dimension) => {
        return Math.round(dimensionValues[unit][dimension]) || '';
    };

    return (
        <div className="flex flex-col pr-2 w-1/5">
            <div className="bg-gray-100 w-full p-3 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Black & White Options</h2>

                {/* Filter Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Filter Options:</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                    >
                        <option value="grayscale(100%)">Black & White</option>
                        <option value="none">None</option>
                        <option value="invert(100%)">Invert</option>
                        <option value="sepia(100%)">Sepia</option>
                        <option value="grayscale(100%) contrast(1000%)">Threshold</option>
                    </select>
                </div>

                {/* Unit Selector */}
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

                {/* Dimension Inputs */}
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Width - {unit}</label>
                        <input
                            type="number"
                            min="0"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                            value={getDimensionValue('width')}
                            onChange={(e) => handleDimensionChange('width', e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Height - {unit}</label>
                        <input
                            type="number"
                            min="0"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
                            value={getDimensionValue('height')}
                            onChange={(e) => handleDimensionChange('height', e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-blue-100 border border-black h-[200px]">Ad-1</div>
        </div>
    );
}

export default BlackWhite;