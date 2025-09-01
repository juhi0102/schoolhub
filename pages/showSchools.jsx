// pages/showSchools.jsx
import { useEffect, useState } from "react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch("/api/schools");
        if (!res.ok) throw new Error("Failed to load schools");

        const data = await res.json();
        // API returns { data: rows }
        setSchools(data.data || []);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Schools Directory</h1>
      {schools.length === 0 ? (
        <p>No schools added yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {schools.map((school) => (
            <div
              key={school.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={`/${school.image}`} // ✅ public/schoolImages/myfile.png
                alt={school.name}
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
              />
              <h3>{school.name}</h3>
              <p>{school.address}</p>
              <p>{school.city}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
