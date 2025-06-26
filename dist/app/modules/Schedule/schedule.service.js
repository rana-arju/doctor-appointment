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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const date_fns_1 = require("date-fns");
const inserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, startTime, endTime } = payload;
    const interverlTime = 30;
    const schedules = [];
    const currentDate = new Date(startDate); // start date
    const lastDate = new Date(endDate); // end date
    while (currentDate <= lastDate) {
        // 09:30  ---> ['09', '30']
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(startTime.split(":")[0])), Number(startTime.split(":")[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, "yyyy-MM-dd")}`, Number(endTime.split(":")[0])), Number(endTime.split(":")[1])));
        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: (0, date_fns_1.addMinutes)(startDateTime, interverlTime),
            };
            const existingSchedule = yield prisma_1.default.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime,
                },
            });
            if (!existingSchedule) {
                const result = yield prisma_1.default.schedule.create({
                    data: scheduleData,
                });
                schedules.push(result);
            }
            startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedules;
});
exports.ScheduleService = {
    inserIntoDB,
};
