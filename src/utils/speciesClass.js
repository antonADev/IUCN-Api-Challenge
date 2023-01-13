// export class Species {
//   constructor(id, name, endangeredClass) {
//     this.id = id;
//     this.name = name;
//     this.endangeredClass = endangeredClass;
//   }
// }

export const createSpeciesObject = (data) => {
  return {
    id: data.taxonid,
    className: data.class_name,
    endangeredClass: data.category,
    name: data.scientific_name,
  };
};
