import pino from 'pino';
import _ from 'lodash';
import fs from 'fs';
import {
  Writable,
} from 'stream';
import config from '../../../config'

class File extends Writable {
  constructor(file) {
    super();
    this.stream = fs.createWriteStream(file, { flags: 'a' });
    this.stream.on('error', (err) => {
      console.log(err);
    });
  }

  _write(chunk, encoding, done) {
    const json = JSON.parse(chunk.toString());
    const data = _.pick(
      json,
      'objectType',
      'objectId',
      'recordTime',
      'businessType',
      'action',
      'content',
      'attachment',
      'recorder',
      'recorderName',
      'recorderType'
    );
    // eslint-disable-next-line
    console.log(data);
    data.objectType = `${data.objectType}`;
    data.content = data.content ? JSON.stringify(data.content) : '';
    this.stream.write(`opSyncLog-${JSON.stringify(data)}\n`);
    done();
  }
}


const logger = pino({
}, new File(config.actionLog.path));
logger.level = config.actionLog.level;

export default logger;
