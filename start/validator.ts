import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  'required': 'The {{ field }} field is required.',
  'string': 'The {{ field }} field must be a valid string.',
  'email': 'The {{ field }} field must contain a valid email address.',
  'phone.matches': 'The phone field must contain only numbers.',
  'phone.minLength': 'The phone number must be at least 10 digits.',
})
