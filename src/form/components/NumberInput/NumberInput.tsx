import React, { useState, useEffect } from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import clsx from 'clsx'

interface NumberInputProps<T extends FormFields>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: keyof T
  formStore: FormStoreType<T>
  className?: string
}
const NumberInput = observer(
  <T extends FormFields>({
    name,
    formStore,
    className,
    ...rest
  }: NumberInputProps<T>) => {
    const [inputValue, setInputValue] = useState(formStore.fields[name] || 0)

    useEffect(() => {
      setInputValue(formStore.fields[name] || 0)
    }, [formStore.fields[name], name])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value)
      setInputValue(newValue)
      formStore.setField(name, newValue as unknown as T[keyof T])
    }

    const inputClassName = clsx('w-full border p-2 text-black', className)

    return (
      <div className={'flex flex-col'}>
        <input
          type="number"
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

export default NumberInput
