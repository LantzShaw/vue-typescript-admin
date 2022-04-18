import { defHttp } from '/@/utils/http/axios';

enum Api {
  keysSize = '/sys/actuator/redis/keysSize',
  memoryInfo = '/sys/actuator/redis/memoryInfo',
  info = '/sys/actuator/redis/info'
}

/**
 * key个数
 */
export const getKeysSize = () => {
  return defHttp.get({ url: Api.keysSize }, { isTransformResponse: false });
};

/**
 * 内存信息
 */
export const getMemoryInfo = () => {
  return defHttp.get({ url: Api.memoryInfo }, { isTransformResponse: false });
};

/**
 * 详细信息
 */
export const getInfo = () => {
  return defHttp.get({ url: Api.info });
};

export const getRedisInfo = () => {
  return Promise.all([
    getKeysSize(),
    getMemoryInfo(),
  ]);
};
