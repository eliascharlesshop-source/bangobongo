'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useCart } from '@/contexts/cart-context'
import { ShoppingCart, Plus } from 'lucide-react'

interface AddOnOption {
  id: string
  name: string
  description: string
  price: number
}

interface ServiceConfigPanelProps {
  serviceId: string
  serviceName: string
  basePrice: number
  addOns: AddOnOption[]
  onClose: () => void
}

export function ServiceConfigPanel({
  serviceId,
  serviceName,
  basePrice,
  addOns,
  onClose,
}: ServiceConfigPanelProps) {
  const { addItem } = useCart()
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    setSelectedAddOns((prev) =>
      checked ? [...prev, addOnId] : prev.filter((id) => id !== addOnId)
    )
  }

  const selectedAddOnDetails = addOns.filter((ao) => selectedAddOns.includes(ao.id))
  const totalPrice = basePrice + selectedAddOnDetails.reduce((sum, ao) => sum + ao.price, 0)

  const handleAddToCart = () => {
    const cartItem = {
      id: `${serviceId}-${Date.now()}`,
      serviceId,
      serviceName,
      basePrice,
      addOns: selectedAddOnDetails,
      totalPrice,
      quantity: 1,
    }
    addItem(cartItem)
    onClose()
  }

  return (
    <Card className="chrome-glass">
      <CardHeader>
        <CardTitle className="text-2xl">{serviceName}</CardTitle>
        <CardDescription>Customize your service with optional add-ons</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Price */}
        <div className="border-b border-primary/10 pb-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Base Service</span>
            <span className="text-lg font-semibold text-primary">${basePrice}</span>
          </div>
        </div>

        {/* Add-ons */}
        {addOns.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Add-ons</h3>
            {addOns.map((addOn) => (
              <div key={addOn.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card/40 transition-colors">
                <Checkbox
                  id={addOn.id}
                  checked={selectedAddOns.includes(addOn.id)}
                  onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor={addOn.id} className="text-sm font-medium cursor-pointer">
                    {addOn.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">{addOn.description}</p>
                </div>
                <span className="text-sm font-semibold text-primary">+${addOn.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-primary/10 pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total Price</span>
            <span className="text-3xl font-black chrome-text-mint">${totalPrice}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="chrome" onClick={handleAddToCart} className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
