import React, { useState, useEffect } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  // All plants from the backend
  const [plants, setPlants] = useState([]);
  // Current text in the search box
  const [search, setSearch] = useState("");

  // Fetch every plant once, when the page first loads
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load plants");
        }
        return response.json();
      })
      .then((data) => {
        const loadedPlants = Array.isArray(data) ? data : [];
        setPlants((currentPlants) => {
          const loadedIds = new Set(loadedPlants.map((plant) => plant.id));
          return [
            ...loadedPlants,
            ...currentPlants.filter((plant) => !loadedIds.has(plant.id)),
          ];
        });
      })
      .catch((error) => {
        console.error("Failed to load plants:", error);
      });
  }, []);

  // Add a newly created plant to state so it renders immediately
  function handleAddPlant(newPlant) {
    setPlants((currentPlants) => [...currentPlants, newPlant]);
  }

  // Show only plants whose name includes the search text
  const plantsToDisplay = plants.filter((plant) =>
    plant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search search={search} onSearchChange={setSearch} />
      <PlantList plants={plantsToDisplay} />
    </main>
  );
}

export default PlantPage;
