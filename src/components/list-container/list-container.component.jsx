import { useState, useEffect, useRef } from 'react';
import './list-container.styles.css';

import { SPECIES_DATA } from '../../resources/species-data';

import ListItem from '../list-item/list-item.component';
import Spinner from '../spinner/spinner.component';
const API_TOKEN = import.meta.env.VITE_IUCN_API_TOKEN;
const ITEMS_PER_PAGE = 10;

const ListContainer = ({ region }) => {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const [conservationMeasures, setConservationMeasures] = useState([]);
  const [finalArray, setFinalArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // 3. Load the list of all species in the selected region — the first page of the results would suffice, no need for pagination
      const data = await fetch(
        `https://apiv3.iucnredlist.org/api/v3/species/region/${region.identifier}/page/0?token=${API_TOKEN}`
      );
      if (!data.ok) throw new Error(`HTTP error! status: ${data.status}`);
      const res = await data.json();

      // 4. Create a model for “Species” and map the results to an array of Species.
      const speciesData = res.result?.map((s) => {
        return {
          id: s.taxonid,
          name: s.main_common_name ? s.main_common_name : s.scientific_name,
          category: s.category,
          family: s.class_name,
          conservationMeasures: '',
        };
      });
      setSpecies(speciesData);
      setLoading(true);
    };
    fetchData();
  }, []);

  // MOCKING DATA
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // 4. Create a model for “Species” and map the results to an array of Species.
  //     const speciesData = SPECIES_DATA.result?.map((s) => {
  //       return {
  //         id: s.taxonid,
  //         name: s.main_common_name ? s.main_common_name : s.scientific_name,
  //         category: s.category,
  //         family: s.class_name,
  //         conservationMeasures: '',
  //       };
  //     });
  //     setSpecies(speciesData);
  //     setLoading(true);
  //   };
  //   fetchData();
  // }, []);

  // 5. Filter the results for Critically Endangered species:
  useEffect(() => {
    const criticallyEndangeredSpecies = species.filter((s) => s.category === 'CR');
    setFilteredSpecies(criticallyEndangeredSpecies);

    // Fetch the conservation measures for all critically endangered species
    const speciesIds = criticallyEndangeredSpecies.map((s) => s.id);

    const measuresPromises = speciesIds?.map((id) => {
      return fetch(
        `https://apiv3.iucnredlist.org/api/v3/measures/species/id/${id}?token=${API_TOKEN}`
      );
    });

    const promiseExecution = async () => {
      await Promise.all(measuresPromises)
        .then((res) =>
          Promise.all(
            res.map((r) => {
              r.json();
            })
          )
        )
        .then((el) => {
          const measures = el.map((e) => e);
          setConservationMeasures(measures);
        });
    };
    promiseExecution();
  }, [species]);

  useEffect(() => {
    const newArray = filteredSpecies.map((el) => {
      conservationMeasures.map((cons) => {
        if (+cons.id === el.id)
          el.conservationMeasures = cons.result?.map((titleEl) => titleEl.title).join(', ');
      });
      return el;
    });
    setFinalArray(newArray);
  }, [conservationMeasures]);

  return (
    <div className='appContainer'>
      <div className='listContainer'>
        {error && <p>{error}</p>}
        {loading ? (
          filteredSpecies?.map((el, i) => (
            <ListItem
              key={i}
              id={el.id}
              name={el.name}
              endangeredClass={el.category}
              family={el.family}
              consMeasures={el.conservationMeasures}
            />
          ))
        ) : (
          <Spinner />
        )}
      </div>
      <button
        className='filter-btn'
        onClick={() => {
          //6. Filter the results (from step 4) for the mammal class
          const mammals = filteredSpecies.filter((el) => el.family === 'MAMMALIA');

          setFilteredSpecies(mammals);
        }}>
        Filter for mammals
      </button>
    </div>
  );
};

export default ListContainer;
