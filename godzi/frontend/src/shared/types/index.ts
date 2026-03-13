export interface Entity {
  address: string
  age_gap: string
  average_cost: string
  categories_ids: string[] //maybe number[]
  contacts: string
  contributors: string
  cost: string
  date: string
  description: string
  entity_id: number
  links: string
  metro: string
  name: string
  photo: string
  source_link: string
  tags_ids: string[] //maybe number[]
}

export interface Category {
  category_id: number
  created_at: string
  name: string
  parent_id: number
  photo: string
  updated_at: string
}
