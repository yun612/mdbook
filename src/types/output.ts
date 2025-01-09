import { z } from 'zod'

export const Output = z.object({
  status: z.enum(['idle', 'loading', 'running', 'finished']),
  data: z.array(
    z.object({
      msg: z.array(z.any()),
      color: z.enum(['red', 'yellow', 'normal'])
    })
  )
})

export const Outputs = z.object({
  python: Output,
  typescript: Output,
  javascript: Output
})

export type OutputType = z.infer<typeof Output>
export type OutputsType = z.infer<typeof Outputs> 