import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/header/header.component';
import ListContainer from './components/list-container/list-container.component';

import Spinner from './components/spinner/spinner.component';

// import { REGIONS } from './resources/species-regions';
const API_TOKEN = import.meta.env.VITE_IUCN_API_TOKEN;

export const randomize = (number) => {
  return Math.floor(Math.random() * number);
};
function App() {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // 1. Load the list of the available regions for species
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `https://apiv3.iucnredlist.org/api/v3/region/list?token=${API_TOKEN}`
      );

      if (!data.ok) throw new Error(data.statusText);
      const res = await data.json();

      // 2. Take a random region from the list

      setRegion(res.results[randomize(res.results.length)]);
      setLoading(true);
    };

    fetchData();
  }, []);

  return (
    <div className='App'>
      {error && <p>{error}</p>}
      {loading ? <Header region={region} /> : <Spinner />}
      {region && <ListContainer region={region} />}
    </div>
  );
}

export default App;
