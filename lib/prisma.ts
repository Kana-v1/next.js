import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    errorFormat: "pretty",
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ]
})

// prisma.$on('query', event => {
//     console.log(`
//         DB QUERY:
        
//         Query: ${event.query}
//         Params: ${event.params},
//         Duration: ${event.duration}
//         Target: ${event.target}
//         Timestamp: ${event.timestamp}
//     `)
// })

prisma.$on('error', event => {
    console.log(`
    DB ERROR: 

    message: ${event.message}
    target: ${event.target}
    timestamp: ${event.timestamp}
    `)
})

// prisma.$on('info', event => {
//     console.log(`
//     DB INFO: 

//     message: ${event.message}
//     target: ${event.target}
//     timestamp: ${event.timestamp}
//     `)
// })

prisma.$on('warn', event => {
    console.log(`
    DB WARN: 

    message: ${event.message}
    target: ${event.target}
    timestamp: ${event.timestamp}
    `)
})



export default prisma

