import React from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import clsx from 'clsx'

interface TextInputProps<T extends FormFields>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: FormStoreType<T>
}

const TextInput = observer(
  <T extends FormFields>({
    name,
    formStore,
    className,
    ...rest
  }: TextInputProps<T>) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      formStore.setField(name, e.target.value as unknown as T[keyof T])
    }

    const inputClassName = clsx('w-full border p-2 rounded', className)

    return (
      <div>
        <input
          name={String(name)}
          className={inputClassName}
          onChange={handleInputChange}
          {...rest}
        />
        {formStore.errors[name] && (
          <span className="text-red-500">{formStore.errors[name]}</span>
        )}
      </div>
    )
  },
)

export default TextInput
