import { supabase } from '../supabase'

export interface MenuItem {
  id: string
  business_id: string
  name: string
  description: string | null
  estimated_time: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateMenuItemParams {
  businessId: string
  name: string
  description?: string
  estimatedTime: number
}

export interface UpdateMenuItemParams {
  itemId: string
  name?: string
  description?: string
  estimatedTime?: number
  isActive?: boolean
}

export async function createMenuItem({ businessId, name, description, estimatedTime }: CreateMenuItemParams): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check if user has access to this business
  const { data: staffRecord, error: staffError } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', user.id)
    .eq('business_id', businessId)
    .limit(1)

  if (staffError || !staffRecord || staffRecord.length === 0) {
    throw new Error('Not authorized')
  }

  const { data: menuItem, error } = await supabase
    .from('menu_items')
    .insert({
      business_id: businessId,
      name,
      description,
      estimated_time: estimatedTime,
      is_active: true,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create menu item: ${error.message}`)
  }

  return menuItem.id
}

export async function getMenuItems(businessId: string): Promise<MenuItem[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check if user has access to this business
  const { data: staffRecord, error: staffError } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', user.id)
    .eq('business_id', businessId)
    .limit(1)

  if (staffError || !staffRecord || staffRecord.length === 0) {
    throw new Error('Not authorized')
  }

  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to get menu items: ${error.message}`)
  }

  return menuItems || []
}

export async function updateMenuItem({ itemId, name, description, estimatedTime, isActive }: UpdateMenuItemParams): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get the menu item to check access
  const { data: item, error: itemError } = await supabase
    .from('menu_items')
    .select('business_id')
    .eq('id', itemId)
    .single()

  if (itemError || !item) {
    throw new Error('Menu item not found')
  }

  // Check if user has access to this business
  const { data: staffRecord, error: staffError } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', user.id)
    .eq('business_id', item.business_id)
    .limit(1)

  if (staffError || !staffRecord || staffRecord.length === 0) {
    throw new Error('Not authorized')
  }

  const updates: any = {}
  if (name !== undefined) updates.name = name
  if (description !== undefined) updates.description = description
  if (estimatedTime !== undefined) updates.estimated_time = estimatedTime
  if (isActive !== undefined) updates.is_active = isActive

  const { error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', itemId)

  if (error) {
    throw new Error(`Failed to update menu item: ${error.message}`)
  }
}