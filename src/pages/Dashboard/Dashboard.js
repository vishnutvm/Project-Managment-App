import React from "react";
import { useSelector } from "react-redux";


function Dashboard() {
  const userDetails = useSelector((state) => state.user.loginUserDetails);
  console.log("userdetilas",userDetails);

  return (
    <div>
     
    </div>
  );
}

export default Dashboard;
