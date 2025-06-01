import { FaTwitter, FaInstagram, FaFacebookF } from "react-icons/fa";
import mentaroLogo from "./../assets/images/mentarologowhitetext.png"

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
        {/* Logo Section */}
        <div className="mb-10 md:mb-0">
          <div className="flex items-center space-x-2">
        <img
          src={mentaroLogo}
          alt="Menataro Logo"
          className="h-10 w-auto"
        />
          </div>
        </div>

        {/* Link Sections */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
          <div className="space-y-2">
            <p>Web Programming</p>
            <p>Mobile Programming</p>
            <p>Java Beginner</p>
            <p>PHP Beginner</p>
          </div>
          <div className="space-y-2">
            <p>Adobe Illustrator</p>
            <p>Adobe Photoshop</p>
            <p>Design Logo</p>
          </div>
          <div className="space-y-2">
            <p>Writing Course</p>
            <p>Photography</p>
            <p>Video Making</p>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm">
        <p className="text-zinc-400">
          Copyright © Mentaro 2025. All Rights Reserved
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0 text-zinc-400">
          <FaTwitter className="hover:text-white cursor-pointer" />
          <FaInstagram className="hover:text-white cursor-pointer" />
          <FaFacebookF className="hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}