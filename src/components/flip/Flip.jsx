import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
import Image from "next/image";
import rotate180 from "../../../public/icons/rotate-180.svg";
import rotate90 from "../../../public/icons/rotate-90.svg";

import React from 'react'

function Flip(props) {
    const {rotation , setRotation, flipX, setFlipX, flipY, setFlipY } = props;


    const rotateImage = (angle) => {
        setRotation((prev) => prev + angle);
    };

    const flipImageX = () => {
        setFlipX((prev) => !prev);
    };

    const flipImageY = () => {
        setFlipY((prev) => !prev);
    };





    return (
        <div className="flex flex-col pr-2  w-1/5">
            <div className="bg-gray-100 w-full p-3 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Rotating Options</h2>

                <div className="flex justify-between my-10">

                    <div className=" bg-slate-300 rounded-lg p-4 px-7 flex justify-center flex-col items-center cursor-pointer" 
                    onClick={flipImageX}
                    >
                        <LuFlipHorizontal2 size={40} />

                        <p>Flip - X</p>
                    </div>

                    <div className=" bg-slate-300 rounded-lg p-4 px-7 flex justify-center flex-col items-center cursor-pointer"
                    onClick={flipImageY}
                    >
                        <LuFlipVertical2 size={40} />
                        <p>Flip - Y</p>
                    </div>
                </div>

                
                <div className="flex justify-between my-10">

                    <div className=" bg-slate-300 rounded-lg p-4 flex justify-center flex-col items-center cursor-pointer" onClick={() => rotateImage(90)}
                    
                    >
                        <Image src={rotate90} alt="Rotate 90°" width={50} height={50}  />

                        <p>Rotate 90°</p>
                    </div>

                    <div className=" bg-slate-300 rounded-lg p-4 flex justify-center flex-col items-center cursor-pointer " onClick={() => rotateImage(180)}
                   
                    >

                        <Image src={rotate180} alt="Rotate 90°" width={50} height={50}  />
                        <p>Rotate 180°</p>
                    </div>

                </div>

                
            </div>
            <div className="bg-blue-100 border border-black h-4/5">Ad-1</div>
        </div>
    )
}

export default Flip