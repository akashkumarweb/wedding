import { AuthForm } from '../../../components/AuthForm'

export default function GalleryLogin() {
  return (
    <AuthForm
      title="Wedding Gallery"
      subtitle="Enter the private family gallery password to view and download original photographs."
      endpoint="/api/auth/gallery"
    />
  )
}
