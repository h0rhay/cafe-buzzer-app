import { supabase } from '../supabase'
import type { MenuItem } from './menuItems'

export type BuzzerStatus = 'active' | 'ready' | 'picked_up' | 'canceled' | 'expired'

export interface Buzzer {
  id: string
  business_id: string
  public_token: string
  ticket: string | null
  customer_name: string | null
  menu_item_ids: string[]
  eta: number
  started_at: string
  ready_at: string | null
  picked_up_at: string | null
  status: BuzzerStatus
  created_at: string
  updated_at: string
}

export interface BuzzerWithMenuItems extends Buzzer {
  menuItems: MenuItem[]
  businessName?: string
  showTimers?: boolean
}

export interface CreateBuzzerParams {
  businessId: string
  ticket?: string
  customerName?: string
  menuItemIds?: string[]
  customEta?: number
}

export interface CreateBuzzerResult {
  buzzerId: string
  publicToken: string
}

// Generate a random token for public access
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export async function createBuzzer({ businessId, ticket, customerName, menuItemIds, customEta }: CreateBuzzerParams): Promise<CreateBuzzerResult> {
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

  // Get business for default ETA
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('default_eta')
    .eq('id', businessId)
    .single()

  if (businessError || !business) {
    throw new Error('Business not found')
  }

  let eta = customEta || business.default_eta

  // If menu items are selected, calculate ETA based on items
  if (menuItemIds && menuItemIds.length > 0) {
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('estimated_time')
      .in('id', menuItemIds)

    if (menuError) {
      throw new Error(`Failed to get menu items: ${menuError.message}`)
    }

    if (menuItems && menuItems.length > 0) {
      const totalTime = menuItems.reduce((sum, item) => sum + item.estimated_time, 0)
      eta = totalTime || eta
    }
  }

  const publicToken = generateToken()
  
  const { data: buzzer, error } = await supabase
    .from('buzzers')
    .insert({
      business_id: businessId,
      public_token: publicToken,
      ticket,
      customer_name: customerName,
      menu_item_ids: menuItemIds || [],
      eta,
      started_at: new Date().toISOString(),
      status: 'active',
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create buzzer: ${error.message}`)
  }

  return { buzzerId: buzzer.id, publicToken }
}

export async function getActiveBuzzers(businessId: string): Promise<BuzzerWithMenuItems[]> {
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

  const { data: buzzers, error } = await supabase
    .from('buzzers')
    .select('*')
    .eq('business_id', businessId)
    .in('status', ['active', 'ready'])
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get active buzzers: ${error.message}`)
  }

  // Get menu items for each buzzer
  const result: BuzzerWithMenuItems[] = []
  for (const buzzer of buzzers || []) {
    let menuItems: MenuItem[] = []
    if (buzzer.menu_item_ids && buzzer.menu_item_ids.length > 0) {
      const { data: items } = await supabase
        .from('menu_items')
        .select('*')
        .in('id', buzzer.menu_item_ids)
      
      menuItems = items || []
    }
    result.push({ ...buzzer, menuItems })
  }

  return result
}

export async function getBuzzerByToken(token: string): Promise<BuzzerWithMenuItems | null> {
  const { data: buzzer, error } = await supabase
    .from('buzzers')
    .select('*')
    .eq('public_token', token)
    .single()

  if (error || !buzzer) {
    return null
  }

  // Get business settings (name and show_timers)
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('name, show_timers')
    .eq('id', buzzer.business_id)
    .single()
  
  if (businessError) {
    console.error('❌ Business query failed:', businessError);
  }

  // Get menu items
  let menuItems: MenuItem[] = []
  if (buzzer.menu_item_ids && buzzer.menu_item_ids.length > 0) {
    const { data: items } = await supabase
      .from('menu_items')
      .select('*')
      .in('id', buzzer.menu_item_ids)
    
    menuItems = items || []
  }

  const result = {
    ...buzzer,
    businessName: business?.name,
    showTimers: business?.show_timers || false,
    menuItems,
  };
  
  return result;
}

export async function adjustBuzzerTime(buzzerId: string, adjustment: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get buzzer to check access
  const { data: buzzer, error: buzzerError } = await supabase
    .from('buzzers')
    .select('eta, business_id')
    .eq('id', buzzerId)
    .single()

  if (buzzerError || !buzzer) {
    throw new Error('Buzzer not found')
  }

  // Check if user has access to this business
  const { data: staffRecord, error: staffError } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', user.id)
    .eq('business_id', buzzer.business_id)
    .limit(1)

  if (staffError || !staffRecord || staffRecord.length === 0) {
    throw new Error('Not authorized')
  }

  const { error } = await supabase
    .from('buzzers')
    .update({
      eta: Math.max(1, buzzer.eta + adjustment),
    })
    .eq('id', buzzerId)

  if (error) {
    throw new Error(`Failed to adjust buzzer time: ${error.message}`)
  }
}

export async function markBuzzerReady(buzzerId: string): Promise<void> {
  await updateBuzzerStatus(buzzerId, 'ready', { ready_at: new Date().toISOString() })
}

export async function markBuzzerPickedUp(buzzerId: string): Promise<void> {
  await updateBuzzerStatus(buzzerId, 'picked_up', { picked_up_at: new Date().toISOString() })
}

export async function cancelBuzzer(buzzerId: string): Promise<void> {
  await updateBuzzerStatus(buzzerId, 'canceled')
}

async function updateBuzzerStatus(buzzerId: string, status: BuzzerStatus, additionalUpdates: any = {}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get buzzer to check access
  const { data: buzzer, error: buzzerError } = await supabase
    .from('buzzers')
    .select('business_id')
    .eq('id', buzzerId)
    .single()

  if (buzzerError || !buzzer) {
    throw new Error('Buzzer not found')
  }

  // Check if user has access to this business
  const { data: staffRecord, error: staffError } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', user.id)
    .eq('business_id', buzzer.business_id)
    .limit(1)

  if (staffError || !staffRecord || staffRecord.length === 0) {
    throw new Error('Not authorized')
  }

  const { error } = await supabase
    .from('buzzers')
    .update({
      status,
      ...additionalUpdates,
    })
    .eq('id', buzzerId)

  if (error) {
    throw new Error(`Failed to update buzzer status: ${error.message}`)
  }
}