import pino from 'pino';
import fs from 'fs';
import path from 'path';
import colors from 'colors';
import moment from 'moment';
import {
  Writable,
} from 'stream';
import config from '../../../config'

const COLORS = {
  /* error */ 50: 'red',
  /* warn */ 40: 'yellow',
  /* info */ 30: 'cyan',
  /* debug */ 20: 'blue',
  /* trace */ 10: 'grey',
}

class RollingFile extends Writable {
  constructor(dirname) {
    super();
    this.dirname = dirname;
    this.createFileStream();
  }

  createFileStream() {
    this.currentFileDate = moment();
    this.stream = fs.createWriteStream(path.join(this.dirname, `${this.currentFileDate.format('YYYY-MM-DD')}.log`), { flags: 'a' });
    this.stream.on('error', (err) => {
      // eslint-disable-next-line
      console.log(err);
    })
  }

  _write(chunk, encoding, done) {
    if (this.currentFileDate.isBefore(moment(), 'day')) {
      this.createFileStream();
    }
    this.stream.write(chunk);

    const msg = chunk.toString();
    const json = JSON.parse(msg);
    if (json.level === 60) {
      // eslint-disable-next-line
      console.log(colors.bgRed.white(msg));
    } else {
      // eslint-disable-next-line
      console.log(colors[COLORS[json.level]](msg));
    }
    done();
  }
}

const logger = pino({
  app: 'etherexplorer',
}, new RollingFile(config.log.path));
logger.level = config.log.level;

export default logger;
