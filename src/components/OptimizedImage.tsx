type OptimizedImageProps = {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  )
}
