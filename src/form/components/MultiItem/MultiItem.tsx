import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { FormStoreType, FormFields } from '../../../store'

interface ArrayObjectField {
  name: string
  type: 'text' | 'number' | 'select'
  options?: string[] // For select type
  defaultValue?: any
}

interface MultiItemProps<T extends FormFields> {
  name: keyof T
  formStore: FormStoreType<T>
  fields: ArrayObjectField[]
}

const MultiItem = observer(
  <T extends FormFields>({ name, formStore, fields }: MultiItemProps<T>) => {
    const [items, setItems] = useState<any[]>(formStore.fields[name] as any[])

    const handleAddItem = () => {
      const newItem = fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.defaultValue || (field.type === 'number' ? 0 : ''),
        }),
        {},
      )
      setItems([...items, newItem])
    }

    const handleItemChange = (index: number, fieldName: string, value: any) => {
      const updatedItems = items.map((item, i) =>
        i === index ? { ...item, [fieldName]: value } : item,
      )
      setItems(updatedItems)
      formStore.setField(name, updatedItems as unknown as T[keyof T])
    }

    const handleRemoveItem = (index: number) => {
      const updatedItems = items.filter((_, i) => i !== index)
      setItems(updatedItems)
      formStore.setField(name, updatedItems as unknown as T[keyof T])
    }

    return (
      <div>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {fields.map((field) => (
              <div key={field.name} className={'text-black'}>
                {field.type === 'select' ? (
                  <select
                    value={item[field.name]}
                    onChange={(e) =>
                      handleItemChange(index, field.name, e.target.value)
                    }
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={item[field.name]}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        field.name,
                        field.type === 'number'
                          ? Number(e.target.value)
                          : e.target.value,
                      )
                    }
                  />
                )}
              </div>
            ))}
            <button type="button" onClick={() => handleRemoveItem(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>
        {formStore.errors[name] && (
          <span className="py-1 text-xs lowercase text-rose-800">
            {formStore.errors[name]}
          </span>
        )}
      </div>
    )
  },
)

export default MultiItem
