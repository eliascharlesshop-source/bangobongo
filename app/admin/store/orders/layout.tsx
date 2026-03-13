import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Management | BangoBongo Admin",
  description: "Manage customer orders and shipping",
}

export default function AdminStoreOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
