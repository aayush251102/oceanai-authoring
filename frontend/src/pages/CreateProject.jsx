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

  // --------------------------------
  // Helpers
  // --------------------------------
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

  // --------------------------------
  // 🤖 AI Suggest Outline (NO PROJECT CREATION)
  // --------------------------------
  const aiSuggestOutline = async () => {
    if (!title || !topic) {
      alert("Please fill Title and Topic first");
      return;
    }

    setLoadingAI(true);

    try {
      const res = await API.post("/projects/ai-outline", {
        topic: topic,
        doc_type: docType
      });

      const aiSections = res.data.suggested_outline.sections;

      if (docType === "docx") {
        setSections(aiSections);
      } else {
        setSlides(aiSections.map((title) => ({ title })));
      }

      alert("✅ AI Outline Loaded");

    } catch (err) {
      console.log(err);
      alert("❌ AI Suggest failed");
    }

    setLoadingAI(false);
  };

  // --------------------------------
  // CREATE PROJECT (ONLY HERE)
  // --------------------------------
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
          token: localStorage.getItem("token")
        },
      });

      const id = res.data.project_id;

      await API.post(`/projects/${id}/set-outline`, {
        outline
      }, {
        params: {
          token: localStorage.getItem("token")
        }
      });

      alert("✅ Project created successfully!");
      navigate(`/project/${id}`);

    } catch (err) {
      console.log("Create error:", err);
      alert("❌ Error creating project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-6">Create New Project</h1>

        {/* TITLE */}
        <label className="block mb-2 font-semibold">Project Title</label>
        <input
          placeholder="Enter project title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 text-black rounded mb-6 placeholder-gray-500"
        />

        {/* TOPIC */}
        <label className="block mb-2 font-semibold">Main Topic</label>
        <input
          placeholder="Enter main topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 text-black rounded mb-6 placeholder-gray-500"
        />

        {/* DOC TYPE */}
        <label className="block mb-2 font-semibold">Document Type</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 text-black rounded mb-6"
        >
          <option value="docx">Microsoft Word (.docx)</option>
          <option value="pptx">PowerPoint (.pptx)</option>
        </select>

        {/* AI BUTTON */}
        <button
          onClick={aiSuggestOutline}
          className="w-full mb-6 bg-purple-600 text-white py-3 rounded-lg text-lg shadow hover:bg-purple-700"
        >
          {loadingAI ? "AI is thinking..." : "🤖 AI Suggest Outline"}
        </button>

        {/* DOCX OUTLINE */}
        {docType === "docx" && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Outline Sections</h2>

            {sections.map((s, i) => (
              <div key={i} className="flex items-center gap-3 mb-4">
                <input
                  value={s}
                  onChange={(e) => updateSection(i, e.target.value)}
                  className="flex-1 p-3 bg-white border border-gray-300 text-black rounded"
                />

                <button onClick={() => moveUp(i, sections, setSections)} className="px-3 py-2 bg-black text-white rounded">↑</button>
                <button onClick={() => moveDown(i, sections, setSections)} className="px-3 py-2 bg-black text-white rounded">↓</button>
                <button onClick={() => removeItem(i, sections, setSections)} className="px-3 py-2 bg-red-600 text-white rounded">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* PPTX SLIDES */}
        {docType === "pptx" && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Slide Titles</h2>

            {slides.map((s, i) => (
              <div key={i} className="mb-4 bg-gray-50 p-4 rounded border">
                <input
                  value={s.title}
                  onChange={(e) => updateSlideTitle(i, e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 text-black rounded mb-3"
                />

                <div className="flex gap-2">
                  <button onClick={() => moveUp(i, slides, setSlides)} className="px-3 py-2 bg-black text-white rounded">↑</button>
                  <button onClick={() => moveDown(i, slides, setSlides)} className="px-3 py-2 bg-black text-white rounded">↓</button>
                  <button onClick={() => removeItem(i, slides, setSlides)} className="px-3 py-2 bg-red-600 text-white rounded">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE BUTTON */}
        <div className="mt-10 text-center">
          <button
            onClick={createProject}
            className="px-6 py-3 bg-black text-white rounded-lg text-lg shadow hover:bg-gray-800"
          >
            ✅ Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
