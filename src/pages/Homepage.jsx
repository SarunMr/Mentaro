import { useState } from 'react';
import MentaroNavbar from "../components/Mentaronavbar.jsx";
import MentaroFooter from "../components/Mentarofooter.jsx";
import MentaroHero from "../components/Mentaroherosection.jsx";


export default function Homepage() {
  return (
    <div>
      <MentaroNavbar />
      <MentaroHero />
      <MentaroFooter />
    </div>
  );      
}

  