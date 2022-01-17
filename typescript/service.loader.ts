import { uniqBy } from "lodash";
import { HolidayService } from "./holiday";

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