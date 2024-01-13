import React from 'react'
import Select from 'react-select'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  name: string
  options: SelectOption[]
  formStore: {
    fields: Record<string, any>
    errors: Record<string, string | undefined>
    setField: (field: string, value: any) => void
  }
}

const CustomSelect: React.FC<SelectProps> = ({ name, options, formStore }) => {
  const handleChange = (selectedOption: any) => {
    formStore.setField(name, selectedOption ? selectedOption.value : '')
  }

  return (
    <div>
      <Select
        options={options}
        value={options.find((option) => option.value === formStore.fields[name])}
        onChange={handleChange}
      />
      {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
    </div>
  )
}

export default CustomSelect
