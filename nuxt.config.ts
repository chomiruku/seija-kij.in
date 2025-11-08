// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},

    modules: [
        '@nuxt/image',
        '@nuxt/eslint',
        '@nuxt/icon',
        '@nuxt/ui'
    ],

    tailwindcss: {
        config: {
            plugins: [require('tailwind-scrollbar')]
        }
    },

    css: ['~/assets/css/main.css'],

    // Basic app configuration
    app: {
        head: {
            title: 'Kijin Seija - 鬼人 正邪 | seija-kij.in',
            meta: [
                // Basic meta tags
                {name: 'description', content: 'Holy Damn I Love Kijin Seija So Much. くそー、鬼人正邪が大好きだよ。'},
                {
                    name: 'keywords',
                    content: 'touhou, seija kijin, kijin seija, seija, kijin, seija-kij.in, booru, vrchat'
                },
                {name: 'robots', content: 'index, follow'},

                // Open Graph tags for social sharing
                {property: 'og:title', content: 'seija-kij.in'},
                {
                    property: 'og:description',
                    content: 'Holy Damn I Love Kijin Seija So Much. くそー、鬼人正邪が大好きだよ。'
                },
                {
                    property: 'og:image',
                    content: '/__kijin_seija_touhou_drawn_by_risutaru__7bbe0ed74e92075cd0b0b85199dc42ed.jpg'
                },
                {property: 'og:url', content: 'https://seija-kij.in/'},

                // Twitter Card tags
                {name: 'twitter:card', content: 'summary_large_image'},
                {name: 'twitter:title', content: 'seija-kij.in'},
                {
                    name: 'twitter:description',
                    content: 'Holy Damn I Love Kijin Seija So Much. くそー、鬼人正邪が大好きだよ。'
                }
            ],
            link: [
                // Favicon links
                {rel: 'icon', type: 'image/x-icon', href: '/seijakijin.ico'},
                {rel: 'alternate icon', type: 'image/svg+xml', href: '/seijakijin.svg'}
            ]
        }
    },

    // Development server configuration
    devServer: {
        port: 3000,
        host: '0.0.0.0'
    }
})