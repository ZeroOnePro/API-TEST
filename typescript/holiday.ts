import axios from 'axios';
import dotenv from 'dotenv';
import { eq, map, uniqBy } from 'lodash';
const moment = require('moment');

dotenv.config();

class HolidayService {
  constructor() {}

  async getHolidaysFromOpenApi(year: string): Promise<
    {
      year: string;
      dateName: string;
      locDate: string;
      dateKind: string;
    }[]
  > {
    try {
      const {
        data: {
          response: {
            body: {
              items: { item },
            },
          },
        },
      } = await axios.get(
        'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo',
        {
          params: {
            ServiceKey: process.env.OPEN_API_KEY,
            solYear: year,
            numOfRows: 100,
            _type: 'json',
          },
        },
      );
      return [
        ...map(item, (object) => ({
          year,
          dateName: object.dateName,
          locDate: `${String(object.locdate).slice(0, 4)}-${String(
            object.locdate,
          ).slice(4, 6)}-${String(object.locdate).slice(6, 8)}`,
          dateKind: 'national',
        })),
      ];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  calculateWeekendDates(year: string): {
    year: string;
    dateName: string;
    locDate: string;
    dateKind: string;
  }[] {
    const yearBeginDate = moment(String(year)).startOf('year');
    const weekends = [];
    for (
      let date = yearBeginDate;
      date.year() !== +year + 1;
      date = date.add(1, 'days')
    ) {
      const dayNumber = date.isoWeekday();
      const isWeekend = eq(dayNumber, 6) || eq(dayNumber, 7);
      if (isWeekend) weekends.push(date.clone().format('YYYY-MM-DD'));
    }
    return [
      ...map(weekends, (day) => ({
        year,
        dateName: eq(moment(day).isoWeekday(), 6) ? '토요일' : '일요일',
        locDate: day,
        dateKind: 'weekend',
      })),
    ];
  }
}

const reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const loadScript = () => {
  reader.question("공휴일을 조회할 년도를 입력해주세요 >> ", async (year: string) => {
    const service = new HolidayService();
    const OpenApiData = await service.getHolidaysFromOpenApi(year);
    const weekends = service.calculateWeekendDates(year);
    const holidays = uniqBy([ ...OpenApiData, ...weekends], 'locDate');
    console.log(`${year}의 휴일은 총 ${holidays.length}일 입니다!`);
    // console.log(holidays);
    reader.close();
  })
}

loadScript();