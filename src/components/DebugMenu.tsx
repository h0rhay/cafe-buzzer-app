import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useDebug } from '../hooks/useDebug'

interface DebugMenuProps {
  onClose: () => void
}

export const DebugMenu: React.FC<DebugMenuProps> = ({ onClose }) => {
  const { debugLog, debugError } = useDebug()
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'database' | 'logs'>('info')

  const handleTestConnection = async () => {
    debugLog('Testing Supabase connection...')
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('count(*)')
        .limit(1)
      
      if (error) {
        debugError('Supabase connection failed', error)
        alert('Connection failed: ' + error.message)
      } else {
        debugLog('Supabase connection successful', data)
        alert('Connection successful!')
      }
    } catch (err) {
      debugError('Supabase connection error', err)
      alert('Connection error: ' + (err as Error).message)
    }
  }

  const handleTestDemo = async () => {
    debugLog('Testing demo data access...')
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', '10000000-0000-0000-0000-000000000001')
        .single()
      
      if (error) {
        debugError('Demo data access failed', error)
        alert('Demo test failed: ' + error.message)
      } else {
        debugLog('Demo data access successful', data)
        alert('Demo test successful! Found: ' + data.name)
      }
    } catch (err) {
      debugError('Demo test error', err)
      alert('Demo test error: ' + (err as Error).message)
    }
  }

  const handleClearBuzzers = async () => {
    if (!confirm('Clear all demo buzzers? This cannot be undone.')) return
    
    debugLog('Clearing demo buzzers...')
    try {
      const { error } = await supabase
        .from('buzzers')
        .delete()
        .eq('business_id', '10000000-0000-0000-0000-000000000001')
      
      if (error) {
        debugError('Failed to clear buzzers', error)
        alert('Failed to clear buzzers: ' + error.message)
      } else {
        debugLog('Successfully cleared demo buzzers')
        alert('Demo buzzers cleared!')
        window.location.reload()
      }
    } catch (err) {
      debugError('Clear buzzers error', err)
      alert('Error: ' + (err as Error).message)
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 text-sm"
        >
          🐛 Debug
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl w-80 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold text-sm">🐛 Debug Menu</span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            −
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            ×
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'info', label: 'Info' },
          { key: 'database', label: 'Database' },
          { key: 'logs', label: 'Logs' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-3 py-2 text-xs font-medium ${
              activeTab === tab.key
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {activeTab === 'info' && (
          <div className="space-y-2 text-xs">
            <div><strong>URL:</strong> {window.location.href}</div>
            <div><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'https://qbczhoqekmpbfbakqgyj.supabase.co'}</div>
            <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</div>
            <div><strong>Local Storage:</strong> {Object.keys(localStorage).length} items</div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-2">
            <button
              onClick={handleTestConnection}
              className="w-full bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700"
            >
              Test Connection
            </button>
            <button
              onClick={handleTestDemo}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded text-xs hover:bg-blue-700"
            >
              Test Demo Data
            </button>
            <button
              onClick={handleClearBuzzers}
              className="w-full bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700"
            >
              Clear Demo Buzzers
            </button>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="text-xs text-gray-600">
            <div className="mb-2">Check browser console for debug logs</div>
            <button
              onClick={() => console.clear()}
              className="w-full bg-gray-600 text-white px-3 py-2 rounded text-xs hover:bg-gray-700"
            >
              Clear Console
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
