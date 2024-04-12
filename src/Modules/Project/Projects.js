import React from 'react'
import Headers from "../../Components/Header/Headers.js"
import Sidebar from "../../Components/SIdebar/Sidebar.js";
import "../Project/Project.css"
import { Layout,Button,Card,Flex } from "antd";
import { useNavigate } from 'react-router-dom';

function Projects() {
    const { Content } = Layout;
    const navigate=useNavigate()
    const projects = [
      { title: "Project 1", description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available" },
      { title: "Project 2", description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available" },
      { title: "Project 3", description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available" },
      { title: "Project 4", description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available" },
      
    ];
    const handleCreate=() => {
      navigate("/addproject")
    }
    
  return (
    <div>
  
  <Flex className="justify-between">
        <h1 className="mt-9 ml-9 font-semibold text-2xl">Project</h1>
        <Button type="primary" className="mt-9 mr-6" onClick={handleCreate}>
          Create  Project
        </Button>
      </Flex>
            <Flex gap={8} className='mt-20 ml-5'>
            {projects.map((project, index) => (
              <Card
                key={index} // It's important to provide a unique key for each mapped item
                title={project.title}
                bordered={false}
                style={{ width: 300, marginBottom: 16 }}
              >
                <p>{project.description}</p>
              </Card>
            ))}
            </Flex>
      
    </div>
  )
}

export default Projects
