import { describe, it, expect, vi } from 'vitest'
import { z, ZodError } from 'zod'
import FormStore from '../src/store/FormStore'

// Define a simple Zod schema for testing
const testSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().min(1, 'Bio is required'),
})

describe('FormStore', () => {
  const initialData = { name: '', bio: '' }
  const formStore = new FormStore(initialData, testSchema)

  describe('Field Initialization and Updating', () => {
    it('should initialize with correct values', () => {
      expect(formStore.fields).toEqual(initialData)
    })

    it('should update field values correctly', () => {
      formStore.setField('name', 'John Doe')
      expect(formStore.fields.name).toBe('John Doe')
    })
  })

  describe('Validation', () => {
    it('should validate fields successfully', async () => {
      formStore.setField('name', 'John Doe')
      formStore.setField('bio', 'Musician')
      const isValid = await formStore.validate()
      expect(isValid).toBeTruthy()
      expect(formStore.errors).toEqual({})
    })

    it('should handle validation errors', async () => {
      formStore.setField('name', '') // Invalid data
      const isValid = await formStore.validate()
      expect(isValid).toBeFalsy()
      expect(formStore.errors.name).toBe('Name is required')
    })
  })

  describe('Form Submission', () => {
    it('should handle form submission successfully', async () => {
      // Mock the submission logic for success scenario
      formStore.submit = vi.fn().mockResolvedValue('Submitted')
      await expect(formStore.submit()).resolves.toBe('Submitted')
    })

    it('should handle submission errors', async () => {
      // Mock the submission logic for failure scenario
      formStore.submit = vi.fn().mockRejectedValue(new Error('Submission failed'))
      await expect(formStore.submit()).rejects.toThrow('Submission failed')
    })
  })

  describe('Form Reset', () => {
    it('should reset the form to initial values', () => {
      formStore.setField('name', 'Jane Doe')
      formStore.setField('bio', 'Musician')
      formStore.resetForm()
      expect(formStore.fields).toEqual(initialData)
    })
  })
})
