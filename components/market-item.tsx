interface MarketItemProps {
  name: string
  price: string
  change: string
  isUp: boolean
}

export default function MarketItem({ name, price, change, isUp }: MarketItemProps) {
  return (
    <div className="min-w-[150px] p-3 bg-white rounded-lg shadow-sm">
      <div className="text-sm font-medium mb-2">{name}</div>
      <div className="text-base font-semibold mb-1">¥ {price}</div>
      <div className={`text-xs ${isUp ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </div>
    </div>
  )
} 