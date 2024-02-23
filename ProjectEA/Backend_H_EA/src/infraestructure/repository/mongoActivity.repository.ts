import { ActivityEntity } from "../../domain/activity/activity.entity";
import { ActivityRepository } from "../../domain/activity/activity.repository";
import ActivityModel from "../model/activity.schema";
import UserModel from "../model/user.schema";
import { ObjectId } from "mongodb";

export class MongoActivityRepository implements ActivityRepository {
  async getActivitiesByLocation(locationId: string): Promise<any> {
    const responseItems = await ActivityModel.find({ idLocation: locationId });
    return responseItems;
  }

  async getActivityById(uuid: string): Promise<any> {
    const responseItem = await ActivityModel.findOne({ _id: uuid }).populate(
      "creatorActivity"
    );
    return responseItem;
  }

  async listActivity(): Promise<any> {
    const responseItem = await ActivityModel.find({});
    return responseItem;
  }

  async listActivityPag(numPage: string): Promise<any> {
    const numActivityPerPage = 2;
    const hop = (parseInt(numPage) - 1) * numActivityPerPage;
    const responseItem = await ActivityModel.find({})
      .skip(hop)
      .limit(numActivityPerPage)
      .exec();
    return responseItem;
  }

  async insertActivity(data: ActivityEntity): Promise<any> {
    const item = await ActivityModel.create(data);

    // Actualizar la propiedad uuid con el valor de response._id
    const updatedData = {
      ...data,
      uuid: item._id,
    };
    // Realizar la actualización en la base de datos
    const activity = await ActivityModel.updateOne(
      { _id: item._id },
      updatedData
    );

    return activity;
  }

  async updateActivity(uuid: string, data: ActivityEntity): Promise<any> {
    const responseItem = await ActivityModel.updateOne({ _id: uuid }, data, {
      new: true,
    });
    return responseItem;
  }

  async deleteActivity(uuid: string): Promise<any> {
    const responseItem = await ActivityModel.findOneAndRemove({ _id: uuid });
    return responseItem;
  }

  async getNumActivity(): Promise<any> {
    const responseItem = (await ActivityModel.countDocuments({})).toString();
    return responseItem;
  }

  async getParticipantsOfActivity(uuid: string, numPage: string): Promise<any> {
    const activitiesPerPage = 2;
    const hop = (parseInt(numPage) - 1) * activitiesPerPage;
    const activity = await ActivityModel.findById(uuid);
    if (!activity) {
      throw new Error(`Activity with _id=${uuid} not found`);
    }
    const responseParticipantIds = activity.participantsActivity;
    if (!responseParticipantIds || responseParticipantIds.length === 0) {
      return [];
    }
    const responseItem = await UserModel.find({
      _id: { $in: responseParticipantIds },
    })
      .skip(hop)
      .limit(activitiesPerPage)
      .exec();
    return responseItem;
  }

  async getActivitiesByUserAndWeek(
    uuid: string,
    startDate: Date
  ): Promise<any> {
    const startOfWeek = new Date(startDate);
    const dayOfWeek = startDate.getUTCDay();
    console.log("dayofWeek", dayOfWeek);
    
    // Ajustar el día de la semana
    const adjustedDayOfWeek = (dayOfWeek + 6) % 7; // Convertir domingo (0) a 6 y desplazar los demás días
    
    // Obtener el primer día (lunes) de la semana
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - adjustedDayOfWeek);
    startOfWeek.setUTCHours(0, 0, 0, 0);
    console.log("start of week", startOfWeek);
    
    // Obtener el último día (domingo) de la semana
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);
    console.log("end of week", endOfWeek);
    
    const activities = await ActivityModel.find({
      participantsActivity: uuid,
    }).exec();
    
    const activitiesOfWeek = activities.filter(
      (activity) =>
        activity.dateActivity >= startOfWeek &&
        activity.dateActivity <= endOfWeek
    );
    
    console.log("myactivities", activitiesOfWeek);
    return activitiesOfWeek;
  }

  async getFollowedUsersActivities(
    currentUserId: string,
    page: string,
    startDate: Date
  ): Promise<any> {
    // Obtener los IDs de los usuarios seguidos
    console.log(currentUserId, page, startDate);
    const user = await UserModel.findById(currentUserId).exec();
    if (!user) {
      return [];
    }
    const followedUserIds = user.followedUser;
    if (!followedUserIds || followedUserIds.length === 0) {
      return [];
    }

    const startOfWeek = new Date(startDate);
    const dayOfWeek = startDate.getUTCDay();
    // Ajustar el día de la semana
    const adjustedDayOfWeek = (dayOfWeek + 6) % 7; // Convertir domingo (0) a 6 y desplazar los demás días
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - adjustedDayOfWeek);
    startOfWeek.setUTCHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);
    const pageSize = 1; // Tamaño de página fijo
    const numPage = parseInt(page, 10);
    const startIndex = (numPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const activitiesByUser: { uuid: string; activities: any[] }[] = [];

    // Obtener las actividades de los usuarios seguidos
    for (let i = 0; i < followedUserIds.length; i++) {
      const followedUserId = followedUserIds[i];
      const activities = await ActivityModel.find({
        participantsActivity: followedUserId,
      }).exec();
      const filteredActivities = activities.filter((activity) => {
        return (
          activity.dateActivity >= startOfWeek &&
          activity.dateActivity <= endOfWeek
        );
      });

      activitiesByUser.push({
        uuid: followedUserId.toString(),
        activities: filteredActivities,
      });
    }

    return activitiesByUser[startIndex];
  }

  async getAllActivitiesByUser(currentUserId: string): Promise<any> {
    console.log("mongoActivity",currentUserId);
    const activities = await ActivityModel.find({ participantsActivity: currentUserId }).exec();
    console.log("usecase",activities);
    return activities;
}

async getAllActivitiesCreatedByUser(currentUserId: string): Promise<any> {
    console.log("mongoActivityCreated",currentUserId);
    const activities = await ActivityModel.find({ creatorActivity: currentUserId }).exec();
    console.log("usecase",activities);
    return activities;
}

async getActivitiesByUserAndMonth(uuid: string, startDate: Date): Promise<any> {
    const startOfMonth = new Date(startDate);
    startOfMonth.setUTCDate(startOfMonth.getUTCDate() - 30); // Restar 30 días a la fecha de inicio
    startDate.setUTCHours(23, 59, 59, 999);

    const activities = await ActivityModel.find({ participantsActivity: uuid }).exec();
    const activitiesOfMonth = activities.filter((activity) =>
        activity.dateActivity >= startOfMonth && activity.dateActivity <= startDate
    );

    return activitiesOfMonth;
}

async getActivitiesByUserLast6Weeks(uuid: string): Promise<number[]> {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    const dayOfWeek = currentDate.getUTCDay();
    console.log("dayofWeek", dayOfWeek);
    // Ajustar el día de la semana
    const adjustedDayOfWeek = (dayOfWeek + 6) % 7; // Convertir domingo (0) a 6 y desplazar los demás días

    // Obtener el primer día (lunes) de la semana
    currentDate.setUTCDate(currentDate.getUTCDate() - adjustedDayOfWeek); //ponemos la currentDate a lunes de la semana actual
    console.log("start of week", currentDate);

    const activities = await ActivityModel.find({ participantsActivity: uuid }).exec();

    const activitiesByWeek: number[] = [];

    for (let i = 0; i < 6; i++) {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setUTCDate(startOfWeek.getUTCDate() - i * 7); // Restar i semanas a la fecha actual
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
      endOfWeek.setUTCHours(23, 59, 59, 999);

      const activitiesOfWeek = activities.filter((activity) =>
        activity.dateActivity >= startOfWeek && activity.dateActivity <= endOfWeek
      );

      activitiesByWeek.push(activitiesOfWeek.length);
    }

    return activitiesByWeek;
  }

  async getActivitiesByMonthAndYear(uuid: string, month: string, year: string): Promise<number[]> {
    const firstDayOfMonth = new Date(parseInt(year), parseInt(month), 1); // Obtener el primer día del mes y año especificados
    const currentDate = new Date(firstDayOfMonth);
    currentDate.setUTCHours(0, 0, 0, 0);
    
    // Obtener el primer día (lunes) de la semana
  
    const activities = await ActivityModel.find({ participantsActivity: uuid }).exec();
  
    const activitiesByWeek: number[] = [0, 0, 0, 0]; // Vector con 4 espacios, inicializados en 0
  
    for (let i = 0; i < 4; i++) { // Iterar solo 4 veces para las 4 semanas del mes
      const startOfWeek = new Date(currentDate);
      startOfWeek.setUTCDate(startOfWeek.getUTCDate() - i * 7); // Restar i semanas a la fecha actual
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
      endOfWeek.setUTCHours(23, 59, 59, 999);
  
      const activitiesOfWeek = activities.filter((activity) =>
        activity.dateActivity >= startOfWeek && activity.dateActivity <= endOfWeek
      );
  
      activitiesByWeek[i] = activitiesOfWeek.length; // Guardar el número de actividades en la semana i
    }
  
    return activitiesByWeek;
  }
  

}
