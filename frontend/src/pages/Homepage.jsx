
import MentaroNavbar from "./../components/Mentaronavbar.jsx";
import MentaroFooter from "./../components/Mentarofooter.jsx";
import MentaroHero from "./../components/Mentaroherosection.jsx";
import Courses from "../components/Student/Courses.jsx";

export default function Homepage() {
  return (
    <div>
      <MentaroNavbar />
      <MentaroHero />
      <Courses/>
      <MentaroFooter />
    </div>
  );
}
