import React, { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchCategories,
  selectAllCategories,
} from '../store/slices/categories.slice';

const columns = [
  {
    dataField: 'name',
    text: 'Nombre',
    sort: true,
    filter: textFilter({ placeholder: 'Buscar por nombre' }),
  },
  {
    dataField: 'color',
    text: 'Color',
    formatter(cell, row, rowIndex, formatExtraData) {
      return (
        <span
          style={{ backgroundColor: cell, display: 'block', padding: '1em' }}
        >
          {cell}
        </span>
      );
    },
  },
];

export const CategoryPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  return (
    <div>
      <h1>Lista de categorías</h1>
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="_id"
        data={categories}
        columns={columns}
        noDataIndication={() => 'No hay categorías'}
        filter={filterFactory()}
      />
    </div>
  );
};

export default CategoryPage;
