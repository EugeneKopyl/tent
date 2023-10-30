import React from 'react';

export const ContactsPage = () => {
  return (
    <div>
      <h1>Контакты:</h1>
      <div
        className="container"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <a
          href="https://yandex.com/maps/org/remont_tentov_i_karkasov/221655374096/?utm_medium=mapframe&utm_source=maps"
          style={{
            color: '#eee',
            fontSize: '12px',
            position: 'absolute',
            top: '0px',
          }}
        >
          Ремонт тентов и каркасов
        </a>
        <a
          href="https://yandex.com/maps/157/minsk/category/autotents_and_canopies/174404984450/?utm_medium=mapframe&utm_source=maps"
          style={{
            color: '#eee',
            fontSize: '12px',
            position: 'absolute',
            top: '14px',
          }}
        >
          Автотенты и пологи в Минске
        </a>
        <a
          href="https://yandex.com/maps/157/minsk/category/frame_and_awning_structures/184107427/?utm_medium=mapframe&utm_source=maps"
          style={{
            color: '#eee',
            fontSize: '12px',
            position: 'absolute',
            top: '28px',
          }}
        >
          Каркасно-тентовые конструкции в Минске
        </a>
        <iframe
          src="https://yandex.com/map-widget/v1/?ll=27.591719%2C53.807769&mode=search&oid=221655374096&ol=biz&sctx=ZAAAAAgBEAAaKAoSCSJTPgRVlztAES%2FgZYaN6EpAEhIJfEYiNIKNvz8Rr8%2Bc9SnHpD8iBgABAgMEBSgKOABA%2B54GSAFqAnVhnQHNzEw9oAEAqAEAvQGt3EWpwgEGkLLC3bkG6gEA8gEA%2BAEAggIK0YLQtdC90YLRi4oCFjE4NDEwNzQyNyQxNzQ0MDQ5ODQ0NTCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=27.591719%2C53.807769&sspn=0.007045%2C0.003167&text=%D1%82%D0%B5%D0%BD%D1%82%D1%8B&z=17.68"
          width="100%"
          height="400"
          frameborder="1"
          allowfullscreen="true"
          title="map"
          style={{ position: 'relative' }}
        ></iframe>
      </div>
    </div>
  );
};
