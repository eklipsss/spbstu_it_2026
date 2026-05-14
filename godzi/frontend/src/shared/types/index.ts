export interface Entity {
  address: string
  age_gap: string
  average_cost: string
  categories_ids: number[]
  contacts: string
  contributors: string
  cost: string
  date: string
  description: string
  entity_id: number
  is_featured?: boolean
  links: string
  metro: string
  name: string
  photo: string
  source_link?: string
  tags_ids: number[]
  created_at?: string | null
  updated_at?: string | null
}

export interface Category {
  category_id: number
  created_at?: string | null
  name: string
  parent_id: number | null
  photo?: string
  updated_at?: string | null
}

export interface AuthUser {
  user_id: number
  email: string
  full_name: string | null
  phone_number: string | null
  city: string | null
  about: string | null
  categories: string[]
  tags: string[]
  is_active: boolean
  is_superuser: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: AuthUser
}
