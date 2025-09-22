import { supabase } from '../supabase'

export interface Business {
  id: string
  owner_id: string
  name: string
  slug: string
  default_eta: number
  show_timers: boolean
  created_at: string
  updated_at: string
}

export interface CreateBusinessParams {
  name: string
  slug: string
  defaultEta?: number
}

export interface UpdateBusinessParams {
  businessId: string
  name?: string
  defaultEta?: number
}

export async function createBusiness({ name, slug, defaultEta = 5 }: CreateBusinessParams): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug) || slug.length < 3 || slug.length > 50) {
    throw new Error('Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only')
  }

  // Create business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .insert({
      owner_id: user.id,
      name,
      slug,
      default_eta: defaultEta,
      show_timers: true,
    })
    .select('id')
    .single()

  if (businessError) {
    if (businessError.code === '23505' && businessError.message.includes('slug')) {
      throw new Error('This business URL is already taken. Please choose a different one.')
    }
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

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get business by slug
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (businessError) {
    if (businessError.code === 'PGRST116') {
      // No business found with this slug
      return null
    }
    throw new Error(`Failed to get business: ${businessError.message}`)
  }

  // Verify user has access to this business
  const { data: staffRecord, error: staffError } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', user.id)
    .eq('business_id', business.id)
    .limit(1)

  if (staffError) {
    throw new Error(`Failed to verify access: ${staffError.message}`)
  }

  if (!staffRecord || staffRecord.length === 0) {
    // User doesn't have access to this business
    return null
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