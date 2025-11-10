// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindScrollbar from 'tailwind-scrollbar'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},

    modules: [
        '@nuxt/image',
        '@nuxt/eslint',
        '@nuxt/icon',
        '@nuxt/ui'
    ],

    ui: {
        theme: {
            colors: ['primary', 'secondary', 'tertiary', 'success', 'info', 'warning', 'error', 'brand', 'crimson', 'deeppink', 'blueviolet', 'plum', 'royalblue']
        }
    },

    vite: {
        build: {
            sourcemap: false  // Disable sourcemaps in production builds
        }
    },

    tailwindcss: {
        config: {
            plugins: [tailwindScrollbar]
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
    },

    nitro: {
        routeRules: {
            // Don't cache HTML pages aggressively - prevent stale color mode
            '/': { headers: { 'Cache-Control': 'no-cache, must-revalidate' } },
            '/**': { headers: { 'Cache-Control': 'no-cache, must-revalidate' } },
            // But keep caching for static assets
            '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
            '/assets/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
        }
    }
})