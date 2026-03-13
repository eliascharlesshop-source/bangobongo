import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Product Management | BangoBongo Admin",
  description: "Create and manage store products",
}

export default function AdminStoreProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
