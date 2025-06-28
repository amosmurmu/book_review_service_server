import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL!)

// uncomment below line to test cache down

// const simulate_cache_down = async () => {
//   await redis.quit()
// }

// simulate_cache_down()
