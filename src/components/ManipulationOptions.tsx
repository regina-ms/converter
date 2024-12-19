import React from 'react'

function ManipulationOptions() {
  return (
    <>
      <div className={`mb-[10px] text-header-200`}>Конвертировать</div>
      <div className={`flex items-center gap-[6px] text-[13px]`}>
        <div>Формат</div>
        <select className={`w-full max-w-[211px] rounded-[4px] border border-[#C9CCD6] px-[9px] py-[6px]`}>
          <option>webp</option>
          <option>jpg</option>
          <option>png</option>
        </select>
      </div>
    </>
  )
}

export default ManipulationOptions
