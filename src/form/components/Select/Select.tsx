import React from 'react'
import Select, { StylesConfig } from 'react-select'
import { FormFields, FormStoreType } from '../../../store'
import { observer } from 'mobx-react'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps<T extends FormFields> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  options: SelectOption[]
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
    };

    return (
      <div>
        <Select
          options={options}
          onChange={handleChange}
          styles={customStyles}
        />
        {formStore.errors[name] && <span className="text-red-500">{formStore.errors[name]}</span>}
      </div>
    )
  },
)

export default CustomSelect
