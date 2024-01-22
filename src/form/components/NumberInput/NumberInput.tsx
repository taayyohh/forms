import React from 'react'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import clsx from 'clsx'

interface NumberInputProps<T extends FormFields>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string // Updated to string
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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = Number(e.target.value)
      formStore.setField(name as keyof T, numericValue as unknown as T[keyof T]) // Cast name to keyof T
    }

    const inputClassName = clsx('border p-2 text-black', className)

    return (
      <div className={'flex flex-col'}>
        <input
          type="number"
          name={name}
          value={(formStore.fields[name as keyof T] as unknown as number) || ''} // Cast name to keyof T
          className={inputClassName}
          onChange={handleInputChange}
          {...rest}
        />
        {formStore.errors[name as keyof T] && ( // Cast name to keyof T
          <span className="py-1 text-xs text-rose-800 lowercase">
            {formStore.errors[name as keyof T]}
          </span> // Cast name to keyof T
        )}
      </div>
    )
  },
)

export default NumberInput
