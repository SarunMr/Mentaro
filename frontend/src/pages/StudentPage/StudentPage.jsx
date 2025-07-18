import { Outlet } from "react-router-dom";
import StudentNavbar from "../../components/Student/StudentNavbar.jsx";
export default function AdminPage() {
  return (
    <>
      <div className="flex-1">
        <StudentNavbar /> {/* If you have a navbar */}
        <main className="p-6">
          <Outlet /> {/* This renders the nested route components */}
        </main>
      </div>
    </>
  );
}
