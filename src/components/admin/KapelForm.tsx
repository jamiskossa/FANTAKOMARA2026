import React, { useState } from "react";

export default function KapelForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [published, setPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("KAPEL ajouté:", {
      title,
      description,
      image,
      startDate,
      endDate,
      published,
    });
    // Ici: connecter à la base de données / API
  };

  return (
    <form
      className="bg-white p-6 rounded shadow-md space-y-4 max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block font-semibold">Titre</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold">Image / Banner URL</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">Date début</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold">Date fin</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publier côté partenaire
        </label>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white p-2 rounded w-full font-bold uppercase tracking-wide hover:bg-indigo-700 transition-colors"
      >
        Enregistrer KAPEL
      </button>
    </form>
  );
}
