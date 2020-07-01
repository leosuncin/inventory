import invertColor from 'invert-color';
import React, { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  numberFilter,
  textFilter,
} from 'react-bootstrap-table2-filter';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCategories } from '../store/slices/categories.slice';
import {
  fetchProducts,
  selectAllProducts,
} from '../store/slices/products.slice';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const quantityFormatter = new Intl.NumberFormat('en-US', {
  useGrouping: true,
  minimumIntegerDigits: 1,
});
export const InventoryPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const columns = [
    {
      dataField: 'name',
      text: 'Nombre',
      sort: true,
      filter: textFilter({ placeholder: 'Buscar por nombre' }),
    },
    {
      dataField: 'quantityStock',
      text: 'Cantidad en existencia',
      filter: numberFilter({ placeholder: 'Filtrar por cantidad' }),
      formatter: (cell, row) => (
        <span
          style={{
            backgroundColor: row.color || 'transparent',
            color: row.color ? 'white' : 'black',
            fontWeight: 'bolder',
            display: 'block',
            padding: '1em',
          }}
        >
          {quantityFormatter.format(cell)}
        </span>
      ),
    },
    {
      dataField: 'averageUnitCost',
      text: 'Costo unitario promedio',
      filter: numberFilter({ placeholder: 'Filtrar por costo' }),
      formatter: cell => priceFormatter.format(Number(cell)),
    },
    {
      dataField: 'currentSalePrice',
      text: 'Precio de venta',
      filter: numberFilter({ placeholder: 'Filtrar por precio' }),
      formatter: cell => priceFormatter.format(Number(cell)),
    },
    {
      dataField: 'category',
      text: 'Category',
      formatter(cell) {
        return (
          <span
            className="badge p-2 text-wrap"
            style={{
              backgroundColor: cell.color,
              color: invertColor(cell.color, true),
              fontSize: '1em',
            }}
          >
            {cell.name}
          </span>
        );
      },
      filter: textFilter({
        placeholder: 'Buscar por categoría',
        onFilter: filter => {
          return products.filter(p =>
            RegExp(String(filter), 'i').test(p.category.name),
          );
        },
      }),
    },
  ];

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  return (
    <div>
      <h1>Lista de productos</h1>
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="_id"
        noDataIndication={() => 'No hay productos'}
        data={products}
        columns={columns}
        filter={filterFactory()}
      />
    </div>
  );
};

export default InventoryPage;
