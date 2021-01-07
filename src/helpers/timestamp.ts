import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const getTimestamp = (timestampString: string, format: string) => {
  return dayjs(timestampString, format);
}
