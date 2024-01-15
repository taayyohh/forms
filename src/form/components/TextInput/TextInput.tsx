import React from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'

interface TextInputProps<T extends FormFields>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: FormStoreType<T>
}

const TextInput = observer(
  <T extends FormFields>({ name, formStore, ...rest }: TextInputProps<T>) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      formStore.setField(name, e.target.value as unknown as T[keyof T])
    }

    return (
      <div>
        <input
          name={String(name)}
          value={(formStore.fields[name] as unknown as string) || ''}
          onChange={handleInputChange}
          {...rest}
        />
        {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
      </div>
    )
  },
)

export default TextInput
