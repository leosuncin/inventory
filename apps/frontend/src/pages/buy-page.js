import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
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
      editable: false,
    },
    {
      dataField: 'category',
      text: 'Categoría',
      formatter: cell => categoriesMap[cell]?.name || cell,
      editable: false,
    },
    {
      dataField: 'quantityOrder',
      text: 'Cantidad de unidades',
      type: 'number',
      formatter: quantityFormatter.format,
      validator(newValue) {
        if (!newValue) {
          return {
            valid: false,
            message: 'La cantidad es requerida',
          };
        }
        if (!Number.isInteger(parseFloat(newValue))) {
          return {
            valid: false,
            message: 'La cantidad debe ser un número entero',
          };
        }
        if (parseInt(newValue) < 0) {
          return {
            valid: false,
            message: 'La cantidad debe ser positiva',
          };
        }

        return true;
      },
    },
    {
      dataField: 'unitCost',
      text: 'Costo Unitario',
      type: 'number',
      formatter: priceFormatter.format,
      validator(newValue) {
        if (!newValue) {
          return {
            valid: false,
            message: 'El costo unitario es requerido',
          };
        }
        if (!Number.isFinite(parseFloat(newValue))) {
          return {
            valid: false,
            message: 'El costo unitario debe ser un número real',
          };
        }
        if (parseFloat(newValue) < 0) {
          return {
            valid: false,
            message: 'El costo unitario debe ser positivo',
          };
        }
        if (!/^\d+(\.\d{0,2})?$/.test(newValue)) {
          return {
            valid: false,
            message:
              'El costo unitario deber ser un número con dos decimales máximo',
          };
        }

        return true;
      },
    },
  ];

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ page: 1 }));
  }, []);

  async function addEntry(entry, isNew) {
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
        cellEdit={cellEditFactory({ mode: 'click' })}
      />
    </div>
  );
};

export default BuyPage;
