import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useRef, useState } from 'react';
import { Button, InputGroup, Overlay, Popover, Spinner } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { useDispatch, useSelector } from 'react-redux';

import AddEntryForm from '../components/add-entry-form';
import {
  fetchCategories,
  getCategoriesState,
} from '../store/slices/categories.slice';
import { addEntry } from '../store/slices/inventories.slice';
import {
  fetchProducts,
  getProductsState,
  saveProduct,
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
  const target = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  const [progress, setProgress] = useState(0);
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

  async function addDetail(entry, isNew) {
    if (isNew) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const { payload, type } = await dispatch(
          saveProduct({
            name: entry.product,
            category: entry.category,
          }),
        );
        if (type.endsWith('fulfilled')) {
          setDetails([
            ...details,
            { ...entry, product: payload._id, id: nanoid() },
          ]);
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      setDetails([...details, { ...entry, id: nanoid() }]);
    }
  }
  async function saveEntries() {
    setShowPopover(true);
    for (const d of details) {
      await dispatch(
        addEntry({
          product: d.product,
          category: d.category,
          quantityOrder: parseInt(d.quantityOrder),
          unitCost: parseFloat(d.unitCost),
          type: 'IN',
        }),
      );
      setProgress(count => count + 1);
    }
    setShowPopover(false);
    setDetails([]);
    setProgress(0);
  }

  return (
    <div>
      <AddEntryForm onAddEntry={addDetail} />
      <BootstrapTable
        bootstrap4
        striped
        hover
        keyField="id"
        columns={columns}
        data={details}
        cellEdit={cellEditFactory({ mode: 'click' })}
      />
      <InputGroup>
        <Button ref={target} onClick={saveEntries} disabled={showPopover}>
          Ingresar
        </Button>
        <InputGroup.Append>
          <InputGroup.Text>
            {priceFormatter.format(
              details.reduce(
                (total, detail) =>
                  total +
                  parseInt(detail.quantityOrder) * parseFloat(detail.unitCost),
                0,
              ),
            )}
          </InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
      <Overlay target={target.current} placement="top" show={showPopover}>
        <Popover id="popover-basic">
          <Popover.Title as="h3">
            Ingresando entrada {progress} de {details.length}
          </Popover.Title>
          <Popover.Content>
            <Spinner animation="border" variant="info" role="status">
              <span className="sr-only">Ingresando...</span>
            </Spinner>
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  );
};

export default BuyPage;
