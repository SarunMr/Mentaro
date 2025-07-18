import { Outlet } from "react-router-dom";
import InstructorSidebar from "../../components/Instructor/InstructorSidebar";
import InstructorNavbar from "../../components/Instructor/InstructorNavbar";
export default function AdminPage() {
  return (
    <>
      <div className="flex">
        <InstructorSidebar />
        <div className="flex-1 ml-20">
          {" "}
          {/* ml-20 to account for sidebar width */}
          <InstructorNavbar /> {/* If you have a navbar */}
          <main className="p-6">
            <Outlet /> {/* This renders the nested route components */}
          </main>
        </div>
      </div>
    </>
  );
}
