
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const User = sequelize.define(
  "Course",
  {
   courseTitile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subTitle:{
      type:DataTypes.STRING,
    },
    description:{
      type:DataTypes.STRING,
    },
    category:{
      type:DataTypes.STRING,
      required:true
    },
    courseLevel:{
      type:DataTypes.STRING,
      enum:["beginner","Medium","Advance"]
    },
    coursePrice:{
      type:DataTypes.INTEGER,
    },
    courseThumbnail:{
      type:String
    },
    enrolledStudents:[
      type:postgres.Schema.DataTypes.ObjectId,
      ref:"User"
    ],
  lectures:[
      {
        type:postgres.Schema.Datatypes.onjectID,
        ref:"Lecuture"
      }
    ],
    creator:{

    }
  idPublished

);

export default User;
