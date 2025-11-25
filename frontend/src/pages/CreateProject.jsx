import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [docType, setDocType] = useState("docx");
  const [loadingAI, setLoadingAI] = useState(false);

  // DOCX Sections
  const [sections, setSections] = useState(["Introduction", "Conclusion"]);

  // PPT Slides
  const [slides, setSlides] = useState([
    { title: "Slide 1" },
    { title: "Slide 2" }
  ]);

  const token = localStorage.getItem("token");

  // ----------------------
  // Helpers
  // ----------------------
  const moveUp = (index, list, setter) => {
    if (index === 0) return;
    const updated = [...list];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setter(updated);
  };

  const moveDown = (index, list, setter) => {
    if (index === list.length - 1) return;
    const updated = [...list];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setter(updated);
  };

  const removeItem = (index, list, setter) => {
    setter(list.filter((_, i) => i !== index));
  };

  const addSection = () => {
    setSections([...sections, ""]);
  };

  const addSlide = () => {
    setSlides([...slides, { title: "" }]);
  };

  const updateSection = (index, value) => {
    const updated = [...sections];
    updated[index] = value;
    setSections(updated);
  };

  const updateSlideTitle = (index, value) => {
    const updated = [...slides];
    updated[index].title = value;
    setSlides(updated);
  };

  // ----------------------
  // 🤖 AI Suggest Outline
  // ----------------------
  const aiSuggestOutline = async () => {
    if (!title || !topic) {
      alert("Fill title & topic first");
      return;
    }

    setLoadingAI(true);

    try {
      const res = await API.post("/projects/ai-outline", {
        topic,
        doc_type: docType
      });

      const aiSections = res.data.suggested_outline.sections;

      if (docType === "docx") {
        setSections(aiSections);
      } else {
        setSlides(aiSections.map((t) => ({ title: t })));
      }

    } catch (err) {
      console.error(err);
      alert("AI Outline failed");
    }

    setLoadingAI(false);
  };

  // ----------------------
  // 📦 CREATE PROJECT
  // ----------------------
  const createProject = async () => {
    if (!title || !topic) {
      alert("Please fill Title and Topic");
      return;
    }

    const outline =
      docType === "docx"
        ? sections.filter((s) => s.trim() !== "")
        : slides.map((s) => s.title);

    try {
      const res = await API.post("/projects/create", null, {
        params: {
          title,
          topic,
          doc_type: docType,
          token
        }
      });

      const projectId = res.data.project_id;

      await API.post(
        `/projects/${projectId}/set-outline`,
        { outline },
        { params: { token } }
      );

      alert("✅ Project created");
      navigate(`/project/${projectId}`);

    } catch (err) {
      console.error(err);
      alert("Error creating project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-6">Create New Project</h1>

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          className="w-full p-3 border-2 border-gray-800 rounded text-black bg-white placeholder-gray-500 mb-4"
        />

        {/* TOPIC */}
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Main Topic"
          className="w-full p-3 border-2 border-gray-800 rounded text-black bg-white placeholder-gray-500 mb-4"
        />

        {/* DOC TYPE */}
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full p-3 border-2 border-gray-800 rounded text-black bg-white mb-6"
        >
          <option value="docx">Microsoft Word (.docx)</option>
          <option value="pptx">PowerPoint (.pptx)</option>
        </select>

        {/* AI Button */}
        <button
          onClick={aiSuggestOutline}
          className="w-full bg-purple-600 text-white py-3 rounded-lg mb-6"
        >
          {loadingAI ? "AI thinking..." : "🤖 AI Suggest Outline"}
        </button>

        {/* DOCX Sections */}
        {docType === "docx" && (
          <>
            <h2 className="font-semibold mb-4">Outline Sections</h2>

            {sections.map((s, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <input
                  value={s}
                  onChange={(e) => updateSection(i, e.target.value)}
                  className="flex-1 p-2 border-2 border-gray-800 rounded text-black bg-white"
                />
                <button
                  onClick={() => moveUp(i, sections, setSections)}
                  className="px-3 py-1 bg-black text-white rounded">↑</button>
                <button
                  onClick={() => moveDown(i, sections, setSections)}
                  className="px-3 py-1 bg-black text-white rounded">↓</button>
                <button
                  onClick={() => removeItem(i, sections, setSections)}
                  className="px-3 py-1 bg-red-600 text-white rounded">✕</button>
              </div>
            ))}

            <button
              onClick={addSection}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Section
            </button>
          </>
        )}

        {/* PPT Slides */}
        {docType === "pptx" && (
          <>
            <h2 className="font-semibold mb-4">Slides</h2>

            {slides.map((s, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <input
                  value={s.title}
                  onChange={(e) => updateSlideTitle(i, e.target.value)}
                  className="flex-1 p-2 border-2 border-gray-800 rounded text-black bg-white"
                />
                <button onClick={() => moveUp(i, slides, setSlides)} className="px-3 bg-black text-white rounded">↑</button>
                <button onClick={() => moveDown(i, slides, setSlides)} className="px-3 bg-black text-white rounded">↓</button>
                <button onClick={() => removeItem(i, slides, setSlides)} className="px-3 bg-red-600 text-white rounded">✕</button>
              </div>
            ))}

            <button
              onClick={addSlide}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Slide
            </button>
          </>
        )}

        {/* CREATE BUTTON */}
        <div className="mt-8 text-center">
          <button
            onClick={createProject}
            className="bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-900"
          >
            ✅ Create Project
          </button>
        </div>

      </div>
    </div>
  );
}
