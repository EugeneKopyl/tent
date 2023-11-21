import React from 'react';
import { useState } from 'react';
import './PartsPage.scss';
import { partsItems } from '../../constants/parts';

const PartsCard = ({ item }) => {
  return (
    <article className="col-6 col-md-4 col-lg-3 my-3">
      <div className="card-item-container">
        <img
          src={item.image}
          alt={item.title}
          className="img-fluid card-img-top"
        />
        <div className="card-body">
          <h3 className="card-item-title p-2 m-0">
            <span className="title-text" title={item.title}>
              {item.title}
            </span>
          </h3>
        </div>
      </div>
    </article>
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
    <main className="container pt-4">
      <header className="text-center">
        <h1>Каталог запчастей</h1>
      </header>
      <section aria-label="Поиск запчастей">
        <p>
          Перечень запчастей представленный в каталоге может быть не полный,
          наличие и цены уточняйте по телефону.
        </p>
        <div className="input-group mb-3">
          <input
            type="search"
            className="form-control"
            placeholder="Введите название запчасти"
            aria-label="Поиск запчасти"
            aria-describedby="search-icon"
            value={searchText}
            onChange={handleChange}
          />
          <span className="input-group-text" id="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </span>
        </div>
      </section>
      <section aria-label="Каталог продукции">
        <div className="row">
          {filteredItems.map((item, index) => (
            <PartsCard key={index} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
};
