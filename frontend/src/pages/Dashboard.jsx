// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/projects/all")
      .then((res) => setProjects(res.data))
      .catch((err) => {
        console.log(err);
        alert("Failed to load projects");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Your Projects</h1>
          <button onClick={() => navigate("/create-project")}
            className="px-5 py-2.5 bg-black text-white rounded-xl shadow hover:bg-gray-900 transition">
            + New Project
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div key={p.id} onClick={() => navigate(`/project/${p.id}`)}
                 className="p-6 bg-white rounded-xl shadow hover:shadow-xl cursor-pointer transition border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{p.title}</h2>
              <p className="text-gray-500 mt-2">Type: <b>{p.doc_type.toUpperCase()}</b></p>
              <p className="text-blue-600 mt-4 text-sm hover:underline">View Project →</p>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-12">
            No projects yet. Click <b>+ New Project</b> to start!
          </p>
        )}
      </div>
    </div>
  );
}
