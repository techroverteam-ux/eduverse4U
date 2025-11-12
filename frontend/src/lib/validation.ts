export const validation = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  phone: (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  },
  
  required: (value: string) => {
    return value.trim().length > 0
  },
  
  minLength: (value: string, min: number) => {
    return value.length >= min
  },
  
  maxLength: (value: string, max: number) => {
    return value.length <= max
  },
  
  age: (age: string) => {
    const ageNum = parseInt(age)
    return ageNum >= 3 && ageNum <= 100
  },
  
  rollNumber: (rollNo: string) => {
    return /^[A-Z0-9]{3,10}$/.test(rollNo)
  },
  
  amount: (amount: string) => {
    const amountNum = parseFloat(amount)
    return amountNum >= 0 && amountNum <= 1000000
  }
}

export const validateStudent = (data: any) => {
  const errors: Record<string, string> = {}
  
  if (!validation.required(data.name)) {
    errors.name = 'Student name is required'
  } else if (!validation.minLength(data.name, 2)) {
    errors.name = 'Name must be at least 2 characters'
  }
  
  if (!validation.required(data.email)) {
    errors.email = 'Email is required'
  } else if (!validation.email(data.email)) {
    errors.email = 'Please enter a valid email'
  }
  
  if (data.phone && !validation.phone(data.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number'
  }
  
  if (!validation.required(data.age)) {
    errors.age = 'Age is required'
  } else if (!validation.age(data.age)) {
    errors.age = 'Age must be between 3 and 100'
  }
  
  if (!validation.required(data.rollNumber)) {
    errors.rollNumber = 'Roll number is required'
  } else if (!validation.rollNumber(data.rollNumber)) {
    errors.rollNumber = 'Roll number must be 3-10 alphanumeric characters'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}

export const validateFee = (data: any) => {
  const errors: Record<string, string> = {}
  
  if (!validation.required(data.studentId)) {
    errors.studentId = 'Please select a student'
  }
  
  if (!validation.required(data.amount)) {
    errors.amount = 'Amount is required'
  } else if (!validation.amount(data.amount)) {
    errors.amount = 'Please enter a valid amount (0-1,000,000)'
  }
  
  if (!validation.required(data.feeType)) {
    errors.feeType = 'Fee type is required'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}