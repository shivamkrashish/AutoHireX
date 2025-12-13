import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500"
    >
      {/* TOP FOOTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-borderColor">

        {/* LOGO + ABOUT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src={assets.logo} alt="logo" className="h-8 md:h-9" />
          <p className="max-w-xs mt-3">
            Premium car rental service with a wide selection of luxury and everyday
            vehicles for all your driving needs.
          </p>

          <div className="flex items-center gap-3 mt-5">
            <img src={assets.facebook_logo} className="w-5 h-5 cursor-pointer" />
            <img src={assets.instagram_logo} className="w-5 h-5 cursor-pointer" />
            <img src={assets.twitter_logo} className="w-5 h-5 cursor-pointer" />
            <img src={assets.gmail_logo} className="w-5 h-5 cursor-pointer" />
          </div>
        </motion.div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">Quick Links</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            <li><a href="#">Home</a></li>
            <li><a href="#">Browse Cars</a></li>
            <li><a href="#">List Your Car</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">Resources</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Insurance</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">Contact</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            <li>1234 Luxury Drive</li>
            <li>San Francisco, CA 94107</li>
            <li>+1 1234 567890</li>
            <li>info@example.com</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between gap-3 py-5"
      >
        <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#">Privacy</a>
          <span>|</span>
          <a href="#">Terms</a>
          <span>|</span>
          <a href="#">Cookies</a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Footer
