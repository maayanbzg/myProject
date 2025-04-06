import Redis from 'ioredis';

const redis = new Redis();

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Save cache with expiration time
export async function setCache(key, value, seconds = 60) {
    await redis.set(key, JSON.stringify(value), 'EX', seconds);
}

// Get the cache
export async function getCache(key) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
}

// Count requests
export async function incrementKey(key, expirySeconds = null) {
    const count = await redis.incr(key);
    if (expirySeconds && count === 1) {
      await redis.expire(key, expirySeconds);
    }
    return count;
}

// Save new unassigned dog
export async function addUnassignedDog(dogId) {
    await redis.lpush('dogs:unassigned', dogId);
}

// Get first unassigned dog
export async function getNextUnassignedDog() {
    return await redis.rpop('dogs:unassigned');
}

export default {
    setCache,
    getCache,
    incrementKey,
    addUnassignedDog,
    getNextUnassignedDog
};