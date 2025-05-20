/**
 * Safely checks if a Web3 wallet (like MetaMask) is available in the browser
 * without trying to redefine the ethereum object
 */
export const isWalletAvailable = (): boolean => {
  if (typeof window === "undefined") return false

  // Safely check if ethereum exists on window without redefining it
  return window.hasOwnProperty("ethereum") || typeof (window as any).ethereum !== "undefined"
}

/**
 * Safely gets the current wallet address if connected
 */
export const getWalletAddress = async (): Promise<string | null> => {
  try {
    if (!isWalletAvailable()) return null

    // Safely access ethereum without redefining it
    const ethereum = (window as any).ethereum

    // Request accounts without modifying ethereum
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    })

    return accounts[0] || null
  } catch (error) {
    console.error("Error connecting to wallet:", error)
    return null
  }
}

/**
 * Safely formats crypto prices
 */
export const formatCryptoPrice = (price: number): string => {
  return price.toFixed(4)
}
