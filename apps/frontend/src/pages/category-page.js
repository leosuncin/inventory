import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { useDispatch, useSelector } from 'react-redux';

import CreateCategoryForm from '../components/create-category-form';
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
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  function openModal() {
    setShow(true);
  }

  return (
    <div>
      <h1 className="text-center">Lista de categorías</h1>
      <Button
        variant="primary"
        onClick={openModal}
        block
        size="lg"
        className="my-3"
      >
        Crear categoría
      </Button>
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
      <CreateCategoryForm open={show} onClose={() => setShow(false)} />
    </div>
  );
};

export default CategoryPage;
