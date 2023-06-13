import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import * as Yup from 'yup';

const MAX_USERNAME_LENGTH = 30;
const MIN_USERNAME_LENGTH = 3;

const EditUsernameModal = ({ isOpen, onClose, onSubmit, initialUsername }) => {
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required').min(MIN_USERNAME_LENGTH, `Username must be at least ${MIN_USERNAME_LENGTH} characters`).max(MAX_USERNAME_LENGTH, `Username must be ${MAX_USERNAME_LENGTH} characters or less`)
  });

  const onSubmitHandler = (values, actions) => {
    onSubmit(values);
    actions.setSubmitting(false);
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Formik initialValues={{ username: initialUsername }} validationSchema={validationSchema} onSubmit={onSubmitHandler}>
          {(formik) => (
            <Form>
              <ModalHeader>Edit your username</ModalHeader>
              <ModalBody>
                <Field name='username'>
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.username && form.touched.username}>
                      <FormLabel htmlFor='username'>Username</FormLabel>
                      <Input {...field} id='username' />
                      <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button variant='ghost' mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='blue' isLoading={formik.isSubmitting} type='submit'>
                  Save
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default EditUsernameModal;