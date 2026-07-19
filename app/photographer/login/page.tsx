import { AuthForm } from '../../../components/AuthForm'

export default function PhotographerLogin() {
  return (
    <AuthForm
      title="Photographer Upload"
      subtitle="Enter the private photographer password to upload and manage wedding photographs."
      endpoint="/api/auth/photographer"
    />
  )
}
