import { action, makeAutoObservable } from 'mobx'
import { ZodSchema, ZodError } from 'zod'

export interface FormFields {
  [key: string]: any
}

type FormErrors<T extends FormFields> = {
  [P in keyof T | '_submit']?: string
}

export type FormStoreType<T extends FormFields> = {
  fields: T
  errors: FormErrors<T>
  setField: <K extends keyof T>(field: K, value: T[K]) => void
  validate: () => Promise<boolean>
  submit: (submissionHandler: (fields: T) => Promise<any>) => Promise<void>
  resetForm: () => void
}

class FormStore<T extends FormFields, U extends ZodSchema<T>> {
  fields: T
  errors: FormErrors<T> = {}
  validationSchema: U
  initialFields: T

  constructor(initialFields: T, validationSchema: U) {
    makeAutoObservable(this, {
      setField: action,
      validate: action,
      submit: action,
      resetForm: action,
    })
    this.fields = initialFields
    this.initialFields = initialFields
    this.validationSchema = validationSchema
  }

  setField<K extends keyof T>(field: K, value: T[K]): void {
    this.fields = { ...this.fields, [field]: value }
    this.errors[field] = ''
  }

  async validate(): Promise<boolean> {
    try {
      await this.validationSchema.parseAsync(this.fields)
      this.errors = {} // Reset all errors
      return true
    } catch (error) {
      console.log('validate error', error)
      console.log('ty', typeof error)
      console.log('zoderror', error instanceof ZodError)
      console.log('z', error?.toString().includes('ZodError'))
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          const path = err.path[0]
          if (typeof path === 'string' || typeof path === 'number') {
            this.errors[path as keyof T] = err.message
          }
        })
      }
      return false
    }
  }

  async submit(submissionHandler: (fields: T) => Promise<any>): Promise<void> {
    const isValid = await this.validate()
    if (!isValid) {
      throw new Error('Validation failed')
    }

    try {
      await submissionHandler(this.fields)
      // Reset form or handle success state as needed
    } catch (error) {
      if (error instanceof Error) {
        this.errors._submit = error.message
      }
    }
  }

  resetForm(): void {
    this.fields = { ...this.initialFields }
    this.errors = {}
  }
}

export default FormStore
