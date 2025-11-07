declare module '*.html?raw' {
  const content: string
  export default content
}

declare module '*.gs?raw' {
  const content: string
  export default content
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}
