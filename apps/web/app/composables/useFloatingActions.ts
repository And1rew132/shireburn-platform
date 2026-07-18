export interface FloatingActionConfig {
  icon: string
  title: string
  action: string
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error'
}

type FloatingActionHandler = () => void | Promise<void>

const handlers = new Map<string, FloatingActionHandler>()

export function useFloatingActions() {
  function registerFloatingAction(action: string, handler: FloatingActionHandler) {
    handlers.set(action, handler)

    return () => {
      if (handlers.get(action) === handler) handlers.delete(action)
    }
  }

  function registerFloatingActions(actions: Record<string, FloatingActionHandler>) {
    const cleanups = Object.entries(actions).map(([action, handler]) => registerFloatingAction(action, handler))
    return () => cleanups.forEach((cleanup) => cleanup())
  }

  async function runFloatingAction(action: string) {
    await handlers.get(action)?.()
  }

  return {
    registerFloatingAction,
    registerFloatingActions,
    runFloatingAction
  }
}
