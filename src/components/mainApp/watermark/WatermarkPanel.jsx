import React from 'react'

function WatermarkPanel() {
  return (
    
    <div className="flex flex-col pr-2  w-1/5">
    <div className="bg-gray-100 w-full p-3 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Watermark Options</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Text:</label>
        <input type="text" name="watermark-text" id="watermark-text"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none" />
      </div>

      <div className="flex  flex-col mb-4">
        <>
          <label className="block text-sm font-medium text-gray-700">Opacity:</label>
          <input type="range" name="watermark" id="watermark"
            className="mt-0 block w-full p-0 border  rounded-md  cursor-pointer " />
        </>
      </div>


      <div className="mb-4 flex w-full gap-3 items-center">
        <div className='w-1/2'>
          <label className="block text-sm font-medium text-gray-700">Choose color:</label>
          <input type="color" name="" id=""
            className=' w-full block  h-[50px] cursor-pointer  '
          />
        </div>
        <div className='w-1/2'>
          <label className="block text-sm font-medium text-gray-700">Text Size:</label>
          <input type="number" name="font-size" id="font-size"
            className=" w-full block  p-2 mt-1 border border-gray-300 rounded-md outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Font Family:</label>
        <select
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md outline-none"
        // value={saveFormat}
        // onChange={(e) => {
        //   if (e.target.value !== saveFormat) {
        //     setSaveFormat(e.target.value);
        //   }

        // }}
        >

          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>

        </select>
      </div>
    </div>
    <div className="bg-blue-100 border border-black h-[200px] ">Ad-1</div>
  </div>
  
  )
}

export default WatermarkPanel