interface NewsItemProps {
  image: string
  title: string
  source: string
  time: string
}

export default function NewsItem({ image, title, source, time }: NewsItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-[80px] h-[60px] rounded-lg overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium line-clamp-2 mb-1">{title}</div>
        <div className="flex items-center text-xs text-gray-500">
          <span>{source}</span>
          <span className="mx-1">·</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  )
} 