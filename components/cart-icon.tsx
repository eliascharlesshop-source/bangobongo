'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { Badge } from '@/components/ui/badge'

export function CartIcon() {
  const { getItemCount } = useCart()
  const count = getItemCount()

  return (
    <Link href="/studio/cart" className="relative inline-flex items-center justify-center">
      <button className="relative p-2 rounded-lg hover:bg-card transition-colors group">
        <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        {count > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs font-bold"
            variant="default"
          >
            {count > 99 ? '99+' : count}
          </Badge>
        )}
      </button>
    </Link>
  )
}
