import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

export const getTimestamp = (timestampString: string, format: string) => {
  return dayjs(timestampString, format);
};
