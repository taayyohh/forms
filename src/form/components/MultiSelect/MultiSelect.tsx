import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { FormStoreType, FormFields } from '../../../store'
import { observer } from 'mobx-react'
import { ActionMeta, MultiValue } from 'react-select'

export interface SelectOption {
  label: string
  value: string
}

interface MultiSelectProps<T extends FormFields> {
  name: keyof T
  loadOptions: (inputValue: string) => Promise<SelectOption[]>
  formStore: FormStoreType<T>
}

const CustomMultiSelect = observer(
  <T extends FormFields>({ name, loadOptions, formStore }: MultiSelectProps<T>) => {
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([])

    useEffect(() => {
      const loadInitialOptions = async () => {
        const currentValues = formStore.fields[name] as string[]
        if (currentValues && currentValues.length > 0) {
          const options = await loadOptions('')
          const selected = options.filter((option) =>
            currentValues.includes(option.value),
          )
          setSelectedOptions(selected)
        }
      }
      loadInitialOptions()
    }, [formStore.fields, name, loadOptions])

    const handleChange = (
      newValue: MultiValue<SelectOption>,
      actionMeta: ActionMeta<SelectOption>,
    ) => {
      const updatedOptions = newValue ? [...newValue] : []
      const values = updatedOptions.map((option) => option.value)

      setSelectedOptions(updatedOptions)
      formStore.setField(name, values as unknown as T[keyof T])
    }

    return (
      <div className={'flex flex-col text-black'}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          value={selectedOptions}
          isMulti
        />
        {formStore.errors[name] && (
          <span className="py-1 text-xs text-rose-800 lowercase">
            {formStore.errors[name]}
          </span>
        )}
      </div>
    )
  },
)

export default CustomMultiSelect
