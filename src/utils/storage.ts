// Mock storage utilities for local development

type Bucket = 'property-images' | 'service-images' | 'product-images'

export const uploadFile = async (
  bucket: Bucket,
  file: File,
  path: string = '',
  fileName?: string
): Promise<string> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return a mock URL
  const mockUrl = `https://mock-storage.com/${bucket}/${path}/${fileName || file.name}`
  console.log('Mock file uploaded:', mockUrl)
  
  return mockUrl
}

export const deleteFile = async (bucket: Bucket, filePath: string) => {
  // Simulate deletion delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  console.log('Mock file deleted:', `${bucket}/${filePath}`)
}