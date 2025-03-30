export default defineAppConfig({
  ui: {
    primary: 'neutral',
    gray: 'zinc',
    font: {
      sans: ['SUSE', 'sans-serif']
    },
    button: {
      variants: {
        solid: {
          default: 'bg-neutral-800 text-white hover:bg-neutral-700 focus-visible:outline-neutral-800 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300',
        }
      }
    },
    notifications: {
      position: 'top-right',
      duration: 5000
    }
  }
})