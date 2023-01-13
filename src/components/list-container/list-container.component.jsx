import { useState, useEffect, useRef } from 'react';
import './list-container.styles.css';

import { SPECIES_DATA } from '../../resources/species-data';
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
  const [pageNum, setPageNum] = useState(ITEMS_PER_PAGE);
  const [lastElement, setLastElement] = useState(null);

  // I implemented this observer and its effect below, which act as virtual pagination, so that the DOM is not affected by a huge amount of data and also the fetch of the conservation measures is performed only 10 at a time.

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setPageNum((pageNum) => pageNum + 10);
        }
      },
      { treshold: 1 }
    )
  );

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  // 3. Load the list of all species in the selected region — the first page of the results would suffice, no need for pagination
  useEffect(() => {
    const fetchData = async () => {
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

    const measuresPromises = speciesIds?.slice(0, pageNum).map((id) => {
      return fetch(
        `https://apiv3.iucnredlist.org/api/v3/measures/species/id/${id}?token=${API_TOKEN}`
      );
    });

    Promise.all(measuresPromises)
      .then((res) => {
        return Promise.all(
          res.map((r) => {
            return r.json();
          })
        );
      })
      .then((el) => {
        const measures = el.map((e) => e);
        setConservationMeasures(measures);
      });
  }, [species, pageNum]);

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
        {!loading && <Spinner />}
        {loading &&
          filteredSpecies.slice(0, pageNum)?.map((el, i) => (
            <div className='listItemContainer' key={i} ref={setLastElement}>
              <h2>Name: {el.name}</h2>
              <p>Danger Class: {el.category}</p>
              <p>
                Conservation Measures:{' '}
                {el.conservationMeasures === ''
                  ? 'Sorry, no measures available'
                  : el.conservationMeasures}
              </p>
              <p>Class Family: {el.family}</p>
            </div>
          ))}
      </div>
      <button
        className='filter-btn'
        onClick={() => {
          //6. Filter the results (from step 4) for the mammal class
          const mammals = filteredSpecies.filter((el) => el.family === 'MAMMALIA');
          if (mammals.length === 0) return;
          setFilteredSpecies(mammals);
        }}>
        Filter for mammals
      </button>
    </div>
  );
};

export default ListContainer;
