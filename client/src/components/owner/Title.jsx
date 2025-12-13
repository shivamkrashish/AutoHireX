import React from 'react'

const Title = ({ title, subTitle, align = "left" }) => {
  return (
    <div className={`w-full ${align === "center" ? "text-center" : "text-left"}`}>
      {/* Title */}
      {title && (
        <h1 className="font-semibold text-2xl md:text-3xl text-gray-800">
          {title}
        </h1>
      )}

      {/* Subtitle */}
      {subTitle && (
        <p className="text-sm md:text-base text-gray-500 mt-2 max-w-xl mx-auto">
          {subTitle}
        </p>
      )}
    </div>
  )
}

export default Title
