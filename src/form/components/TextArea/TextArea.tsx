import React from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from "mobx-react";

// Make TextareaProps generic and extend T from FormFields
interface TextareaProps<T extends FormFields>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  formStore: FormStoreType<T>
}

// Make Textarea a generic component
const Textarea = observer(<T extends FormFields>({
  name,
  formStore,
  ...rest
}: TextareaProps<T>) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Cast the string value to the correct type
    formStore.setField(name, e.target.value as unknown as T[keyof T])
  }

  return (
    <div>
      <textarea
        name={String(name)}
        value={(formStore.fields[name] as unknown as string) || ''}
        onChange={handleInputChange}
        {...rest}
      />
      {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
    </div>
  )
})

export default Textarea
