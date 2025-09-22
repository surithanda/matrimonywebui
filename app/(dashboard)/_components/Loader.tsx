import Lottie from 'lottie-react'
import React from 'react'
import LoaderAnimation from "@/public/lottie/Loading.json"

export default function Loader() {
  return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <Lottie
          loop
          animationData={LoaderAnimation}
          style={{ width: 150, height: 150 }}
        />
      </div>
  )
}
