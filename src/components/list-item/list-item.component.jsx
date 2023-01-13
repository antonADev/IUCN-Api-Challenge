import './list-item.styles.css';
const ListItem = ({ name, endangeredClass, consMeasures, family }) => {
  return (
    <div className='listItemContainer'>
      <h2>Name: {name}</h2>
      <p>Danger Class: {endangeredClass}</p>
      <p>
        Conservation Measures: {consMeasures === '' ? 'Sorry, no measures available' : consMeasures}
      </p>
      <p>Class Family: {family}</p>
    </div>
  );
};

export default ListItem;
