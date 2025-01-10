import { z } from 'zod'
import { languages } from '@/data/app'

export const Language = z.enum(languages)

// @/types/editor.ts
export interface EditorType {
  code: string;
  lang: LanguageType;
  defaultCode: string;
  theme: 'dark' | 'light';
  readonly: boolean;
  monacoTheme?: string; // 添加 monacoTheme 属性并设置为可选
}


export const Editor = z.object({
  lang: Language,
  code: z.string(),
  defaultCode: z.string(),
  theme: z.enum(['dark', 'light']),
  readonly: z.boolean()
})

// export type EditorType = z.infer<typeof Editor>
export type LanguageType = z.infer<typeof Language> 