import type { EditorType } from './editor'
import type { OutputType } from './output'
import type { Dimensions } from './dimensions'

export interface Message {
  id: string
  editor: EditorType
  output: OutputType
  dimensions: Dimensions
}

export interface ReplMessage {
  repl: Message
} 