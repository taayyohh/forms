import React, { useEffect, useState } from 'react'
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
    // Local state for managing input value
    const [inputValue, setInputValue] = useState(formStore.fields[name] || '')

    // Update local state when the formStore changes
    useEffect(() => {
      setInputValue(formStore.fields[name] || '')
    }, [formStore.fields[name]])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue) // Update local state
      formStore.setField(name, newValue as unknown as T[keyof T]) // Update form store
    }

    const inputClassName = clsx('w-full border p-2 text-black', className)

    return (
      <div className={'flex flex-col'}>
        <input
          name={String(name)}
          value={inputValue}
          className={inputClassName}
          onChange={handleInputChange}
          {...rest}
        />
        {formStore.errors[name] && (
          <span className="py-1 text-xs lowercase text-rose-800">
            {formStore.errors[name]}
          </span>
        )}
      </div>
    )
  },
)

export default TextInput
