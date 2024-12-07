import { createFileRoute } from '@tanstack/react-router'
import { Form } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

interface Message {
  id: number
  first_name: string
  last_name: string
  content: string
  timestamp: Date
}

interface ChatFormValues {
  message: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    content: "Hello! How can we help you today?",
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: 2,
    first_name: "Current",
    last_name: "User",
    content: "Cały czas tłukło, ale to tak tłukło, całe noce całe dnie tłukło",
    timestamp: new Date(Date.now() - 2000000),
  },
  {
    id: 3,
    first_name: "John",
    last_name: "Doe",
    content: "I understand. Let's talk about what tłukło.",
    timestamp: new Date(Date.now() - 1000000),
  },
  {
    id: 4,
    first_name: "Alice",
    last_name: "Smith",
    content: "Młotek tak tłukł",
    timestamp: new Date(Date.now() - 500000),
  },
]

export const Route = createFileRoute('/_auth/chat')({
  component: ChatComponent,
})

function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([])

  const form = useForm<ChatFormValues>({
    defaultValues: {
      message: '',
    },
  })

  useEffect(() => {
    setMessages(initialMessages)
  }, [])

  const onSubmit = (values: ChatFormValues) => {
    if (!values.message.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      first_name: "Current",
      last_name: "User",
      content: values.message,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    form.reset()
  }

  return (
    <div className="flex flex-col h-[88vh] max-h-screen p-2">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.first_name === "Current" ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.first_name === "Current"
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {message.first_name} {message.last_name}
              </div>
              <div className="break-all">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-background pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Textarea
              placeholder="Type your message here..."
              {...form.register('message')}
              className="min-h-[80px]"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90"
            >
              Send Message
            </button>
          </form>
        </Form>
      </div>
    </div>
  )
}
