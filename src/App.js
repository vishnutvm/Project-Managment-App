import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Sidebar from "./Components/SIdebar/Sidebar";
import Headers from "./Components/Header/Headers";
import { ConfigProvider } from "antd";
import Dashboard from "./pages/Dashboard/Dashboard";
import Projects from "./Modules/Project/Projects";
import AddProject from "./Modules/Project/AddProject";
import Forms from "./Components/CommonForm/TaskForms";
import Layouts from "./Layouts/Layouts";
import Tasks from "./Modules/Tasks/Tasks";
import Members from "./Modules/Members/Members";
import SearchBar from "./Components/SearchBar/SearchBar";
import AllProjects from "./Components/TreeComponent/AllProjects";


function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3EC0601A",
        },
        components: {
          Layout: {
            siderBg: "white",
            headerBg: "white",
            bodyBg: "#F0F3F8",
          },
          Menu: {
            itemHoverBg: "#3EC0601A",
            activeBarBorderWidth: 0,
          },
          Button:{
            defaultActiveBg:"#3EC0601A",
            borderColorDisabled:"green",
            defaultActiveBorderColor:"#3EC0601A",
            // defaultBg:"#3EC0601A",
            defaultBorderColor:"green",
            defaultColor:"green"

          },
          Table:{
            rowSelectedBg:"#3EC0601A",
            rowHoverBg:"#F0F3F8",
            rowSelectedHoverBg:"#F0F3F8",
            headerBg:"#F0F3F8"
          },
       
          Card: {
            headerBg: "#3EC0601A",
          },
          Input: {
            paddingBlock: 10,
            activeBorderColor: "green",
            hoverBorderColor: "green",
            paddingBlock:4,
            // paddingInline:14,
            // paddingInlineLG:16,
            paddingInlineSM:11
            
          },
          Form: {
            size: "large",
            // labelHeight:"45",
            labelFontSize: "20",
          },
          DatePicker: {
            activeBorderColor: "green",
            hoverBorderColor: "green",
            cellRangeBorderColor: "green",
            cellHoverWithRangeBg: "green",
            cellActiveWithRangeBg: "green",
            cellHoverBg: "green",
            cellHoverWithRangeBg: "green",
          },
          Tree:{
            colorBgContainer:"#F0F3F8",
            fontSize:18
          }
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <Layouts>
                <Routes>
                  <Route path="/sidebar" element={<Sidebar />} />
                  <Route path="/header" element={<Headers />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects" element={<AllProjects />} />
                  <Route path="/commonform" element={<Forms />} />
                  <Route path="/" element={<AddProject />} />
                  <Route path="/addproject" element={<AddProject />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/search" element={<SearchBar />} />
                  
                </Routes>
              </Layouts>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
