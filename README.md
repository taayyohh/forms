# mobx-zod-form-store

A MobX-based form store with Zod validation, featuring a dynamic Form component for React applications.

## Description

mobx-zod-form-store is a comprehensive utility package designed to streamline the process of creating, managing, and validating forms in React applications. It utilizes MobX for state management and Zod for robust schema validation. This package also includes a dynamic Form component, making form creation more declarative and less error-prone.
## Installation

To install the package, use npm:

```bash
npm i mobx-zod-form-store
```

## Usage
### Basic FormStore Usage
Here's a basic example of how to use the FormStore:

```
import FormStore from 'mobx-form-store';
import { z } from 'zod';

// Define your schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().min(1, 'Bio is required'),
});

// Create a store
const formStore = new FormStore({ name: '', bio: '' }, formSchema);

// Update fields and validate
formStore.setField('name', 'John Doe');
formStore.validate();

```

### Using useFormStore Hook
You can also use the useFormStore hook for managing form state in functional components:

```
import React from 'react';
import useFormStore from 'path-to-useFormStore';
import { z } from 'zod';

// Define your form schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

const MyForm = () => {
  const { formStore, handleChange, handleSubmit } = useFormStore({
    initialFields: { name: '', email: '' },
    validationSchema: formSchema,
    onSubmit: async (fields) => {
      // Handle form submission
      console.log('Form Data:', fields);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formStore.fields.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        {formStore.errors.name && <span>{formStore.errors.name}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formStore.fields.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {formStore.errors.email && <span>{formStore.errors.email}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

### Dynamic Form Component
The Form component allows you to create forms dynamically based on a configuration array. This array defines the fields, their types, placeholders, and other properties.

Form Field Types
The package supports the following field types:

- text: For text input.
- number: For numeric input.
- textarea: For multiline text input.
- multiselect: For a multi-select input.
- multiitem: For a group of related inputs.
- imageupload: For uploading images.

### Example of Using the Form Component

```bash
import React from 'react';
import Form, { FieldType } from 'path-to-Form';
import { z } from 'zod';

// Form fields configuration
const fieldsConfig = [
  { name: 'name', type: FieldType.Text, placeholder: 'Name', className: 'mb-4 p-2 border rounded' },
  { name: 'age', type: FieldType.Number, placeholder: 'Age', className: 'mb-4 p-2 border rounded' },
  // More fields with Tailwind classes...
];

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(0, 'Age must be a positive number'),
  // Validation for other fields...
});

const MyDynamicForm = () => {
  const handleSubmit = async (fields) => {
    // Handle form submission
    console.log('Form Data:', fields);
  };

  return (
    <Form
      fieldsConfig={fieldsConfig}
      initialFields={{ name: '', age: 0 }}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
      className={'border p-2'}
    />
  );
};

export default MyDynamicForm;


```

## Tailwind CSS Support
This package is designed with Tailwind CSS in mind, offering seamless integration for projects using the Tailwind CSS framework. You can easily apply Tailwind utility classes to enhance the styling and responsiveness of your forms.

## Features
- Easy integration with MobX
- Built-in validation with Zod
- Simplified form state management
- Dynamic Form component for flexible form creation.


## ImageUpload Component
The ImageUpload component in `mobx-zod-form-store` provides an easy way to upload images to IPFS via NFT.storage, a free service for storing off-chain data like images and metadata for NFTs.

### Features
- Uploads images to IPFS via NFT.storage.
- Generates IPFS URIs for each uploaded image.
- Supports multiple image uploads.
- Provides a preview of uploaded images.
- Integrates seamlessly with the form store.

### Usage
To use the ImageUpload component, you need to:

- Set Up NFT.storage Account: First, sign up for an account at NFT.storage and get your API token.

- Install Dependencies: Make sure` mobx-zod-form-store` and its dependencies are installed in your project.

- Use the Component: Import and use the ImageUpload component in your forms.

```bash

import React from 'react';
import { useFormStore, ImageUpload } from 'mobx-zod-form-store';
import { z } from 'zod';

const formSchema = z.object({
  imageUri: z.array(z.string()),
});

const MyForm = () => {
  const { formStore, handleSubmit } = useFormStore({
    initialFields: { imageUri: [] },
    validationSchema: formSchema,
    onSubmit: (fields) => {
      console.log('Form Data:', fields);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <ImageUpload name="imageUri" formStore={formStore} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;


```

Remember to provide the NFT.storage API token in your projects `.env` to ensure the upload functionality works as expected.

## Contributing
Contributions, issues, and feature requests are welcome!

## License
MIT

## Author
@taayyohh
