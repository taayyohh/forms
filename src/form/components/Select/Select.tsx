import React from 'react'
import { StylesConfig } from 'react-select'
import { FormFields, FormStoreType } from '../../../store'
import { observer } from 'mobx-react'
import AsyncSelect from 'react-select/async'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps<T extends FormFields>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  options: (inputValue: string) => Promise<SelectOption[]>
  formStore: FormStoreType<T>
  className?: string
}

const CustomSelect = observer(
  <T extends FormFields>({ name, options, formStore, className }: SelectProps<T>) => {
    const handleChange = (selectedOption: any) => {
      formStore.setField(name, selectedOption ? selectedOption.value : '')
    }

    const customStyles: StylesConfig<SelectOption, false> = {
      control: (provided) => ({
        ...provided,
        // Apply additional styles here
        // Use className as needed
      }),
      // Add more customizations if needed
    }

    return (
      <div className={'flex flex-col text-black'}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={options}
          onChange={handleChange}
        />
        {formStore.errors[name] && (
          <span className="py-1 text-xs text-rose-800 lowercase">{formStore.errors[name]}</span>
        )}
      </div>
    )
  },
)

export default CustomSelect
