import { supabase } from '../supabase'

export interface Business {
  id: string
  owner_id: string
  name: string
  default_eta: number
  created_at: string
  updated_at: string
}

export interface CreateBusinessParams {
  name: string
  defaultEta: number
}

export interface UpdateBusinessParams {
  businessId: string
  name?: string
  defaultEta?: number
}

export async function createBusiness({ name, defaultEta }: CreateBusinessParams): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Create business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .insert({
      owner_id: user.id,
      name,
      default_eta: defaultEta,
    })
    .select('id')
    .single()

  if (businessError) {
    throw new Error(`Failed to create business: ${businessError.message}`)
  }

  // Add owner as staff
  const { error: staffError } = await supabase
    .from('staff')
    .insert({
      business_id: business.id,
      user_id: user.id,
      role: 'owner',
    })

  if (staffError) {
    throw new Error(`Failed to add owner as staff: ${staffError.message}`)
  }

  return business.id
}

export async function getUserBusiness(): Promise<Business | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: staffRecords, error: staffError } = await supabase
    .from('staff')
    .select('business_id')
    .eq('user_id', user.id)
    .limit(1)

  if (staffError) {
    throw new Error(`Failed to get staff record: ${staffError.message}`)
  }

  if (!staffRecords || staffRecords.length === 0) {
    return null
  }

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', staffRecords[0].business_id)
    .single()

  if (businessError) {
    throw new Error(`Failed to get business: ${businessError.message}`)
  }

  return business
}

export async function updateBusiness({ businessId, name, defaultEta }: UpdateBusinessParams): Promise<void> {
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

  const updates: any = {}
  if (name !== undefined) updates.name = name
  if (defaultEta !== undefined) updates.default_eta = defaultEta

  const { error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', businessId)

  if (error) {
    throw new Error(`Failed to update business: ${error.message}`)
  }
}