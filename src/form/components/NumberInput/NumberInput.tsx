import React from 'react'
import { FormFields, FormStoreType } from '../../../store'

interface NumberInputProps<T extends FormFields>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: FormStoreType<T>
}

const NumberInput = <T extends FormFields>({
  name,
  formStore,
  ...rest
}: NumberInputProps<T>) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formStore.setField(name, e.target.value as unknown as T[keyof T])
  }

  return (
    <div>
      <input
        type="number"
        name={name}
        value={formStore.fields[name] || ''}
        onChange={handleInputChange}
        {...rest}
      />
      {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
    </div>
  )
}

export default NumberInput
