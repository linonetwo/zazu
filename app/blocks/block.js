import cuid from 'cuid'

import logger from '../lib/logger'

class Block {
  constructor(data) {
    this.pluginId = data.pluginId
    this.type = data.type
    this.id = data.id || cuid()
    this.connections = data.connections || []
    this.logger = logger.bindMeta({ plugin: this.pluginId, block: this.id })
  }

  requiredField(fieldName) {
    const blockName = this.constructor.name
    this.logger.log('error', `Field "${fieldName}" is required.`, {
      fieldName,
      blockName,
    })
  }

  _ensurePromise(value) {
    if (!(value instanceof Promise)) {
      this.logger.log('error', 'Block did not return a Promise')
      return Promise.resolve()
    }
    return value
  }

  call(state) {
    return state.next()
  }
}

export default Block
