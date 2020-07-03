/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState } from 'react';
import { Button, Col, Form, InputGroup } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { selectAllCategories } from '../store/slices/categories.slice';
import { selectAllProducts } from '../store/slices/products.slice';

const defaultValues = {
  product: '',
  category: '',
  quantityOrder: 1,
  unitCost: 1,
};
export const AddEntryForm = props => {
  const { handleSubmit, register, setValue, watch, control, reset } = useForm({
    defaultValues,
  });
  const categories = useSelector(selectAllCategories);
  const products = useSelector(selectAllProducts);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedProduct, setSelectedProduct] = useState();

  function handleChange(value, action) {
    switch (action.action) {
      case 'select-option':
        setValue(action.name, value.value);
        if (action.name === 'product') {
          const category = products.find(p => p._id === value.value).category;
          setSelectedProduct(value);
          setValue('category', category._id);
          // @ts-ignore
          setSelectedCategory({ value: category._id, label: category.name });
        }
        if (action.name === 'category' && isNewProduct) {
          setSelectedCategory(value);
        }
        break;

      case 'clear':
        setValue(action.name, null);
        if (action.name === 'product') {
          setSelectedProduct(null);
          if (!isNewProduct) {
            // @ts-ignore
            setSelectedCategory(null);
            setValue('category', null);
          }
          setIsNewProduct(false);
        }
        break;

      case 'create-option':
        setValue(action.name, value.label);
        setIsNewProduct(true);
        setSelectedProduct(value);
        break;
    }
  }
  async function onSubmit(data) {
    await props.onAddEntry(data, isNewProduct);
    // @ts-ignore
    reset({ defaultValues });
    setValue('product', null, { shouldDirty: false });
    setValue('category', null, { shouldDirty: false });
    setSelectedProduct(null);
    setSelectedCategory(null);
    setIsNewProduct(false);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h1>Agregar nueva orden de producto</h1>
      <Form.Row>
        <Form.Group controlId="product-input" as={Col}>
          <Form.Label>Producto</Form.Label>
          <Controller
            name="product"
            control={control}
            rules={{ required: true }}
            render={props => (
              <CreatableSelect
                {...props}
                inputId="product-input"
                name="product"
                isClearable
                options={products.map(c => ({ value: c._id, label: c.name }))}
                noOptionsMessage={() => 'No hay productos'}
                onChange={handleChange}
                value={selectedProduct}
              />
            )}
          />
        </Form.Group>
        <Form.Group controlId="category-input" as={Col}>
          <Form.Label>Categoría</Form.Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={props => (
              <Select
                {...props}
                inputId="category-input"
                name="category"
                isDisabled={watch('product') && !isNewProduct}
                noOptionsMessage={() => 'No hay categorías'}
                options={categories.map(c => ({ value: c._id, label: c.name }))}
                onChange={handleChange}
                value={selectedCategory}
              />
            )}
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group controlId="quantity-input" as={Col}>
          <Form.Label>Cantidad de unidades</Form.Label>
          <Form.Control
            name="quantityOrder"
            type="text"
            inputMode="numeric"
            pattern="[0-9]+"
            defaultValue="1"
            ref={register}
          />
        </Form.Group>
        <Form.Group controlId="unit-cost-input" as={Col}>
          <Form.Label>Costo unitario</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              name="unitCost"
              type="text"
              inputMode="decimal"
              pattern="[0-9]+(?:\.[0-9]{0,2})?"
              defaultValue="1"
              ref={register}
            />
          </InputGroup>
        </Form.Group>
      </Form.Row>
      <Form.Group>
        <Button type="submit">Agregar</Button>
      </Form.Group>
    </Form>
  );
};
export default AddEntryForm;
