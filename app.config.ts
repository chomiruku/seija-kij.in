export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate',
      brand: 'brand',
      crimson: 'crimson',
      deeppink: 'deeppink',
      blueviolet: 'blueviolet',
      plum: 'plum',
      royalblue: 'royalblue'
    },
    button: {
      slots: {
        base: 'rounded-none clip-chevron font-mono tracking-wider uppercase text-xs focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[inset_0_0_0_2px_#ff3342]',
      }
    },
    badge: {
      slots: {
        base: 'rounded-none clip-parallelogram font-mono tracking-widest uppercase',
      }
    },
    input: {
      slots: {
        base: 'rounded-none border-l-2 border-l-crimson-500 font-mono',
      }
    },
    textarea: {
      slots: {
        base: 'rounded-none border-l-2 border-l-crimson-500 font-mono',
      }
    },
    select: {
      slots: {
        base: 'rounded-none',
      }
    },
    modal: {
      slots: {
        content: 'rounded-none',
        header: 'border-b border-crimson-500',
      }
    },
    slideover: {
      slots: {
        content: 'rounded-none',
      }
    },
    card: {
      slots: {
        root: 'rounded-none',
      }
    },
    pagination: {
      slots: {
        item: 'rounded-none clip-parallelogram',
        prev: 'rounded-none',
        next: 'rounded-none',
      }
    },
  }
})
