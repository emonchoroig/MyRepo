import { UserEntity } from "../user/user.entity";
import { ActivityEntity } from "./activity.entity";

export interface ActivityRepository {
  insertActivity(data: ActivityEntity): Promise<ActivityEntity | null>;
  updateActivity(
    uuid: string,
    data: ActivityEntity
  ): Promise<ActivityEntity | null>;
  deleteActivity(uuid: string): Promise<ActivityEntity | null>;
  listActivity(): Promise<ActivityEntity[] | null>;
  getActivityById(uuid: string): Promise<ActivityEntity | null>;
  listActivityPag(numPage: string): Promise<ActivityEntity[] | null>;
  getParticipantsOfActivity(
    uuid: string,
    numPage: string
  ): Promise<UserEntity[] | null>;
  getNumActivity(): Promise<string | null>;
  getActivitiesByUserAndWeek(
    uuid: string,
    startDate: Date
  ): Promise<ActivityEntity[] | null>;
  getFollowedUsersActivities(
    currentUserId: string,
    page: string,
    startDate: Date
  ): Promise<any>;
  getActivitiesByLocation(locationId: string): Promise<ActivityEntity[] | null>;

  getAllActivitiesByUser(currentUserId:string): Promise<any>;
  getAllActivitiesCreatedByUser(currentUserId:string): Promise<any>;
  getActivitiesByUserAndMonth(uuid: string, startDate: Date): Promise<ActivityEntity[]|null>
  getActivitiesByUserLast6Weeks(currentUserId:string): Promise<any>;
  getActivitiesByMonthAndYear(currentUserId:string, month: string, year:string): Promise<any>;


}
