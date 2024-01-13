import { useState, useCallback } from 'react'
import { ZodSchema } from 'zod'
import FormStore from '../store/FormStore'

interface UseFormStoreParams<T> {
  initialFields: T
  validationSchema: ZodSchema<T>
  onSubmit: (fields: T) => Promise<void>
}

function useFormStore<T extends object>({
  initialFields,
  validationSchema,
  onSubmit,
}: UseFormStoreParams<T>) {
  const [formStore] = useState(() => new FormStore(initialFields, validationSchema))

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      formStore.setField(field, value)
    },
    [formStore],
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const isValid = await formStore.validate()
      if (isValid) {
        try {
          await onSubmit(formStore.fields)
          formStore.resetForm()
        } catch (error) {
          if (error instanceof Error) {
            // Optional: Handle submission errors
            console.error('Form submission error:', error)
          }
        }
      }
    },
    [formStore, onSubmit],
  )

  return { formStore, handleChange, handleSubmit }
}

export default useFormStore
