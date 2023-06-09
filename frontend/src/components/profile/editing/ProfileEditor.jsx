import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button, FormControl, FormLabel, Input, FormErrorMessage, Box, Textarea, Switch, Text, Flex } from '@chakra-ui/react';
import { formatDateTime } from '../../../helpers/date';


const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 50;
const LAST_NAME_MIN_LENGTH = 2;
const LAST_NAME_MAX_LENGTH = 50;
const BIO_MAX_LENGTH = 500;
const LOCATION_MAX_LENGTH = 100;

const ProfileEditor = ({passedProfile, updateProfile}) => {

  const [profile, setProfile] = useState({
  firstName: '',
  lastName: '',
  bio: '',
  location: '',
  isPrivate: false,
    createdAt: '',
    updatedAt: '',});

  useEffect(() => {
    setProfile(passedProfile);
    }, [passedProfile]);

    
    const validationSchema = Yup.object({
      firstName: Yup.string()
        .required('First name is required')
        .min(FIRST_NAME_MIN_LENGTH, `First name must be at least ${FIRST_NAME_MIN_LENGTH} characters`)
        .max(FIRST_NAME_MAX_LENGTH, `First name must be ${FIRST_NAME_MAX_LENGTH} characters or less`),
      lastName: Yup.string()
        .required('Last name is required')
        .min(LAST_NAME_MIN_LENGTH, `Last name must be at least ${LAST_NAME_MIN_LENGTH} characters`)
        .max(LAST_NAME_MAX_LENGTH, `Last name must be ${LAST_NAME_MAX_LENGTH} characters or less`),
      bio: Yup.string()
        .max(BIO_MAX_LENGTH, `Bio must be ${BIO_MAX_LENGTH} characters or less`),
      location: Yup.string()
        .max(LOCATION_MAX_LENGTH, `Location must be ${LOCATION_MAX_LENGTH} characters or less`),
      isPrivate: Yup.boolean()
    });  
   

  const onSubmit = (values, actions) => {
    updateProfile(values);
    actions.setSubmitting(false);
  };

  return (
    <Box maxW='600px' mx='auto'>
        <Text fontSize='sm' fontWeight='light' textAlign='left' my='10px'>Last updated: {formatDateTime(profile.updatedAt)}</Text>
      <Formik initialValues={profile} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize={true}>
        {(formik) => (
          <Form>
            <Field name="firstName" my={2}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                  <FormLabel ml={1} fontWeight={'semibold'} htmlFor="firstName">First Name</FormLabel>
                  <Input {...field} id="firstName" />
                  <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            
            <Field name="lastName" my={2}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                  <FormLabel ml={1} fontWeight={'semibold'} htmlFor="lastName">Last Name</FormLabel>
                  <Input {...field} id="lastName" />
                  <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="bio" my={2}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.bio && form.touched.bio}>
                  <FormLabel ml={1} fontWeight={'semibold'} htmlFor="bio">Bio</FormLabel>
                  <Textarea {...field} id="bio" />
                  <FormErrorMessage>{form.errors.bio}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="location" my={2}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.location && form.touched.location}>
                  <FormLabel ml={1} fontWeight={'semibold'} htmlFor="location">Location</FormLabel>
                  <Input {...field} id="location" />
                  <FormErrorMessage>{form.errors.location}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="isPrivate">
          {({ field }) => (
            <FormControl display="flex" alignItems="center" my={5}>
              <FormLabel  fontWeight='bold' htmlFor="isPrivate" mb="0">
              🔒 Private Profile
              </FormLabel>
              <Switch id="isPrivate" {...field} isChecked={field.value} />
            </FormControl>
          )}
        </Field>
            {!formik.dirty ? <Text fontSize='sm' fontWeight='light' textAlign='left' my='10px'>No changes made. Change values to display update Button.</Text> : 
            (
                <Box mt={4}>
                <Flex justify="flex-end">
                    <Button colorScheme="green" isLoading={formik.isSubmitting} type="submit" disabled={!formik.dirty}>
                        Update Profile
                    </Button>
                 </Flex>
                </Box>)
        }

          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ProfileEditor;