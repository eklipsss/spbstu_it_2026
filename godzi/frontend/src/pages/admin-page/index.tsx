import {
  useCreateAdminCategoryMutation,
  useCreateAdminEntityMutation,
  useCreateAdminUserMutation,
  useDeleteAdminCategoryMutation,
  useDeleteAdminEntityMutation,
  useDeleteAdminUserMutation,
  useGetAdminCategoriesQuery,
  useGetAdminCollectionQuery,
  useGetAdminEntitiesQuery,
  useGetAdminUsersQuery,
  useUpdateAdminEntityMutation,
} from '@/entities/admin/api'
import type { AdminEntityPayload, AdminUserPayload } from '@/entities/admin/api'
import type { Category, Entity } from '@/shared/types'
import { Helmet } from 'react-helmet-async'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import styles from './admin-page.module.scss'

type AdminTab = 'categories' | 'entities' | 'collection' | 'users'

interface EntityFormState {
  name: string
  contributors: string
  address: string
  metro: string
  description: string
  links: string
  contacts: string
  photo: string
  cost: string
  average_cost: string
  age_gap: string
  date: string
  is_featured: boolean
  category_ids: number[]
  tag_ids: string
}

interface UserFormState {
  email: string
  password: string
  full_name: string
  phone_number: string
  city: string
  about: string
  is_active: boolean
  is_superuser: boolean
}

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'categories', label: 'Категории' },
  { id: 'entities', label: 'Сущности' },
  { id: 'collection', label: 'Подборка' },
  { id: 'users', label: 'Пользователи' },
]

const emptyEntityForm: EntityFormState = {
  name: '',
  contributors: '',
  address: '',
  metro: '',
  description: '',
  links: '',
  contacts: '',
  photo: '',
  cost: '',
  average_cost: '',
  age_gap: '',
  date: '',
  is_featured: false,
  category_ids: [],
  tag_ids: '',
}

const emptyUserForm: UserFormState = {
  email: '',
  password: '',
  full_name: '',
  phone_number: '',
  city: '',
  about: '',
  is_active: true,
  is_superuser: false,
}

const parseIds = (value: string) =>
  value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0)

const categoryNamesById = (categories: Category[]) =>
  categories.reduce<Record<number, string>>((acc, category) => {
    acc[category.category_id] = category.name
    return acc
  }, {})

const getErrorText = (error: unknown) => {
  if (!error || typeof error !== 'object') return ''
  if ('data' in error) {
    const data = error.data as { detail?: unknown } | string | undefined
    if (typeof data === 'string') return data
    if (typeof data?.detail === 'string') return data.detail
    if (data?.detail) return JSON.stringify(data.detail)
    return 'Не удалось выполнить действие'
  }
  return 'Не удалось выполнить действие'
}

const entityToForm = (entity: Entity): EntityFormState => ({
  name: entity.name ?? '',
  contributors: entity.contributors ?? '',
  address: entity.address ?? '',
  metro: entity.metro ?? '',
  description: entity.description ?? '',
  links: entity.links ?? '',
  contacts: entity.contacts ?? '',
  photo: entity.photo ?? '',
  cost: entity.cost ?? '',
  average_cost: entity.average_cost ?? '',
  age_gap: entity.age_gap ?? '',
  date: entity.date ?? '',
  is_featured: Boolean(entity.is_featured),
  category_ids: entity.categories_ids ?? [],
  tag_ids: (entity.tags_ids ?? []).join(', '),
})

const formToPayload = (form: EntityFormState): AdminEntityPayload => ({
  name: form.name.trim(),
  contributors: form.contributors.trim(),
  address: form.address.trim(),
  metro: form.metro.trim(),
  description: form.description.trim(),
  links: form.links.trim(),
  contacts: form.contacts.trim(),
  photo: form.photo.trim(),
  cost: form.cost.trim(),
  average_cost: form.average_cost.trim(),
  age_gap: form.age_gap.trim(),
  date: form.date.trim(),
  is_featured: form.is_featured,
  category_ids: form.category_ids,
  tag_ids: parseIds(form.tag_ids),
})

interface AdminPageProps {
  onLogout?: () => void
}

export const AdminPage = ({ onLogout }: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('categories')
  const [categoryName, setCategoryName] = useState('')
  const [categoryParentId, setCategoryParentId] = useState('')
  const [entityForm, setEntityForm] = useState<EntityFormState>(emptyEntityForm)
  const [editingEntityId, setEditingEntityId] = useState<number | null>(null)
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm)
  const [message, setMessage] = useState('')

  const {
    data: categories = [],
    error: categoriesError,
    isFetching: isCategoriesFetching,
    refetch: refetchCategories,
  } = useGetAdminCategoriesQuery()
  const {
    data: entities = [],
    error: entitiesError,
    isFetching: isEntitiesFetching,
    refetch: refetchEntities,
  } = useGetAdminEntitiesQuery()
  const {
    data: collection = [],
    isFetching: isCollectionFetching,
    refetch: refetchCollection,
  } = useGetAdminCollectionQuery()
  const {
    data: users = [],
    error: usersError,
    isFetching: isUsersFetching,
    refetch: refetchUsers,
  } = useGetAdminUsersQuery()

  const [createCategory, { isLoading: isCreatingCategory }] = useCreateAdminCategoryMutation()
  const [deleteCategory] = useDeleteAdminCategoryMutation()
  const [createEntity, { isLoading: isCreatingEntity }] = useCreateAdminEntityMutation()
  const [updateEntity, { isLoading: isUpdatingEntity }] = useUpdateAdminEntityMutation()
  const [deleteEntity] = useDeleteAdminEntityMutation()
  const [createUser, { isLoading: isCreatingUser }] = useCreateAdminUserMutation()
  const [deleteUser] = useDeleteAdminUserMutation()

  const categoryMap = useMemo(() => categoryNamesById(categories), [categories])
  const accessError = getErrorText(categoriesError ?? entitiesError ?? usersError)
  const isDatabaseLoading = isCategoriesFetching || isEntitiesFetching || isCollectionFetching || isUsersFetching

  const refreshDatabaseData = () => {
    setMessage('Подгружаем данные из базы')
    void refetchCategories()
    void refetchEntities()
    void refetchCollection()
    void refetchUsers()
  }

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    try {
      await createCategory({
        name: categoryName.trim(),
        parent_id: categoryParentId ? Number(categoryParentId) : null,
      }).unwrap()
      setCategoryName('')
      setCategoryParentId('')
      setMessage('Категория сохранена')
    } catch (error) {
      setMessage(getErrorText(error))
    }
  }

  const handleSubmitEntity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    const payload = formToPayload(entityForm)

    try {
      if (editingEntityId) {
        await updateEntity({ entityId: editingEntityId, body: payload }).unwrap()
        setMessage('Сущность обновлена')
      } else {
        await createEntity(payload).unwrap()
        setMessage('Сущность создана')
      }

      setEntityForm(emptyEntityForm)
      setEditingEntityId(null)
    } catch (error) {
      setMessage(getErrorText(error))
    }
  }

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    const payload: AdminUserPayload = {
      email: userForm.email.trim(),
      password: userForm.password,
      full_name: userForm.full_name.trim(),
      phone_number: userForm.phone_number.trim() || undefined,
      city: userForm.city.trim() || undefined,
      about: userForm.about.trim() || undefined,
      is_active: userForm.is_active,
      is_superuser: userForm.is_superuser,
      categories: [],
      tags: [],
    }

    try {
      await createUser(payload).unwrap()
      setUserForm(emptyUserForm)
      setMessage('Пользователь создан')
    } catch (error) {
      setMessage(getErrorText(error))
    }
  }

  const startEntityEdit = (entity: Entity) => {
    setEditingEntityId(entity.entity_id)
    setEntityForm(entityToForm(entity))
    setActiveTab('entities')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleEntityInCollection = async (entity: Entity) => {
    try {
      await updateEntity({
        entityId: entity.entity_id,
        body: { is_featured: !entity.is_featured },
      }).unwrap()
    } catch (error) {
      setMessage(getErrorText(error))
    }
  }

  return (
    <>
      <Helmet>
        <title>Админ-панель GOdzi</title>
      </Helmet>

      <main className={styles.admin}>
        <div className="container">
            <div className={styles.header}>
              <div>
                <span>GOdzi admin</span>
                <h1>Админ-панель</h1>
              </div>
              <div className={styles.headerActions}>
                <button type="button" onClick={refreshDatabaseData} disabled={isDatabaseLoading}>
                  {isDatabaseLoading ? 'Загрузка из базы...' : 'Подгрузить из базы'}
                </button>
                {onLogout ? (
                  <button type="button" onClick={onLogout}>
                    Выйти
                  </button>
                ) : null}
                <div className={styles.stats}>
                  <strong>{categories.length}</strong>
                  <span>категорий</span>
                  <strong>{entities.length}</strong>
                  <span>сущностей</span>
                  <strong>{users.length}</strong>
                  <span>юзеров</span>
                </div>
              </div>
            </div>

            {accessError ? <div className={styles.notice}>{accessError}</div> : null}
            {message ? <div className={styles.notice}>{message}</div> : null}

            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={activeTab === tab.id ? styles.tabActive : ''}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'categories' ? (
              <section className={styles.grid}>
                <form className={styles.panel} onSubmit={handleCreateCategory}>
                  <h2>Создать категорию</h2>
                  <label>
                    Название
                    <input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required />
                  </label>
                  <label>
                    Родительская категория
                    <select value={categoryParentId} onChange={(event) => setCategoryParentId(event.target.value)}>
                      <option value="">Без родителя</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" disabled={isCreatingCategory}>
                    Создать
                  </button>
                </form>

                <div className={styles.panel}>
                  <h2>Категории</h2>
                  <div className={styles.list}>
                    {categories.map((category) => (
                      <article key={category.category_id} className={styles.row}>
                        <div>
                          <strong>{category.name}</strong>
                          <span>
                            ID {category.category_id}
                            {category.parent_id ? ` · родитель: ${categoryMap[category.parent_id] ?? category.parent_id}` : ''}
                          </span>
                        </div>
                        <button type="button" onClick={() => void deleteCategory(category.category_id)}>
                          Удалить
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === 'entities' ? (
              <section className={styles.gridWide}>
                <form className={styles.panel} onSubmit={handleSubmitEntity}>
                  <h2>{editingEntityId ? 'Редактировать сущность' : 'Создать сущность'}</h2>
                  <div className={styles.formGrid}>
                    <label>
                      Название
                      <input
                        value={entityForm.name}
                        onChange={(event) => setEntityForm({ ...entityForm, name: event.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Категории
                      <select
                        multiple
                        value={entityForm.category_ids.map(String)}
                        onChange={(event) =>
                          setEntityForm({
                            ...entityForm,
                            category_ids: Array.from(event.target.selectedOptions, (option) => Number(option.value)),
                          })}
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.category_id} value={category.category_id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Метро
                      <input
                        value={entityForm.metro}
                        onChange={(event) => setEntityForm({ ...entityForm, metro: event.target.value })}
                      />
                    </label>
                    <label>
                      Адрес
                      <input
                        value={entityForm.address}
                        onChange={(event) => setEntityForm({ ...entityForm, address: event.target.value })}
                      />
                    </label>
                    <label>
                      Дата / график
                      <input
                        value={entityForm.date}
                        onChange={(event) => setEntityForm({ ...entityForm, date: event.target.value })}
                      />
                    </label>
                    <label>
                      Контакты
                      <input
                        value={entityForm.contacts}
                        onChange={(event) => setEntityForm({ ...entityForm, contacts: event.target.value })}
                      />
                    </label>
                    <label>
                      Ссылка
                      <input
                        value={entityForm.links}
                        onChange={(event) => setEntityForm({ ...entityForm, links: event.target.value })}
                      />
                    </label>
                    <label>
                      Фото
                      <input
                        value={entityForm.photo}
                        onChange={(event) => setEntityForm({ ...entityForm, photo: event.target.value })}
                      />
                    </label>
                    <label>
                      Стоимость
                      <input
                        value={entityForm.cost}
                        onChange={(event) => setEntityForm({ ...entityForm, cost: event.target.value })}
                      />
                    </label>
                    <label>
                      Средний чек
                      <input
                        value={entityForm.average_cost}
                        onChange={(event) => setEntityForm({ ...entityForm, average_cost: event.target.value })}
                      />
                    </label>
                    <label>
                      Возраст
                      <input
                        value={entityForm.age_gap}
                        onChange={(event) => setEntityForm({ ...entityForm, age_gap: event.target.value })}
                      />
                    </label>
                    <label>
                      ID тегов через запятую
                      <input
                        value={entityForm.tag_ids}
                        onChange={(event) => setEntityForm({ ...entityForm, tag_ids: event.target.value })}
                      />
                    </label>
                    <label className={styles.fullWidth}>
                      Описание
                      <textarea
                        value={entityForm.description}
                        onChange={(event) => setEntityForm({ ...entityForm, description: event.target.value })}
                        required
                      />
                    </label>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={entityForm.is_featured}
                        onChange={(event) => setEntityForm({ ...entityForm, is_featured: event.target.checked })}
                      />
                      В подборке на главной
                    </label>
                  </div>
                  <div className={styles.actions}>
                    <button type="submit" disabled={isCreatingEntity || isUpdatingEntity}>
                      {editingEntityId ? 'Сохранить' : 'Создать'}
                    </button>
                    {editingEntityId ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEntityId(null)
                          setEntityForm(emptyEntityForm)
                        }}
                      >
                        Отменить
                      </button>
                    ) : null}
                  </div>
                </form>

                <div className={styles.panel}>
                  <h2>Сущности</h2>
                  <div className={styles.list}>
                    {entities.map((entity) => (
                      <article key={entity.entity_id} className={styles.row}>
                        <div>
                          <strong>{entity.name}</strong>
                          <span>
                            ID {entity.entity_id} · {(entity.categories_ids ?? []).map((id) => categoryMap[id] ?? id).join(', ') || 'без категории'}
                          </span>
                        </div>
                        <div className={styles.rowActions}>
                          <button type="button" onClick={() => void toggleEntityInCollection(entity)}>
                            {entity.is_featured ? 'Убрать' : 'В подборку'}
                          </button>
                          <button type="button" onClick={() => startEntityEdit(entity)}>
                            Изменить
                          </button>
                          <button type="button" onClick={() => void deleteEntity(entity.entity_id)}>
                            Удалить
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === 'collection' ? (
              <section className={styles.panel}>
                <h2>Сущности в подборке</h2>
                <div className={styles.list}>
                  {collection.length ? (
                    collection.map((entity) => (
                      <article key={entity.entity_id} className={styles.row}>
                        <div>
                          <strong>{entity.name}</strong>
                          <span>ID {entity.entity_id}</span>
                        </div>
                        <div className={styles.rowActions}>
                          <button type="button" onClick={() => startEntityEdit(entity)}>
                            Изменить
                          </button>
                          <button type="button" onClick={() => void toggleEntityInCollection(entity)}>
                            Убрать из подборки
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className={styles.empty}>В подборке пока нет сущностей</div>
                  )}
                </div>
              </section>
            ) : null}

            {activeTab === 'users' ? (
              <section className={styles.grid}>
                <form className={styles.panel} onSubmit={handleCreateUser}>
                  <h2>Создать юзера</h2>
                  <label>
                    Email
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Пароль
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
                      minLength={4}
                      required
                    />
                  </label>
                  <label>
                    Имя
                    <input
                      value={userForm.full_name}
                      onChange={(event) => setUserForm({ ...userForm, full_name: event.target.value })}
                    />
                  </label>
                  <label>
                    Телефон
                    <input
                      value={userForm.phone_number}
                      onChange={(event) => setUserForm({ ...userForm, phone_number: event.target.value })}
                    />
                  </label>
                  <label>
                    Город
                    <input
                      value={userForm.city}
                      onChange={(event) => setUserForm({ ...userForm, city: event.target.value })}
                    />
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={userForm.is_superuser}
                      onChange={(event) => setUserForm({ ...userForm, is_superuser: event.target.checked })}
                    />
                    Администратор
                  </label>
                  <button type="submit" disabled={isCreatingUser}>
                    Создать
                  </button>
                </form>

                <div className={styles.panel}>
                  <h2>Юзеры</h2>
                  <div className={styles.list}>
                    {users.map((user) => (
                      <article key={user.user_id} className={styles.row}>
                        <div>
                          <strong>{user.full_name || user.email}</strong>
                          <span>
                            ID {user.user_id} · {user.email} {user.is_superuser ? '· admin' : ''}
                          </span>
                        </div>
                        <button type="button" onClick={() => void deleteUser(user.user_id)}>
                          Удалить
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}
        </div>
      </main>
    </>
  )
}
