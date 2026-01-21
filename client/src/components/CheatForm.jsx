import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function CheatForm() {
  const { user, createCheat, updateCheat, allCategories, allLanguages } =
    useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    notes: "",
    language_id: "",
    category_id: "",
  });

  const onClear = () => {
    setFormData({
      title: "",
      code: "",
      notes: "",
      language_id: "",
      category_id: "",
    });
  };

  useEffect(() => {
    if (id && user?.languages) {
      const allCheats = user.languages.flatMap((lang) => lang.cheats || []);
      const foundCheat = allCheats.find((c) => c.id === parseInt(id));

      if (foundCheat) {
        setFormData({
          title: foundCheat.title || "",
          code: foundCheat.code || "",
          notes: foundCheat.notes || "",
          language_id: foundCheat.language_id || "",
          category_id: foundCheat.category_id || "",
        });
      }
    }
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      code: formData.code,
      notes: formData.notes,
      language_id: parseInt(formData.language_id),
      category_id: parseInt(formData.category_id),
      user_id: user.id,
    };

    const result = id
      ? await updateCheat(id, payload)
      : await createCheat(payload);

    if (!result.success) {
      console.error("Failed:", result.error);
      return;
    }
    onClear();
    navigate("/");
  };

  return (
    <>
      <div className="form-container">
        <button type="button" onClick={() => navigate(-1)}>
          ⬅ Back to Home
        </button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label htmlFor="language_id">Language</label>
          <select
            id="language_id"
            name="language_id"
            value={formData.language_id}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a language
            </option>
            {allLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <label htmlFor="category_id">Category</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a category
            </option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label htmlFor="code">Code</label>
          <textarea
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />

          <label htmlFor="notes">Notes</label>
          <input
            type="text"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <button type="submit">{id ? "Update" : "Create"}</button>
          <button type="button" onClick={onClear}>
            Clear
          </button>
        </form>
      </div>
    </>
  );
}
