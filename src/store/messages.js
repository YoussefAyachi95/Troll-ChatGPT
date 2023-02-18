import { create } from 'zustand'

export const useMessageStore = create((set, get) => ({
  messages: [],
  sendPrompt: async ({ prompt }) => {
    const messageIAid = get().messages.length + 1
    // Update the state of the messages
    // with the user message
    // and create an empty message from the AI
    // while we do the data fetch
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: state.messages.length,
          ia: false,
          message: prompt
        },
        {
          id: state.messages.length + 1,
          ia: true,
          message: ''
        }
      ]
    }))

    // data fetch
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      const json = await response.json()

      // Update the empty AI message with a full text
      set((state) => ({
        messages: state.messages.map((entry) => {
          if (entry.id === messageIAid) {
            return {
              ...entry,
              message: json.response
            }
          }
          return entry
        })
      }))
    } catch (error) {
      console.error(error)
    }
  }
}))
