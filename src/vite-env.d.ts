/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_BLOG: string
  readonly VITE_ENABLE_COMMENTS: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_WEB3FORMS_KEY: string
  readonly VITE_GOOGLE_SCRIPT_URL: string
  readonly VITE_CALENDAR_EMAIL: string
  readonly VITE_BOOKING_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
