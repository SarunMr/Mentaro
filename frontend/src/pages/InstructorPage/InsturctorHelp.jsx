
import { BookOpen, FilePlus2, CheckCheck, Settings, HelpCircle, FileText, User2, Tag, XCircle } from "lucide-react";

function InstructorHelp() {
  const sections = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-700" />,
      title: "Dashboard",
      steps: [
        "View total instructors, students, courses, and learning stats at a glance.",
        "Quick access to recent courses and platform analytics.",
      ],
    },
    {
      icon: <FilePlus2 className="w-6 h-6 text-green-700" />,
      title: "Add Course",
      steps: [
        "Use the 'Add Course' tab to create new courses.",
        "Fill out: Title, Category, Level, Pricing, Description, Requirements, and Objectives.",
        "Add curriculum by organizing chapters and lessons. You can upload video lessons directly from your device.",
        "Upload extra notes/resources for students.",
        "Submit the course for admin approval."
      ],
    },
    {
      icon: <CheckCheck className="w-6 h-6 text-indigo-700" />,
      title: "Approvals",
      steps: [
        "Admins can view all courses submitted by instructors pending approval.",
        "Click the eye icon to view course details (curriculum, notes, etc).",
        "Approve to make the course live, or decline to remove it from the pending list.",
      ]
    },
    {
      icon: <Settings className="w-6 h-6 text-yellow-600" />,
      title: "Tools (Discount Codes)",
      steps: [
        "Generate discount codes for any course.",
        "Enter code name, discount percentage, and select the course.",
        "All created discounts are listed with time and easy delete options."
      ]
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-gray-700" />,
      title: "Help",
      steps: [
        "Read these guides for each tab.",
        "Contact support if you need more help.",
        "Use this section as a quick reference or troubleshooting starting point."
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-2 sm:px-8">
      <div className="flex items-center gap-3 mb-10">
        <HelpCircle className="w-9 h-9 text-blue-500" />
        <h1 className="text-4xl font-bold text-gray-900">Admin & Instructor Help Center</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <div
            key={section.title}
            className="bg-white border rounded-2xl shadow p-8"
          >
            <div className="flex items-center mb-4 gap-3">
              {section.icon}
              <h2 className="font-semibold text-2xl text-gray-800 tracking-tight">{section.title}</h2>
            </div>
            <ul className="list-disc space-y-3 pl-8 text-gray-700 text-lg">
              {section.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 rounded-2xl border bg-blue-50 text-blue-900 px-7 py-7 shadow flex items-center gap-6">
        <Tag className="w-9 h-9" />
        <div>
          <div className="font-bold text-lg">Need more help?</div>
          <div className="text-lg">Contact your super admin or platform technical support for assistance with any issues not covered in this section.</div>
        </div>
      </div>
    </div>
  );
}

export default InstructorHelp;
