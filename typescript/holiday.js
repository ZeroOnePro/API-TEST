"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var axios_1 = require("axios");
var dotenv_1 = require("dotenv");
var lodash_1 = require("lodash");
var moment = require('moment');
dotenv_1["default"].config();
var HolidayService = /** @class */ (function () {
    function HolidayService() {
    }
    HolidayService.prototype.getHolidaysFromOpenApi = function (year) {
        return __awaiter(this, void 0, void 0, function () {
            var item, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get('http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo', {
                                params: {
                                    ServiceKey: process.env.OPEN_API_KEY,
                                    solYear: year,
                                    numOfRows: 100,
                                    _type: 'json'
                                }
                            })];
                    case 1:
                        item = (_a.sent()).data.response.body.items.item;
                        return [2 /*return*/, __spreadArray([], (0, lodash_1.map)(item, function (object) { return ({
                                year: year,
                                dateName: object.dateName,
                                locDate: "".concat(String(object.locdate).slice(0, 4), "-").concat(String(object.locdate).slice(4, 6), "-").concat(String(object.locdate).slice(6, 8)),
                                dateKind: 'national'
                            }); }), true)];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, []];
                }
            });
        });
    };
    HolidayService.prototype.calculateWeekendDates = function (year) {
        var yearBeginDate = moment(String(year)).startOf('year');
        var weekends = [];
        for (var date = yearBeginDate; date.year() !== +year + 1; date = date.add(1, 'days')) {
            var dayNumber = date.isoWeekday();
            var isWeekend = (0, lodash_1.eq)(dayNumber, 6) || (0, lodash_1.eq)(dayNumber, 7);
            if (isWeekend)
                weekends.push(date.clone().format('YYYY-MM-DD'));
        }
        return __spreadArray([], (0, lodash_1.map)(weekends, function (day) { return ({
            year: year,
            dateName: (0, lodash_1.eq)(moment(day).isoWeekday(), 6) ? '토요일' : '일요일',
            locDate: day,
            dateKind: 'weekend'
        }); }), true);
    };
    return HolidayService;
}());
var reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
var loadScript = function () {
    reader.question("공휴일을 조회할 년도를 입력해주세요 >> ", function (year) { return __awaiter(void 0, void 0, void 0, function () {
        var service, OpenApiData, weekends, holidays;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    service = new HolidayService();
                    return [4 /*yield*/, service.getHolidaysFromOpenApi(year)];
                case 1:
                    OpenApiData = _a.sent();
                    weekends = service.calculateWeekendDates(year);
                    holidays = (0, lodash_1.uniqBy)(__spreadArray(__spreadArray([], OpenApiData, true), weekends, true), 'locDate');
                    console.log("".concat(year, "\uC758 \uD734\uC77C\uC740 \uCD1D ").concat(holidays.length, "\uC77C \uC785\uB2C8\uB2E4!"));
                    // console.log(holidays);
                    reader.close();
                    return [2 /*return*/];
            }
        });
    }); });
};
loadScript();
