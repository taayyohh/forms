import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import clsx from 'clsx'
import { FormStoreType, FormFields } from '../../../store'

interface TextInputProps<T extends FormFields>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  formStore: FormStoreType<T>
  placeholder?: string
}

const TextInput = observer(
  <T extends FormFields>({
    name,
    formStore,
    className,
    placeholder,
    ...rest
  }: TextInputProps<T>) => {
    const [inputValue, setInputValue] = useState(formStore.fields[name] || '')
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
      setInputValue(formStore.fields[name] || '')
    }, [formStore.fields[name]])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      formStore.setField(name, newValue as unknown as T[keyof T])
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
    }

    const inputClassName = clsx('w-full border p-2 text-black', className)
    const labelClassName = clsx(
      'transition-all ease-in-out duration-300',
      {
        'text-sm': isFocused || inputValue,
        'text-base': !isFocused && !inputValue,
      },
      'absolute px-2 left-2',
      {
        'top-0': isFocused || inputValue,
        'top-1/2 transform -translate-y-1/2': !isFocused && !inputValue,
      },
    )

    return (
      <div className={'relative flex flex-col pt-4'}>
        <label htmlFor={name} className={labelClassName}>
          {placeholder}
        </label>
        <input
          id={name}
          name={String(name)}
          value={inputValue}
          className={inputClassName}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
