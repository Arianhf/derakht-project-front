import { Product, ProductCategory, CartDetails, CartItem } from '@/types/shop'

let productIdCounter = 1

export function createMockProduct(overrides?: Partial<Product>): Product {
  const id = String(productIdCounter++)
  return {
    id,
    title: 'کتاب آموزش ریاضی',
    description: 'کتاب آموزش ریاضی برای کودکان با تصاویر رنگی و تمرین‌های جذاب',
    price: 250000,
    stock: 50,
    sku: `BOOK-${id.padStart(4, '0')}`,
    is_available: true,
    slug: `math-book-${id}`,
    meta_title: 'کتاب آموزش ریاضی - درخت',
    meta_description: 'کتاب آموزش ریاضی برای کودکان',
    min_age: 6,
    max_age: 10,
    age_range: '۶-۱۰ سال',
    feature_image: '/images/products/math-book.jpg',
    created_at: new Date().toISOString(),
    popularity: 100,
    ...overrides,
  }
}

export function createMockCategory(overrides?: Partial<ProductCategory>): ProductCategory {
  return {
    id: '1',
    name: 'کتاب‌های آموزشی',
    slug: 'educational-books',
    description: 'کتاب‌های آموزشی برای کودکان',
    parent_id: null,
    ...overrides,
  }
}

export function createMockCartItem(overrides?: Partial<CartItem>): CartItem {
  const product = createMockProduct(overrides?.product)
  const quantity = overrides?.quantity || 1
  const price = overrides?.price || product.price

  return {
    product,
    quantity,
    price,
    total_price: price * quantity,
    ...overrides,
  }
}

export function createMockCart(overrides?: Partial<CartDetails>): CartDetails {
  const items = overrides?.items || [
    createMockCartItem({
      product: createMockProduct({ id: '1', title: 'کتاب ریاضی', price: 150000 }),
      quantity: 2
    }),
    createMockCartItem({
      product: createMockProduct({ id: '2', title: 'کتاب علوم', price: 200000 }),
      quantity: 1
    }),
  ]

  const total_amount = items.reduce((sum, item) => sum + item.total_price, 0)

  return {
    items_count: items.length,
    total_amount,
    items,
    shipping_cost: 0,
    ...overrides,
  }
}

// Predefined mock products
export const mockProducts: Product[] = [
  createMockProduct({
    id: '1',
    title: 'کتاب ریاضی پایه اول',
    price: 150000,
    min_age: 6,
    max_age: 7,
  }),
  createMockProduct({
    id: '2',
    title: 'کتاب علوم پایه دوم',
    price: 200000,
    min_age: 7,
    max_age: 8,
  }),
  createMockProduct({
    id: '3',
    title: 'مجموعه داستان‌های کودکانه',
    price: 350000,
    min_age: 4,
    max_age: 10,
  }),
  createMockProduct({
    id: '4',
    title: 'کتاب آموزش زبان انگلیسی',
    price: 180000,
    min_age: 8,
    max_age: 12,
  }),
]

export const mockCategories: ProductCategory[] = [
  createMockCategory({
    id: '1',
    name: 'کتاب‌های آموزشی',
    slug: 'educational-books'
  }),
  createMockCategory({
    id: '2',
    name: 'کتاب‌های داستان',
    slug: 'story-books'
  }),
  createMockCategory({
    id: '3',
    name: 'لوازم التحریر',
    slug: 'stationery'
  }),
]

export const mockCart = createMockCart()
