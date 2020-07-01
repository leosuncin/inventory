import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { saveCategory } from '../store/slices/categories.slice';

const validations = {
  name: {
    required: 'El nombre es requerido',
    minLength: {
      value: 5,
      message: 'El nombre debe tener al menos cinco caracteres',
    },
    maxLength: {
      value: 9,
      message: 'El nombre debe tener no más de nueve caracteres',
    },
  },
  color: {
    required: 'El color es requerido',
    minLength: {
      value: 4,
      message: 'El color debe tener al menos cuatro caracteres',
    },
    maxLength: {
      value: 9,
      message: 'El color debe tener no más de nueve caracteres',
    },
  },
};
export const CreateCategoryForm = props => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, register, formState, errors } = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  function handleClose() {
    setOpen(prevOpen => !prevOpen);
    props.onClose();
  }
  async function dispatchSaveCategory(data) {
    await dispatch(saveCategory(data));
    handleClose();
  }

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          id="save-category"
          onSubmit={handleSubmit(dispatchSaveCategory)}
        >
          <Form.Group controlId="category-name">
            <Form.Label>Nombre de la categoría</Form.Label>
            <Form.Control name="name" ref={register(validations.name)} />
            {errors.name && (
              <Form.Text className="text-danger">
                {errors.name?.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="category-color">
            <Form.Label>Color de la categoría</Form.Label>
            <Form.Control
              type="color"
              name="color"
              ref={register(validations.color)}
            />
            {errors.color && (
              <Form.Text className="text-danger">
                {errors.color?.message}
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={formState.isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="save-category"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Guardando categoría' : 'Crear categoría'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCategoryForm;
