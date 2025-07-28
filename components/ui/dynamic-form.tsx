'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file'

interface FormField {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: (value: any) => string | null
  disabled?: boolean
  description?: string
}

interface DynamicFormProps {
  title?: string
  description?: string
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => Promise<void>
  submitLabel?: string
  loading?: boolean
  initialData?: Record<string, any>
  className?: string
}

export function DynamicForm({
  title,
  description,
  fields,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  initialData = {},
  className = ''
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: initialData[field.name] || (field.type === 'checkbox' ? false : '')
    }), {})
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`
    }

    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }

    if (field.validation) {
      return field.validation(value)
    }

    return null
  }

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    fields.forEach(field => {
      const error = validateField(field, formData[field.name])
      if (error) {
        newErrors[field.name] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitError(null)
      await onSubmit(formData)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name]
    const error = errors[field.name]

    const fieldProps = {
      id: field.name,
      name: field.name,
      disabled: field.disabled || loading,
      className: error ? 'border-destructive' : ''
    }

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...fieldProps}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        )

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => handleChange(field.name, newValue)}
            disabled={fieldProps.disabled}
          >
            <SelectTrigger className={fieldProps.className}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value || false}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
              disabled={fieldProps.disabled}
            />
            <Label htmlFor={field.name} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        )

      case 'file':
        return (
          <Input
            {...fieldProps}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleChange(field.name, file)
              }
            }}
          />
        )

      default:
        return (
          <Input
            {...fieldProps}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => {
              const newValue = field.type === 'number' 
                ? parseFloat(e.target.value) || 0 
                : e.target.value
              handleChange(field.name, newValue)
            }}
          />
        )
    }
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              {field.type !== 'checkbox' && (
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              )}
              
              {renderField(field)}
              
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
              
              {errors[field.name] && (
                <p className="text-sm text-destructive">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
