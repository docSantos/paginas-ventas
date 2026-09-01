'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { COUNTRIES } from '@/lib/countries'
import { formatPhone } from '@/lib/utils'

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function PhoneInputField({ value, onChange, required = false }: PhoneInputFieldProps) {
  const [lada, setLada] = useState('52')
  const [hasInit, setHasInit] = useState(false)

  useEffect(() => {
    if (value && !hasInit) {
      const raw = value.replace(/\D/g, '')
      const sorted = [...COUNTRIES].filter(c => c.code !== 'separator').sort((a, b) => b.code.length - a.code.length)
      for (const c of sorted) {
        if (raw.startsWith(c.code)) {
          setLada(c.code)
          setHasInit(true)
          break
        }
      }
    }
  }, [value, hasInit])

  const rawPhone = (value || '').replace(/\D/g, '')
  let phonePart = rawPhone
  
  if (rawPhone.startsWith(lada)) {
    phonePart = rawPhone.substring(lada.length)
  }

  const displayPhone = formatPhone(phonePart, lada)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawNew = e.target.value.replace(/\D/g, '')
    onChange(`+${lada}${rawNew}`)
  }

  const handleLadaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLada = e.target.value
    setLada(newLada)
    onChange(`+${newLada}${phonePart}`)
  }

  const selectedCountry = COUNTRIES.find(c => c.code === lada)

  return (
    <div className="flex h-11 shadow-sm rounded-md">
      <div className="relative flex items-center">
        {/* Fake transparent select overlay visual */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md text-sm text-gray-700">
          <span>{selectedCountry?.flag} +{lada}</span>
          <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
        
        {/* Real select, invisible but clickable */}
        <select 
          className="w-24 sm:w-28 h-11 opacity-0 cursor-pointer appearance-none absolute inset-0"
          value={lada}
          onChange={handleLadaChange}
        >
          {COUNTRIES.map((country, idx) => (
            country.code === 'separator' ? (
              <option key={`sep-${idx}`} disabled>──────────</option>
            ) : (
              <option key={`${country.code}-${country.name}`} value={country.code}>
                {country.flag} +{country.code} ({country.name})
              </option>
            )
          ))}
        </select>
        
        {/* Spacer to push the input */}
        <div className="w-24 sm:w-28 h-11 border border-r-0 border-transparent"></div>
      </div>
      
      <Input 
        type="tel" 
        required={required}
        placeholder="1234567890"
        className="h-11 rounded-l-none pl-3 flex-1 border-gray-300 focus-visible:ring-teal-500 focus-visible:border-teal-500 shadow-none text-base sm:text-sm"
        value={displayPhone}
        onChange={handlePhoneChange}
        maxLength={18}
      />
    </div>
  )
}
