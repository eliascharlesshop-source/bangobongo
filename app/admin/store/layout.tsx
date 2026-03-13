import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Store Management | BangoBongo Admin",
  description: "Manage products, orders, and store settings",
}

export default function AdminStoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
