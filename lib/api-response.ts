import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

export function errorResponse(error: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error
  }, { status })
}

export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: 'Unauthorized'
  }, { status: 401 })
}

export function forbiddenResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: 'Forbidden'
  }, { status: 403 })
}

export function notFoundResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: 'Not found'
  }, { status: 404 })
}

export function validationErrorResponse(errors: string[]): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: 'Validation failed',
    data: { errors }
  }, { status: 422 })
}

export function internalErrorResponse(): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: 'Internal server error'
  }, { status: 500 })
}