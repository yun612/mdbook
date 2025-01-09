import { z } from 'zod'
import { languages } from '@/data/app'

export const Language = z.enum(languages)

export const Editor = z.object({
  lang: Language,
  code: z.string(),
  defaultCode: z.string(),
  theme: z.enum(['dark', 'light']),
  readonly: z.boolean()
})

export type EditorType = z.infer<typeof Editor>
export type LanguageType = z.infer<typeof Language> 