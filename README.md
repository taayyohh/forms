# mobx-form-store

A MobX-based form store with Zod validation.

## Description

mobx-form-store is a utility package for React applications using MobX for state management. It simplifies the process of creating and managing form states, with integrated Zod validation to ensure data integrity.

## Installation

To install the package, use npm:

```bash
npm install mobx-form-store
```

Here's a basic example of how to use mobx-form-store:

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

## Features
- Easy integration with MobX
- Built-in validation with Zod
- Simplified form state management

## Contributing
Contributions, issues, and feature requests are welcome!

## License
MIT

## Author
@taayyohh
