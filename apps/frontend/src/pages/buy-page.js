import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useDispatch, useSelector } from 'react-redux';

import AddEntryForm from '../components/add-entry-form';
import {
  fetchCategories,
  getCategoriesState,
} from '../store/slices/categories.slice';
import {
  fetchProducts,
  getProductsState,
} from '../store/slices/products.slice';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const quantityFormatter = new Intl.NumberFormat('en-US', {
  useGrouping: true,
  minimumIntegerDigits: 1,
});
export const BuyPage = () => {
  const [details, setDetails] = useState([]);
  const dispatch = useDispatch();
  const { entities: categoriesMap } = useSelector(getCategoriesState);
  const { entities: productsMap } = useSelector(getProductsState);
  const columns = [
    {
      dataField: 'product',
      text: 'Producto',
      formatter: cell => productsMap[cell]?.name || cell,
    },
    {
      dataField: 'category',
      text: 'Categoría',
      formatter: cell => categoriesMap[cell]?.name || cell,
    },
    {
      dataField: 'quantityOrder',
      text: 'Cantidad de unidades',
      formatter: quantityFormatter.format,
    },
    {
      dataField: 'unitCost',
      text: 'Costo Unitario',
      formatter: priceFormatter.format,
    },
  ];

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ page: 1 }));
  }, []);

  function addEntry(entry, isNew) {
    setDetails([...details, { ...entry, id: nanoid() }]);
  }

  return (
    <div>
      <AddEntryForm onAddEntry={addEntry} />
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="id"
        columns={columns}
        data={details}
      />
    </div>
  );
};

export default BuyPage;
