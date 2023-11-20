import React from 'react';
import { useState } from 'react';
import './PartsPage.scss';
import { partsItems } from '../../constants/parts';

const PartsCard = ({ item }) => {
  return (
    <div className="col-md-4 col-lg-3 my-3">
      <div className="card-item-container">
        <img
          src={item.image}
          alt={item.title}
          className="img-fluid"
          style={{ objectFit: 'contain', aspectRatio: '1/1' }}
        ></img>
        <p className="card-item-title p-2 m-0">
          <span className="title-text p-0 m-0" title={item.title}>
            {item.title}
          </span>
        </p>
      </div>
    </div>
  );
};

export const PartsPage = () => {
  const [searchText, setSearchText] = useState('');

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredItems = partsItems.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="container pt-4">
      <h1 className="text-center">Каталог запчастей</h1>
      <p>
        Перечень запчастей представленный в каталоге может быть не полный,
        наличие и цены уточняйте по телефону.
      </p>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Введите название запчасти"
          aria-label="Поиск запчасти"
          aria-describedby="search-icon"
          value={searchText}
          onChange={handleChange}
        ></input>
        <span className="input-group-text" id="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </span>
      </div>
      <div className="row">
        {filteredItems.map((item, index) => (
          <PartsCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};
