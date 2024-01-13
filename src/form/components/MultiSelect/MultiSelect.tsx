import React from 'react'
import AsyncSelect from 'react-select/async'

interface SelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  name: string
  loadOptions: (inputValue: string) => Promise<SelectOption[]>
  formStore: {
    fields: Record<string, any>
    errors: Record<string, string | undefined>
    setField: (field: string, value: any) => void
  }
}

const CustomMultiSelect: React.FC<MultiSelectProps> = ({
  name,
  loadOptions,
  formStore,
}) => {
  const handleChange = (selectedOptions: any) => {
    const values = selectedOptions
      ? selectedOptions.map((option: SelectOption) => option.value)
      : []
    formStore.setField(name, values)
  }

  return (
    <div>
      <AsyncSelect
        isMulti
        loadOptions={loadOptions}
        value={
          formStore.fields[name] &&
          formStore.fields[name].map((value: string) => ({ label: value, value }))
        }
        onChange={handleChange}
      />
      {formStore.errors[name] && <span>{formStore.errors[name]}</span>}
    </div>
  )
}

export default CustomMultiSelect