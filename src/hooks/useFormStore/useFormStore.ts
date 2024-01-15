import { useState, useCallback } from 'react'
import { ZodSchema } from 'zod'
import FormStore from '../../store/FormStore'

interface UseFormStoreParams<T> {
  initialFields: T
  validationSchema: ZodSchema<T>
  onSubmit: (fields: T) => Promise<void>
  validationErrors: {}
}

export default function useFormStore<T extends object>({
  initialFields,
  validationSchema,
  onSubmit,
}: UseFormStoreParams<T>) {
  const [formStore] = useState(() => new FormStore(initialFields, validationSchema))
  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      formStore.setField(field, value)
      // Optionally, you can clear the error for this field when it changes
      setValidationErrors((prev) => ({ ...prev, [field]: '' }))
    },
    [formStore],
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      console.log('fields', formStore.fields, isValid)
      const isValid = await formStore.validate()
      if (isValid) {
        try {
          await onSubmit(formStore.fields)
          formStore.resetForm()
          setValidationErrors({}) // Clear validation errors on successful submission
        } catch (error) {
          if (error instanceof Error) {
            console.error('Form submission error:', error)
            // Optionally, handle submission errors here
          }
        }
      } else {
        // Update state with validation errors from formStore
        setValidationErrors(formStore.errors)
      }
    },
    [formStore, onSubmit],
  )

  return { formStore, handleChange, handleSubmit, validationErrors }
}
