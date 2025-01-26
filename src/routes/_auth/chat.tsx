import { createFileRoute } from '@tanstack/react-router'
import { Form } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next'
import { Client, IFrame } from '@stomp/stompjs'
import { protectRoute } from '@/routes/_auth'
import { useAuth } from "@/auth";

let isSub = false;

interface Message {
  id: number
  senderName: string
  content: string
  timestamp: Date
  chatName?: string
}

interface ChatFormValues {
  message: string
}

export const Route = createFileRoute('/_auth/chat')({
  beforeLoad: ({ context }) => {
    protectRoute(context, ['volunteer', 'charity', 'victim']);
  },
  component: ChatComponent,
})

function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [stompClient, setStompClient] = useState<Client | null>(null)
  const { user } = useAuth();
  const userId = user?.id;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const form = useForm<ChatFormValues>({
    defaultValues: {
      message: '',
    },
  })

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const chatId = 1;
    //const userId = 1;

    const url = `http://localhost:8080/chat/getChatHistory?chatId=${chatId}&userId=${userId}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Assuming the response is JSON
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .then((data) => {
        console.log("Chat history:", data);
        //wstawianie wiadomosci do chatu
        data.forEach((value) => {
          try {
            setMessages(prev => [...prev, {
              id: Date.now(),
              senderName: value.senderName,
              content: value.message,
              timestamp: new Date(value.timestamp),
              chatName: "General Chat"
            }])

            console.log(value)
          } catch (error) {
            console.error(error.message)
          }
        })

        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error fetching chat history:", error);
      });


    const socket = new WebSocket('ws://localhost:8080/chatSystem');
    //const socket = new SockJS('http://localhost:8080/chatSystem')
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('[STOMP]', str),
      connectHeaders: {
        userId: userId,
      },
    })

    client.onConnect = (frame) => {
      if (isSub)
        return;

      console.log('Connected to chat:', frame)
      setStompClient(client)

      client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
        const newMessage = JSON.parse(message.body)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            senderName: newMessage.senderName,
            content: newMessage.message,
            timestamp: new Date(newMessage.date),
            chatName: newMessage.chatName,
          },
        ])
      })

      client.subscribe('/topic/public', (message) => {
        const newMessage = JSON.parse(message.body)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            senderName: newMessage.senderName,
            content: newMessage.message,
            timestamp: new Date(newMessage.date),
            chatName: newMessage.chatName,
          },
        ])
      })

      isSub = true;
    }

    client.onStompError = (frame: IFrame) => {
      console.error('Broker reported error:', frame.headers['message'])
      console.error('Additional details:', frame.body)
    }

    client.activate()

    return () => {
      if (client.connected) {
        console.log('Disconnecting from chat...')
        client.deactivate()
        isSub = false;
      }
    }
  }, [userId])

  const onSubmit = (values: ChatFormValues) => {
    if (!values.message.trim() || !stompClient) return

    const chatMessage = {
      senderId: parseInt(userId),
      message: values.message,
      chatId: 1,
    }

    fetch("http://localhost:8080/chat/sendMessage", {
      method: "POST",
      body: JSON.stringify(chatMessage),
      headers: {
        "Content-type": "application/json;"
      }
    }).then((response) => {
      if (response.ok) {
       console.log(`OK: ${response.status}`);

        const chatId = 1;
        //const userId = 1;

        const url = `http://localhost:8080/chat/getChatHistory?chatId=${chatId}&userId=${userId}`;

        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json(); // Assuming the response is JSON
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          })
          .then((data) => {
            console.log("Chat history:", data);
            setMessages([]);
            //wstawianie wiadomosci do chatu
            data.forEach((value) => {
              try {
                setMessages(prev => [...prev, {
                  id: Date.now(),
                  senderName: value.senderName,
                  content: value.message,
                  timestamp: new Date(value.timestamp),
                  chatName: "General Chat"
                }])

                console.log(value)
              } catch (error) {
                console.error(error.message)
              }
            })

            scrollToBottom();
          })
          .catch((error) => {
            console.error("Error fetching chat history:", error);
          });
      } else {
        // Obsługa błędów
        console.error(`Error: ${response.status}`);
        console.error("Failed to send message:");
      }
    }).catch((error) => {
        console.error("Failed to send message:", error);
      });

    form.reset()
  }

  const { t } = useTranslation()

  return (
    <div className="flex flex-col h-[88vh] max-h-screen p-2">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderName === 'Current User'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.senderName === 'Current User'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {message.senderName}
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
        <div ref={messagesEndRef} /> {/* Scrolling to the last message */}
      </div>

      <div className="sticky bottom-0 bg-background pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Textarea
              placeholder={t('chat.message')}
              {...form.register('message')}
              className="min-h-[80px] resize-none"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90"
            >
              {t('chat.button')}
            </button>
          </form>
        </Form>
      </div>
    </div>
  )
}