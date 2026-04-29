export const categories = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', count: 12453 },
  { id: 'vehicles', name: 'Vehicles', icon: 'Car', count: 8287 },
  { id: 'furniture', name: 'Home & Furniture', icon: 'Sofa', count: 6892 },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', count: 15421 },
  { id: 'property', name: 'Property', icon: 'Home', count: 4567 },
  { id: 'jobs', name: 'Jobs', icon: 'Briefcase', count: 9834 },
  { id: 'services', name: 'Services', icon: 'Wrench', count: 5623 },
  { id: 'education', name: 'Education', icon: 'BookOpen', count: 3421 },
  { id: 'daily', name: 'Daily Needs', icon: 'ShoppingBag', count: 7892 },
]

export const listings = []
export const conversations = []
export const messages = []
export const userProfile = {}
export const notifications = []

export const indianCities = [
  'Hyderabad',
  'Bengaluru', 
  'Chennai',
  'Mumbai',
  'Delhi NCR',
  'Pune',
  'Kolkata',
  'Vijayawada',
  'Warangal',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
]

export function formatPrice(price: number): string {
  if (price === 0) return 'Contact for Price'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}
