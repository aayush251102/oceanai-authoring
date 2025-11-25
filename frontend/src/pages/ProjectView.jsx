import { useEffect, useState } from "react";
import { API } from "../api/api";
import { useParams } from "react-router-dom";

export default function ProjectView() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [instruction, setInstruction] = useState({});
  const [comments, setComments] = useState({});

  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    try {
      const projRes = await API.get("/projects/all");
      const found = projRes.data.find(p => p.id == id);
      setProject(found);

      const contRes = await API.get(`/content/${id}/get-content?token=${token}`);
      setContent(contRes.data);
    } catch (err) {
      console.log(err);
      alert("Error loading project");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const generateContent = async () => {
    setLoading(true);
    try {
      const res = await API.post(`/content/${id}/generate-content?token=${token}`);
      setContent(res.data.content);
    } catch {
      alert("Error generating content");
    }
    setLoading(false);
  };

  const refineSection = async (section) => {
    try {
      const res = await API.post(
        `/content/${id}/refine-section?token=${token}`,
        {
          section,
          instruction: instruction[section]
        }
      );

      setContent(prev => ({
        ...prev,
        [section]: res.data.new_text
      }));
    } catch {
      alert("Refine failed");
    }
  };

  const sendFeedback = async (section, type) => {
    try {
      await API.post(`/content/${id}/feedback?token=${token}`, {
        section,
        feedback: type
      });
    } catch {
      alert("Error sending feedback");
    }
  };

  const sendComment = async (section) => {
    try {
      await API.post(`/content/${id}/comment?token=${token}`, {
        section,
        comment: comments[section]
      });
      alert("Comment saved");
    } catch {
      alert("Comment error");
    }
  };

  const downloadFile = (type) => {
    window.open(`http://127.0.0.1:8000/content/${id}/export-${type}?token=${token}`);
  };

  if (!project) return <p>Loading project...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-600 mb-6">Type: <b>{project.doc_type}</b></p>

        <div className="flex gap-3 mb-6">
          <button onClick={generateContent} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Generating..." : "Generate Content"}
          </button>

          <button onClick={() => downloadFile("docx")} className="bg-black text-white px-4 py-2 rounded">
            Download DOCX
          </button>

          <button onClick={() => downloadFile("pptx")} className="bg-black text-white px-4 py-2 rounded">
            Download PPT
          </button>
        </div>

        {Object.entries(content).map(([section, text]) => (
          <div key={section} className="border p-6 mb-6 rounded-lg bg-gray-50">

            <h2 className="text-xl font-semibold mb-2">{section}</h2>
            <p className="text-gray-800 mb-4 whitespace-pre-line">{text}</p>

            <input
              type="text"
              placeholder="Refinement instruction..."
              className="w-full p-2 border rounded mb-3 text-black"
              onChange={(e) =>
                setInstruction({ ...instruction, [section]: e.target.value })
              }
            />

            <button
              onClick={() => refineSection(section)}
              className="bg-purple-600 text-white px-4 py-1 rounded mb-4"
            >
              Refine using AI
            </button>

            <div className="flex gap-4 mb-4">
              <button onClick={() => sendFeedback(section, "like")} className="bg-blue-600 text-white px-3 py-1 rounded">
                👍 Like
              </button>
              <button onClick={() => sendFeedback(section, "dislike")} className="bg-red-600 text-white px-3 py-1 rounded">
                👎 Dislike
              </button>
            </div>

            <textarea
              placeholder="Add your comment..."
              className="w-full p-3 border rounded mb-2 text-black"
              rows={2}
              onChange={(e) =>
                setComments({ ...comments, [section]: e.target.value })
              }
            />

            <button
              onClick={() => sendComment(section)}
              className="bg-gray-800 text-white px-4 py-1 rounded"
            >
              Save Comment
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
