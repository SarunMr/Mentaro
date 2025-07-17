import Course from "../../components/Student/Course";
export default function MyCourse(){
  const isLoading = false
  const myCurrentCourses = [1,2];
  return (
    <div className="max-w-4xl mx-auto my-24 px-4 md:px-0">
      <h1 className="font-bold text-2xl">My Course</h1>
      <div className="my-5">
        {
        isLoading ? (<MyCourseSkelton/>):
            myCurrentCourses.length === 0 ? (<p>You are not enrolled in any course.</p>):
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> 
                {
              [1,2].map((course,index)=><Course key={index}/>)
                }
              </div>
            
        }



      </div>
    </div>
  );
}


const MyCourseSkelton = () =>(
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_,index) =>(
    <div
      key={index} className="bg-gray-300 rounded-lg h-40 animate-pulse"></div>
    ))
    }
  </div>
)
