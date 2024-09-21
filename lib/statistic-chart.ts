import { db } from "@/lib/db";
import { format , subMonths  } from "date-fns";

type ChartData = {
  date: string;
  server: number;
  profile: number;
};

export async function StatisticChart() {

   const now = new Date();
   const last12Months = Array.from({ length: 12 }, (_, i) => {
     return format(subMonths(now, i), "yyyy-MM"); 
   }).reverse(); 
 
   
   const startDate = subMonths(now, 12);
 
   const serverData = await db.server.findMany({
     where: {
       createdAt: {
         gte: startDate, 
       },
     },
     select: {
       createdAt: true,
     },
   });
 
   const profileData = await db.profile.findMany({
     where: {
       createdAt: {
         gte: startDate,
       },
     },
     select: {
       createdAt: true,
     },
   });
 
   const result: { [date: string]: { server: number; profile: number } } = {};
 
   serverData.forEach((server) => {
     const date = format(server.createdAt, "yyyy-MM");
     if (!result[date]) {
       result[date] = { server: 0, profile: 0 };
     }
     result[date].server += 1;
   });
 

   profileData.forEach((profile) => {
     const date = format(profile.createdAt, "yyyy-MM");
     if (!result[date]) {
       result[date] = { server: 0, profile: 0 };
     }
     result[date].profile += 1;
   });
 
   const chartData: ChartData[] = last12Months.map((month) => ({
     date: month,
     server: result[month]?.server || 0,   
     profile: result[month]?.profile || 0, 
   }));
 
   return chartData;


}